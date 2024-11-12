// backend/middleware/authMiddleware.js

const admin = require('firebase-admin');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Error verifying ID token:', error);
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token.' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }
};

const checkIfAdmin = (req, res, next) => {
  if (req.user && req.user.admin === true) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admins only.' });
  }
};

module.exports = {
  authenticateToken,
  checkIfAdmin,
};
