
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ProfilePage = () => {
    const [user, setUser] = useState({ name: '', email: '', events: [] });
    const auth = getAuth();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const currentUser = auth.currentUser;

            if (!currentUser) {
                alert('You must be logged in to view your profile.');
                window.location.href = '/login';
                return;
            }

            try {
                // Get the user's profile data from Firestore
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUser({
                        name: userData.name || currentUser.displayName,
                        email: currentUser.email,
                        events: userData.events || []
                    });
                } else {
                    alert('User profile not found.');
                }
            } catch (err) {
                console.error('Error loading profile:', err);
            }
        };

        fetchUserProfile();
    }, [auth]);

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

