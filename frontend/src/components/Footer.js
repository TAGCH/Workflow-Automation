import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGithub } from 'react-icons/fa';

function MyFooter() {
    return (
        <div className="pt-5">
            <footer className="bg-light fixed-bottom text-dark py-3 shadow-sm" style={{zIndex: "unset"}}>
                <Container>
                    <Row className="align-items-center">
                        <Col xs={6}>
                            <p className="mb-0" style={{ fontSize: '16px' }}>
                                Copyright &copy; 2024 Workflow Automate
                            </p>
                        </Col>
                        <Col xs={6} className="text-end">
                            <a
                                href="https://github.com/TAGCH/Workflow-Automation"
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
        </div>
    );
}

export default MyFooter;
