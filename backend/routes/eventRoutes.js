// backend/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const authenticate = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

// Apply authentication middleware to all routes
router.use(authenticate);

// Valid RSVP statuses
const validStatuses = ['going', 'interested', 'not going'];

/**
 * GET /api/events
 * Retrieve all events with optional pagination and filtering
 */
router.get('/', async (req, res) => {
  try {
    // Pagination parameters
    const limit = parseInt(req.query.limit) || 10;
    let query = db.collection('events').orderBy('date', 'asc').limit(limit);

    // Start after a specific document (for pagination)
    if (req.query.startAfter) {
      const startAfterDoc = await db.collection('events').doc(req.query.startAfter).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }

    // Filtering by organizerId
    if (req.query.organizerId) {
      query = query.where('organizerId', '==', req.query.organizerId);
    }

    // Execute the query
    const snapshot = await query.get();
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
});

/**
 * POST /api/events
 * Create a new event
 */
router.post(
  '/',
  [
    // Input validation middleware
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('location').notEmpty().withMessage('Location is required'),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Authorization check (optional)
    const userRole = req.user.role || 'student';
    if (!['faculty', 'staff'].includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    try {
      const event = {
        title: req.body.title,
        description: req.body.description,
        date: new Date(req.body.date),
        location: req.body.location,
        organizerId: req.user.uid,
        createdAt: new Date(),
      };

      const docRef = await db.collection('events').add(event);
      res.status(201).json({ id: docRef.id, ...event });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Error creating event' });
    }
  }
);

/**
 * PUT /api/events/:eventId
 * Update an existing event
 */
router.put(
  '/:eventId',
  [
    // Input validation middleware
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const eventId = req.params.eventId;
      const eventRef = db.collection('events').doc(eventId);

      // Check if the event exists
      const eventDoc = await eventRef.get();
      if (!eventDoc.exists) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Authorization check: only the organizer can update the event
      if (eventDoc.data().organizerId !== req.user.uid) {
        return res.status(403).json({ error: 'Forbidden: You are not the organizer' });
      }

      await eventRef.update(req.body);
      res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Error updating event' });
    }
  }
);

/**
 * DELETE /api/events/:eventId
 * Delete an event
 */
router.delete('/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const eventRef = db.collection('events').doc(eventId);

    // Check if the event exists
    const eventDoc = await eventRef.get();
    if (!eventDoc.exists) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Authorization check: only the organizer can delete the event
    if (eventDoc.data().organizerId !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden: You are not the organizer' });
    }

    await eventRef.delete();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Error deleting event' });
  }
});

/**
 * GET /api/events/:eventId/rsvps
 * Get RSVPs for a specific event
 */
router.get('/:eventId/rsvps', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const rsvpsSnapshot = await db.collection('events').doc(eventId).collection('rsvps').get();
    const rsvps = rsvpsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(rsvps);
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({ error: 'Error fetching RSVPs' });
  }
});

/**
 * POST /api/events/:eventId/rsvps
 * RSVP to an event
 */
router.post(
  '/:eventId/rsvps',
  [
    // Input validation middleware
    body('status')
      .isIn(validStatuses)
      .withMessage(`Status must be one of: ${validStatuses.join(', ')}`),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const eventId = req.params.eventId;
      const userId = req.user.uid;
      const status = req.body.status;

      const rsvpData = {
        status,
        timestamp: new Date(),
      };

      await db
        .collection('events')
        .doc(eventId)
        .collection('rsvps')
        .doc(userId)
        .set(rsvpData);

      res.status(200).json({ message: 'RSVP recorded', ...rsvpData });
    } catch (error) {
      console.error('Error recording RSVP:', error);
      res.status(500).json({ error: 'Error recording RSVP' });
    }
  }
);

module.exports = router;
