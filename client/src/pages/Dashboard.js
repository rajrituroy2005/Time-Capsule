// client/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTimeCapsules, deleteTimeCapsule } from '../services/timeCapsuleService';
import { formatDistanceToNow, isPast } from 'date-fns';
import { FaTrash, FaEye, FaLock, FaUnlock } from 'react-icons/fa'; // Example icons

const Dashboard = () => {
    const [capsules, setCapsules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCapsules = async () => {
        try {
            const data = await getTimeCapsules();
            setCapsules(data);
        } catch (err) {
            console.error('Error fetching capsules:', err.response ? err.response.data : err.message);
            setError('Failed to load time capsules.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCapsules();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this time capsule? This action cannot be undone.')) {
            try {
                await deleteTimeCapsule(id);
                fetchCapsules(); // Refresh list
            } catch (err) {
                console.error('Error deleting capsule:', err.response ? err.response.data : err.message);
                setError('Failed to delete time capsule.');
            }
        }
    };

    if (loading) return <div className="loading-state">Loading time capsules...</div>;
    if (error) return <div className="error-state">{error}</div>;

    const upcomingCapsules = capsules.filter(capsule => !isPast(new Date(capsule.unlockDate)));
    const unlockedCapsules = capsules.filter(capsule => isPast(new Date(capsule.unlockDate)));

    return (
        <div className="dashboard-page">
            <h1>Your Time Capsules</h1>

            <div className="dashboard-actions">
                <Link to="/create" className="btn btn-primary">Create New Time Capsule</Link>
            </div>

            <section className="upcoming-capsules">
                <h2>Upcoming Capsules</h2>
                {upcomingCapsules.length === 0 ? (
                    <p className="no-capsules">No upcoming time capsules. Create one!</p>
                ) : (
                    <div className="capsule-grid">
                        {upcomingCapsules.map(capsule => (
                            <div key={capsule._id} className="capsule-card locked">
                                <div className="capsule-icon"><FaLock /></div>
                                <h3>{capsule.title}</h3>
                                <p>Unlocks in: {formatDistanceToNow(new Date(capsule.unlockDate), { addSuffix: true })}</p>
                                <p className="unlock-date">({new Date(capsule.unlockDate).toLocaleDateString()} {new Date(capsule.unlockDate).toLocaleTimeString()})</p>
                                <div className="card-actions">
                                    <button onClick={() => handleDelete(capsule._id)} className="btn btn-danger btn-sm" title="Delete">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="unlocked-capsules">
                <h2>Unlocked Capsules</h2>
                {unlockedCapsules.length === 0 ? (
                    <p className="no-capsules">No capsules have unlocked yet.</p>
                ) : (
                    <div className="capsule-grid">
                        {unlockedCapsules.map(capsule => (
                            <div key={capsule._id} className="capsule-card unlocked">
                                <div className="capsule-icon"><FaUnlock /></div>
                                <h3>{capsule.title}</h3>
                                <p>Unlocked on: {new Date(capsule.unlockDate).toLocaleDateString()}</p>
                                <div className="card-actions">
                                    <Link to={`/capsule/${capsule._id}`} className="btn btn-secondary btn-sm" title="View">
                                        <FaEye /> View
                                    </Link>
                                    <button onClick={() => handleDelete(capsule._id)} className="btn btn-danger btn-sm" title="Delete">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;