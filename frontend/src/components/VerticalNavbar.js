import React, { useState } from 'react';

const VerticalNavbar = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="vertical-navbar d-flex flex-column align-items-center bg-light shadow-sm rounded"
            style={{
                height: isHovered ? '400px' : '80px',
                width: '70px',
                position: 'fixed',
                top: '120px',
                left: '20px',
                padding: '10px',
                zIndex: 1,
                overflow: 'hidden',
                transition: 'height 0.6s ease-in-out',
            }}
        >
            <i className="bi bi-caret-down-square" style={{fontSize: '2rem', margin: '10px 0'}}></i>
            <i className="bi bi-house-door-fill" style={{fontSize: '2rem', margin: '10px 0'}}></i>
            <i className="bi bi-plus-circle-fill" style={{fontSize: '2rem', margin: '10px 0'}}></i>
            <i className="bi bi-slash-circle-fill" style={{fontSize: '2rem', margin: '10px 0'}}></i>
            <i className="bi bi-chevron-double-right" style={{fontSize: '2rem', margin: '10px 0', marginTop: 'auto'}}></i>
        </div>
    );
};

export default VerticalNavbar;
