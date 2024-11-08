
import React, { useState } from 'react';

const RSVPForm = ({ eventId }) => {
    const [email, setEmail] = useState('');

    const handleRSVP = () => {
        fetch('/api/rsvp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ userEmail: email, eventId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('RSVP successful!');
            } else {
                alert(data.message || 'RSVP failed.');
            }
        })
        .catch(err => console.error('Error:', err));
    };

    return (
        <div>
            <h2>RSVP for Event</h2>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleRSVP}>RSVP</button>
        </div>
    );
};

export default RSVPForm;
