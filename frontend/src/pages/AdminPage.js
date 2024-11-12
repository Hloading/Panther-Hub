import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>
            <p>Manage events and user interactions here.</p>
            <Link to="/events">Back to Events</Link>
        </div>
    );
};

export default AdminPage;
