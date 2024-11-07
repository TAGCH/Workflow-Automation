import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Navigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";

// Mock the Navigate component from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Navigate: jest.fn(() => null)
}));

const renderWithUserContext = (ui, user = null, loading = false, error = null) => {
    return render(
        <UserContext.Provider value={{ user, loading, error }}>
            <MemoryRouter>{ui}</MemoryRouter>
        </UserContext.Provider>
    );
};

describe('ProtectedRoute', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('redirects to prehome page if user is not authenticated', () => {
        renderWithUserContext(
            <ProtectedRoute>
                <HomePage />
            </ProtectedRoute>
        );

        expect(Navigate).toHaveBeenCalledWith({ to: '/', replace: true }, {});
        expect(screen.queryByText(/Home Page Content/i)).not.toBeInTheDocument();
    });

    it('redirects to /home/:id if user is authenticated', () => {
        const user = { id: '1', name: 'Test User' };

        renderWithUserContext(
            <ProtectedRoute>
                <HomePage />
            </ProtectedRoute>,
            user,
            false, // loading = false
            null   // no error
        );

        // Check that Navigate was called to redirect to /home/1
        expect(Navigate).toHaveBeenCalledWith({ to: '/home/1', replace: true }, {});
        expect(screen.queryByText(/Home Page Content/i)).not.toBeInTheDocument();
    });

    it('shows loading state while checking authentication', () => {
        renderWithUserContext(
            <ProtectedRoute>
                <HomePage />
            </ProtectedRoute>,
            null,
            true // loading = true
        );

        expect(screen.getByTestId('auth-loading')).toBeInTheDocument();
        expect(screen.queryByText(/Home Page Content/i)).not.toBeInTheDocument();
    });

    it('handles error state in authentication check', async () => {
        renderWithUserContext(
            <ProtectedRoute>
                <HomePage />
            </ProtectedRoute>,
            null,
            false, // loading = false
            'Auth Error' // error message
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-error')).toBeInTheDocument();
            expect(screen.getByText(/Authentication Error/i)).toBeInTheDocument();
        });
    });
});
