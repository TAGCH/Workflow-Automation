import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrehomePage from "./pages/PrehomePage";
import HomePage from "./pages/HomePage";
import Workflow from "./pages/WorkflowPage";
import MyflowPage from "./pages/MyflowPage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WorkflowPage from './pages/WorkflowPage';


function App() {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<PrehomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/createflow" element={<Workflow />} />
            <Route path="/myflows" element={<MyflowPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/workflow/" element={<WorkflowPage />} />
        </Routes>
      </Router>
  );
}

export default App;