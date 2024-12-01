import React, {useContext, useEffect, useState} from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VerticalNavbar from "../components/VerticalNavbar";
import WorkflowCard from "../components/WorkflowCard";
import "../styles/pages/Myflow.css"
import {UserContext} from "../context/UserContext";
import api from "../services/api";

const MyflowPage = () => {
    const [workflows, setWorkflows] = useState([]);
    const {user} = useContext(UserContext);

    useEffect(() => {
        const fetchWorkflows = async () => {
            try {
                const response = await api.get("/workflows/");
                const data = await response.data;
                const userWorkflows = data.filter(workflow => workflow.owner_id === user.id);

                setWorkflows(userWorkflows);
            } catch (error) {
                console.error("Error fetching workflows:", error);
            }
        };

        fetchWorkflows();
    }, [user.id]);

    return (
        <div>
            <Navbar />
            <div className="d-flex">
                <VerticalNavbar />
                <div className="container text-center py-4">
                    <h2 className="py-5">My Workflows</h2>
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
                            <div className="no-workflows-message">
                                <p>You have no workflows</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default MyflowPage;
