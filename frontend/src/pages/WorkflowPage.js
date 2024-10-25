import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerticalNavbar from '../components/VerticalNavbar';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useDropzone } from 'react-dropzone';

// I think I'mma need the id from create page
const WorkflowPage = () => {
  const param = useParams();

  const [workflows, setWorkflows] = useState([]);
  const [flowData, setFlowData] = useState({
    email: '',
    title: '',
    body: ''
  });

  // Fetch workflows whhich is not actually being used (yet)
  const fetchFlows = async () => {
    const response = await api.get(`/workflow/`);
    setWorkflows(response.data);
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  // Handle form input changes
  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFlowData({
      ...flowData,
      [event.target.name]: value,
    });
  };

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await api.post(`/workflow/`, flowData);
    fetchFlows();
    setFlowData({
      email: '',
      title: '',
      body: ''
    });
  };

  // Dropzone functionality
  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]); // Append the first file
  
    try {
      const response = await api.post('/workflow/import/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  
  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <VerticalNavbar />
        <div className="container py-4">
          <h2 className="text-center py-5">My Workflows</h2>
          <div className="row pl-40">
            {/* Workflow Form */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>Workflow {param.id}</h5>
                      <form onSubmit={handleFormSubmit}>
                        <div className='mb-3 mt-3'>
                          <label htmlFor='email' className='form-label'>
                            Email:
                          </label>
                          <input type='text' className='form-control' id='email' name='email' onChange={handleInputChange} value={flowData.email} />
                        </div>
                        <div className='mb-3 mt-3'>
                          <label htmlFor='title' className='form-label'>
                            Title:
                          </label>
                          <input type='text' className='form-control' id='title' name='title' onChange={handleInputChange} value={flowData.title} />
                        </div>
                        <div className='mb-3 mt-3'>
                          <label htmlFor='body' className='form-label'>
                            Body:
                          </label>
                          <input type='text' className='form-control' id='body' name='body' onChange={handleInputChange} value={flowData.body} />
                        </div>
                        <button type='submit' className="btn btn-primary mt-2">
                          Send
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dropzone */}
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

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WorkflowPage;
