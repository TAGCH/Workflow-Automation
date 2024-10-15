import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate from react-router-dom
import { UserContext } from "../context/UserContext";
import ErrorMessage from "../components/ErrorMessage";
import api from "../services/api";  // Import the Axios instance

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);
  const navigate = useNavigate();  // Create a navigate function

  const submitRegistration = async () => {
    // Prepare the request body
    const requestBody = {
      email: email,
      hashed_password: password, // Ensure this matches your API requirements
    };
    
    try {
      // Use Axios to make the POST request
      const response = await api.post("/api/users", requestBody);
      console.log("Response:", response);
      
      // Assuming the token is returned in response.data.access_token
      setToken(response.data.access_token);
      navigate("/"); // Navigate to the home page
    } catch (error) {
      console.error("Error during registration:", error);
      // Check if error response exists and extract message
      if (error.response) {
        setErrorMessage(error.response.data.detail || "An error occurred during registration.");
      } else {
        setErrorMessage("An error occurred during registration.");
      }
    }
  };
    
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register button clicked");
    if (password === confirmationPassword && password.length > 5) {
      submitRegistration();
    } else {
      setErrorMessage(
        "Ensure that the passwords match and are greater than 5 characters"
      );
    }
  };

  return (
    <div className="column">
      <form className="box" onSubmit={handleSubmit}>
        <h1 className="title has-text-centered">Register</h1>
        <div className="field">
          <label className="label">Email Address</label>
          <div className="control">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Confirm Password</label>
          <div className="control">
            <input
              type="password"
              placeholder="Enter password"
              value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <ErrorMessage message={errorMessage} />
        <br />
        <button className="button is-primary" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
