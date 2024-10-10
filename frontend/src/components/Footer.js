import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGithub } from 'react-icons/fa';

function MyFooter() {
    return (
        <footer className="fixed-bottom bg-light text-dark py-3 shadow-sm">
            <Container>
                <Row className="align-items-center">
                    <Col xs={6}>
                        <p className="mb-0" style={{ fontSize: '16px' }}>
                            Copyright &copy; 2024 Workflow Automate
                        </p>
                    </Col>
                    <Col xs={6} className="text-end">
                        <a
                            href="https://github.com/TAGCH/Workflow-Automationa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-dark"
                            style={{ textDecoration: 'none', fontSize: '16px' }}
                        >
                            <FaGithub size={28} className="me-2" />
                            GitHub
                        </a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default MyFooter;
