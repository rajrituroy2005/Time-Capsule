// client/src/pages/CreateCapsulePage.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createTimeCapsule } from '../services/timeCapsuleService';
import { useNavigate } from 'react-router-dom';

const CreateCapsulePage = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [unlockDate, setUnlockDate] = useState(new Date());
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('message', message);
        formData.append('unlockDate', unlockDate.toISOString()); // ISO string for backend

        files.forEach((file) => {
            formData.append('files', file);
        });

        try {
            await createTimeCapsule(formData);
            navigate('/dashboard'); // Redirect to dashboard after creation
        } catch (err) {
            console.error('Error creating capsule:', err.response ? err.response.data : err.message);
            setError('Failed to create time capsule. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-capsule-page">
            <h2>Create Your Time Capsule</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="files">Upload Photos/Files:</label>
                    <input
                        type="file"
                        id="files"
                        multiple
                        onChange={handleFileChange}
                        accept="image/*, application/pdf" // Example: allow images and PDFs
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="unlockDate">Unlock Date:</label>
                    <DatePicker
                        selected={unlockDate}
                        onChange={(date) => setUnlockDate(date)}
                        dateFormat="Pp"
                        showTimeSelect
                        minDate={new Date()} // Cannot set unlock date in the past
                        className="date-picker-input"
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Capsule'}
                </button>
            </form>
        </div>
    );
};

export default CreateCapsulePage;