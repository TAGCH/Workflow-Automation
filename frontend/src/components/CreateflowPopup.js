import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import '../styles/components/CreateflowPopup.css'; 

const CreateflowPopup = ({ closePopup }) => {
    const { token } = useContext(UserContext);
    const [workflowName, setWorkflowName] = useState('');
    const [workflowType, setWorkflowType] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCreate = async () => {
        if (workflowName.trim() && workflowType) {
            setError('');
    
            if (!token) {
                setError('No authorization token found. Please log in.');
                return;
            }
    
            try {
                const response = await axios.post(
                    'http://localhost:8000/api/workflows',
                    {
                        name: workflowName,
                        type: workflowType,
                        details: {}
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
    
                console.log('Workflow created:', response.data);
                closePopup();

                // Redirect based on workflow type
                const workflowId = response.data.id;
                if (workflowType === 'email') {
                    navigate(`/workflows/email/${workflowId}`);
                } else if (workflowType === 'google-sheet') {
                    navigate(`/workflows/excel/${workflowId}`);
                }
                
            } catch (error) {
                setError(error.response?.data?.detail || 'Failed to create workflow');
                console.error('Error details:', error.response ? error.response.data : error.message);
            }
        } else {
            setError('Please enter a valid name and select a workflow type');
        }
    };
    
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>New Workflow</h2>
                <input
                    type="text"
                    placeholder="Enter workflow name"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                />
                <select
                    value={workflowType}
                    onChange={(e) => setWorkflowType(e.target.value)}
                >
                    <option value="" disabled>Select workflow type</option>
                    <option value="email">Send Email to Users from Excel</option>
                    <option value="google-sheet">Update Google Sheet from Excel</option>
                </select>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button onClick={handleCreate}>Create</button>
                <button onClick={closePopup}>Cancel</button>
            </div>
        </div>
    );
};

export default CreateflowPopup;
