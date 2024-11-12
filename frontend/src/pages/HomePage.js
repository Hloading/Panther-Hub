// src/pages/HomePage.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './HomePage.css';

const HomePage = () => {
    const { currentUser } = useContext(AuthContext);

    return (
        <div className="home-page">
            <h1>Welcome to Panther Hub</h1>
            <p>Your gateway to campus events</p>

            {currentUser ? (
                <div className="welcome-message">
                    <p>Welcome, {currentUser.displayName || currentUser.email}!</p>
                    <Link to="/events" className="button">View Events</Link>
                </div>
            ) : (
                <div className="auth-options">
                    <Link to="/login" className="button">Login</Link>
                    <Link to="/register" className="button">Register</Link>
                </div>
            )}
        </div>
    );
};

export default HomePage;
