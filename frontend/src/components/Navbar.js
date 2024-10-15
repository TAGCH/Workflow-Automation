import React, { useContext } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { UserContext } from '../context/UserContext'; // Import UserContext

function MyNavbar() {
    const { user, setToken } = useContext(UserContext); // Access user and setToken from UserContext

    const handleLogout = () => {
        setToken(null); // Clear the token to log out the user
        localStorage.removeItem("awesomeUsersToken"); // Remove token from localStorage
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
                        onClick={() => window.location.href = '/login'} // Redirect to login page
                    >
                        <FaSignInAlt />
                    </Button>
                )}
            </Container>
        </Navbar>
    );
}

export default MyNavbar;
