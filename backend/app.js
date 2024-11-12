// backend/app.js

const express = require('express');
const app = express();
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccountKey.json');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware to parse JSON bodies
app.use(express.json());

// Use routes
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
