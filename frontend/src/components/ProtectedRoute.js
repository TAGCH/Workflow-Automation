import React, { useContext } from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading, error } = useContext(UserContext);
    const location = useLocation();

    if (loading) {
        return <div data-testid="auth-loading">Loading...</div>;
    }

    if (error) {
        return <div data-testid="auth-error">Authentication Error: {error}</div>;
    }

    if (user && location.pathname === "/") {
        return <Navigate to={`/home/${user.id}`} replace />;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
