import React from 'react';
import { useNavigate } from 'react-router-dom';
import ggsheet from "../images/googlesheet.png";
import gmail from "../images/gmail.png";

const WorkflowCard = ({ id, name, type, status, userId }) => {
    const navigate = useNavigate();

    const handleViewWorkflow = () => {
        const route = type === "Send Email" ? `/gmailworkflow/${userId}/${id}` : `/spreadsheetflow/${userId}/${id}`;
        navigate(route);
    };

    return (
        <div className="col-md-4 mb-4">
            <div className="card workflow-card h-100" onClick={handleViewWorkflow}>
                <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h5>{name}</h5>
                            <p>Type: {type === "Send Email" ? "Email" : type === "Update" ? "Google Sheet" : type}</p>
                            <p>Status: {status ? "Active" : "Inactive"}</p>
                        </div>
                        <div className="workflow-image-container">
                            <img
                                src={type === "Update" ? ggsheet : gmail}
                                alt={type}
                                className="workflow-image"
                            />
                        </div>
                    </div>
                    <button
                        className="btn btn-primary view-workflow-btn mt-auto"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent card click from firing
                            handleViewWorkflow();
                        }}
                        style={{
                            backgroundColor: '#20c997',
                            border: "none"
                        }}
                    >
                        View Workflow
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkflowCard;
