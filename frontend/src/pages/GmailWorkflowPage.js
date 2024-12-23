import React, { useState, useEffect, useContext, useRef } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerticalNavbar from '../components/VerticalNavbar';
import DateTimePopup from "../components/DateTimePopup";
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { UserContext } from "../context/UserContext";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from 'react-redux';
import { addFile, clearFile } from '../redux/fileSlice';
import ErrorMessage from "../components/ErrorMessage";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UpdateSenderPopup from '../components/UpdateSenderPopup';

const GmailWorkflowPage = () => {
    const { id } = useParams();
    const { user, token } = useContext(UserContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [keyNames, setKeyNames] = useState([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [emails, setEmails] = useState([]); // New state for storing emails
    const [workflows, setWorkflows] = useState([]);
    const [flowData, setFlowData] = useState({
        recipient_email: '',
        title: '',
        body: '',
        name: ''
    });
    const [workflowObjects, setWorkflowObjects] = useState([]);
    const [uploadedFileName, setUploadedFileName] = useState(''); // State for storing file name

    const [isPopupOpen, setIsPopupOpen] = useState(false); // New state for popup visibility
    const [selectedDatesAndTimes, setSelectedDatesAndTimes] = useState([]);
    const [isActivated, setIsActivated] = useState(false);

    // Add For Change sender
    const [isSenderPopupOpen, setIsSenderPopupOpen] = useState(false); // State for managing the sender popup
    const openSenderPopup = () => {
        console.log("Opening sender popup");
        setIsSenderPopupOpen(true)
    };
    // End For Change sender

    const activateWorkflow = async () => {
        try {
            // Determine the new status (1 for active, 0 for inactive)
            const newStatus = 1;

            // Make the PUT request to update the workflow status
            const response = await api.put(`/workflows/${id}/`, { status: newStatus });
            setIsActivated(true);  // Set to true if status is 1 (active), false if 0 (inactive)

        } catch (err) {
            console.error('Failed to toggle workflow status:', err);
        }
    };

    const deactivateWorkflow = async () => {
        try {
            // Determine the new status (1 for active, 0 for inactive)
            const newStatus = 0;

            // Make the PUT request to update the workflow status
            const response = await api.put(`/workflows/${id}/`, { status: newStatus });

            // Update the state based on the response
            const updatedWorkflow = response.data;
            setIsActivated(false);  // Set to true if status is 1 (active), false if 0 (inactive)

        } catch (err) {
            console.error('Failed to toggle workflow status:', err);
        }
    };

    const openPopup = () => setIsPopupOpen(true);

    // Function to handle confirmed selections from DateTimePopup
    const handleConfirm = (selectedDatesAndTimes) => {
        setSelectedDatesAndTimes(selectedDatesAndTimes);
        setIsPopupOpen(false);
        console.log("Confirmed dates and times:", selectedDatesAndTimes);
    };
    const [fileUpdate, setFileUpdate] = useState(false);

    const inputRef = useRef(null);  // Ref for input field
    const dropdownRef = useRef(null);  // Ref for dropdown container

    const fetchFlows = async () => {
        const response = await api.get(`/workflow/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add Authorization header
                    },
                });
        setWorkflows(response.data);
        setIsActivated(response.data.status);
    };

    useEffect(() => {
        fetchFlows();
    }, [id]);

    const fetchRecentData = async () => {
        try {
            const response = await api.get(`/gmailflow/${id}/recent`);
            const recentData = response.data;

            setFlowData({
                recipient_email: recentData.recipient_email || '',
                title: recentData.title || '',
                body: recentData.body || '',
                name: recentData.name || ''
            });
            // Check if all fields are empty
            if (!recentData.recipient_email && !recentData.title && !recentData.body && !recentData.name) {
                // If all fields are empty, show the popup
                setIsSuccessPopupOpen(true);
                setPopupMessage("No Saved Data");
            } else {
                setErrorMessage("");
                console.log("Recent data loaded:", recentData);
            }
        } catch (error) {
            console.error("Failed to fetch recent data:", error);
            setIsSuccessPopupOpen(true);
            setPopupMessage("No Saved Data");
        }
    };

    // Function to fetch key names directly from the backend
    const fetchKeyNames = async () => {
        try {
            const response = await api.get(`/workflow/${id}/keysname/`);
            setKeyNames(response.data.keyNames || []);
        } catch (error) {
            console.error("Failed to fetch key names:", error);
        }
    };

    // Function to fetch data from database
    const fetchWorkflowData = async () => {
        try {
            const response = await api.get(`/workflow/${id}/data`);
            setWorkflowObjects(Object(response.data))
        } catch (error) {
            console.error("Failed to fetch data from database");
        }
    };
    
    // Fetch from the API if no file name is in the Redux store
    const fetchFileMetadata = async () => {
        try {
            const response = await api.get(`/workflow/${id}/file-metadata/`);
            if (response.data.filename) {
                setUploadedFileName(response.data.filename);
                console.log("File added:", uploadedFileName);
                dispatch(addFile({ name: response.data.filename }));
            }
        } catch (error) {
            console.error("Failed to fetch file metadata:", error);
        }
    };

    const dispatch = useDispatch(); // Send action to Redux store
    const uploadFile = useSelector((state) => state.files.uploadFile);

    useEffect(() => {
        console.log("useEffect triggered", workflowObjects);
        // Fetch key names from the backend on component mound or id change
        if (!workflowObjects.length){
            fetchKeyNames();
            console.log('fetch key name from database');
            fetchWorkflowData();
            console.log('fetch flow object data');
        }

        // Fetch file metadata only if there's no file data in Redux or workflowObjects
        if (!uploadedFileName && !workflowObjects.length) {
            fetchFileMetadata();
            console.log('fetch file meta data');
        } else if (uploadFile) {
            setUploadedFileName(uploadFile.name); // Set file name from Redux
        }
        console.log("FileUpdate state:", fileUpdate);
        setFileUpdate(false);
        
    }, [id, fileUpdate]);

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];

        dispatch(clearFile());
        console.log("Redux file state:", uploadFile);
        dispatch(addFile({ name: file.name }));
        setUploadedFileName(file.name);
        setFileUpdate(true);

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
                setWorkflowObjects(Object(workflowData));
            }

        } catch (error) {
            console.error(error);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        noClick: false,
        noKeyboard: true,
    });

    const handleInputChange = (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const fieldName = event.target.name;

        // Check if the value includes " /" and it is valid to trigger autocomplete
        const hasTriggerPattern = value.includes(" /");
        const hasKeyAfterPattern = value.match(/ \/[\w]+/); // Check if " /" is followed by valid text

        if (hasTriggerPattern && !hasKeyAfterPattern) {
            setShowAutocomplete(true); // Show dropdown only if " /" is valid for autocomplete
            setCurrentField(fieldName);
        } else {
            setShowAutocomplete(false);
        }

        setFlowData({
            ...flowData,
            [fieldName]: value,
        });
    };

    // Hide dropdown if input loses focus without selection
    const handleInputBlur = () => {
        // Only hide autocomplete when input or dropdown isn't focused
        setTimeout(() => {
            if (dropdownRef.current && !dropdownRef.current.contains(document.activeElement)) {
                setShowAutocomplete(false);
            }
        }, 100);  // Small delay to allow click on dropdown item
    };

    // Autocomplete functionality
    const handleAutocompleteClick = (keyName) => {
        // Add key placeholder with '/' and set it in the current field.
        const currentValue = flowData[currentField];

        // If the last character is ' /', replace it with the keyName ;otherwise, append '/${keyName}'
        const updatedValue = currentValue.endsWith(" /")
            ? currentValue.slice(0, -2) + ` /${keyName}`
            : `${currentValue} /${keyName}`;

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

        const action = event.nativeEvent.submitter?.value;

        try {
            console.log("Action:", action);
            fetchFlows();
            const needsReplacement = Object.values(flowData).some(value => value.includes(" /"));
            let emailPromises;

            if (action === "Save") {
                // Clear flows and reset form data before starting email sending process

                // console.log("replacement checked? ", needsReplacement)
                // console.log("Creating personalizedEmail");
                // if (needsReplacement) {
                //     emailPromises = workflowObjects.map((recipient) => {
                //         const personalizedEmail = {
                //             recipient_email: replaceKeysInString(flowData.recipient_email, recipient),
                //             title: replaceKeysInString(flowData.title, recipient),
                //             body: replaceKeysInString(flowData.body, recipient),
                //             name: flowData.name,
                //             workflow_id: id,
                //         };
                //         return api.post(`/gmailflow/`, personalizedEmail);
                //     });
                // }
                // else {
                        const formatEmail = {
                        recipient_email: flowData.recipient_email,
                        title: flowData.title,
                        body: flowData.body,
                        name: flowData.name,
                        workflow_id: id
                    };
                    console.log(formatEmail);
                    // Check if all fields are empty
                    if (!formatEmail.recipient_email && !formatEmail.title && !formatEmail.body && !formatEmail.name) {
                        // If all fields are empty, show the popup
                        setIsSuccessPopupOpen(true);
                        setPopupMessage("Data is Empty");
                    } else {
                        await api.post(`/gmailflow/`, formatEmail);
                        setIsSuccessPopupOpen(true);
                        setPopupMessage("Data Saved");
                    }
                // }

                fetchFlows();
            }

            else if (action === "Send") {

                if (needsReplacement) {
                    emailPromises = workflowObjects.map((recipient) => {
                        const personalizedEmail = {
                            recipient_email: replaceKeysInString(flowData.recipient_email, recipient),
                            title: replaceKeysInString(flowData.title, recipient),
                            body: replaceKeysInString(flowData.body, recipient),
                            name: flowData.name,
                            workflow_id: id,
                        };


                        // Send API request for each personalized email
                        return api.post(`/sendmail/${id}/`, personalizedEmail);
                        setIsSuccessPopupOpen(true);
                        setPopupMessage("Email Sent");
                    });

                } else {
                    // Send a single email when no replacement is needed
                    const singleEmail = {
                        recipient_email: flowData.recipient_email,
                        title: flowData.title,
                        body: flowData.body,
                        name: flowData.name,
                        workflow_id: id,
                    };

                    emailPromises = [api.post(`/sendmail/${id}/`, singleEmail)];
                }
                await Promise.all(emailPromises);
                setIsSuccessPopupOpen(true);
                setPopupMessage("Email Sent");
                // console.log("Emails saved successfully");

                fetchFlows();
            }

        } catch (error) {
            console.error("Error submitting the form:", error);
        }

        // clearFile();
    };

    const SuccessPopup = ({ message, onClose }) => {
        const [hovered, setHovered] = useState(false);
    
        return (
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                }}
            >
                <div
                    style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        textAlign: "center",
                        maxWidth: "400px",
                        width: "90%",
                    }}
                >
                    <br></br>
                    <h6><strong>{message}</strong></h6>
                    <br></br>
                    <button
                        style={{
                            backgroundColor: hovered ? "#20c997" : "#333",
                            color: "white",
                            border: "none",
                            padding: "10px 15px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        onClick={onClose}
                    >
                        OK
                    </button>
                </div>
            </div>
        );
    };

    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    return (
        <div>
            <Navbar />
            <div className="d-flex">
                <VerticalNavbar />
                <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                    <h2 className="text-center py-5">Workflow: {workflows.name}</h2>
                    <button 
                        className="btn btn-secondary" 
                        style={{ position: 'absolute', top: '100px', right: '100px' }} 
                        onClick={openSenderPopup}
                    >
                        Change Sender
                    </button>
                    <div className="col-md-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body d-flex flex-column">
                                <div {...getRootProps()} className="dropzone-section" style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}>
                                    <input {...getInputProps()} />
                                    {uploadedFileName ? (
                                        <div>
                                            <p>Uploaded File: <strong>{uploadedFileName}</strong></p>
                                            <button type="button" className="btn btn-secondary">Change File</button>
                                        </div>
                                    ) : (
                                        <p>Drag and drop your Excel file here, or click to select file</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <ErrorMessage message={errorMessage} />
                    <div className="col-md-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="text-center mb-4">Key Available for Use</h5>
                                <h6 className='text-center mb-4'
                                    style={{backgroundColor: 'beige', padding: '15px', borderRadius: '15px'}}>
                                    {Object(keyNames).length > 0
                                        ? Object(keyNames).join(', ')
                                        : 'No key available'}
                                </h6>
                                <form onSubmit={handleFormSubmit}
                                      style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
                                    {['recipient_email', 'title', 'name', 'body'].map((field) => (
                                        <div className="mb-4" key={field}>
                                            <label
                                                htmlFor={field}
                                                className="form-label"
                                            >
                                                {field.charAt(0).toUpperCase() + field.slice(1)}:
                                            </label>
                                            <div style={{position: 'relative', paddingBottom: '20px'}}>
                                                {field === 'body' ? (
                                                    <ReactQuill
                                                        value={flowData[field]}
                                                        onChange={(value) =>
                                                            handleInputChange({target: {name: field, value}})
                                                        }
                                                        onBlur={() => handleInputBlur(field)} // Disable dropdown when not focused
                                                        theme="snow"
                                                        style={{height: '150px'}}
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id={field}
                                                        name={field}
                                                        value={flowData[field]}
                                                        onChange={handleInputChange}
                                                        onBlur={handleInputBlur} // Disable dropdown when not focused
                                                        autoComplete="off"
                                                        ref={inputRef}
                                                    />
                                                )}
                                                {showAutocomplete && currentField === field && keyNames.length > 0 && (
                                                    <div
                                                        ref={dropdownRef}
                                                        className="autocomplete-dropdown"
                                                        style={{
                                                            position: 'absolute',
                                                            zIndex: 100,
                                                            backgroundColor: 'white',
                                                            border: '1px solid #ccc',
                                                            width: '100%',
                                                        }}
                                                    >
                                                        {keyNames.map((name) => (
                                                            <div
                                                                key={name}
                                                                onClick={() => handleAutocompleteClick(name)}
                                                                style={{padding: '5px', cursor: 'pointer'}}
                                                            >
                                                                {name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={fetchRecentData} className="btn btn-secondary mt-3 w-100">
                                        Load Recent Data
                                    </button>
                                    <button type='submit' className="btn btn-primary mt-2 w-100" name="action"
                                            value="Save"> Save
                                    </button>
                                    <button type='submit' className="btn btn-primary mt-2 w-100" name="action"
                                            value="Send"> Send
                                    </button>
                                </form>
                                <button
                                    onClick={isActivated ? deactivateWorkflow : activateWorkflow}
                                    className={`btn ${isActivated ? 'btn-danger' : 'btn-success'} mt-2 w-100`}
                                    name="action"
                                >
                                    {isActivated ? 'Deactivate Workflow' : 'Activate Workflow'}
                                </button>
                                <button onClick={openPopup} className="btn btn-secondary mt-3 w-100">
                                    Select Date and Time
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isPopupOpen && (
                <DateTimePopup
                    open={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    onConfirm={handleConfirm}
                    workflowID={id}
                />
            )}
            {/* Include the new UpdateSenderPopup */}
            {isSenderPopupOpen && (
                <UpdateSenderPopup
                    open={isSenderPopupOpen}
                    onClose={() => setIsSenderPopupOpen(false)}
                    flowId={id} // Pass the workflow ID
                />
            )}
            {isSuccessPopupOpen && (
                <SuccessPopup
                    message={popupMessage}
                    onClose={() => setIsSuccessPopupOpen(false)} // Close the popup
                />
            )}
            <Footer/>
        </div>
    );
};

export default GmailWorkflowPage;
