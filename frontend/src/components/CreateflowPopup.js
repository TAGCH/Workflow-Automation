import React, { useState, useContext } from 'react';
import gmailIcon from '../images/gmail.png';
import ggsheetIcon from '../images/googlesheet.png';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import api from '../services/api'; // Make sure this path is correct

const CreateflowPopup = ({ closePopup }) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    // State to manage the selected workflow type and input values
    const [workflowType, setWorkflowType] = useState('');
    const [workflowName, setWorkflowName] = useState('');
    const [senderEmail, setSenderEmail] = useState('');
    const [senderPassword, setSenderPassword] = useState('');

    const handleOptionClick = (option) => {
        setWorkflowType(option);
    };

    const handleCreateWorkflow = async () => {
        if (!user) return; // Ensure user is available before sending data

        
        try {
            const response = await api.post('/workflows/', {
                name: workflowName,
                type: workflowType,
                owner_id: user.id,
                sender_email: senderEmail,
                sender_hashed_password: senderPassword, // Make sure this is hashed if required
                trigger_time: null, // Adjust based on your requirements
                trigger_frequency: null, // Adjust based on your requirements
                trigger_day: null, // Adjust based on your requirements
                status: false // Default status
            });
            
            console.log('Workflow created:', response.data);
            // Optionally navigate to the new workflow page or refresh the data
            closePopup();
            if (workflowType === 'Send Email') {
                navigate(`/gmailworkflow/${user.id}/${response.data.id}`); // Adjust this route as needed
            } else if (workflowType === 'Update') {
                navigate(`/spreadsheetflow/${user.id}/${response.data.id}`); // Adjust this route as needed
            }
        } catch (error) {
            console.error('Error creating workflow:', error);
            // Handle error (show a notification, etc.)
        }
    };

    return (
        <div
            className="popup-overlay"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >
            <div
                className="popup-content"
                style={{
                    position: 'relative',
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 15px rgba(0,0,0,0.2)',
                    width: '450px',
                    textAlign: 'center',
                }}
            >
                <button
                    onClick={closePopup}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        padding: '5px 10px',
                        backgroundColor: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        fontSize: '18px',
                        cursor: 'pointer',
                        lineHeight: '1',
                        width: '35px',
                        height: '35px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc3545')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'black')}
                >
                    &times;
                </button>
                <h2>Select an Action</h2>
                <div className="options-container" style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                    <div
                        className={`option ${workflowType === 'Send Email' ? 'selected' : ''}`}
                        onClick={() => handleOptionClick('Send Email')}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', border: workflowType === 'Send Email' ? '2px solid blue' : 'none' }}
                    >
                        <img src={gmailIcon} alt="Gmail Icon" style={{ width: '50px', height: '50px' }} />
                        <p className="pt-3">Send Email</p>
                    </div>
                    <div
                        className={`option ${workflowType === 'Update' ? 'selected' : ''}`}
                        onClick={() => handleOptionClick('Update')}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', border: workflowType === 'Update' ? '2px solid blue' : 'none' }}
                    >
                        <img src={ggsheetIcon} alt="Google Sheets Icon" style={{ width: '50px', height: '50px' }} />
                        <p className="pt-3">Update</p>
                    </div>
                </div>

                {/* Input Fields */}
                <div style={{ marginTop: '20px' }}>
                    <input
                        type="text"
                        placeholder="Workflow Name"
                        value={workflowName}
                        onChange={(e) => setWorkflowName(e.target.value)}
                        style={{ width: '90%', margin: '10px 0', padding: '10px' }}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Sender Email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        style={{ width: '90%', margin: '10px 0', padding: '10px' }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Sender Password"
                        value={senderPassword}
                        onChange={(e) => setSenderPassword(e.target.value)}
                        style={{ width: '90%', margin: '10px 0', padding: '10px' }}
                        required
                    />
                </div>

                {/* Create Workflow Button */}
                <button
                    onClick={handleCreateWorkflow}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: 'blue',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Create Workflow
                </button>
            </div>
        </div>
    );
};

export default CreateflowPopup;