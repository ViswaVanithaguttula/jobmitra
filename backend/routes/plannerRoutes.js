import express from 'express';
import { checkEligibility, generateStudyPlan, getActiveStudyPlan, toggleTaskCompletion } from '../controllers/plannerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Both of these specific features require the user to be authenticated
router.post('/check', protect, checkEligibility);
router.post('/generate', protect, generateStudyPlan);
router.get('/active', protect, getActiveStudyPlan);
router.put('/:planId/tasks/:taskId/toggle', protect, toggleTaskCompletion);

export default router;
