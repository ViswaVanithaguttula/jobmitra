import mongoose from 'mongoose';

// Schema for a user's generated Study Plan
const studyPlanSchema = mongoose.Schema(
  {
    user: {
      // This references the User model (like a Foreign Key in SQL)
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    targetExam: {
      // This references the Exam model
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Exam'
    },
    hoursPerDay: {
      type: Number,
      required: true
    },
    preparationLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true
    },
    schedule: [
      {
        week: Number,
        topics: [
          {
            title: String,
            isCompleted: {
              type: Boolean,
              default: false
            }
          }
        ],
      },
    ],
  },
  {
    timestamps: true
  }
);

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
export default StudyPlan;
