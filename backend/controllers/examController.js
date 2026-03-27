import asyncHandler from 'express-async-handler';
import Exam from '../models/Exam.js';
import BackupExam from '../models/BackupExam.js';

// @desc    Fetch all exams (with optional filtering)
// @route   GET /api/exams
// @access  Public
const getExams = asyncHandler(async (req, res) => {
  // Optional query parameters for pagination or filtering
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        examName: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Exam.countDocuments({ ...keyword });
  const exams = await Exam.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ exams, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single exam
// @route   GET /api/exams/:id
// @access  Public
const getExamById = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (exam) {
    res.json(exam);
  } else {
    res.status(404);
    throw new Error('Exam not found');
  }
});

// @desc    Fetch backup exams for a primary exam
// @route   GET /api/exams/backup/:examId
// @access  Public
const getBackupExams = asyncHandler(async (req, res) => {
  const backups = await BackupExam.find({ primaryExam: req.params.examId }).populate('backupExam');

  if (backups && backups.length > 0) {
    res.json(backups);
  } else {
    res.status(404);
    throw new Error('No backup exams found for this primary exam');
  }
});

// @desc    Create a new exam
// @route   POST /api/exams
// @access  Private/Admin
const createExam = asyncHandler(async (req, res) => {
  const { 
    examName, minAge, maxAge, qualificationRequired, description, 
    state, examType, syllabus, estimatedPrepHours, roadmap, strategies 
  } = req.body;
  
  const exam = new Exam({
    examName,
    minAge,
    maxAge,
    qualificationRequired,
    description,
    state,
    examType: examType || 'UPSC',
    syllabus: syllabus || [],
    estimatedPrepHours: estimatedPrepHours || 500,
    roadmap: roadmap || [],
    strategies: strategies || []
  });

  const createdExam = await exam.save();
  res.status(201).json(createdExam);
});

// @desc    Delete an exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin
const deleteExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (exam) {
    await exam.deleteOne();
    res.json({ message: 'Exam removed' });
  } else {
    res.status(404);
    throw new Error('Exam not found');
  }
});

// @desc    Update an exam
// @route   PUT /api/exams/:id
// @access  Private/Admin
const updateExam = asyncHandler(async (req, res) => {
  const { 
    examName, minAge, maxAge, qualificationRequired, description, 
    state, examType, syllabus, estimatedPrepHours, roadmap, strategies 
  } = req.body;

  const exam = await Exam.findById(req.params.id);

  if (exam) {
    exam.examName = examName || exam.examName;
    exam.minAge = minAge !== undefined ? minAge : exam.minAge;
    exam.maxAge = maxAge !== undefined ? maxAge : exam.maxAge;
    if (qualificationRequired) exam.qualificationRequired = qualificationRequired;
    exam.description = description || exam.description;
    exam.state = state || exam.state;
    exam.examType = examType || exam.examType;
    if (syllabus) exam.syllabus = syllabus;
    exam.estimatedPrepHours = estimatedPrepHours !== undefined ? estimatedPrepHours : exam.estimatedPrepHours;
    if (roadmap) exam.roadmap = roadmap;
    if (strategies) exam.strategies = strategies;

    const updatedExam = await exam.save();
    res.json(updatedExam);
  } else {
    res.status(404);
    throw new Error('Exam not found');
  }
});

export { getExams, getExamById, getBackupExams, createExam, deleteExam, updateExam };
