import mongoose from 'mongoose';

// Schema linking two exams that have a similar syllabus
const backupExamSchema = mongoose.Schema(
  {
    primaryExam: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Exam'
    },
    backupExam: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Exam'
    },
    similarityScore: {
      type: Number, // Percentage of overlap (e.g., 85 for 85%)
      required: true
    },
    reason: {
      type: String, // E.g., "Highly overlapping syllabus in Quant and Reasoning."
      required: true
    }
  },
  {
    timestamps: true
  }
);

const BackupExam = mongoose.model('BackupExam', backupExamSchema);
export default BackupExam;
