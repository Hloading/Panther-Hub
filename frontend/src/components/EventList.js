
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Event.css';

const EventList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error('Error fetching events:', err));
    }, []);

    return (
        <div className="event-list">
            <h1>Upcoming Events</h1>
            {events.length > 0 ? (
                events.map(event => (
                    <Link to={`/events/${event._id}`} key={event._id}>
                        <div className="event-card">
                            <h2>{event.title}</h2>
                            <p>{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                    </Link>
                ))
            ) : (
                <p>No events available.</p>
            )}
        </div>
    );
};

export default EventList;
