import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import '../styles/Event.css';

const EventDetails = () => {
    const { id } = useParams();  // Extract event ID from URL
    const [event, setEvent] = useState(null);
    const user = auth.currentUser;

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventRef = doc(db, 'events', id);
                const eventSnapshot = await getDoc(eventRef);
                if (eventSnapshot.exists()) {
                    setEvent(eventSnapshot.data());
                } else {
                    console.error('Event not found');
                }
            } catch (err) {
                console.error('Error fetching event details:', err);
            }
        };
        fetchEvent();
    }, [id]);

    const handleRSVP = async () => {
        if (!user) {
            alert('Please log in to RSVP');
            return;
        }

        try {
            // Add RSVP to the user's `rsvpedEvents` subcollection
            const userEventRef = doc(db, `users/${user.uid}/rsvpedEvents`, id);
            await setDoc(userEventRef, {
                eventId: id,
                eventTitle: event.title,
                eventDate: event.date,
            });

            // Add the user's ID to the `rsvpedUsers` array in the event document
            const eventRef = doc(db, 'events', id);
            await updateDoc(eventRef, {
                rsvpedUsers: arrayUnion(user.uid),
            });

            alert('RSVP successful!');
        } catch (error) {
            console.error('Error RSVPing to event:', error);
            alert('Failed to RSVP');
        }
    };

    if (!event) return <p>Loading...</p>;

    return (
        <div className="event-details">
            <h1>{event.title}</h1>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Location: {event.location}</p>
            <p>{event.description}</p>
            <button onClick={handleRSVP}>RSVP</button>
        </div>
    );
};

export default EventDetails;
