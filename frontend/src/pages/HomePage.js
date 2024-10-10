import React from 'react';

const HomePage = () => {
    return (
        <div className="home-container">
            <header className="hero">
                <h1>Welcome to My Website</h1>
                <p>Your one-stop solution for all things awesome!</p>
                <a href="/about" className="btn">Learn More</a>
            </header>
            <section className="features">
                <h2>Features</h2>
                <div className="feature-list">
                    <div className="feature-item">
                        <h3>Feature 1</h3>
                        <p>Description of feature 1.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Feature 2</h3>
                        <p>Description of feature 2.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Feature 3</h3>
                        <p>Description of feature 3.</p>
                    </div>
                </div>
            </section>
            <footer className="footer">
                <p>&copy; 2024 My Website</p>
            </footer>
        </div>
    );
};

export default HomePage;
