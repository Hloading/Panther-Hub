// backend/app.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'backend.env') });
const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
//const admin = require('firebase-admin');
const { admin, db } = require('./firebase');

const app = express();

//const db = admin.firestore();

app.use(cors());
app.use(express.json());

// Import routes
const notificationRoutes = require('./routes/notificationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
//const adminRoutes = requite('./routes/adminRoutes');

app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;
