import React, { useContext, useState } from 'react';
import { Navbar, Container, Button, Modal } from 'react-bootstrap';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { UserContext } from '../context/UserContext'; // Import UserContext
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

function MyNavbar() {
    const { user, setToken, setUser } = useContext(UserContext); // Access user, setToken, and setUser from UserContext
    const navigate = useNavigate(); // Create navigate function
    const [showLogoutModal, setShowLogoutModal] = useState(false); // State for controlling the modal visibility

    const handleLogout = () => {
        setToken(null); // Clear the token to log out the user
        setUser(null); // Clear the user state to ensure user is logged out
        localStorage.removeItem("awesomeUsersToken"); // Remove token from localStorage
        navigate('/login'); // Redirect to login page
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true); // Show the modal when the logout button is clicked
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false); // Hide the modal if the user cancels the logout
    };

    const handleConfirmLogout = () => {
        setShowLogoutModal(false); // Hide the modal and log out the user
        handleLogout(); // Call the logout function
    };

    return (
        <>
            <div className="pb-5">
                <Navbar bg="light" variant="light" className="shadow-sm fixed-top position-fixed w-100">
                    <Container>
                        <Link to="/home/${user.id}" style={{ textDecoration: 'none' }}>
                            <Navbar.Brand style={{ fontWeight: 'bold', fontFamily: 'Modak', fontSize: '32px' }}>
                                Workflow
                            </Navbar.Brand>
                        </Link>
                        {user ? ( // If user is logged in
                            <Button
                                variant="outline-secondary"
                                className="border-0"
                                style={{
                                    padding: '8px',
                                    width: '50px',
                                    height: '50px',
                                }}
                                onClick={handleLogoutClick} // Open modal on click
                            >
                                <FaSignOutAlt />
                            </Button>
                        ) : ( // If user is not logged in
                            <Button
                                variant="outline-secondary"
                                className="border-0"
                                style={{
                                    padding: '8px',
                                    width: '50px',
                                    height: '50px',
                                }}
                                onClick={() => navigate('/login')} // Use navigate to redirect to login page
                            >
                                <FaSignInAlt />
                            </Button>
                        )}
                    </Container>
                </Navbar>

                {/* Logout Confirmation Modal */}
                <Modal show={showLogoutModal} onHide={handleCancelLogout} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Logout</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to log out?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCancelLogout}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleConfirmLogout}>
                            Logout
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}

export default MyNavbar;
