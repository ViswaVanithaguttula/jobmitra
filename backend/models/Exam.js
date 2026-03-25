import mongoose from 'mongoose';

// Define the schema for a Government Exam
const examSchema = mongoose.Schema(
  {
    examName: {
      type: String,
      required: true,
      unique: true
    },
    minAge: {
      type: Number,
      required: true
    },
    maxAge: {
      type: Number,
      required: true
    },
    qualificationRequired: {
      // Could be an array if multiple degrees qualify, e.g., ["12th Pass", "Graduate"]
      type: [String],
      required: true
    },
    categoryRelaxation: {
      // How many extra years specific categories get. e.g. { OBC: 3, SC: 5, ST: 5 }
      OBC: { type: Number, default: 0 },
      SC: { type: Number, default: 0 },
      ST: { type: Number, default: 0 },
      EWS: { type: Number, default: 0 }
    },
    syllabus: {
      // Using an array of strings to list topics
      type: [String],
      required: true
    },
    examType: {
      type: String,
      enum: ['UPSC', 'SSC', 'Banking', 'Railway', 'State PSC', 'Defense'],
      required: true
    },
    state: {
      type: String,
      default: 'All India'
    },
    description: {
      type: String
    },
    examDate: {
      type: Date
    },
    estimatedPrepHours: {
      type: Number,
      default: 500
    },
    roadmap: {
      type: [String]
    },
    strategies: {
      type: [String]
    }
  },
  {
    timestamps: true
  }
);

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
