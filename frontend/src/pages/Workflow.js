import React, { useState } from 'react';

const WorkflowPage = () => {
  const [workflowName, setWorkflowName] = useState('');
  const [firstName, setFirstName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for what happens when the workflow is created
    console.log(`Workflow Created: ${workflowName}`);
    console.log(`First Name: ${firstName}`);
  };

  return (
    <div className="workflow-container" style={styles.container}>
      {/* Header: When the file is created */}
      <div className="header" style={styles.header}>
        {/* <img src="path_to_icon" alt="Google Sheet" style={styles.icon} /> */}
        <p>When the file is created</p>
      </div>

      {/* Workflow Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>New Workflow</h2>
        
        {/* Workflow Name Input */}
        <label style={styles.label}>
          WorkFlow Name:
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="Enter workflow name"
            style={styles.input}
          />
        </label>
        <button type="submit" style={styles.button}>Create</button>

        {/* Body */}
        <label style={styles.label}>
          Body:
          <div style={styles.bodyContainer}>
            <p style={styles.bodyText}>Dear,</p>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              style={styles.inputFirstName}
            />
          </div>
        </label>
      </form>

      {/* Show advanced options */}
      <div style={styles.advancedOptions}>
        <p>Show advanced options</p>
        <span>▼</span>
      </div>
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '400px',
    margin: '0 auto',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  icon: {
    width: '24px',
    height: '24px',
    marginRight: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    width: '100%',
    marginTop: '5px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '14px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  bodyContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  bodyText: {
    marginRight: '10px',
  },
  inputFirstName: {
    padding: '10px',
    fontSize: '14px',
    width: '100px',
    marginLeft: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  advancedOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    color: '#666',
    cursor: 'pointer',
  },
};

export default WorkflowPage;
