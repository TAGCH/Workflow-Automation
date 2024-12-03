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
    const [activatedWorkflowCount, setActivatedWorkflowCount] = useState(0);

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
        // Set interval to change the message every 10 seconds
        const intervalId = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * messages.length);
            setCurrentMessage(messages[randomIndex]);
        }, 10000); // 10 seconds

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [user, navigate]);

    const fetchWorkflows = async () => {
        try {
          
            const response = await api.get("/workflows/", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add Authorization header
                    },
                });

            const data = await response.data;
            const userWorkflows = data.filter(workflow => workflow.owner_id === user.id);
            const lastTwoWorkflows = userWorkflows.slice(-2);
            const activeWorkflows = userWorkflows.filter(workflow => workflow.status === true);
            setWorkflows(lastTwoWorkflows);
            setActivatedWorkflowCount(activeWorkflows.length);
        } catch (error) {
            console.error('Error fetching workflows:', error);
        }
    };

    const messages = [
        "Hope you enjoy your lucky day! 🍀",
        "Wishing you a day full of opportunities! ✨",
        "Today is a great day for success! 🌟",
        "Make the most of today! 💪",
        "Keep pushing forward! 🚀",
        "You're on the right track! 👍"
    ];

    const [currentMessage, setCurrentMessage] = useState(messages[0]);

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
                        <p className="pl-40">{currentMessage}</p>
                    </div>
                    <div className="bg-light p-3 rounded mb-4">
                        <h4>Notifications</h4>
                            <p>
                                {activatedWorkflowCount > 0
                                    ? `✅ Activated Workflow Count: ${activatedWorkflowCount} workflows`
                                    : "❎ No activated workflow"}
                            </p>
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
