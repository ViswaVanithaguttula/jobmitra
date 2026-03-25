import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
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
  const user = await User.findById(req.user._id);

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

export { registerUser, authUser, getUserProfile, updateUserProfile, toggleSaveExam };
