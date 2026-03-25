import React from 'react';
import { Clock, BookOpen, ExternalLink, Briefcase, Heart } from 'lucide-react';
import Button from './Button';
import './ExamCard.css';

const ExamCard = ({ title, ageLimit, qualification, description, backupParams = null, onViewDetails, isSaved = false, onToggleSave = null, examId = null }) => {
  return (
    <div className="exam-card card">
      <div className="exam-card-header">
        <h3 className="exam-title">{title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onToggleSave && (
            <button 
              className={`save-btn-icon ${isSaved ? 'saved' : ''}`}
              onClick={() => onToggleSave(examId)}
              title={isSaved ? "Remove from Saved" : "Save Exam"}
            >
              <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
            </button>
          )}
          <span className="exam-badge">{backupParams ? 'Backup' : 'Main'}</span>
        </div>
      </div>
      
      {description && <p className="exam-desc">{description}</p>}
      
      <div className="exam-details">
        {ageLimit && (
          <div className="detail-item">
            <Clock size={16} />
            <span>Age: {ageLimit}</span>
          </div>
        )}
        {qualification && (
          <div className="detail-item">
            <BookOpen size={16} />
            <span>Qual: {qualification}</span>
          </div>
        )}
        {backupParams && backupParams.similarity && (
          <div className="detail-item tooltip">
            <Briefcase size={16} />
            <span>Syllabus Similarity: {backupParams.similarity}</span>
          </div>
        )}
      </div>

      <div className="exam-actions">
        {backupParams ? (
          <>
            <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href='/strategy'}>Plan Strategy</Button>
            <Button variant="primary" size="sm" className="w-full" onClick={onViewDetails}>View Details</Button>
          </>
        ) : (
          <Button variant="outline" className="w-full btn-icon-right" onClick={onViewDetails}>
            View Details <ExternalLink size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExamCard;
