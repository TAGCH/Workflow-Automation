import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";  
import { UserContext } from "../context/UserContext";
import ErrorMessage from "../components/ErrorMessage";
import api from "../services/api";
import '../styles/pages/Register.css';  // New CSS for Register page

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setToken } = useContext(UserContext); 
  const navigate = useNavigate();  

  const submitRegistration = async () => {
    const requestBody = {
      email: email,
      hashed_password: password,
    };
    
    try {
      const response = await api.post("/api/users", requestBody);
      console.log("Response:", response);
      
      setToken(response.data.access_token);
      navigate(`/home/${setToken.id}`); 
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response) {
        const errorDetail = error.response.data.detail;
        setErrorMessage(typeof errorDetail === 'string' ? errorDetail : "An error occurred during registration.");
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
      setErrorMessage("Ensure that the passwords match and are greater than 5 characters.");
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center">
      <div className="register-box p-5 shadow-lg rounded bg-light">
        <h1 className="title text-center mb-4">Register</h1>
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
          <div className="form-group mb-3">
            <label htmlFor="confirmationPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmationPassword"
              placeholder="Enter password again"
              value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <ErrorMessage message={errorMessage} />
          <div className="d-grid gap-2 mt-4">
            <button className="btn btn-primary" type="submit">
              Register
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <span>Already have an account? </span>
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
