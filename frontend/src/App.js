import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
  );
}

export default App;