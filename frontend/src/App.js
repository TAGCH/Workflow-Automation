import React, {useContext} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "../src/components/Navbar"
import Footer from "../src/components/Footer";
import PrehomePage from "./pages/PrehomePage";
import HomePage from "./pages/HomePage";
import GmailWorkflowPage from "./pages/GmailWorkflowPage";
import MyflowPage from "./pages/MyflowPage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import {UserContext} from "./context/UserContext";


function App() {
    const {user} = useContext(UserContext);
  return (
      <Router>
        <Navbar />
        <Routes>
            <Route
                path="/"
                element={user ? <Navigate to={`/home/${user.id}`} replace /> : <PrehomePage />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/home/:id"
                element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/myflows/:user_id"
                element={
                    <ProtectedRoute>
                        <MyflowPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/gmailworkflow/:user_id/:id"
                element={
                    <ProtectedRoute>
                        <GmailWorkflowPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
        <Footer />
      </Router>
  );
}

export default App;