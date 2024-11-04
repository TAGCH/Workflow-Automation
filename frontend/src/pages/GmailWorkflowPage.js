import React, { useState, useEffect, useContext } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerticalNavbar from '../components/VerticalNavbar';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { UserContext } from "../context/UserContext";
import { useDropzone } from "react-dropzone";

const GmailWorkflowPage = () => {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [keyNames, setKeyNames] = useState([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [emails, setEmails] = useState([]); // New state for storing emails
    const [flowData, setFlowData] = useState({
        email: '',
        title: '',
        body: '',
        name: ''
    });
    const [workflowObjects, setWorkflowObjects] = useState([]);
    const [uploadedFileName, setUploadedFileName] = useState(''); // State for storing file name

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        setUploadedFileName(file.name); // Set the file name to display
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post(`/workflow/${id}/import/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const workflowData = response.data.data;
            console.log(workflowData);

            if (workflowData.length > 0) {
                const workflowKeys = Object.keys(workflowData[0]);
                setKeyNames(workflowKeys);
            }
            
            if (workflowData) {
                const workflowObjectEntry = Object(workflowData);
                setWorkflowObjects(workflowObjectEntry);
            }

        } catch (error) {
            console.error(error);
        }
    };

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        noClick: false,
        noKeyboard: true,
    });

    const handleInputChange = (event) => {
        const value = event.target.value;
        const fieldName = event.target.name;

        if (value.includes("/")) {
            setShowAutocomplete(true);
            setCurrentField(fieldName);
        } else {
            setShowAutocomplete(false);
        }

        setFlowData({
            ...flowData,
            [fieldName]: value,
        });
    };

    const handleAutocompleteClick = (keyName) => {
        const currentValue = flowData[currentField];
        const updatedValue = currentValue.endsWith("/")
            ? currentValue.slice(0, -1) + `/${keyName}`
            : currentValue + `/${keyName}`;
        
        setFlowData({
            ...flowData,
            [currentField]: updatedValue,
        });
        setShowAutocomplete(false);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const gmailflowResponse = await api.post(`/gmailflow/${id}/`, flowData);
            console.log("Emails sent successfully:", gmailflowResponse.data);
            setFlowData({
                email: '',
                title: '',
                body: '',
                name: ''
            });
        } catch (error) {
            console.error("Error submitting the form:", error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="d-flex">
                <VerticalNavbar />
                <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                    <h2 className="text-center py-5">Workflow Name</h2>
                    <div className="col-md-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body d-flex flex-column">
                                <div {...getRootProps()} className="dropzone-section" style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}>
                                    <input {...getInputProps()} />
                                    {uploadedFileName ? (
                                        <div>
                                            <p>Uploaded File: <strong>{uploadedFileName}</strong></p>
                                            <button type="button" className="btn btn-secondary" onClick={open}>Change File</button>
                                        </div>
                                    ) : (
                                        <p>Drag and drop your Excel file here, or click to select file</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="text-center mb-4">Workflow user id: {id}</h5>
                                <form onSubmit={handleFormSubmit}>
                                    {['email', 'title', 'body', 'name'].map((field) => (
                                        <div className='mb-3' key={field}>
                                            <label htmlFor={field} className='form-label'>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type={field === 'body' ? 'textarea' : 'text'}
                                                    className='form-control'
                                                    id={field}
                                                    name={field}
                                                    onChange={handleInputChange}
                                                    value={flowData[field]}
                                                />
                                                {showAutocomplete && currentField === field && keyNames.length > 0 && (
                                                    <div className="autocomplete-dropdown" style={{ position: 'absolute', zIndex: 100, backgroundColor: 'white', border: '1px solid #ccc', width: '100%' }}>
                                                        {keyNames.map((name) => (
                                                            <div key={name} onClick={() => handleAutocompleteClick(name)} style={{ padding: '5px', cursor: 'pointer' }}>
                                                                {name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button type='submit' className="btn btn-primary mt-2 w-100">Send</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default GmailWorkflowPage;
