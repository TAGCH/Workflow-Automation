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
    const [filteredWorkflows, setFilteredWorkflows] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState(""); // For filtering by status (active or inactive)
    const {user, token} = useContext(UserContext);

    useEffect(() => {
        const fetchWorkflows = async () => {
            if (!token) {
                console.warn("No token available for authorization");
                return;
            }

            try {
                const response = await api.get("/workflows/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = response.data;

                // Filter workflows for the current user
                const userWorkflows = data.filter(workflow => workflow.owner_id === user.id);
                setWorkflows(userWorkflows);
                setFilteredWorkflows(userWorkflows);
            } catch (error) {
                console.error("Error fetching workflows:", error);
            }
        };

        fetchWorkflows();
    }, [user.id, token]);

    // Search handler
    const handleSearch = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(searchValue);
        
        // Filter workflows based on search term and status filter
        const filtered = workflows.filter(workflow => 
            workflow.name.toLowerCase().includes(searchValue)
            && (statusFilter === "" || workflow.status.toString() === statusFilter)
        );

        setFilteredWorkflows(filtered);
    };

    // Status filter handler
    const handleStatusFilter = (event) => {
        const statusValue = event.target.value;
        setStatusFilter(statusValue);

        // Filter workflows based on search term and selected status
        const filtered = workflows.filter(workflow => 
            (workflow.name.toLowerCase().includes(searchTerm) || searchTerm === "")
            && (statusValue === "" || workflow.status.toString() === statusValue)
        );

        setFilteredWorkflows(filtered);
    };

    return (
        <div>
            <Navbar />
            <div className="d-flex">
                <VerticalNavbar />
                <div className="container text-center py-4">
                    <h2 className="py-5">My Workflows</h2>

                    {/* Search and Filter on the same line */}
                    <div className="d-flex justify-content-center mb-5">
                        {/* Search Bar */}
                        <div className="search-bar">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search by workflow name..." 
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="status-filter ml-2">
                            <select className="form-select" onChange={handleStatusFilter} value={statusFilter}>
                                <option value="">All Statuses</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Workflow Cards */}
                    <div className="row pl-40">
                        {filteredWorkflows.length > 0 ? (
                            filteredWorkflows.map(workflow => (
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
