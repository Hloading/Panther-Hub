
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Event.css';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        fetch(`/api/events/${id}`)
            .then(res => res.json())
            .then(data => setEvent(data))
            .catch(err => console.error('Error fetching event details:', err));
    }, [id]);

    if (!event) return <p>Loading...</p>;

    return (
        <div className="event-details">
            <h1>{event.title}</h1>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Location: {event.location}</p>
            <p>{event.description}</p>
            <button onClick={() => alert('RSVP functionality to be integrated')}>RSVP</button>
        </div>
    );
};

export default EventDetails;
