// src/pages/HomePage.js

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './HomePage.css';

const HomePage = () => {
    const { currentUser } = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (currentUser) {
                try {
                    // Refresh the ID token to get the latest custom claims
                    await currentUser.getIdToken(true);
                    const tokenResult = await currentUser.getIdTokenResult();
                    setIsAdmin(!!tokenResult.claims.admin);
                } catch (error) {
                    console.error('Error fetching ID token:', error);
                }
            } else {
                setIsAdmin(false);
            }
        };

        checkAdminStatus();
    }, [currentUser]);

    return (
        <div className="home-page">
            <h1>Welcome to Panther Hub</h1>
            <p>Your gateway to campus events</p>

            {currentUser ? (
                <div className="welcome-message">
                    <p>Welcome, {currentUser.displayName || currentUser.email}!</p>
                    <div className="user-actions">
                        <Link to="/events" className="button">
                            View Events
                        </Link>
                        {isAdmin && (
                            <Link to="/admin" className="button">
                                Admin Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            ) : (
                <div className="guest-options">
                    <Link to="/events" className="button">
                        View Events
                    </Link>
                    <div className="auth-options">
                        <Link to="/login" className="button">
                            Login
                        </Link>
                        <Link to="/register" className="button">
                            Register
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
