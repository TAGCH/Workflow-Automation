import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import Workflow from "./pages/Workflow";


function App() {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/workflow" element={<Workflow />} />
        </Routes>
      </Router>
  );
}

export default App;