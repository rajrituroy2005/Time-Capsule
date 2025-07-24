// client/src/pages/ViewCapsulePage.js
// client/src/pages/ViewCapsulePage.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTimeCapsuleById } from '../services/timeCapsuleService';
import { isPast, formatDistanceToNow } from 'date-fns'; // <--- THIS LINE IS CRITICAL

// ... rest of your component code

const ViewCapsulePage = () => {
    const { id } = useParams();
    const [capsule, setCapsule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCapsule = async () => {
            try {
                const data = await getTimeCapsuleById(id);
                setCapsule(data);
                if (!isPast(new Date(data.unlockDate)) && data.userId !== (await import('../services/authService')).getCurrentUser()._id) {
                    // Basic check to prevent direct access if not unlocked and not owner
                    setError('This capsule is still locked!');
                    // Optionally navigate back or to a locked message page
                    // navigate('/dashboard');
                }
            } catch (err) {
                console.error('Error fetching capsule:', err.response ? err.response.data : err.message);
                if (err.response && err.response.status === 403) {
                    setError('This time capsule is still locked!');
                } else if (err.response && err.response.status === 404) {
                    setError('Time capsule not found.');
                } else {
                    setError('Failed to load time capsule.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCapsule();
    }, [id, navigate]);

    if (loading) return <div className="loading-state">Loading time capsule...</div>;
    if (error) return <div className="error-state">{error}</div>;
    if (!capsule) return <div className="error-state">No capsule data found.</div>;

    const isLocked = !isPast(new Date(capsule.unlockDate));

    return (
        <div className="view-capsule-page">
            <button onClick={() => navigate('/dashboard')} className="btn btn-back">Back to Dashboard</button>
            <h2>Time Capsule: {capsule.title}</h2>
            <p className="unlock-info">
                {isLocked ? (
                    <span>This capsule will unlock on: <strong>{new Date(capsule.unlockDate).toLocaleString()}</strong></span>
                ) : (
                    <span>This capsule unlocked on: <strong>{new Date(capsule.unlockDate).toLocaleString()}</strong></span>
                )}
            </p>

            {isLocked ? (
                <div className="locked-content">
                    <p>The contents of this capsule are currently locked. Check back on the unlock date!</p>
                    <div className="countdown-display">
                        {/* Placeholder for a cool countdown component */}
                        <h3>Countdown: {formatDistanceToNow(new Date(capsule.unlockDate), { addSuffix: true })}</h3>
                    </div>
                </div>
            ) : (
                <div className="unlocked-content">
                    <p className="message-content">{capsule.message}</p>

                    {capsule.files && capsule.files.length > 0 && (
                        <div className="capsule-files">
                            <h3>Attached Memories:</h3>
                            <div className="file-gallery">
                                {capsule.files.map((file, index) => (
                                    <div key={index} className="file-item">
                                        {file.mimetype.startsWith('image/') ? (
                                            <img src={`http://localhost:5000${file.filepath}`} alt={file.filename} className="capsule-image" />
                                        ) : (
                                            <a href={`http://localhost:5000${file.filepath}`} target="_blank" rel="noopener noreferrer">
                                                Download {file.filename}
                                            </a>
                                        )}
                                        <p>{file.filename}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ViewCapsulePage;