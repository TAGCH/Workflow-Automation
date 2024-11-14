import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa'; // Import the arrow icon from react-icons
import ErrorMessage from "../components/ErrorMessage";
import { UserContext } from "../context/UserContext";
import api from "../services/api";
import '../styles/pages/Login.css';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setToken } = useContext(UserContext); 
  const navigate = useNavigate();

  const submitLogin = async () => {
    const requestData = new URLSearchParams({
      grant_type: 'password',  
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

      setToken(response.data.access_token);
      navigate(`/home/${setToken.id}`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        const errorDetail = error.response.data.detail;
        if (typeof errorDetail === 'string') {
          setErrorMessage("Invalid credentials. Please check your email and password.");
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  const handleBack = () => {
    navigate(`/home/${setToken.id}`); // Navigates to the previous page
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-box p-5 shadow-lg rounded bg-light position-relative">
        {/* Back arrow icon */}
        <FaArrowLeft 
          onClick={handleBack} 
          style={{ 
            position: 'absolute', 
            top: '20px', 
            left: '20px', 
            fontSize: '16px', // Smaller size
            color: '#B0B0B0', // Light gray color
            cursor: 'pointer' 
          }} 
        />

        <h1 className="title text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <ErrorMessage message={errorMessage} />
          <div className="d-grid gap-2 mt-4">
            <button className="btn btn-primary" type="submit">
              Login
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
