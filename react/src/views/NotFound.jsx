
import React from 'react';
import '../css/NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="error-wrapper">
                <h1 className="error-code">404</h1>
                <p className="error-message">Oops! Page not found</p>
                <p className="error-description">
                    The page you are looking for might have been removed or is temporarily unavailable.
                </p>
                <a href="/" className="home-link">Back to Home</a>
            </div>
        </div>
    );
};

export default NotFound;
