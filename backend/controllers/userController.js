// backend/controllers/userController.js
const { admin, db } = require('../firebase');
const { validationResult } = require('express-validator');

/**
 * POST /api/users/register
 * Register a new user
 */
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Create user profile in Firestore
    const userProfile = {
      uid: userRecord.uid,
      name,
      email,
      role: 'student', // or prompt user to select role
      createdAt: new Date(),
    };

    await db.collection('users').doc(userRecord.uid).set(userProfile);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userProfile,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    let errorMessage = 'Failed to register user';

    // Handle specific errors
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Email already in use';
    }

    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

/**
 * POST /api/users/login
 * Log in a user
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Note: Firebase Authentication should be handled on the client side.
  // This function can be used to generate custom tokens if needed.

  res.status(501).json({
    success: false,
    message: 'Login functionality should be implemented on the client side using Firebase Authentication SDK.',
  });
};
