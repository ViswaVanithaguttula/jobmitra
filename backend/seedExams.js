import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exam from './models/Exam.js';
import BackupExam from './models/BackupExam.js';
import dns from 'dns';

dns.setServers(['1.1.1.1', '8.8.8.8']);
dotenv.config({ path: './.env' });

const dummyExams = [
  {
    examName: "UPSC Civil Services",
    minAge: 21,
    maxAge: 32,
    qualificationRequired: ["Graduate", "Graduate (Any Stream)", "B.Tech/B.E.", "Post Graduate"],
    categoryRelaxation: { OBC: 3, SC: 5, ST: 5, EWS: 0 },
    syllabus: ["History", "Geography", "Polity", "Economy", "Ethics", "Current Affairs"],
    examType: "UPSC",
    state: "All India",
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
    state: "All India",
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
    state: "All India",
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
  },
  {
    examName: "State PSC",
    minAge: 21,
    maxAge: 35,
    qualificationRequired: ["Graduate", "Graduate (Any Stream)", "B.Tech/B.E.", "Post Graduate"],
    categoryRelaxation: { OBC: 3, SC: 5, ST: 5, EWS: 0 },
    syllabus: ["History", "Geography", "Polity", "Economy", "State Specific GK", "Current Affairs"],
    examType: "State PSC",
    state: "Andhra Pradesh",
    description: "State level administrative services examination.",
    examDate: new Date('2026-07-20'),
    estimatedPrepHours: 1000,
    roadmap: [
      "Phase 1: Basic NCERTs and State Board Books (Months 1-3)",
      "Phase 2: Standard Books & State GK (Months 4-6)",
      "Phase 3: Answer Writing & Prelims Mocks (Months 7-8)"
    ],
    strategies: [
      "Focus heavily on State-specific General Knowledge.",
      "Read local newspapers daily.",
      "Practice previous year State PSC papers."
    ]
  },
  {
    examName: "RRB NTPC",
    minAge: 18,
    maxAge: 33,
    qualificationRequired: ["12th Pass", "Graduate", "Graduate (Any Stream)"],
    categoryRelaxation: { OBC: 3, SC: 5, ST: 5, EWS: 0 },
    syllabus: ["General Awareness", "Mathematics", "General Intelligence and Reasoning"],
    examType: "Railway",
    state: "All India",
    description: "RRB NTPC (Non-Technical Popular Categories) recruitment is for various posts in Indian Railways.",
    examDate: new Date('2026-08-10'),
    estimatedPrepHours: 500,
    roadmap: [
      "Cover basic Mathematics (Arithmetic and Advance)",
      "Read Lucent General Knowledge for General Awareness",
      "Practice Reasoning topics daily"
    ],
    strategies: [
      "Focus on high-scoring topics in Mathematics",
      "Regularly revise General Awareness facts",
      "Solve previous year RRB papers"
    ]
  },
  {
    examName: "RBI Grade B",
    minAge: 21,
    maxAge: 30,
    qualificationRequired: ["Graduate", "Post Graduate"],
    categoryRelaxation: { OBC: 3, SC: 5, ST: 5, EWS: 0 },
    syllabus: ["General Awareness", "English", "Quantitative Aptitude", "Reasoning", "Economics and Social Issues", "Finance and Management"],
    examType: "Banking",
    state: "All India",
    description: "Highly prestigious examination for officers in Reserve Bank of India.",
    examDate: new Date('2026-06-15'),
    estimatedPrepHours: 1000,
    roadmap: [
      "Phase 1: Phase 1 subjects (Quant, Reas, Eng, GA)",
      "Phase 2: ESI & FM concepts",
      "Phase 3: Answer writing for Mains"
    ],
    strategies: [
      "Deep understanding of macroeconomics.",
      "Read RBI notifications and circulars.",
      "Practice descriptive writing."
    ]
  },
  {
    examName: "FCI Manager",
    minAge: 18,
    maxAge: 28,
    qualificationRequired: ["Graduate", "B.Tech/B.E.", "Post Graduate"],
    categoryRelaxation: { OBC: 3, SC: 5, ST: 5, EWS: 0 },
    syllabus: ["English Language", "Reasoning Ability", "Numerical Aptitude", "General Studies"],
    examType: "SSC", // or PSU
    state: "All India",
    description: "Recruitment for Managers in Food Corporation of India.",
    examDate: new Date('2026-11-20'),
    estimatedPrepHours: 400,
    roadmap: [
      "Phase 1: Clear basic subjects identical to SSC/Banking combo",
      "Phase 2: Mocks and Sectionals",
      "Phase 3: Revision"
    ],
    strategies: [
      "Extremely fast calculation speed required.",
      "Focus heavily on reasoning puzzles."
    ]
  },
  {
    examName: "SSC CHSL",
    minAge: 18,
    maxAge: 27,
    qualificationRequired: ["12th Pass", "Graduate", "B.Tech/B.E.", "Post Graduate"],
    categoryRelaxation: { OBC: 3, SC: 5, ST: 5, EWS: 0 },
    syllabus: ["English Language", "General Intelligence", "Quantitative Aptitude", "General Awareness"],
    examType: "SSC",
    state: "All India",
    description: "Staff Selection Commission Combined Higher Secondary Level for LDC, DEO.",
    examDate: new Date('2026-03-10'),
    estimatedPrepHours: 300,
    roadmap: [
      "Phase 1: Basic Math and English Grammar",
      "Phase 2: General Awareness from Lucent",
      "Phase 3: Mock Tests"
    ],
    strategies: [
      "Practice typing for Skill Test.",
      "Similar prep as SSC CGL Tier 1."
    ]
  }
];

