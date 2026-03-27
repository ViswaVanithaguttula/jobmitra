 import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Exam from '../models/Exam.js';
import BackupExam from '../models/BackupExam.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, age, qualification, category, graduationYear, state, profession, dailyStudyHours } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // 400 Bad Request
    throw new Error('User with this email already exists');
  }

  // Create new user in database
  const user = await User.create({
    name,
    email,
    password, // This will be automatically hashed by our pre('save') middleware
    age,
    qualification,
    category,
    graduationYear,
    state,
    profession,
    dailyStudyHours
  });

  if (user) {
    // Respond with user data and the generated token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      message: 'User registered successfully!'
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data provided');
  }
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // Match password with the hashed password inside DB
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      message: 'Logged in successfully!'
    });
  } else {
    res.status(401); // 401 Unauthorized
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile details
// @route   GET /api/users/profile
// @access  Private (Requires Token)
const getUserProfile = asyncHandler(async (req, res) => {
  // `req.user` is defined in the `protect` middleware
  const user = await User.findById(req.user._id).populate('lockedExam');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      qualification: user.qualification,
      category: user.category,
      graduationYear: user.graduationYear,
      state: user.state,
      profession: user.profession,
      dailyStudyHours: user.dailyStudyHours,
      savedExams: user.savedExams,
      lockedExam: user.lockedExam,
      studyPlan: user.studyPlan,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (Requires Token)
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.age = req.body.age || user.age;
    user.qualification = req.body.qualification || user.qualification;
    user.category = req.body.category || user.category;
    user.graduationYear = req.body.graduationYear || user.graduationYear;
    user.state = req.body.state || user.state;
    user.profession = req.body.profession || user.profession;
    user.dailyStudyHours = req.body.dailyStudyHours || user.dailyStudyHours;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      age: updatedUser.age,
      qualification: updatedUser.qualification,
      category: updatedUser.category,
      state: updatedUser.state,
      profession: updatedUser.profession,
      dailyStudyHours: updatedUser.dailyStudyHours,
      token: generateToken(updatedUser._id),
      message: 'Profile updated successfully!'
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Toggle Save Exam
// @route   POST /api/users/exams/:id/save
// @access  Private
const toggleSaveExam = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const examId = req.params.id;

  if (user) {
    const isSaved = user.savedExams.includes(examId);
    
    if (isSaved) {
      // Remove it
      user.savedExams = user.savedExams.filter(id => id.toString() !== examId.toString());
    } else {
      // Add it
      user.savedExams.push(examId);
    }
    
    await user.save();
    res.json({ message: isSaved ? 'Exam removed from saved list' : 'Exam saved to profile', savedExams: user.savedExams });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get backup exams based on user profile
// @route   GET /api/users/profile/backup-exams
// @access  Private
const getBackupExamsForUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const exams = await Exam.find({});

  const qualLevels = {
    '10th Pass': 1,
    '12th Pass': 2,
    'Diploma': 2.5,
    'Graduate': 3,
    'Post-Graduate': 4,
    'Ph.D': 5,
  };

  const userQualLevel = qualLevels[user.qualification] || 0;
  const userAge = user.age;
  const userCat = user.category;
  const userState = user.state;

  // 1. Identify all exams the user is fully eligible for
  const eligibleExamIds = exams.filter((exam) => {
    const relaxation = exam.categoryRelaxation?.[userCat] || 0;
    const maxAgeAllowed = exam.maxAge + relaxation;
    const minAgeAllowed = exam.minAge;

    const reqQualLevels = exam.qualificationRequired.map(q => qualLevels[q] || 0);
    const minReqQualLevel = reqQualLevels.length > 0 ? Math.min(...reqQualLevels) : 0;

    const isAgeEligible = userAge >= minAgeAllowed && userAge <= maxAgeAllowed;
    const isStateEligible = exam.state === 'All India' || exam.state === userState;
    const isQualEligible = exam.qualificationRequired.includes(user.qualification) || userQualLevel >= minReqQualLevel;

    return isAgeEligible && isStateEligible && isQualEligible;
  }).map(e => e._id.toString());

  // Add saved exams in case they aren't fully eligible but saved them manually, plus locked exam
  const explicitIds = [...user.savedExams.map(id => id.toString())];
  if (user.lockedExam) {
    // If it's populated vs unpopulated
    const lId = user.lockedExam._id ? user.lockedExam._id.toString() : user.lockedExam.toString();
    explicitIds.push(lId);
  }

  const primaryExamIds = [...new Set([...eligibleExamIds, ...explicitIds])];

  // 2. Fetch all BackupExam links where primaryExam is in primaryExamIds
  const backupLinks = await BackupExam.find({
    primaryExam: { $in: primaryExamIds }
  }).populate('backupExam').populate('primaryExam');

  // 3. To avoid duplicates and format the response
  const backupsMap = {};

  backupLinks.forEach(link => {
    if (link.backupExam) {
      const bId = link.backupExam._id.toString();
      // Only suggest it if user is NOT fully eligible for the backup, 
      // or if we just want to suggest it anyway. We'll suggest it anyway 
      // since it's an explicit syllabus overlap target.
      if (!backupsMap[bId]) {
        backupsMap[bId] = {
          _id: link.backupExam._id,
          examName: link.backupExam.examName,
          description: link.backupExam.description,
          similarityScore: link.similarityScore,
          matchReason: link.reason,
          primaryExamName: link.primaryExam.examName,
          estimatedPrepHours: link.backupExam.estimatedPrepHours
        };
      }
    }
  });

  const backupExams = Object.values(backupsMap);

  res.json({ backupExams });
});

// @desc    Lock an exam and generate weekly study plan
// @route   POST /api/users/profile/lock-exam/:examId
// @access  Private
const lockExamAndGeneratePlan = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const exam = await Exam.findById(req.params.examId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!exam) {
    res.status(404);
    throw new Error('Exam not found');
  }

  user.lockedExam = exam._id;
  
  // Calculate weeks or map roadmap directly to weeks
  const newStudyPlan = [];
  
  if (exam.roadmap && exam.roadmap.length > 0) {
    exam.roadmap.forEach((phase, index) => {
      newStudyPlan.push({
        weekNumber: index + 1,
        title: `Phase ${index + 1}`,
        tasks: [phase], 
        isCompleted: false
      });
    });
  } else if (exam.syllabus && exam.syllabus.length > 0) {
    exam.syllabus.forEach((subject, index) => {
      newStudyPlan.push({
        weekNumber: index + 1,
        title: `Study ${subject}`,
        tasks: [`Complete all topics under ${subject}`],
        isCompleted: false
      });
    });
  } else {
    // Default fallback
    newStudyPlan.push({
      weekNumber: 1,
      title: "General Preparation",
      tasks: ["Start reading foundational materials", "Review past papers"],
      isCompleted: false
    });
  }

  user.studyPlan = newStudyPlan;
  await user.save();

  res.json({
    message: 'Exam locked and study plan generated successfully',
    lockedExam: user.lockedExam,
    studyPlan: user.studyPlan
  });
});

// @desc    Update study progress for a specific week
// @route   PUT /api/users/profile/study-plan/:weekNumber
// @access  Private
const updateStudyProgress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const weekNum = parseInt(req.params.weekNumber, 10);
  const planIndex = user.studyPlan.findIndex(p => p.weekNumber === weekNum);

  if (planIndex !== -1) {
    // Toggle completion status
    user.studyPlan[planIndex].isCompleted = !user.studyPlan[planIndex].isCompleted;
    await user.save();
    
    res.json({
      message: 'Progress updated',
      studyPlan: user.studyPlan
    });
  } else {
    res.status(404);
    throw new Error('Week not found in study plan');
  }
});

export { registerUser, authUser, getUserProfile, updateUserProfile, toggleSaveExam, getBackupExamsForUser, lockExamAndGeneratePlan, updateStudyProgress };
