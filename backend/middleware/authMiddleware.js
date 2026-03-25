import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Middleware to protect routes that require authentication
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the request contains an authorization header that starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token authenticity using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database using the ID in the token payload
      // Select('-password') ensures we don't pass the hashed password around
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the actual route handler
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token attached');
  }
});

// Admin Middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
