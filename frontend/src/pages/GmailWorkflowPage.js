import React, { useState, useEffect, useContext } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerticalNavbar from '../components/VerticalNavbar';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { UserContext } from "../context/UserContext";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from 'react-redux';
import { addFile, clearFile } from '../redux/fileSlice';

const GmailWorkflowPage = () => {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [keyNames, setKeyNames] = useState([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [emails, setEmails] = useState([]); // New state for storing emails
    const [workflows, setWorkflows] = useState([]);
    const [flowData, setFlowData] = useState({
        email: '',
        title: '',
        body: '',
        name: ''
    });
    const [workflowObjects, setWorkflowObjects] = useState([]);
    const [uploadedFileName, setUploadedFileName] = useState(''); // State for storing file name

    const fetchFlows = async () => {
        const response = await api.get(`/workflow/${id}/`);
        console.log('normal fetchflow')
        setWorkflows(response.data);
    };
    
    const dispatch = useDispatch(); // Send action to Redux store
    const uploadFile = useSelector((state) => state.files.uploadFile);

    useEffect(() => {
        if (uploadFile) {
            setUploadedFileName(uploadFile.name); // Set file name from Redux
        } else {
            // Fetch from the API if no file name is in the Redux store
            const fetchFileMetadata = async () => {
                try {
                    const response = await api.get(`/workflow/${id}/file-metadata`);
                    if (response.data.file_name) {
                        setUploadedFileName(response.data.file_name);
                        dispatch(addFile({ name: response.data.file_name }));
                    }
                } catch (error) {
                    console.error("Failed to fetch file metadata:", error);
                }
            };
    
            fetchFileMetadata();
        }
    }, [dispatch, id, uploadFile]);

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];

        dispatch(clearFile());
        dispatch(addFile({ name: file.name }));
        setUploadedFileName(file.name);

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
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const fieldName = event.target.name;

        // Check value include '/' to trigger autocomplete
        if (value.includes("/")) {
            setShowAutocomplete(true); // drop down state
            setCurrentField(fieldName); // 
        } else {
            setShowAutocomplete(false);
        }

        setFlowData({
            ...flowData,
            [fieldName]: value,
        });
    };

    // Autocomplete functionality
    const handleAutocompleteClick = (keyName) => {
        // Add key placeholder with '/' and set it in the current field.
        const currentValue = flowData[currentField];

        // If the last character is '/', replace it with the keyName ;otherwise, append '/${keyName}'
        const updatedValue = currentValue.endsWith("/")
            ? currentValue.slice(0, -1) + `/${keyName}`
            : currentValue + `/${keyName}`;
        
        setFlowData({
            ...flowData,
            [currentField]: updatedValue,
        });
        setShowAutocomplete(false); // Hide drop down after completion
    };

    // Helper function to replace keys in a string using recipient data
    const replaceKeysInString = (str, recipient) => {
        // Replace any '/keyName' pattern with the corresponding value from recipient, if available
        return str.replace(/\/\w+/g, (match) => recipient[match.slice(1)] || match);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
    
        try {
            // Clear flows and reset form data before starting email sending process
            fetchFlows();
            setFlowData({
                email: '',
                title: '',
                body: '',
                name: '',
                workflow_id: ''
            });
    
            console.log("Sending flow data:", flowData);
    
            // Determine if any replacements are needed based on presence of '/' in flowData
            const needsReplacement = Object.values(flowData).some(value => value.includes("/"));
    
            let emailPromises;
            
            if (needsReplacement) {
                // Generate an array of promises to send individualized emails
                emailPromises = workflowObjects.map((recipient) => {
                    // Conditionally apply key replacement if needed
                    const personalizedEmail = {
                        email: replaceKeysInString(flowData.email, recipient),
                        title: replaceKeysInString(flowData.title, recipient),
                        body: replaceKeysInString(flowData.body, recipient),
                        name: flowData.name, // Set name as-is from form data
                        workflow_id: id // Set workflow_id directly
                    };
                    
                    console.log('Creating personalizedEmail:', personalizedEmail);
    
                    // Send API request for each personalized email
                    return api.post(`/gmailflow/${id}/`, personalizedEmail);
                });
            } else {
                // Send a single email when no replacement is needed
                const singleEmail = {
                    email: flowData.email,
                    title: flowData.title,
                    body: flowData.body,
                    name: flowData.name,
                    workflow_id: id
                };
    
                console.log('Creating single email:', singleEmail);
                emailPromises = [api.post(`/gmailflow/${id}/`, singleEmail)];
            }
    
            // Wait for all email-sending promises to complete
            await Promise.all(emailPromises);
    
            console.log("Emails sent successfully");
    
            // Refetch flows after email sending is complete
            fetchFlows();
    
            // Reset form data to initial state after successful email sending
            setFlowData({
                email: '',
                title: '',
                body: '',
                name: '',
                workflow_id: ''
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
                                                    <div className="autocomplete-dropdown" style={{ position: 'absolute', zIndex: 100, backgroundColor: 'black', border: '1px solid #ccc', width: '100%' }}>
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
