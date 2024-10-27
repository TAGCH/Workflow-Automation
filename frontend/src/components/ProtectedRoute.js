import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading, error } = useContext(UserContext);

    if (loading) {
        return <div data-testid="auth-loading">Loading...</div>;
    }

    if (error) {
        return <div data-testid="auth-error">Authentication Error: {error}</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
