// src/components/RSVPForm.js

import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RSVPForm = ({ eventId }) => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRSVP = async () => {
    if (!currentUser) {
      toast.error('Please log in to RSVP.');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const idToken = await currentUser.getIdToken();

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ eventId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('RSVP successful!');
      } else {
        toast.error(data.message || 'RSVP failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rsvp-form">
      <h2>RSVP for Event</h2>
      <button onClick={handleRSVP} disabled={loading} className="rsvp-button">
        {loading ? 'Processing...' : 'RSVP'}
      </button>
      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RSVPForm;
