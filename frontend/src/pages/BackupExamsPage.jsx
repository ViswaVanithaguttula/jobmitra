import React, { useState, useEffect } from 'react';
import { Compass, AlertTriangle } from 'lucide-react';
import ExamCard from '../components/ExamCard';
import './BackupExamsPage.css';

const BackupExamsPage = () => {
  const [selectedExam, setSelectedExam] = useState(null);
  const [backupExams, setBackupExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBackupExams = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('jobmitra_user'));
        if (!userInfo || !userInfo.token) {
          setError('Please log in to see your personalized backup exams.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/users/profile/backup-exams', {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch backup exams');
        }

        const formattedExams = data.backupExams.map(exam => ({
          id: exam._id,
          title: exam.examName,
          description: exam.description || `Highly recommended backup for ${exam.primaryExamName}`,
          backupParams: { 
            similarity: `${exam.similarityScore}%`,
            reason: exam.matchReason,
            primary: exam.primaryExamName
          }
        }));

        setBackupExams(formattedExams);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBackupExams();
  }, []);

  if (loading) {
    return (
      <div className="container padding-y" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>Loading your personalized backup exams...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container padding-y">
        <div className="warning-banner glass" style={{ color: 'red' }}>
          <AlertTriangle size={24} />
          <p><strong>Error:</strong> {error}</p>
        </div>
      </div>
    );
  }

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
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--text-dark)' }}>Primary Target:</strong> {selectedExam.backupParams.primary || "N/A"}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--text-dark)' }}>Syllabus Similarity:</strong> {selectedExam.backupParams.similarity}
              </div>
              <div>
                <strong style={{ color: 'var(--text-dark)' }}>Why this Backup?:</strong> {selectedExam.backupParams.reason || "High logic overlap."}
              </div>
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