const seedExams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to: ${process.env.MONGO_URI}`);
    
    // Clear existing exams just to make sure we don't have duplicates
    await Exam.deleteMany();
    
    console.log('Inserting dummy exams...');
    for (const exam of dummyExams) {
      // Use updateOne with upsert to avoid duplicate key errors if run multiple times
      await Exam.updateOne(
        { examName: exam.examName },
        { $set: exam },
        { upsert: true }
      );
    }
    
    console.log('Successfully seeded dummy exams!');

    console.log('Seeding Backup Exams relationships...');
    await BackupExam.deleteMany();

    const upsc = await Exam.findOne({ examName: "UPSC Civil Services" });
    const ssc = await Exam.findOne({ examName: "SSC CGL" });
    const statePsc = await Exam.findOne({ examName: "State PSC" });
    const rrbNtpc = await Exam.findOne({ examName: "RRB NTPC" });
    const ibps = await Exam.findOne({ examName: "IBPS PO" });
    const rbi = await Exam.findOne({ examName: "RBI Grade B" });
    const fci = await Exam.findOne({ examName: "FCI Manager" });
    const sscChsl = await Exam.findOne({ examName: "SSC CHSL" });

    // Build the dynamic array based on which exams were found
    const backupExamsData = [];

    if (upsc && statePsc) {
      backupExamsData.push({
        primaryExam: upsc._id,
        backupExam: statePsc._id,
        similarityScore: 80,
        reason: "Highly overlapping syllabus in History, Geography, Polity, and Current Affairs."
      });
    }

    if (ssc && rrbNtpc) {
      backupExamsData.push({
        primaryExam: ssc._id,
        backupExam: rrbNtpc._id,
        similarityScore: 85,
        reason: "Very similar syllabus covering Math, Reasoning, and General Awareness."
      });
    }

    if (ssc && sscChsl) {
      backupExamsData.push({
        primaryExam: ssc._id,
        backupExam: sscChsl._id,
        similarityScore: 90,
        reason: "Virtually identical Tier-1 syllabus; serves as a great safety net for CGL aspirants."
      });
    }

    if (ibps && rbi) {
      backupExamsData.push({
        primaryExam: ibps._id,
        backupExam: rbi._id,
        similarityScore: 65,
        reason: "Strong overlap in Quants/Reasoning/English, though RBI requires extra effort in Economics."
      });
    }

    if (ssc && fci) {
      backupExamsData.push({
        primaryExam: ssc._id,
        backupExam: fci._id,
        similarityScore: 80,
        reason: "FCI Managers exam structure lies exactly between SSC and Banking logic, making it a robust backup."
      });
    }
    
    if (ibps && fci) {
      backupExamsData.push({
        primaryExam: ibps._id,
        backupExam: fci._id,
        similarityScore: 75,
        reason: "Good overlap with IBPS reasoning formats."
      });
    }

    if (backupExamsData.length > 0) {
      await BackupExam.insertMany(backupExamsData);
      console.log(`Successfully seeded ${backupExamsData.length} backup exam relationships!`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedExams();
