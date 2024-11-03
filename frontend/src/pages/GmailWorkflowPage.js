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
    // const [workflows, setWorkflows] = useState([]);
    const [emails, setEmails] = useState([]); // New state for storing emails
    const [flowData, setFlowData] = useState({
        email: '',
        title: '',
        body: '',
        name:''
    });

    const onDrop = async (acceptedFiles) => {
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);

        try {
            const response = await api.post(`/workflow/${id}/import/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const columns = Object.keys(response.data);
            setKeyNames(columns);
            if (response.data.emails) {
                setEmails(response.data.emails); // Set emails from response
            }
            console.log(response.data);
            console.log("keyNames:", keyNames);
        } catch (error) {
            console.error(error);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    // const fetchFlows = async () => {
    //     const response = await api.get(`/gmailflow/${id}/`);
    //     setEmails(response.data);
    // };

    // useEffect(() => {
    //     fetchFlows();
    // }, []);

    const handleInputChange = (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const fieldName = event.target.name;

        if (value.includes("/")) {
            console.log("Autocomplete triggered for field:", fieldName);
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
        const updatedValue = flowData[currentField].replace(/\/\w*/, keyName);
        
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
            // const emailResponse = await api.post(`/send-emails`, { 
            //     emails, 
            //     message: flowData.body, 
            // });

            console.log("Emails sent successfully:", gmailflowResponse.data);
            // fetchFlows();
            setFlowData({
                email: '',
                title: '',
                body: '',
                name:''
            });
        } catch (error) {
            console.error("Error submitting the form:", error);
        }
    };

    // useEffect(() => {
    //     if (!user || user.id !== parseInt(id, 10)) {
    //         navigate(`/home/${user.id}`);
    //     }
    // }, [user, id, navigate]);

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
                                    <p>Drag and drop your excel file here, or click to select file</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="text-center mb-4">Workflow user id: {id}</h5>
                                <form onSubmit={handleFormSubmit}>
                                    {['email', 'title', 'body','name'].map((field) => (
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