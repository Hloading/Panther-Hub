import React from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import LoginComponent from '../components/LoginComponent';

const HomePage = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    const handleLogout = async () => {
        await signOut(auth);
        window.location.reload();
    };

    return (
        <div className="home-page">
            <h1>Welcome to Panther Hub</h1>
            <p>Your gateway to campus events</p>

            {!user ? (
                <div className="auth-options">
                    <Link to="/login" className="button">Login</Link>
                    <Link to="/register" className="button">Register</Link>
                </div>
            ) : (
                <div className="auth-options">
                    <p>Welcome, {user.displayName || user.email}!</p>
                    <button onClick={handleLogout} className="button">Logout</button>
                </div>
            )}
        </div>
    );
};

export default HomePage;

