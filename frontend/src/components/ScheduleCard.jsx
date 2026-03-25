import React from 'react';
import { Calendar } from 'lucide-react';
import './ScheduleCard.css';

const ScheduleCard = ({ day, title, hours, tasks, onClick }) => {
  return (
    <div className="schedule-card card" onClick={onClick} style={{ cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-2px)' } }}>
      <div className="schedule-header">
        <div className="schedule-day">
          <Calendar size={18} />
          <span>{day}</span>
        </div>
        <div className="schedule-hours">{hours} Horas</div>
      </div>
      
      <h4 className="schedule-title">{title}</h4>
      
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '15px' }}>{tasks.length} Structured Study Topics</p>
        <div style={{ padding: '0.75rem', backgroundColor: 'var(--light-blue)', color: 'var(--primary-blue)', borderRadius: '8px', fontWeight: 600 }}>
          Click to View Daily Strategy
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
