import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the axios instance from api.js
import '../styles/components/UpdateSenderPopup.css';
function UpdateSenderPopup({ flowId, onClose }) {
    const [senderEmail, setSenderEmail] = useState('');
    const [senderPassword, setSenderPassword] = useState('');
    useEffect(() => {
        console.log("flowId in useEffect:", flowId);
        const fetchSenderEmail = async () => {
            try {
                const response = await api.get(`/workflows/${flowId}/sender-email`);
                console.log("API Response:", response.data); // Debugging
                setSenderEmail(response.data.sender_email);
            } catch (error) {
                console.error('Error fetching sender email:', error);
            }
        };
        if (flowId) fetchSenderEmail();
    }, [flowId]);
    const handleUpdateSender = async () => {
        try {
            // Use the api instance to make the PUT request
            await api.put(`/workflows/${flowId}/update-sender`, {
                sender_email: senderEmail,
                sender_hashed_password: senderPassword
            });
            onClose();
        } catch (error) {
            console.error('Error updating sender:', error);
            alert('Failed to update sender credentials');
        }
    };
    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <h2 className="popup-title">Update Sender Credentials</h2>
                <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="Sender Email"
                    className="popup-input"
                />
                <input
                    type="password"
                    value={senderPassword}
                    onChange={(e) => setSenderPassword(e.target.value)}
                    placeholder="Sender Password"
                    className="popup-input"
                />
                <div className="popup-buttons">
                    <button onClick={handleUpdateSender} className="popup-button update">
                        Update Sender
                    </button>
                    <button onClick={onClose} className="popup-button cancel">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
export default UpdateSenderPopup;