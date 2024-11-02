import React, {useContext, useEffect, useState} from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VerticalNavbar from "../components/VerticalNavbar";
import WorkflowCard from "../components/WorkflowCard";
import {UserContext} from "../context/UserContext";

const MyflowPage = () => {
    const [workflows, setWorkflows] = useState([]);
    const {user} = useContext(UserContext);

    useEffect(() => {
        const fetchWorkflows = async () => {
            try {
                const response = await fetch('http://localhost:8000/workflows');
                const data = await response.json();
                const userWorkflows = data.filter(workflow => workflow.owner_id === user.id);

                setWorkflows(userWorkflows);
            } catch (error) {
                console.error("Error fetching workflows:", error);
            }
        };

        fetchWorkflows();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="d-flex">
                <VerticalNavbar />
                <div className="container py-4">
                    <h2 className="text-center py-5">My Workflows</h2>
                    <div className="row pl-40">
                        {workflows.map(workflow => (
                            <WorkflowCard
                                key={workflow.id}
                                id={workflow.id}
                                name={workflow.name}
                                type={workflow.type}
                                status={workflow.status}
                                userId={user.id} // Assuming the user_id is in the workflow data
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MyflowPage;
