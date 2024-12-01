import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ggsheet from "../images/googlesheet.png";
import gmail from "../images/gmail.png";
import "../styles/components/WorkflowCard.css";
import api from "../services/api"

const WorkflowCard = ({ id, name, type, status, userId }) => {
    const [isDeleted, setIsDeleted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleViewWorkflow = () => {
        const route = type === "Send Email" ? `/gmailworkflow/${userId}/${id}/` : `/spreadsheetflow/${userId}/${id}/`;
        navigate(route);
    };

    const handleDeleteWorkflow = async () => {
        try {
            const response = await api.delete(`/workflows/${id}/`);
            console.log('Workflow deleted successfully:', response.data);
            setIsDeleted(true);
            setShowModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting workflow:', error);
        }
    };

    return (
        <div className="col-md-4 mb-4">
            <div className="card workflow-card h-100">
                <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="workflow-text-container" style={{flex: 1, textAlign: 'left'}}>
                            <h5>{name}</h5>
                            <p>Type: {type === "Send Email" ? "Email" : type === "Update" ? "Google Sheet" : type}</p>
                            <p>Status: {status ? "Active" : "Inactive"}</p>
                        </div>
                        <div className="workflow-image-container" style={{
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src={type === "Update" ? ggsheet : gmail}
                                alt={type}
                                className="workflow-image"
                                style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}}
                            />
                        </div>
                    </div>
                    <div className="workflow-buttons">
                        <button
                            className="btn view-workflow-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleViewWorkflow();
                            }}
                            style={{
                                color: 'white',
                                backgroundColor: 'black',
                                border: "none"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#20c997';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "black";
                                e.currentTarget.style.color = "white";
                            }}
                        >
                            View Workflow
                        </button>
                        <button
                            className="btn delete-workflow-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowModal(true);
                            }}
                            style={{
                                color: 'white',
                                backgroundColor: 'black',
                                border: "none"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#dc3545';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "black";
                                e.currentTarget.style.color = "white";
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{backgroundColor: "white", borderRadius: "10px"}}>
                        <h5>Are you sure you want to delete this workflow?</h5>
                        <div className="modal-buttons">
                            <button
                                onClick={handleDeleteWorkflow}
                                className="btn btn-danger"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default WorkflowCard;
