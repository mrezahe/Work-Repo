const jwt = require('jsonwebtoken'); // TODO: Ensure jsonwebtoken is installed
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // No token provided
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Invalid token
    }

    // Find the user based on the decoded user ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.sendStatus(403); // User not found
    }

    // Attach user information to the request object
    req.user = user;
    req.role = decoded.role; // Attach user role

    next(); // Proceed to the next middleware or route handler
  });
};

// Middleware to check for specific roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };