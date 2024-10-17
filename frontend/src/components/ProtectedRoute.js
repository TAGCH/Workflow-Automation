import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(UserContext);

    if (!user) {
        // If user is not authenticated, redirect to login
        return <Navigate to="/login" replace />;
    }

    return children; // If user is authenticated, render children
};

export default ProtectedRoute;
