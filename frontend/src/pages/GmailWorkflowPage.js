import React, {useState, useEffect, useContext} from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerticalNavbar from '../components/VerticalNavbar';
import {useNavigate, useParams} from 'react-router-dom';
import api from '../api';
import { UserContext } from "../context/UserContext";

// I think I'mma need the id from create page
const GmailWorkflowPage = () => {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [workflows, setWorkflows] = useState([]);
    const [flowData, setFlowData] = useState({
        email: '',
        title: '',
        body: ''
    });

    // Fetch workflows whhich is not actually being used (yet)
    const fetchFlows = async () => {
        const response = await api.get(`/workflow/${id}/`);
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
        await api.post(`/workflow/${id}/`, flowData);
        fetchFlows();
        setFlowData({
            email: '',
            title: '',
            body: ''
        });
    };

    useEffect(() => {
        if (!user || user.id !== parseInt(id, 10)) {
            navigate('/home');
        }
    }, [user, id, navigate]);

    return (
        <div>
            <Navbar />
            <div className="d-flex">
                <VerticalNavbar />
                <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                    <h2 className="text-center py-5">My Workflows</h2>
                    <div className="col-md-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="text-center mb-4">Workflow {id}</h5>
                                <form onSubmit={handleFormSubmit}>
                                    <div className='mb-3'>
                                        <label htmlFor='email' className='form-label'>Email:</label>
                                        <input type='text' className='form-control' id='email' name='email' onChange={handleInputChange} value={flowData.email} />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='title' className='form-label'>Title:</label>
                                        <input type='text' className='form-control' id='title' name='title' onChange={handleInputChange} value={flowData.title} />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='body' className='form-label'>Body:</label>
                                        <input type='text' className='form-control' id='body' name='body' onChange={handleInputChange} value={flowData.body} />
                                    </div>
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