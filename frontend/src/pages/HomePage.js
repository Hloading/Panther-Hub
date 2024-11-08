
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="home-page">
            <h1>Welcome to Panther Hub</h1>
            <p>Your central platform for managing and exploring campus events.</p>
            <Link to="/events">View Events</Link>
            <Link to="/profile">Your Profile</Link>
        </div>
    );
};

export default HomePage;
