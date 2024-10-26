import React, {useContext} from 'react';
import gmailIcon from '../images/gmail.png';
import ggsheetIcon from '../images/googlesheet.png';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';

const CreateflowPopup = ({ closePopup }) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const handleOptionClick = (option) => {
        if (!user) {
            alert("Please log in to continue."); // Alert if user is not logged in
            return;
        }
        if (option === 'Send Email') {
            navigate(`/gmailworkflow/${user.id}`);
        } else if (option === 'Update') {
            navigate(`/spreadsheetflow/${user.id}`);
        }
    };

    return (
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
                    width: '450px',
                    textAlign: 'center',
                }}
            >
                <button
                    onClick={closePopup}
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
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                    >
                        <img src={gmailIcon} alt="Gmail Icon" style={{ width: '50px', height: '50px' }} />
                        <p className="pt-3">Send Email</p>
                    </div>
                    <div
                        className="option"
                        onClick={() => handleOptionClick('Update')}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                    >
                        <img src={ggsheetIcon} alt="Google Sheets Icon" style={{ width: '50px', height: '50px' }} />
                        <p className="pt-3">Update</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateflowPopup;
