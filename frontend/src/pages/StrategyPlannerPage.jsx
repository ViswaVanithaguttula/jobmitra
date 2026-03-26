import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, Circle, Award, BookOpen, Clock, Calendar, X } from 'lucide-react';
import Button from '../components/Button';
import './StrategyPlannerPage.css';

const StrategyPlannerPage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(null);
  
  const [localTaskState, setLocalTaskState] = useState(() => {
     const stored = localStorage.getItem('jobmitra_task_state');
     return stored ? JSON.parse(stored) : {};
  });

  const fetchProfile = async () => {
    try {
      const userStr = localStorage.getItem('jobmitra_user');
      if (!userStr) return;
      const userInfo = JSON.parse(userStr);
      if (!userInfo.token) return;

      const res = await fetch('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
      }
    } catch (err) {
      console.error("Could not fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleToggleWeek = async (weekNumber, e) => {
    if (e) e.stopPropagation();
    try {
      const userStr = localStorage.getItem('jobmitra_user');
      const token = userStr ? JSON.parse(userStr).token : '';
      if (!token) return;

      const res = await fetch(`http://localhost:5000/api/users/profile/study-plan/${weekNumber}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUserProfile(prev => {
           const updatedPlan = [...prev.studyPlan];
           const idx = updatedPlan.findIndex(p => p.weekNumber === weekNumber);
           if(idx !== -1) {
            // Toggle completion status
            updatedPlan[idx] = { ...updatedPlan[idx], isCompleted: !updatedPlan[idx].isCompleted };
           }
           return { ...prev, studyPlan: updatedPlan };
        });
      }
    } catch (err) {
      console.error('Failed to toggle week progress', err);
    }
  };

  const handleToggleWeekLocal = (weekNumber) => {
    handleToggleWeek(weekNumber);
    setSelectedWeek(prev => ({...prev, isCompleted: !prev.isCompleted}));
  };

  const handleToggleSubTask = (key) => {
    setLocalTaskState(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      localStorage.setItem('jobmitra_task_state', JSON.stringify(newState));
      return newState;
    });
  };

  if (loading) return <div className="container padding-y" style={{textAlign: "center"}}>Loading your master plan...</div>;

  if (!userProfile || !userProfile.lockedExam) {
    return (
      <div className="container padding-y">
        <div className="card text-center" style={{ padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Target size={64} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>No Target Exam Locked</h2>
          <p style={{ color: 'var(--text-color)', marginBottom: '1.5rem' }}>You need to lock an exam to auto-generate a study roadmap.</p>
          <Button onClick={() => window.location.href='/eligible-exams'} variant="primary">Browse Eligible Exams</Button>
        </div>
      </div>
    );
  }

  const studyPlan = userProfile.studyPlan || [];
  const completedCount = studyPlan.filter(w => w.isCompleted).length;
  const progressPercent = studyPlan.length > 0 ? Math.round((completedCount / studyPlan.length) * 100) : 0;

  return (
    <div className="container padding-y">
      <div className="strategy-header text-center mb-5" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title text-orange" style={{ marginBottom: '0.5rem', color: 'var(--primary-orange)' }}>Master Strategy Timeline</h1>
        <p className="section-desc">Track your weekly milestones for <strong>{userProfile.lockedExam?.examName || "Your Target Exam"}</strong>.</p>
      </div>
      
      <div className="sticky-progress card mb-5" style={{ position: 'sticky', top: '10px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--primary-blue)' }}>Overall Readiness</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>{completedCount} of {studyPlan.length} Weeks Completed</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-orange)' }}>{progressPercent}%</span>
        </div>
      </div>

      <div className="timeline-container" style={{ position: 'relative', paddingLeft: '2rem', marginLeft: '1rem', borderLeft: '3px solid var(--border)' }}>
        {studyPlan.map((weekItem) => (
          <div key={weekItem.weekNumber} className="timeline-item" style={{ position: 'relative', marginBottom: '2rem', paddingLeft: '1.5rem' }}>
            
            <div 
              style={{
                position: 'absolute',
                left: '-40px',
                top: '10px',
                background: '#fff',
                borderRadius: '50%',
                padding: '4px',
                cursor: 'pointer',
                boxShadow: '0 0 0 4px var(--bg-color)',
                zIndex: 2
              }}
              title={weekItem.isCompleted ? "Mark Pending" : "Mark Completed"}
              onClick={(e) => handleToggleWeek(weekItem.weekNumber, e)}
            >
              {weekItem.isCompleted ? (
                <CheckCircle size={28} style={{ color: '#22c55e', fill: '#fff' }} />
              ) : (
                 <Circle size={28} style={{ color: 'var(--text-light)', fill: '#fff' }} />
              )}
            </div>
            
            <div className="timeline-card card" 
                 style={{ 
                   padding: '1.5rem', 
                   borderLeft: `4px solid ${weekItem.isCompleted ? '#22c55e' : 'var(--primary-orange)'}`,
                   opacity: weekItem.isCompleted ? 0.8 : 1,
                   transition: 'all 0.3s ease',
                   cursor: 'pointer'
                 }}
                 onClick={() => setSelectedWeek(weekItem)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: weekItem.isCompleted ? '#166534' : 'var(--primary-orange)' }}>
                  Week {weekItem.weekNumber}
                </span>
                {weekItem.isCompleted && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <Award size={14} /> Completed
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>{weekItem.title}</h3>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {weekItem.tasks && weekItem.tasks.map((task, tIdx) => (
                   <li key={tIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-color)', fontSize: '0.95rem' }}>
                     <BookOpen size={16} style={{ marginTop: '2px', flexShrink: 0, color: 'var(--primary-blue)' }} />
                     <span style={{ textDecoration: weekItem.isCompleted ? 'line-through' : 'none', color: weekItem.isCompleted ? 'var(--text-light)' : 'inherit' }}>
                       {task}
                     </span>
                   </li>
                ))}
              </ul>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                 <button 
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: weekItem.isCompleted ? '#f1f5f9' : '#fff7ed',
                    color: weekItem.isCompleted ? '#475569' : '#c2410c',
                    transition: 'background 0.2s ease'
                  }}
                  onClick={(e) => handleToggleWeek(weekItem.weekNumber, e)}
                 >
                   {weekItem.isCompleted ? 'Undo Completion' : 'Mark Week Complete'}
                 </button>
                 <span style={{ marginLeft: '1rem', fontSize: '0.85rem', color: 'var(--primary-blue)', textDecoration: 'underline' }}>
                   View Daily Breakdown
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedWeek && (
        <div className="modal-overlay" onClick={() => setSelectedWeek(null)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Week {selectedWeek.weekNumber} Breakdown</h2>
              <button className="close-btn" onClick={() => setSelectedWeek(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-desc">
                <strong>Phase focus:</strong>
                <p>{selectedWeek.title}</p>
                <p className="text-gray" style={{ marginTop: '0.5rem' }}>Daily Commitment: {userProfile?.dailyStudyHours || 6} Hours</p>
              </div>

              <div className="timeline-container" style={{ marginTop: '1.5rem' }}>
                <h3 className="mb-4 text-blue" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Daily Schedule Breakdown</h3>
                
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((dayName, dIdx) => {
                  const hrs = Number(userProfile?.dailyStudyHours || 6);
                  let morningHours = Math.ceil(hrs / 2);
                  let eveningHours = Math.floor(hrs / 2);

                  const tasksArray = selectedWeek.tasks && selectedWeek.tasks.length > 0 ? selectedWeek.tasks : ['General Study'];
                  const mIndex = (dIdx * 2) % tasksArray.length;
                  const eIndex = (dIdx * 2 + 1) % tasksArray.length;
                  
                  const morningTask = tasksArray[mIndex];
                  const eveningTask = tasksArray[eIndex];

                  const gIndexMorning = mIndex + dIdx * 100;
                  const gIndexEvening = eIndex + dIdx * 100 + 50; 

                  const morningKey = `${userProfile._id}_w${selectedWeek.weekNumber}_${gIndexMorning}`;
                  const eveningKey = `${userProfile._id}_w${selectedWeek.weekNumber}_${gIndexEvening}`;

                  const isMorningDone = localTaskState[morningKey] || false;
                  const isEveningDone = localTaskState[eveningKey] || false;

                  return (
                    <div key={dIdx} className="timeline-day-block p-4 rounded-lg border" style={{ marginBottom: '1.5rem', background: 'var(--white)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                      <h4 className="flex items-center gap-2 font-semibold text-lg" style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>
                        <Calendar className="text-orange" size={18}/> {dayName}
                      </h4>
                      <div className="timeline-items flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {morningHours > 0 && morningTask && (
                          <div className="timeline-card p-3 rounded" style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-blue)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <label style={{ display: 'flex', width: '100%', cursor: 'pointer', gap: '1rem', alignItems: 'flex-start' }}>
                              <input 
                                 type="checkbox" 
                                 checked={isMorningDone}
                                 onChange={() => handleToggleSubTask(morningKey)}
                                 style={{ marginTop: '0.25rem', cursor: 'pointer', transform: 'scale(1.2)' }}
                              />
                              <div style={{ flex: 1 }}>
                                 <div className="time-badge flex items-center gap-2 mb-1 font-medium" style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                   <Clock size={14} /> 09:00 AM - {9 + morningHours}:00 {9 + morningHours >= 12 ? 'PM' : 'AM'}
                                 </div>
                                 <div className="task-detail" style={{ color: isMorningDone ? 'var(--text-light)' : 'var(--text-dark)', textDecoration: isMorningDone ? 'line-through' : 'none' }}>
                                   <strong>{morningHours} Hours Focus:</strong> {morningTask}
                                 </div>
                              </div>
                            </label>
                          </div>
                        )}
                        {eveningHours > 0 && eveningTask && (
                          <div className="timeline-card p-3 rounded" style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--secondary-blue)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <label style={{ display: 'flex', width: '100%', cursor: 'pointer', gap: '1rem', alignItems: 'flex-start' }}>
                              <input 
                                 type="checkbox" 
                                 checked={isEveningDone}
                                 onChange={() => handleToggleSubTask(eveningKey)}
                                 style={{ marginTop: '0.25rem', cursor: 'pointer', transform: 'scale(1.2)' }}
                              />
                              <div style={{ flex: 1 }}>
                                 <div className="time-badge flex items-center gap-2 mb-1 font-medium" style={{ color: 'var(--secondary-blue)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                   <Clock size={14} /> 05:00 PM - {5 + eveningHours}:00 PM
                                 </div>
                                 <div className="task-detail" style={{ color: isEveningDone ? 'var(--text-light)' : 'var(--text-dark)', textDecoration: isEveningDone ? 'line-through' : 'none' }}>
                                   <strong>{eveningHours} Hours Focus:</strong> {eveningTask}
                                 </div>
                              </div>
                            </label>
                          </div>
                         )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <Button variant="outline" onClick={() => handleToggleWeekLocal(selectedWeek.weekNumber)}>
                {selectedWeek.isCompleted ? 'Mark Entire Week Incomplete' : 'Mark Entire Week Complete'}
              </Button>
              <Button variant="primary" onClick={() => setSelectedWeek(null)}>Close Timeline</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyPlannerPage;
