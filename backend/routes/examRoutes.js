import express from 'express';
import { getExams, getExamById, getBackupExams, createExam, deleteExam, updateExam } from '../controllers/examController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getExams)
  .post(protect, admin, createExam);
  
router.route('/backup/:examId').get(getBackupExams);

router.route('/:id')
  .get(getExamById)
  .delete(protect, admin, deleteExam)
  .put(protect, admin, updateExam);

export default router;
