import React, { useState } from 'react';
import gmailIcon from '../images/gmail.png';
import ggsheetIcon from '../images/googlesheet.png';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerticalNavbar from '../components/VerticalNavbar';


const WorkflowPage = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleIconClick = () => {
    setShowOptions(true);
  };

  const handleOptionClick = (option) => {
    setShowOptions(false);
    if (option === 'Send Email') {
      setShowEmailForm(true);
    }
  };

  const handleExitClick = () => {
    setShowOptions(false);
  };

  return (
      <div style={{ position: 'relative' }}>
        <Navbar />
        <VerticalNavbar />
        {showEmailForm && (
            <div
                className="email-form-container"
                style={{
                  marginTop: '20px',
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  width: '450px',
                  margin: '20px auto',
                }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img src={gmailIcon} alt="Gmail Icon" style={{ width: '30px', marginRight: '10px' }} />
                <h3>Send an email</h3>
              </div>

              <div className="form-field">
                <label style={{ color: 'red', marginRight: '5px' }}>*</label>
                <label>To</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <i className="bi bi-envelope" style={{ marginRight: '8px' }}></i>
                  <input
                      type="text"
                      placeholder="Email"
                      style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        flex: '1',
                      }}
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginTop: '10px' }}>
                <label style={{ color: 'red', marginRight: '5px' }}>*</label>
                <label>Title</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                      type="text"
                      placeholder="Welcome"
                      style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        flex: '1',
                      }}
                  />
                  <i className="bi bi-person" style={{ marginLeft: '8px' }}></i>
                  <input
                      type="text"
                      placeholder="Last Name"
                      style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        flex: '1',
                        marginLeft: '8px',
                      }}
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginTop: '10px' }}>
                <label style={{ color: 'red', marginRight: '5px' }}>*</label>
                <label>Body</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <i className="bi bi-person" style={{ marginRight: '8px' }}></i>
                  <textarea
                      placeholder="Dear, First Name"
                      rows="3"
                      style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        width: '100%',
                      }}
                  ></textarea>
                </div>
              </div>
            </div>
        )}

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