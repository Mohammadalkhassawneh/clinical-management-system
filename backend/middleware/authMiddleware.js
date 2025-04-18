const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to authenticate token
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET || 'clinic_management_secret_key', async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token.' });
      }

      // Check if user exists
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Add user info to request
      req.user = {
        id: user.id,
        username: user.username,
        role: user.role
      };

      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

// Middleware to check doctor role
const isDoctor = (req, res, next) => {
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Doctor role required.' });
  }
  next();
};

// Middleware to check receptionist role
const isReceptionist = (req, res, next) => {
  if (req.user.role !== 'receptionist' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Receptionist role required.' });
  }
  next();
};

module.exports = {
  authenticateToken,
  isAdmin,
  isDoctor,
  isReceptionist
};
