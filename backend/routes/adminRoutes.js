// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { authenticateToken, checkIfAdmin } = require('../middleware/authMiddleware');

// Apply authenticateToken middleware to all routes in this router
router.use(authenticateToken);

// Route to set custom claims, only accessible by admins
router.post('/setCustomClaims', checkIfAdmin, async (req, res) => {
  try {
    const { uid, claims } = req.body;

    if (!uid || !claims) {
      return res.status(400).json({ message: 'UID and claims are required.' });
    }

    await admin.auth().setCustomUserClaims(uid, claims);

    res.status(200).json({ message: 'Custom claims set successfully.' });
  } catch (error) {
    console.error('Error setting custom claims:', error);
    res.status(500).json({ error: 'Failed to set custom claims.' });
  }
});

// Test route to verify middleware execution
router.get('/test', checkIfAdmin, (req, res) => {
  res.send('Admin route is working with authentication middleware.');
});

module.exports = router;
