import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import Workflow from "./pages/WorkflowPage";
import MyflowPage from "./pages/MyflowPage";


function App() {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/createflow" element={<Workflow />} />
            <Route path="/myflow" element={<MyflowPage />} />
        </Routes>
      </Router>
  );
}

export default App;