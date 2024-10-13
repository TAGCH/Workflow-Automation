import React, { useState } from 'react';
import gmailIcon from '../images/gmail.png';
import ggsheetIcon from '../images/googlesheet.png';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerticalNavbar from '../components/VerticalNavbar';


const WorkflowPage = () => {
    const [showOptions, setShowOptions] = useState(false);

    const handleIconClick = () => {
        setShowOptions(true);
    };

    const handleOptionClick = () => {
        setShowOptions(false);
    };

    const handleExitClick = () => {
        setShowOptions(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            <Navbar />
            <VerticalNavbar />
            <div className="add-contents">
                <i
                    className="bi bi-plus-circle-fill add-contents-clickable"
                    onClick={handleIconClick}
                    style={{
                        fontSize: '50px',
                        cursor: 'pointer',
                        display: 'flex',
                        background: 'white',
                        justifyContent: 'center',
                        margin: '20px auto',
                    }}
                ></i>
            </div>
            {showOptions && (
                <div
                    className="popup-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        className="popup-content"
                        style={{
                            position: 'relative',
                            backgroundColor: 'white',
                            padding: '30px',
                            borderRadius: '10px',
                            boxShadow: '0px 0px 15px rgba(0,0,0,0.2)',
                            width: '400px',
                            textAlign: 'center',
                        }}
                    >
                        <button
                            onClick={handleExitClick}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                padding: '5px 10px',
                                backgroundColor: 'black',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                fontSize: '18px',
                                cursor: 'pointer',
                                lineHeight: '1',
                                width: '35px',
                                height: '35px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc3545')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'black')}
                        >
                            &times;
                        </button>
                        <h2>Select an Action</h2>
                        <div className="options-container" style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                            <div
                                className="option"
                                onClick={() => handleOptionClick('Send Email')}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <img src={gmailIcon} alt="Gmail Icon" style={{ width: '50px', height: '50px' }} />
                                <p className="pt-3">Send Email</p>
                            </div>
                            <div
                                className="option"
                                onClick={() => handleOptionClick('Update')}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <img src={ggsheetIcon} alt="Google Sheets Icon" style={{ width: '50px', height: '50px' }} />
                                <p className="pt-3">Update</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default WorkflowPage;
