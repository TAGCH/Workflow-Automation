import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-center mt-5">Welcome to the Home Page!</h1>
                        <p className="text-center">This is a simple page styled with Bootstrap.</p>
                        <button className="btn btn-primary">Click Me!</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
