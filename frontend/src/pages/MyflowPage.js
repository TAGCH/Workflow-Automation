import React from 'react';
import ggsheet from "../images/googlesheet.png";
import gmail from "../images/gmail.png";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VerticalNavbar from "../components/VerticalNavbar";

const MyflowPage = () => {
    return (
        <div>
            <Navbar />
            <div className="d-flex">
                <VerticalNavbar />
                <div className="container py-4">
                    <h2 className="text-center py-5">My Workflows</h2>
                    <div className="row pl-40">
                        <div className="col-md-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5>Workflow 1</h5>
                                            <p>Status: Active</p>
                                        </div>
                                        <div className="d-flex">
                                            <img src={ggsheet} alt="ggsheet" className="img-fit" />
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-primary mt-2"
                                    >
                                        View Workflow
                                    </button>
                                </div>
                            </div>
                        </div>
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
                                    <button
                                        className="btn btn-primary mt-2"
                                    >
                                        View Workflow
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5>Workflow 3</h5>
                                            <p>Status: Inactive</p>
                                        </div>
                                        <div className="d-flex">
                                            <img src={ggsheet} alt="ggsheet" className="img-fit"/>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-primary mt-2"
                                    >
                                        View Workflow
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MyflowPage;
