import React, { useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useDropzone} from 'react-dropzone'
import HomePage from "./pages/HomePage";
import Workflow from "./pages/Workflow";


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/workflow" element={<Workflow />} />
          
        </Routes>
      </Router>
  );
}

export default App;