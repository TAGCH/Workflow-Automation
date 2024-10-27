import React, { useContext, useEffect } from 'react';
import gmail from "../images/gmail.png";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VerticalNavbar from "../components/VerticalNavbar";
import { UserContext } from '../context/UserContext';
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // Function to extract the username from the email
    const getUsernameFromEmail = (email) => {
        if (!email) return '';
        return email.split('@')[0]; // Get the part before '@'
    };

    useEffect(() => {
        if (user && user.id) {
            navigate(`/home/${user.id}`);
        }
    }, [user, navigate]);

    return (
        <div>
            <Navbar />
            <div className="d-flex">
                <VerticalNavbar />
                <div className="welcome-container">
                    <div className="bg-black p-4 rounded mb-4">
                        <div className="d-flex align-items-center">
                            <h1 className="font-weight-bold">
                                Welcome back, {user ? getUsernameFromEmail(user.email) : "User"}!
                            </h1>
                        </div>
                        <p>Hope you enjoy your lucky day! 🍀</p>
                    </div>
                    <div className="bg-light p-3 rounded mb-4">
                        <h4>Notifications</h4>
                        <p>No new notifications</p>
                    </div>
                    <div className="bg-light p-3 rounded">
                        <h4>Recent Workflows</h4>
                        <div className="col-md-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5>Workflow 2</h5>
                                            <p>Status: Completed</p>
                                        </div>
                                        <div className="d-flex">
                                            <img src={gmail} alt="gmail" className="img-fit"/>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary mt-2">
                                        View Workflow
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default HomePage;
