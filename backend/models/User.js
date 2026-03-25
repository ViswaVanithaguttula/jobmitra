import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the schema (structure) for a User document in MongoDB
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true // Ensures no two users share the same email
    },
    password: {
      type: String,
      required: [true, 'Please add a password']
    },
    age: {
      type: Number,
      required: [true, 'Please specify your age']
    },
    qualification: {
      type: String,
      required: [true, 'Please specify your highest qualification']
    },
    category: {
      type: String,
      enum: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      required: true
    },
    profession: {
      type: String,
      enum: ['Student', 'Working Professional', 'Full-Time Aspirant', 'Other'],
      default: 'Full-Time Aspirant'
    },
    dailyStudyHours: {
      type: Number,
      min: 1,
      max: 24
    },
    savedExams: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam'
    }],
    graduationYear: {
      type: Number
    },
    state: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Method to compare entered password with the hashed password inside database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware: Hash the password right before saving to the database
userSchema.pre('save', async function () {
  // If password field is not modified, skip hashing (e.g., when updating only username)
  if (!this.isModified('password')) {
    return;
  }

  // Generate a cryptographically strong salt, and hash the password with it
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
