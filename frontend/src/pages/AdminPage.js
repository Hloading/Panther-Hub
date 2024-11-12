// src/pages/AdminPage.js

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { auth } from '../firebase';
import './AdminPage.css';

const AdminPage = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Assuming 'isAdmin' is a custom claim or stored in user data

    const isAdmin = currentUser?.customClaims?.admin;

    if (!currentUser) {
        // Redirect to login if not authenticated
        navigate('/login');
        return null;
    }

    if (!isAdmin) {
        // Redirect or display not authorized message
        return (
            <div className="admin-page">
                <h1>Access Denied</h1>
                <p>You do not have permission to access this page.</p>
                <Link to="/">Return to Home</Link>
            </div>
        );
    }

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>
            <p>Manage events and user interactions here.</p>
            <div className="admin-actions">
                <Link to="/admin/create-event" className="button">
                    Create Event
                </Link>
                <Link to="/admin/manage-events" className="button">
                    Manage Events
                </Link>
                <Link to="/admin/users" className="button">
                    Manage Users
                </Link>
            </div>
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
            <Link to="/events" className="back-link">
                Back to Events
            </Link>
        </div>
    );
};

export default AdminPage;
