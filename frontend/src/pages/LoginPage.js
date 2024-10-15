import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { UserContext } from "../context/UserContext";
import api from "../services/api";  // Import the Axios instance

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);
  const navigate = useNavigate();

  const submitLogin = async () => {
    console.log("Submitting login form...");  // Debugging log
    const requestData = new URLSearchParams({
      grant_type: 'password',  // Set grant_type to "password"
      username: email,
      password: password,
      scope: '',
      client_id: '',
      client_secret: ''
    }).toString();
  
    try {
      const response = await api.post("/api/token", requestData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
  
      console.log("Response received: ", response);  // Debugging log
  
      // If the request was successful, set the token and navigate
      setToken(response.data.access_token);
      navigate('/home');
    } catch (error) {
      console.error("Error during login: ", error);  // Debugging log
      if (error.response && error.response.data) {
        const message = typeof error.response.data.detail === 'string'
          ? error.response.data.detail
          : JSON.stringify(error.response.data.detail);
        setErrorMessage(message);
      } else {
        setErrorMessage("An error occurred during login.");
      }
    }
  };  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");  // Debugging log
    submitLogin();
  };

  return (
    <div className="column">
      <form className="box" onSubmit={handleSubmit}>
        <h1 className="title has-text-centered">Login</h1>
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
        <ErrorMessage message={errorMessage} />
        <br />
        <button className="button is-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
