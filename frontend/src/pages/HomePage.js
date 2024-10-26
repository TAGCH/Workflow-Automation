import React, { useContext, useState } from 'react';
import gmail from "../images/gmail.png";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VerticalNavbar from "../components/VerticalNavbar";
import CreateflowPopup from '../components/CreateflowPopup'; // Import the popup component
import { UserContext } from '../context/UserContext';

const HomePage = () => {
    const { user } = useContext(UserContext);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage the popup

    const getUsernameFromEmail = (email) => {
        return email.split('@')[0];
    };

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <div>
            <Navbar />
            <div className="d-flex">
                <VerticalNavbar openPopup={openPopup} /> {/* Pass openPopup function to the navbar */}
                <div className="welcome-container">
                    <div className="bg-black p-4 rounded mb-4">
                        <div className="d-flex align-items-center">
                            <h1 className="font-weight-bold">
                                Welcome , {user ? getUsernameFromEmail(user.email) : "User"}!
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
                {/* Render the popup here so it overlays the entire viewport */}
                {isPopupOpen && <CreateflowPopup closePopup={closePopup} />}
            </div>
            <Footer/>
        </div>
    );
};

export default HomePage;

