import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';

function MyNavbar() {
    return (
        <Navbar bg="light" variant="light" className="shadow-sm">
            <Container>
                <Navbar.Brand href="/home" style={{ fontWeight: 'bold', fontFamily: 'Modak', fontSize: '32px' }}>
                    Workflow
                </Navbar.Brand>
                <Button variant="outline-secondary" className="border-0" style={{
                    padding: '8px',
                    width: '50px',
                    height: '50px',
                }}>
                    <FaSignOutAlt />
                </Button>
            </Container>
        </Navbar>
    );
}

export default MyNavbar;
