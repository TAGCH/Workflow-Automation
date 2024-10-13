import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerticalNavbar from '../components/VerticalNavbar';


const WorkflowPage = () => {
  return (
      <div>
          <Navbar/>
          <VerticalNavbar/>
          <div className="add-contents">
              <i className="bi bi-plus-circle-fill add-contents-clickable"></i>
          </div>
          <Footer/>
      </div>
  );
};

export default WorkflowPage;
