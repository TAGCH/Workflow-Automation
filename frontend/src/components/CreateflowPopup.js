import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateflowPopup = ({ closePopup }) => {
    const [workflowName, setWorkflowName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCreate = () => {
        if (workflowName.trim()) {
            setError('')
            closePopup();
            navigate('/createflow');
        } else {
            setError('Please enter a valid name');
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
                zIndex: 1000
            }}
        >
            <div
                className="popup-content"
                style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 15px rgba(0,0,0,0.2)',
                    width: '400px',
                    textAlign: 'center'
                }}
            >
                <h2>New Workflow</h2>
                <input
                    type="text"
                    placeholder="Enter workflow name"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="popup-input"
                />
                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                    <button
                        onClick={handleCreate}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#6f42c1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5a32a3')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6f42c1')}
                    >
                        Create
                    </button>
                    <button
                        onClick={closePopup}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c82333')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dc3545')}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateflowPopup;