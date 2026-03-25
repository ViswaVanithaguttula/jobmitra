import jwt from 'jsonwebtoken';

// Function to generate a JSON Web Token
const generateToken = (id) => {
  // Sign the token with the user ID, secret from .env, and set an expiration time (e.g., 30 days)
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
