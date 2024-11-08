
import React, { useEffect, useState } from 'react';

const ProfilePage = () => {
    const [user, setUser] = useState({ name: '', email: '', events: [] });

    useEffect(() => {
        fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setUser(data.user);
            } else {
                alert('Failed to load profile.');
                window.location.href = '/login';
            }
        })
        .catch(err => console.error('Error loading profile:', err));
    }, []);

    return (
        <div className="profile-page">
            <h1>{user.name}'s Profile</h1>
            <p>Email: {user.email}</p>
            <h2>Registered Events</h2>
            <ul>
                {user.events.map(event => (
                    <li key={event.id}>{event.title} - {new Date(event.date).toLocaleDateString()}</li>
                ))}
            </ul>
        </div>
    );
};

export default ProfilePage;
