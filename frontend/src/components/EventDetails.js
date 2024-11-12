// src/components/EventDetails.js

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
  doc,
  getDoc,
  arrayUnion,
  Timestamp,
  runTransaction,
} from 'firebase/firestore';
import '../styles/Event.css';
import { AuthContext } from '../contexts/AuthContext';

const EventDetails = () => {
  const { id } = useParams(); // Extract event ID from URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading event details
  const [rsvpLoading, setRsvpLoading] = useState(false); // State for RSVP button loading
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [hasRsvped, setHasRsvped] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0); // State for RSVP count

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventRef = doc(db, 'events', id);
        const eventSnapshot = await getDoc(eventRef);
        if (eventSnapshot.exists()) {
          const eventData = eventSnapshot.data();

          // Check if the current user has already RSVPed
          if (currentUser && eventData.rsvpedUsers?.includes(currentUser.uid)) {
            setHasRsvped(true);
          }

          // Set RSVP count
          setRsvpCount(eventData.rsvpedUsers ? eventData.rsvpedUsers.length : 0);

          setEvent(eventData);
        } else {
          setError('Event not found.');
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false); // End loading once event is fetched
      }
    };
    fetchEvent();
  }, [id, currentUser]);

  const handleRSVP = async () => {
    if (!currentUser) {
      setError('Please log in to RSVP.');
      return;
    }

    setRsvpLoading(true); // Start RSVP loading
    setError('');
    setSuccessMessage('');

    try {
      const userEventRef = doc(db, `users/${currentUser.uid}/rsvpedEvents`, id);
      const eventRef = doc(db, 'events', id);

      // Use a transaction to ensure atomicity
      await runTransaction(db, async (transaction) => {
        const eventDoc = await transaction.get(eventRef);

        if (!eventDoc.exists()) {
          throw new Error('Event does not exist.');
        }

        const eventData = eventDoc.data();

        if (eventData.rsvpedUsers?.includes(currentUser.uid)) {
          throw new Error('You have already RSVPed to this event.');
        }

        // Update event document
        transaction.update(eventRef, {
          rsvpedUsers: arrayUnion(currentUser.uid),
        });

        // Add to user's RSVPed events
        transaction.set(userEventRef, {
          eventId: id,
          eventTitle: eventData.title,
          eventDate: eventData.date,
          rsvpAt: Timestamp.now(),
        });
      });

      setHasRsvped(true);
      setRsvpCount((prevCount) => prevCount + 1); // Update RSVP count
      setSuccessMessage('RSVP successful!');
    } catch (error) {
      console.error('Error RSVPing to event:', error);
      setError(error.message || 'Failed to RSVP. Please try again later.');
    } finally {
      setRsvpLoading(false); // End RSVP loading
    }
  };

  if (loading) return <p>Loading event details...</p>; // Show loading message while fetching

  if (error) return <p className="error-message">{error}</p>; // Display error if any

  return (
    <div className="event-details">
      <h1>{event.title}</h1>
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={`${event.title} banner`}
          className="event-image"
        />
      )}
      <p>Date: {event.date.toDate().toLocaleDateString()}</p>
      <p>Location: {event.location}</p>
      <p>{event.description}</p>
      <p>Total RSVPs: {rsvpCount}</p>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}
      {hasRsvped ? (
        <p>You have already RSVPed to this event.</p>
      ) : (
        <button onClick={handleRSVP} disabled={rsvpLoading}>
          {rsvpLoading ? 'Processing RSVP...' : 'RSVP'}
        </button>
      )}
    </div>
  );
};

export default EventDetails;
