// backend/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

// Get all events
router.get('/', async (req, res) => {
    try {
        const eventsRef = db.collection('events');
        const snapshot = await eventsRef.get();
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
});

// Create a new event
router.post('/', async (req, res) => {
    try {
        const event = req.body;
        const eventsRef = db.collection('events');
        const docRef = await eventsRef.add(event);
        res.status(201).json({ id: docRef.id, ...event });
    } catch (error) {
        res.status(500).json({ error: 'Error creating event' });
    }
});

module.exports = router;
