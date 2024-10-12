import React, { useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrehomePage from "./pages/PrehomePage";
import HomePage from "./pages/HomePage";
import WorkflowPage from "./pages/WorkflowPage";
import MyflowPage from "./pages/MyflowPage";


function App() {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<PrehomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/createflow" element={<WorkflowPage />} />
            <Route path="/myflows" element={<MyflowPage />} />
        </Routes>
      </Router>
  );
}

export default App;