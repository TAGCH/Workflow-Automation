import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerticalNavbar from '../components/VerticalNavbar';


const WorkflowPage = () => {
  return (
      <div>
        <Navbar />
        <VerticalNavbar />
        <Footer />
      </div>
  );
};

export default WorkflowPage;
