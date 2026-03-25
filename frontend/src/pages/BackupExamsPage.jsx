import React, { useState } from 'react';
import { Compass, AlertTriangle } from 'lucide-react';
import ExamCard from '../components/ExamCard';
import './BackupExamsPage.css';

const BackupExamsPage = () => {
  const [selectedExam, setSelectedExam] = useState(null);
  const backupExams = [
    {
      id: 1,
      title: "State PSC (Provincial Civil Services)",
      description: "Highly overlapping syllabus with UPSC. Same GS subjects but with an additional local state history paper.",
      backupParams: { similarity: "High (85%)" }
    },
    {
      id: 2,
      title: "IBPS PO / SBI PO",
      description: "Excellent backup for SSC CGL aspirants due to heavy overlap in Quantitative Aptitude and Reasoning.",
      backupParams: { similarity: "High (70%)" }
    },
    {
      id: 3,
      title: "RBI Grade B",
      description: "Great alternative for UPSC economy enthusiasts. Focuses deeply on Finance and Management.",
      backupParams: { similarity: "Moderate (60%)" }
    },
    {
      id: 4,
      title: "FCI Manager",
      description: "A secure Central Govt job with an exam pattern very similar to SSC/Banking combo.",
      backupParams: { similarity: "High (80%)" }
    }
  ];

  return (
    <div className="container padding-y">
      <div className="backup-hero card mb-4">
        <div className="backup-hero-content">
          <div className="flex-center mb-2">
            <Compass size={40} className="text-orange" />
          </div>
          <h1 className="backup-hero-title">Smart Backup Planning</h1>
          <p className="backup-hero-desc">
            Never put all your eggs in one basket. Discover exams with syllabi dangerously close to your primary target. Prepare for multiple exams with almost the same effort.
          </p>
        </div>
      </div>

      <div className="warning-banner glass">
        <AlertTriangle size={24} className="text-orange" />
        <p><strong>Pro Tip:</strong> Attempt the mock tests of these backup exams at least once a month to get familiar with their slight pattern variations.</p>
      </div>

      <div className="backup-grid md:grid-cols-2 mt-4">
        {backupExams.map(exam => (
          <ExamCard 
            key={exam.id}
            title={exam.title}
            description={exam.description}
            backupParams={exam.backupParams}
            onViewDetails={() => setSelectedExam(exam)}
          />
        ))}
      </div>

      {selectedExam && (
        <div className="modal-overlay" onClick={() => setSelectedExam(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--primary-blue)' }}>{selectedExam.title}</h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-color)', lineHeight: '1.6' }}>{selectedExam.description}</p>
            <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
              <strong style={{ color: 'var(--text-dark)' }}>Syllabus Similarity:</strong> {selectedExam.backupParams.similarity}
            </div>
            <button 
              style={{ padding: '0.9rem', width: '100%', backgroundColor: 'var(--primary-blue)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', marginTop: '0.5rem' }} 
              onClick={() => setSelectedExam(null)}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupExamsPage;
