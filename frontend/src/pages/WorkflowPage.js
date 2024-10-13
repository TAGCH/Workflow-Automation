import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerticalNavbar from '../components/VerticalNavbar';
import { useParams } from 'react-router-dom';
import api from '../api'


const WorkflowPage = () => {
  const param = useParams()

  const [workflows, setWorkflows] = useState([]);
  const [flowData, setFlowData] = useState({
    email: '',
    title: '',
    body: ''
  });

  const fetchFlows = async () => {
    const response = await api.get('/workflow');
    setWorkflows(response.data)
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFlowData({
      ...flowData,
      [event.target.name]: value,
    });
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await api.post('/workflow', flowData);
    fetchFlows();
    setFlowData({
      email: '',
      title: '',
      body: ''
    });
  };
  

  return (
    <div>
    <Navbar />
    <div className="d-flex">
        <VerticalNavbar />
        <div className="container py-4">
            <h2 className="text-center py-5">My Workflows</h2>
            <div className="row pl-40">
                <div className="col-md-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center">
                              
                                    <div>
                                        {/* <h5>Workflow {param.id}</h5> */}
                                        <h5>Workflow</h5>
                                        <form onSubmit={handleFormSubmit}>
                                          <div className='mb-3 mt-3'>
                                              <label htmlFor='email' className='form-label'>
                                                  email:
                                              </label>
                                            <input type='text' className='form-control' id='email' name='email' onChange={handleInputChange} value={flowData.email}/>
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
            </div>
        </div>
    </div>
    <Footer />
</div>
  );
};

export default WorkflowPage;
