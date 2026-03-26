import express from 'express';
import { 
  registerUser, 
  authUser, 
  getUserProfile, 
  updateUserProfile,
  toggleSaveExam,
  getBackupExamsForUser,
  lockExamAndGeneratePlan,
  updateStudyProgress
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Authentication routes
router.post('/register', registerUser);
router.post('/login', authUser);

// Protected User routes
// We chain the `protect` middleware before the `getUserProfile` controller
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/profile/backup-exams').get(protect, getBackupExamsForUser);
router.post('/profile/lock-exam/:examId', protect, lockExamAndGeneratePlan);
router.put('/profile/study-plan/:weekNumber', protect, updateStudyProgress);
router.post('/exams/:id/save', protect, toggleSaveExam);

// Temporarily expose an elevation tool for the Local Test user (remove before PROD)
import User from '../models/User.js';
router.get('/makeadmin/:email', async (req, res) => {
  await User.findOneAndUpdate({ email: req.params.email }, { isAdmin: true });
  res.send(`Successfully granted Admin privileges to ${req.params.email}! Please logout and log back in to see the changes.`);
});

export default router;
