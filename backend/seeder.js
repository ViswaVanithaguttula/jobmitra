import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exam from './models/Exam.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Exam.deleteMany();

    const sampleExams = [
      {
        examName: "UPSC Civil Services",
        minAge: 21,
        maxAge: 32,
        qualificationRequired: ["Graduate", "Graduate (Any Stream)", "B.Tech/B.E.", "Post Graduate"],
        categoryRelaxation: { OBC: 3, SC: 5, ST: 5, EWS: 0 },
        syllabus: ["History", "Geography", "Polity", "Economy", "Ethics", "Current Affairs"],
        examType: "UPSC",
        description: "Premier exam for administrative roles like IAS, IPS, IFS.",
        examDate: new Date('2026-05-26'),
        estimatedPrepHours: 1200,
        roadmap: [
          "Phase 1: Basic NCERTs (Months 1-3)",
          "Phase 2: Standard Books & Optional Subject (Months 4-7)",
          "Phase 3: Answer Writing & Prelims Mocks (Months 8-10)",
          "Phase 4: Intensive Revision (Months 11-12)"
        ],
        strategies: [
          "Read newspapers daily for current affairs.",
          "Practice PYQs (Previous Year Questions) religiously.",
          "Focus on Answer Writing practice from day 1 for Mains."
        ]
      },
      {
        examName: "SSC CGL",
        minAge: 18,
        maxAge: 32,
        qualificationRequired: ["Graduate", "Graduate (Any Stream)", "B.Tech/B.E.", "Post Graduate"],
        categoryRelaxation: { OBC: 3, SC: 5, ST: 5, EWS: 0 },
        syllabus: ["Quantitative Aptitude", "Reasoning", "English", "General Awareness"],
        examType: "SSC",
        description: "Conduct by Staff Selection Commission for Group B & C posts.",
        examDate: new Date('2026-09-15'),
        estimatedPrepHours: 600,
        roadmap: [
          "Phase 1: Syllabus completion for Math & English (Months 1-3)",
          "Phase 2: Reasoning and General Awareness (Months 4-5)",
          "Phase 3: Speed Building and Mock Tests (Month 6)"
        ],
        strategies: [
          "Learn short tricks for Quantitative Aptitude.",
          "Read Lucent's GK for General Awareness.",
          "Take at least 2 full-length mocks every week."
        ]
      },
      {
        examName: "IBPS PO",
        minAge: 20,
        maxAge: 30,
        qualificationRequired: ["Graduate", "Graduate (Any Stream)", "B.Tech/B.E.", "Post Graduate"],
        categoryRelaxation: { OBC: 3, SC: 5, ST: 5, EWS: 0 },
        syllabus: ["Quantitative Aptitude", "Reasoning", "English", "Banking Awareness"],
        examType: "Banking",
        description: "Recruitment for Probationary Officers in Public Sector Banks.",
        examDate: new Date('2026-10-05'),
        estimatedPrepHours: 400,
        roadmap: [
          "Phase 1: Basic Concepts of Quants & Reasoning (Weeks 1-4)",
          "Phase 2: Current Affairs & Banking Awareness (Weeks 5-8)",
          "Phase 3: Sectional Mocks & Speed Practice (Weeks 9-12)",
          "Phase 4: Full-Length Mocks & Analysis (Weeks 13-16)"
        ],
        strategies: [
          "Focus heavily on calculation speed.",
          "Reading comprehension and puzzles are key.",
          "Daily practice using sectional quizzes."
        ]
      }
    ];

    await Exam.insertMany(sampleExams);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
