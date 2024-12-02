import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VerticalNavbar from "../components/VerticalNavbar";
import WorkflowCard from "../components/WorkflowCard";
import { UserContext } from '../context/UserContext';
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const HomePage = () => {
    const { user, token} = useContext(UserContext);
    const navigate = useNavigate();
    const [workflows, setWorkflows] = useState([]);

    // Function to extract the username from the email
    const getUsernameFromEmail = (email) => {
        if (!email) return '';
        return email.split('@')[0]; // Get the part before '@'
    };

    useEffect(() => {
        if (user && user.id) {
            navigate(`/home/${user.id}`);
            fetchWorkflows()
        }
    }, [user, navigate]);

    const fetchWorkflows = async () => {
        try {
          
            const response = await api.get("/workflows", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add Authorization header
                    },
                });

            const data = await response.data;
            const lastTwoWorkflows = data.filter(workflow => workflow.owner_id === user.id).slice(-2);
            setWorkflows(lastTwoWorkflows);
        } catch (error) {
            console.error('Error fetching workflows:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="d-flex">
                <VerticalNavbar />
                <div className="welcome-container">
                    <div className="bg-black p-4 rounded mb-4">
                        <div className="d-flex align-items-center">
                            <h1 className="font-weight-bold pl-40">
                                Welcome back, {user ? getUsernameFromEmail(user.email) : "User"}!
                            </h1>
                        </div>
                        <p className="pl-40">Hope you enjoy your lucky day! 🍀</p>
                    </div>
                    <div className="bg-light p-3 rounded mb-4">
                        <h4 className="pl-40">Notifications</h4>
                        <p className="pl-40">No new notifications</p>
                    </div>
                    <div className="bg-light p-3 rounded">
                        <h4 className="pl-40 py-1">Recent Workflows</h4>
                        <div className="row pl-40">
                            {workflows.length > 0 ? (
                                workflows.map(workflow => (
                                    <WorkflowCard
                                        key={workflow.id}
                                        id={workflow.id}
                                        name={workflow.name}
                                        type={workflow.type}
                                        status={workflow.status}
                                        userId={user.id}
                                    />
                                ))
                            ) : (
                                <div>
                                    <p>You have no workflows</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default HomePage;
