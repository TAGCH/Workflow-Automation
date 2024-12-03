import React, { useState } from 'react';
import '../styles/components/GuidelinePopup.css'; // Assuming you have styles for the popup here

const GuidelinePopup = ({ closePopup }) => {
    const [activeTopic, setActiveTopic] = useState('passwords'); // Default to 'passwords'

    const renderContent = () => {
        switch (activeTopic) {
            case 'passwords':
                return (
                    <div>
                        <br></br>
                        <h3>App passwords</h3>
                        <br></br>
                        <p>
                            App passwords are unique, 16-character passwords that allow less secure apps or devices to access your Google account without using your main account password. They are particularly useful for apps or devices that do not support two-step verification.
                        </p>
                        <p>
                            <h6>To create and use an app password for Gmail, follow these steps:</h6>
                        </p>
                        <ol>
                            <li>
                                Go to your <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer">
                                Google Account Security</a> page.
                            </li>
                            <li>Ensure that 2-Step Verification is enabled on your account. If it is not, follow the instructions to enable it.</li>
                            <li>Scroll down to the "Signing in to Google" section and select <strong>App Passwords</strong>.</li>
                            <li>
                                Sign in again if prompted. You will see the "App Passwords" page, where you can generate a new app password.
                            </li>
                            <li>
                                Under the "Select app" dropdown, choose the app you want to generate the password for. For email clients, select "Mail."
                            </li>
                            <li>
                                Under the "Select device" dropdown, choose the device you are setting up, or select "Other (Custom Name)" and type a descriptive name.
                            </li>
                            <li>Click <strong>Generate</strong>. A 16-character password will appear.</li>
                            <li>
                                Copy the app password and use it in place of your regular password in the app or device you are setting up.
                            </li>
                        </ol>
                        <p>
                            Once set up, your app or device will connect to Gmail using the app password, and you won't need to re-enter it unless you remove the app or reset your account settings.
                        </p>
                        <p>
                            For more detailed instructions, visit the official Google Support page: <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer">Google App Passwords</a>.
                        </p>
                    </div>
                );
            case 'magic-tags':
                return (
                    <div>
                        <br></br>
                        <h3>Magic Tags</h3>
                        <br></br>
                        <p>
                            Magic tags are dynamic placeholders used within your workflows that get replaced with data from your uploaded Excel file. These tags allow you to personalize content such as emails by automatically filling in values like names or email addresses based on the data in your workflow.
                        </p>
                        <br></br>
                        <h5>How to Use Magic Tags:</h5>
                        <ol>
                            <li>
                                Press the <strong>space bar</strong>, then type the <strong>/</strong> character.
                            </li>
                            <li>
                                A list of magic tags, based on the column headers from your Excel file, will appear.
                            </li>
                            <li>
                                Select the tag you want, and it will be inserted into your text.
                            </li>
                        </ol>
                        <br></br>
                        <h5>
                            For example, if your Excel file contains the following data:
                        </h5>
                        <br></br>
                        <p><strong>Excel Data Example:</strong></p>
                        <table>
                            <thead>
                                <tr>
                                    <th>email</th>
                                    <th>fname</th>
                                    <th>lname</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>example1@example.com</td>
                                    <td>user1</td>
                                    <td>ex1</td>
                                </tr>
                                <tr>
                                    <td>example2@example.com</td>
                                    <td>user2</td>
                                    <td>ex2</td>
                                </tr>
                                <tr>
                                    <td>example3@example.com</td>
                                    <td>user3</td>
                                    <td>ex3</td>
                                </tr>
                            </tbody>
                        </table>
                        <br></br>
                        <p>
                            The column headers (e.g., <strong>email</strong>, <strong>fname</strong>, <strong>lname</strong>) will become available as magic tags that can be used throughout your workflow. These tags will automatically be replaced with the corresponding values from your Excel data when the workflow is executed.
                        </p>
                        <br></br>
                        <p><strong>Example Usage:</strong></p>
                        <ul>
                            <li><strong>Recipient_email:</strong> /email</li>
                            <li><strong>Title:</strong> Company Monthly Notification</li>
                            <li><strong>Body:</strong> Hi, /fname</li>
                        </ul>
                        <p>
                            When the workflow runs, these magic tags will be replaced with the actual data from your Excel file. For instance:
                        </p>
                        <br></br>
                        <p><strong>Resulting Emails:</strong></p>
                        <ul>
                            <li>1st email: Recipient_email: example1@example.com, Title: Company Monthly Notification, Body: Hi, user1</li>
                            <li>2nd email: Recipient_email: example2@example.com, Title: Company Monthly Notification, Body: Hi, user2</li>
                            <li>3rd email: Recipient_email: example3@example.com, Title: Company Monthly Notification, Body: Hi, user3</li>
                        </ul>
                        <br></br>
                        <p>
                            This allows you to automatically generate personalized messages for each recipient in your workflow, saving time and improving efficiency.
                        </p>
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
                        App passwords
                    </button>
                    <button
                        className={`btn btn-link ${activeTopic === 'magic-tags' ? 'active' : ''}`}
                        onClick={() => setActiveTopic('magic-tags')}
                    >
                        Magic tag
                    </button>
                </div>
                <div className="guideline-content">{renderContent()}</div>
            </div>
        </div>
    );
};

export default GuidelinePopup;