// Load environment variables from .env
require('dotenv').config({ path: './backend.env' });
const twilio = require('twilio');

// Initialize Twilio client with credentials from environment variables
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = client;
