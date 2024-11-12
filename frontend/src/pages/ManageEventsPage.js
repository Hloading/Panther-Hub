// src/pages/ManageEventsPage.js

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './ManageEventsPage.css';

const ManageEventsPage = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'events'));
                const eventsList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setEvents(eventsList);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteDoc(doc(db, 'events', eventId));
                setEvents(events.filter((event) => event.id !== eventId));
                alert('Event deleted successfully!');
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event.');
            }
        }
    };

    return (
        <div className="manage-events-page">
            <h1>Manage Events</h1>
            {events.length > 0 ? (
                <ul className="event-list">
                    {events.map((event) => (
                        <li key={event.id}>
                            <h3>{event.title}</h3>
                            <button onClick={() => handleDelete(event.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events found.</p>
            )}
        </div>
    );
};

export default ManageEventsPage;
