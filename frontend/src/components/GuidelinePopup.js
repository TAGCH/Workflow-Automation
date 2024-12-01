import React, { useState } from 'react';
import '../styles/components/GuidelinePopup.css'; // Assuming you have styles for the popup here

const GuidelinePopup = ({ closePopup }) => {
    const [activeTopic, setActiveTopic] = useState('passwords'); // Default to 'passwords'

    const renderContent = () => {
        switch (activeTopic) {
            case 'passwords':
                return (
                    <div>
                        <h5>How to create and use app passwords</h5>
                        <p>
                            App passwords are special passwords used for accessing your account from non-browser
                            apps. To create one:
                        </p>
                        <ol>
                            <li>Go to your account security settings.</li>
                            <li>Select "App Passwords" and follow the instructions.</li>
                            <li>Use the generated password in place of your usual password for the app.</li>
                        </ol>
                    </div>
                );
            case 'magic-tags':
                return (
                    <div>
                        <h5>How to use magic tags</h5>
                        <p>
                            Magic tags are placeholders in workflows. They dynamically replace values based on
                            workflow data. For example:
                        </p>
                        <ul>
                            <li><strong>{`{{name}}`}</strong>: Replaces with the recipient's name.</li>
                            <li><strong>{`{{email}}`}</strong>: Replaces with the recipient's email address.</li>
                        </ul>
                        <p>Insert these tags in your email templates or workflows for dynamic personalization.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="guideline-popup">
            <div className="guideline-popup-content">
                <i
                    className="bi bi-x-circle-fill close-icon"
                    onClick={closePopup}
                    style={{ fontSize: '1.5rem', cursor: 'pointer', float: 'right' }}
                ></i>
                <div className="guideline-header">
                    <button
                        className={`btn btn-link ${activeTopic === 'passwords' ? 'active' : ''}`}
                        onClick={() => setActiveTopic('passwords')}
                    >
                        How to create and use app passwords
                    </button>
                    <button
                        className={`btn btn-link ${activeTopic === 'magic-tags' ? 'active' : ''}`}
                        onClick={() => setActiveTopic('magic-tags')}
                    >
                        How to use magic tag
                    </button>
                </div>
                <div className="guideline-content">{renderContent()}</div>
            </div>
        </div>
    );
};

export default GuidelinePopup;
