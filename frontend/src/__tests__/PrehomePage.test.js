import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from "../context/UserContext";
import PrehomePage from '../pages/PrehomePage';

// Mock the components that are not directly tested
jest.mock('../components/Navbar', () => () => <div data-testid="mock-navbar">Navbar</div>);
jest.mock('../components/Footer', () => () => <div data-testid="mock-footer">Footer</div>);
jest.mock('../components/AnimatedBars', () => () => <div data-testid="mock-animated-bars">AnimatedBars</div>);

const renderWithRouter = (ui, { user = null } = {}) => {
    return render(
        <BrowserRouter>
            <UserContext.Provider value={{ user }}>
                {ui}
            </UserContext.Provider>
        </BrowserRouter>
    );
};

describe('PrehomePage', () => {
    beforeEach(() => {
        jest.useFakeTimers(); // Use fake timers for time-dependent tests
    });

    afterEach(() => {
        jest.useRealTimers(); // Restore real timers after tests
        jest.clearAllMocks(); // Clear any mock calls or instances
    });

    it('renders main components and heading', () => {
        renderWithRouter(<PrehomePage />);

        expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
        expect(screen.getByTestId('mock-animated-bars')).toBeInTheDocument();
        expect(screen.getByText('A platform to optimize your workflow management')).toBeInTheDocument();
    });

    it('shows "Get Started" button when user is not logged in', () => {
        renderWithRouter(<PrehomePage />);

        const button = screen.getByText('Get Started');
        expect(button).toBeInTheDocument();
        expect(button.closest('a')).toHaveAttribute('href', '/login');
    });

    it('shows "Home" button when user is logged in', () => {
        const user = { id: '1', name: 'Test User' }
        renderWithRouter(<PrehomePage />, { user });

        const button = screen.getByText('Home');
        expect(button).toBeInTheDocument();
        expect(button.closest('a')).toHaveAttribute('href', `/home/${user.id}`);
    });

    it('applies fade animation class after timeout', async () => {
        renderWithRouter(<PrehomePage />);

        const heading = screen.getByText('A platform to optimize your workflow management');
        expect(heading).toHaveClass('opacity-0'); // Initially should have this class

        // Wrap the timer advancement in act to handle state updates
        await act(async () => {
            jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
            expect(heading).toHaveClass('fade-up-left-to-right'); // Should have this class after timeout
        });
    });

    it('renders feature sections with correct content', () => {
        renderWithRouter(<PrehomePage />);

        expect(screen.getByText('Get started in seconds')).toBeInTheDocument();
        expect(screen.getByText('Easy to create workflow and utilize as your desired.')).toBeInTheDocument();
        expect(screen.getByText('Streamline and automate workflows')).toBeInTheDocument();
        expect(screen.getByText('Automate repetitive and timely tasks.')).toBeInTheDocument();
    });
});
