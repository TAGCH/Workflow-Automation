import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrehomePage from "./pages/PrehomePage";
import HomePage from "./pages/HomePage";
import GmailWorkflowPage from "./pages/GmailWorkflowPage";
import SpreadSheetWorkflowPage from "./pages/SpreadSheetWorkflowPage";
import MyflowPage from "./pages/MyflowPage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<PrehomePage />} />
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
                path="/myflows"
                element={
                    <ProtectedRoute>
                        <MyflowPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/gmailworkflow/:id"
                element={
                    <ProtectedRoute>
                        <GmailWorkflowPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/spreadsheetflow/:id"
                element={
                    <ProtectedRoute>
                        <SpreadSheetWorkflowPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
      </Router>
  );
}

export default App;