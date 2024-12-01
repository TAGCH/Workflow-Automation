import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CreateflowPopup from './CreateflowPopup';
import GuidelinePopup from './GuidelinePopup';
import { UserContext } from "../context/UserContext";

const VerticalNavbar = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isGuidelinePopupOpen, setIsGuidelinePopupOpen] = useState(false);
    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);
    const toggleGuidelinePopup = () => setIsGuidelinePopupOpen(!isGuidelinePopupOpen);
    const previousPage = useNavigate();
    const { user } = useContext(UserContext);

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
            <i className={isHovered ? 'bi bi-caret-up-square' : 'bi bi-caret-down-square'} style={{ fontSize: '2rem', margin: '10px 0' }}></i>
            <Link to={`/home/${user.id}`} style={{ textDecoration: 'none', color: 'inherit', margin: '10px 0' }}>
                <i className="bi bi-house-door-fill" style={{ fontSize: '2rem', margin: '10px 0' }}
                   onMouseEnter={(e) => (e.currentTarget.style.color = '#20c997')}
                   onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')} />
            </Link>
            <Link to={"#"} onClick={openPopup} style={{ textDecoration: 'none', color: 'inherit', margin: '10px 0' }}>
                <i className="bi bi-file-earmark-plus-fill" style={{ fontSize: '2rem', margin: '10px 0' }}
                   onMouseEnter={(e) => (e.currentTarget.style.color = '#20c997')}
                   onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')} />
            </Link>
            <Link to={`/myflows/${user.id}`} style={{ textDecoration: 'none', color: 'inherit', margin: '10px 0' }}>
                <i className="bi bi-collection-fill" style={{ fontSize: '2rem', margin: '10px 0' }}
                   onMouseEnter={(e) => (e.currentTarget.style.color = '#20c997')}
                   onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')} />
            </Link>
            <i className="bi bi-question-circle-fill" style={{ fontSize: '2rem', margin: '10px 0', cursor: 'pointer' }}
               onClick={toggleGuidelinePopup}
               onMouseEnter={(e) => (e.currentTarget.style.color = '#20c997')}
               onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')} />
            <i className="bi bi-chevron-double-left" style={{ fontSize: '2rem', margin: '10px 0', marginTop: 'auto' }} onClick={() => previousPage(-1)}
               onMouseEnter={(e) => (e.currentTarget.style.color = '#20c997')}
               onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')} />
            {isPopupOpen && <CreateflowPopup closePopup={closePopup} />}
            {isGuidelinePopupOpen && <GuidelinePopup closePopup={toggleGuidelinePopup} />}
        </div>
    );
};

export default VerticalNavbar;
