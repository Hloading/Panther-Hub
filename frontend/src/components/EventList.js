// src/components/EventList.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import '../styles/Event.css';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [filteredEvents, setFilteredEvents] = useState([]); // State for filtered events

  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted component

    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, 'events');
        const now = Timestamp.now();

        // Query to get upcoming events ordered by date
        const eventsQuery = query(
          eventsCollection,
          where('date', '>=', now),
          orderBy('date', 'asc')
        );

        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsList = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (isMounted) {
          setEvents(eventsList); // Update events state with fetched data
          setFilteredEvents(eventsList); // Initialize filtered events
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        if (isMounted) {
          setError('Failed to load events. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false); // End loading after fetching events
        }
      }
    };

    fetchEvents();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Filter events based on search term
    if (term.trim() === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) =>
        event.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  };

  if (loading) return <p>Loading events...</p>; // Loading message while fetching
  if (error) return <p className="error-message">{error}</p>; // Display error message

  return (
    <div className="event-list-container">
      <h2>Upcoming Events</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
        aria-label="Search events"
      />

      <div className="event-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div className="card event-card" key={event.id}>
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={`${event.title} banner`}
                  className="event-image"
                />
              )}
              <h3>{event.title}</h3>
              <p>
                Date:{' '}
                {event.date &&
                  event.date.toDate().toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </p>
              <p>Location: {event.location}</p>
              <Link to={`/events/${event.id}`} className="details-link">
                View Details / RSVP
              </Link>
            </div>
          ))
        ) : (
          <p>No upcoming events found.</p>
        )}
      </div>
    </div>
  );
}

export default EventList;
