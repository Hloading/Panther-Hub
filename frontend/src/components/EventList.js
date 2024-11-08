
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Event.css'; // Updated path for Event.css

const events = [
    { id: 1, title: "Music Festival", date: "March 20", location: "Campus Park" },
    { id: 2, title: "Tech Talk", date: "April 15", location: "Main Auditorium" },
    // Add more events
];

function EventList() {
    return (
        <div>
            <h2>Upcoming Events</h2>
            <div className="event-list">
                {events.map(event => (
                    <div className="card event-card" key={event.id}>
                        <h3>{event.title}</h3>
                        <p>Date: {event.date}</p>
                        <p>Location: {event.location}</p>
                        <button>RSVP</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventList;
