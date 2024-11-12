// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { authenticateToken, checkIfAdmin } = require('../middleware/authMiddleware');

// Add console logs to verify middleware functions
console.log('Type of authenticateToken:', typeof authenticateToken); // Should be 'function'
console.log('Type of checkIfAdmin:', typeof checkIfAdmin);           // Should be 'function'

router.post('/setCustomClaims', authenticateToken, checkIfAdmin, async (req, res) => {
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

module.exports = router;
