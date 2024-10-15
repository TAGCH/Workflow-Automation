import React, { useContext } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { UserContext } from '../context/UserContext'; // Import UserContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function MyNavbar() {
    const { user, setToken } = useContext(UserContext); // Access user and setToken from UserContext
    const navigate = useNavigate(); // Create navigate function

    const handleLogout = () => {
        setToken(null); // Clear the token to log out the user
        localStorage.removeItem("awesomeUsersToken"); // Remove token from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <Navbar bg="light" variant="light" className="shadow-sm">
            <Container>
                <Navbar.Brand href="/home" style={{ fontWeight: 'bold', fontFamily: 'Modak', fontSize: '32px' }}>
                    Workflow
                </Navbar.Brand>
                {user ? ( // If user is logged in
                    <Button 
                        variant="outline-secondary" 
                        className="border-0" 
                        style={{
                            padding: '8px',
                            width: '50px',
                            height: '50px',
                        }}
                        onClick={handleLogout} // Handle logout on click
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
    );
}

export default MyNavbar;
