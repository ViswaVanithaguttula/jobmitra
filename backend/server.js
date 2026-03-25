import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize the Express app
const app = express();

// Middleware
app.use(express.json()); // Allows parsing of JSON request bodies
app.use(cors()); // Enables Cross-Origin Resource Sharing (allows frontend to call backend)

// Base route for testing
app.get('/', (req, res) => {
  res.send('JobMitra Backend API is running perfectly!');
});

// Import route files
import userRoutes from './routes/userRoutes.js';
import examRoutes from './routes/examRoutes.js';
import plannerRoutes from './routes/plannerRoutes.js';

app.use('/api/auth', userRoutes); // Login/Register go here
app.use('/api/users', userRoutes); // Profile goes here
app.use('/api/exams', examRoutes); // Exams List and Backups
app.use('/api/eligibility', plannerRoutes); // Check eligibility
app.use('/api/planner', plannerRoutes); // Generate plan

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
