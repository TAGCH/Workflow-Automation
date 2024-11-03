import React, {useContext} from 'react';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimatedBars from "../components/AnimatedBars";
import { UserContext } from '../context/UserContext';

const PrehomePage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <Navbar/>
            <div className="bg-white py-xl-5">
                <div>
                    <h1 className={`font-size72 font-weight-bold text-center gradient-text ${isVisible ? 'fade-up-left-to-right' : 'opacity-0'}`}>
                        A platform to optimize your workflow management
                    </h1>
                </div>
                <div className="pt-xl-5">
                    <AnimatedBars/>
                </div>
            </div>
            <div className="d-flex justify-content-center align-items-center py-xl-5">
                <Link to={user ? `/home/${user.id}` : "/login"}>
                    <div className="get-started font-size25">
                        {user ? "Home" : "Get Started"}
                    </div>
                </Link>
            </div>
            <div className="bg-white py-xl-5 d-flex justify-content-center">
                <div className="text-overlay d-flex align-items-center justify-content-between"
                     style={{maxWidth: '900px', zIndex: "unset"}}>
                    <div className="px-30">
                        <h1 className="font-size52 font-weight-bold gradient-text2 mb-2">
                            Get started in seconds
                        </h1>
                        <p className="font-size25 mb-0">
                            Easy to create workflow and utilize as your desired.
                        </p>
                    </div>
                    <div className="ml-4">
                        <i className="bi bi-lightning-charge font-size200 px-30"></i>
                    </div>
                </div>
            </div>
            <div className="bg-white py-xl-5 d-flex justify-content-center">
                <div className="text-overlay d-flex align-items-center justify-content-between"
                     style={{maxWidth: '900px', zIndex: "unset"}}>
                    <div className="ml-4">
                        <i className="bi bi-check-circle font-size200 px-30"></i>
                    </div>
                    <div className="px-30">
                        <h1 className="font-size52 font-weight-bold gradient-text2 mb-2">
                            Streamline and automate workflows
                        </h1>
                        <p className="font-size25 mb-0">
                            Automate repetitive and timely tasks.
                        </p>
                    </div>
                </div>
            </div>
            <br></br>
            <Footer/>
        </div>
    );
};

export default PrehomePage;
