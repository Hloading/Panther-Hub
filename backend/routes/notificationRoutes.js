// backend/routes/notificationRoutes.js
require('dotenv').config({ path: './backend.env' });
// backend/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const twilio = require('twilio');
const authenticate = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Ensure environment variables are loaded
require('dotenv').config({ path: path.resolve(__dirname, '../backend.env') });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  throw new Error('Twilio credentials are missing.');
}

const client = twilio(accountSid, authToken);

// Apply authentication middleware to all routes in this router
router.use(authenticate);

// Rate limiter for notification route
const notificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each user to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/notifications/send
 * Send an SMS notification
 */
router.post(
  '/send',
  notificationLimiter,
  [
    // Input validation middleware
    body('to')
      .notEmpty()
      .withMessage('Recipient phone number is required')
      .isMobilePhone()
      .withMessage('Invalid phone number'),
    body('message')
      .notEmpty()
      .withMessage('Message content is required')
      .isLength({ max: 1600 })
      .withMessage('Message cannot exceed 1600 characters'),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { to, message } = req.body;

    try {
      const sms = await client.messages.create({
        body: message,
        to: to,
        from: twilioPhoneNumber,
      });

      res.status(200).json({
        success: true,
        message: 'Notification sent!',
        sid: sms.sid,
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      let errorMessage = 'Failed to send notification';

      // Handle specific Twilio errors if needed
      if (error.code === 21211) {
        errorMessage = 'Invalid phone number';
      }

      res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }
);

module.exports = router;
