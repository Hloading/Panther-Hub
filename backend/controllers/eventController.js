// backend/controllers/eventController.js
const { db } = require('../firebase');
const { validationResult } = require('express-validator');

/**
 * GET /api/events
 * Fetch all events from Firestore
 */
exports.getEvents = async (req, res) => {
  try {
    const eventsSnapshot = await db.collection('events').get();
    const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(events);
  } catch (err) {
    console.error('Failed to fetch events:', err);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

/**
 * POST /api/events
 * Create a new event in Firestore
 */
exports.createEvent = async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, date, location, description } = req.body;

  try {
    const eventData = {
      title,
      description,
      date: new Date(date),
      location,
      organizerId: req.user.uid, // Assumes authentication middleware sets req.user
      createdAt: new Date(),
    };

    const docRef = await db.collection('events').add(eventData);

    res.status(201).json({
      message: 'Event created successfully',
      id: docRef.id,
      ...eventData,
    });
  } catch (err) {
    console.error('Failed to create event:', err);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

/**
 * PUT /api/events/:eventId
 * Update an existing event
 */
exports.updateEvent = async (req, res) => {
  const eventId = req.params.eventId;

  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const eventRef = db.collection('events').doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Authorization check
    if (eventDoc.data().organizerId !== req.user.uid) {
      return res.status(403).json({ message: 'Forbidden: You are not the organizer' });
    }

    await eventRef.update(req.body);
    res.status(200).json({ message: 'Event updated successfully' });
  } catch (err) {
    console.error('Failed to update event:', err);
    res.status(500).json({ message: 'Failed to update event' });
  }
};

/**
 * DELETE /api/events/:eventId
 * Delete an event
 */
exports.deleteEvent = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const eventRef = db.collection('events').doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Authorization check
    if (eventDoc.data().organizerId !== req.user.uid) {
      return res.status(403).json({ message: 'Forbidden: You are not the organizer' });
    }

    await eventRef.delete();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Failed to delete event:', err);
    res.status(500).json({ message: 'Failed to delete event' });
  }
};
