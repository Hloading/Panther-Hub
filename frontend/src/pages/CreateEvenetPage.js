// src/pages/CreateEventPage.js

import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './CreateEventPage.css';

const CreateEventPage = () => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, 'events'), {
                title,
                date: Timestamp.fromDate(new Date(date)),
                location,
                description,
                createdAt: Timestamp.now(),
            });
            alert('Event created successfully!');
            navigate('/admin');
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event.');
        }
    };

    return (
        <div className="create-event-page">
            <h1>Create Event</h1>
            <form onSubmit={handleCreateEvent} className="event-form">
                <input
                    type="text"
                    placeholder="Event Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    placeholder="Event Date and Time"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
                <button type="submit">Create Event</button>
            </form>
        </div>
    );
};

export default CreateEventPage;
