import React, { useState, useEffect } from 'react';
import { PenTool, Target, Calendar, X, Clock } from 'lucide-react';
import InputField from '../components/InputField';
import SelectDropdown from '../components/SelectDropdown';
import Button from '../components/Button';
import ScheduleCard from '../components/ScheduleCard';
import './StrategyPlannerPage.css';

const StrategyPlannerPage = () => {
  const [formData, setFormData] = useState({
    targetYear: '2025',
    studyHours: '6',
    prepLevel: ''
  });
  
  const [isGenerated, setIsGenerated] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [planId, setPlanId] = useState(null);

  const levelOptions = ['Beginner (Starting Just Now)', 'Intermediate (Know isolated topics)', 'Advanced (Needs Revision & Mocks)'];

  useEffect(() => {
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
          if (data.dailyStudyHours) {
            setFormData(prev => ({ ...prev, studyHours: data.dailyStudyHours.toString() }));
          }
        }
      } catch (err) {
        console.error("Could not fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const userStr = localStorage.getItem('jobmitra_user');
      const token = userStr ? JSON.parse(userStr).token : '';
      if (!token) throw new Error('You must be logged in to generate a strategy plan!');

      // Retrieve exams to dynamically get target exam id
      const examsRes = await fetch('http://localhost:5000/api/exams');
      const examsData = await examsRes.json();
      if (!examsData.exams || examsData.exams.length === 0) throw new Error("Database holds no exams");

      const targetExamId = examsData.exams[0]._id; // Map statically for default

      const res = await fetch('http://localhost:5000/api/planner/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          targetExamId,
          hoursPerDay: Number(formData.studyHours),
          preparationLevel: formData.prepLevel.split(' ')[0]
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to generate plan');

      const formattedPlan = data.schedule.map((weekItem, index) => ({
        day: `Week ${weekItem.week}`,
        hours: `${formData.studyHours}`,
        title: `Targeted Study Phase ${index + 1}`,
        tasks: weekItem.topics
      }));

      setWeeklyPlan(formattedPlan);
      setPlanId(data._id);
      setIsGenerated(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleTask = async (taskId, weekIndex, taskIndex) => {
    try {
      const userStr = localStorage.getItem('jobmitra_user');
      const token = userStr ? JSON.parse(userStr).token : '';
      if (!token || !planId) return;

      const res = await fetch(`http://localhost:5000/api/planner/${planId}/tasks/${taskId}/toggle`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        // Update local state without re-fetching
        const newPlan = [...weeklyPlan];
        newPlan[weekIndex].tasks[taskIndex].isCompleted = !newPlan[weekIndex].tasks[taskIndex].isCompleted;
        setWeeklyPlan(newPlan);
      }
    } catch (err) {
      console.error('Failed to toggle task', err);
    }
  };

  return (
    <div className="container padding-y">
      <div className="strategy-header text-center">
        <div className="icon-wrapper-large bg-orange-gradient">
          <PenTool size={36} color="white" />
        </div>
        <h1 className="section-title mb-2 mt-4">Personalized Strategy Planner</h1>
        <p className="section-desc">Generate a dynamic study roadmap curated just for you based on your available time.</p>
      </div>

      <div className="strategy-container card">
        {!isGenerated ? (
          <div className="strategy-form-section">
            <h3 className="form-heading"><Target size={20} className="text-orange" /> Set Your Goal Parameters</h3>
            <form onSubmit={handleGenerate} className="strategy-form">
              <div className="form-row">
                <InputField 
                  label="Target Exam Year" 
                  id="targetYear" 
                  type="number" 
                  min="2024"
                  max="2030"
                  value={formData.targetYear} 
                  onChange={handleChange} 
                  required 
                />
                <InputField 
                  label="Study Hours available per Day" 
                  id="studyHours" 
                  type="number" 
                  min="2"
                  max="16"
                  value={formData.studyHours} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <SelectDropdown 
                label="Current Preparation Level" 
                id="prepLevel" 
                options={levelOptions} 
                value={formData.prepLevel} 
                onChange={handleChange} 
                required 
              />
              <div className="btn-container text-center mt-4">
                <Button type="submit" variant="primary" size="lg">Generate My Weekly Plan</Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="generated-plan-section">
            <div className="plan-header flex-between">
              <div>
                <h3 className="plan-title text-blue">Your Master Study Plan</h3>
                <p className="plan-subtitle">Targeting {formData.targetYear} | {formData.studyHours} hours/day | {formData.prepLevel}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsGenerated(false)}>Re-configure</Button>
            </div>

            <div className="plan-grid md:grid-cols-2">
              {weeklyPlan.map((dayPlan, index) => (
                <ScheduleCard 
                  key={index}
                  day={dayPlan.day}
                  hours={dayPlan.hours}
                  title={dayPlan.title}
                  tasks={dayPlan.tasks}
                  onClick={() => setSelectedWeek(dayPlan)}
                />
              ))}
            </div>
            
            <div className="plan-actions mt-4 text-center">
              <Button variant="secondary" size="lg" onClick={() => window.location.href='/home'}>Go to Dashboard</Button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Daily Timeline Modal */}
      {selectedWeek && (
        <div className="modal-overlay" onClick={() => setSelectedWeek(null)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedWeek.day} Breakdown</h2>
              <button className="close-btn" onClick={() => setSelectedWeek(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-desc">
                <strong>Phase focus:</strong>
                <p>{selectedWeek.title}</p>
                <p className="text-gray" style={{ marginTop: '0.5rem' }}>Daily Commitment: {selectedWeek.hours} Hours</p>
              </div>

              <div className="timeline-container" style={{ marginTop: '1.5rem' }}>
                <h3 className="mb-4 text-blue" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Daily Schedule Breakdown</h3>
                
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((dayName, dIdx) => {
                  const hrs = Number(selectedWeek.hours);
                  let morningHours = Math.ceil(hrs / 2);
                  let eveningHours = Math.floor(hrs / 2);

                  const mIndex = (dIdx * 2) % selectedWeek.tasks.length;
                  const eIndex = (dIdx * 2 + 1) % selectedWeek.tasks.length;
                  
                  const morningTask = selectedWeek.tasks[mIndex];
                  const eveningTask = selectedWeek.tasks[eIndex];

                  // The week structure is an array of tasks. Figure out the actual week index from title
                  const weekMatch = selectedWeek.day.match(/Week (\d+)/);
                  const weekIdx = weekMatch ? parseInt(weekMatch[1]) - 1 : 0;

                  return (
                    <div key={dIdx} className="timeline-day-block p-4 rounded-lg border" style={{ marginBottom: '1.5rem', background: 'var(--white)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                      <h4 className="flex items-center gap-2 font-semibold text-lg" style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>
                        <Calendar className="text-orange" size={18}/> {dayName}
                      </h4>
                      <div className="timeline-items flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {morningHours > 0 && morningTask && (
                          <div className="timeline-card p-3 rounded" style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-blue)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <input 
                               type="checkbox" 
                               checked={morningTask.isCompleted || false}
                               onChange={() => handleToggleTask(morningTask._id, weekIdx, mIndex)}
                               style={{ marginTop: '0.25rem', cursor: 'pointer', transform: 'scale(1.2)' }}
                            />
                            <div>
                               <div className="time-badge flex items-center gap-2 mb-1 font-medium" style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                 <Clock size={14} /> 09:00 AM - {9 + morningHours}:00 {9 + morningHours >= 12 ? 'PM' : 'AM'}
                               </div>
                               <div className="task-detail" style={{ color: morningTask.isCompleted ? 'var(--text-light)' : 'var(--text-dark)', textDecoration: morningTask.isCompleted ? 'line-through' : 'none' }}>
                                 <strong>{morningHours} Hours Focus:</strong> {morningTask.title || morningTask}
                               </div>
                            </div>
                          </div>
                        )}
                        {eveningHours > 0 && eveningTask && (
                          <div className="timeline-card p-3 rounded" style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--secondary-blue)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <input 
                               type="checkbox" 
                               checked={eveningTask.isCompleted || false}
                               onChange={() => handleToggleTask(eveningTask._id, weekIdx, eIndex)}
                               style={{ marginTop: '0.25rem', cursor: 'pointer', transform: 'scale(1.2)' }}
                            />
                            <div>
                               <div className="time-badge flex items-center gap-2 mb-1 font-medium" style={{ color: 'var(--secondary-blue)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                 <Clock size={14} /> 05:00 PM - {5 + eveningHours}:00 PM
                               </div>
                               <div className="task-detail" style={{ color: eveningTask.isCompleted ? 'var(--text-light)' : 'var(--text-dark)', textDecoration: eveningTask.isCompleted ? 'line-through' : 'none' }}>
                                 <strong>{eveningHours} Hours Focus:</strong> {eveningTask.title || eveningTask}
                               </div>
                            </div>
                          </div>
                         )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="primary" onClick={() => setSelectedWeek(null)}>Close Timeline</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyPlannerPage;
