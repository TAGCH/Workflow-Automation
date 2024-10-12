import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VerticalNavbar = () => {
    const [isHovered, setIsHovered] = useState(false);
    const previousPage = useNavigate();

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
            <i className={isHovered ? 'bi bi-caret-up-square' : 'bi bi-caret-down-square'} style={{fontSize: '2rem', margin: '10px 0'}}></i>
            <Link to={"/home"} style={{ textDecoration: 'none', color: 'inherit', margin: '10px 0'}}>
                <i className="bi bi-house-door-fill" style={{fontSize: '2rem', margin: '10px 0'}}
                   onMouseEnter={(e) => (e.currentTarget.style.color = '#20c997')}
                   onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                </i>
            </Link>
            <Link to={"/createflow"} style={{ textDecoration: 'none', color: 'inherit', margin: '10px 0'}}>
                <i className="bi bi-file-earmark-plus-fill" style={{fontSize: '2rem', margin: '10px 0'}}
                   onMouseEnter={(e) => (e.currentTarget.style.color = '#20c997')}
                   onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                </i>
            </Link>
            <Link to={"/myflow"} style={{ textDecoration: 'none', color: 'inherit', margin: '10px 0'}}>
                <i className="bi bi-collection-fill" style={{fontSize: '2rem', margin: '10px 0'}}
                   onMouseEnter={(e) => (e.currentTarget.style.color = '#20c997')}
                   onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                </i>
            </Link>
            <i className="bi bi-chevron-double-left" style={{fontSize: '2rem', margin: '10px 0', marginTop: 'auto'}} onClick={() => previousPage(-1)}
               onMouseEnter={(e) => (e.currentTarget.style.color = '#20c997')}
               onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
            </i>
        </div>
    );
};

export default VerticalNavbar;
