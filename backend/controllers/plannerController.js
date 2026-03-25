import asyncHandler from 'express-async-handler';
import Exam from '../models/Exam.js';
import StudyPlan from '../models/StudyPlan.js';

// @desc    Check Eligibility Engine
// @route   POST /api/eligibility/check
// @access  Private (Requires User to be logged in to read their profile)
const checkEligibility = asyncHandler(async (req, res) => {
  // If user is logged in, their data is in req.user. Alternatively, take it from req.body
  const { age, qualification, category, state } = req.body.age ? req.body : req.user;

  // 1. Fetch all exams from database
  const exams = await Exam.find({});

  // 2. Filter exams based on core logic
  const eligibleExams = exams.filter((exam) => {
    // Check Qualification match (More flexible approach)
    const matchesQual = exam.qualificationRequired.some(q => {
      const dbQual = q.toLowerCase();
      const userQual = qualification ? qualification.toLowerCase() : '';
      return dbQual === userQual || dbQual.includes(userQual) || userQual.includes(dbQual);
    });
    
    // Check Age with Category Relaxation
    let effectiveMaxAge = exam.maxAge;
    
    // Apply relaxation if category exists
    if (exam.categoryRelaxation && exam.categoryRelaxation[category]) {
      effectiveMaxAge += exam.categoryRelaxation[category];
    }
    
    const matchesAge = age >= exam.minAge && age <= effectiveMaxAge;

    // Check State
    let matchesState = true;
    if (state && state !== 'All India') {
      matchesState = (exam.state === 'All India' || exam.state === state);
    }

    return matchesQual && matchesAge && matchesState;
  });

  res.json({
    totalEligible: eligibleExams.length,
    exams: eligibleExams
  });
});

// @desc    Generate Study Plan
// @route   POST /api/planner/generate
// @access  Private
const generateStudyPlan = asyncHandler(async (req, res) => {
  const { targetExamId, hoursPerDay, preparationLevel } = req.body;

  const targetExam = await Exam.findById(targetExamId);
  if (!targetExam) {
    res.status(404);
    throw new Error('Target Exam not found');
  }

  // CORE LOGIC: Dynamically generate weeks based on prepLevel and hours
  // In a real app, this would use a complex algorithm matching syllabus topics.
  const baseSyllabus = targetExam.syllabus && targetExam.syllabus.length > 0
    ? targetExam.syllabus
    : ["Reasoning", "Quantitative Aptitude", "General Knowledge", "English", "Mock Tests", "Revision", "Current Affairs"];
  
  const generateWeeklyTasks = (weekNum) => {
    const tasks = [];
    for (let day = 0; day < 7; day++) {
      tasks.push({ title: `${baseSyllabus[day % baseSyllabus.length]} - Week ${weekNum} Morning Focus` });
      tasks.push({ title: `${baseSyllabus[(day + 1) % baseSyllabus.length]} - Week ${weekNum} Evening Focus` });
    }
    return tasks;
  };

  const generatedSchedule = [
    { week: 1, topics: generateWeeklyTasks(1) },
    { week: 2, topics: generateWeeklyTasks(2) },
    { week: 3, topics: generateWeeklyTasks(3) },
    { week: 4, topics: generateWeeklyTasks(4) }
  ];

  // Save the plan to the database
  const studyPlan = await StudyPlan.create({
    user: req.user._id,
    targetExam: targetExamId,
    hoursPerDay,
    preparationLevel,
    schedule: generatedSchedule
  });

  res.status(201).json(studyPlan);
});

// @desc    Get user's active study plan
// @route   GET /api/planner/active
// @access  Private
const getActiveStudyPlan = asyncHandler(async (req, res) => {
  const latestPlan = await StudyPlan.findOne({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('targetExam');

  if (latestPlan) {
    res.json(latestPlan);
  } else {
    res.status(404);
    throw new Error('No active study plan found');
  }
});

// @desc    Toggle a task's completion status
// @route   PUT /api/planner/:planId/tasks/:taskId/toggle
// @access  Private
const toggleTaskCompletion = asyncHandler(async (req, res) => {
  const { planId, taskId } = req.params;
  const plan = await StudyPlan.findOne({ _id: planId, user: req.user._id });

  if (plan) {
    let taskFound = null;
    for (let week of plan.schedule) {
      const task = week.topics.id(taskId);
      if (task) {
        task.isCompleted = !task.isCompleted;
        taskFound = task;
        break;
      }
    }

    if (taskFound) {
       await plan.save();
       res.json({ message: 'Task toggled', task: taskFound });
    } else {
       res.status(404);
       throw new Error('Task not found in this study plan');
    }
  } else {
    res.status(404);
    throw new Error('Study plan not found');
  }
});

export { checkEligibility, generateStudyPlan, getActiveStudyPlan, toggleTaskCompletion };
