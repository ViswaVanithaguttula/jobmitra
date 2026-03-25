import React, { useState, useEffect } from 'react';
import { Search, Loader2, Calendar, Award, Briefcase, MapPin, User, X, BookOpen, Compass, Info } from 'lucide-react';
import { FaUserCircle } from 'react-icons/fa';
import InputField from '../components/InputField';
import SelectDropdown from '../components/SelectDropdown';
import Button from '../components/Button';
import ExamCard from '../components/ExamCard';
import './CheckEligibilityPage.css';

const CheckEligibilityPage = () => {
  const [formData, setFormData] = useState({
    age: '',
    qualification: '',
    category: '',
    state: '',
    otherState: ''
  });
  
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const handleCloseModal = () => setSelectedExam(null);

  const calculateDaysRemaining = (examDate) => {
    if (!examDate) return null;
    const today = new Date();
    const date = new Date(examDate);
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  const ageOptions = Array.from({ length: 23 }, (_, i) => `${i + 18}`);
  const qualOptions = ['10th Pass', '12th Pass', 'Graduate (Any Stream)', 'B.Tech/B.E.', 'Post Graduate'];
  const catOptions = ['General', 'OBC', 'SC', 'ST', 'EWS'];
  const stateOptions = ['All India', 'Andhra Pradesh', 'Delhi', 'Karnataka', 'Kerala', 'Maharashtra', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Other'];

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
          setUserProfile(data);
          setFormData(prev => ({
            ...prev,
            age: data.age?.toString() || '',
            category: data.category || '',
            state: stateOptions.includes(data.state || '') ? data.state : (data.state ? 'Other' : ''),
            otherState: stateOptions.includes(data.state || '') ? '' : (data.state || ''),
            qualification: data.qualification === '10th' ? '10th Pass' 
                         : data.qualification === '12th' ? '12th Pass'
                         : data.qualification === 'Graduate' ? 'Graduate (Any Stream)'
                         : data.qualification === 'Post-Graduate' ? 'Post Graduate'
                         : ''
          }));
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

  const handleCheck = async (e) => {
    e.preventDefault();
    setIsChecking(true);
    
    try {
      const finalData = { ...formData };
      if (finalData.state === 'Other') {
        finalData.state = finalData.otherState;
      }

      const userStr = localStorage.getItem('jobmitra_user');
      const token = userStr ? JSON.parse(userStr).token : '';

      if (!token) throw new Error('You must be logged in to check eligibility! Please login first.');

      const res = await fetch('http://localhost:5000/api/eligibility/check', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(finalData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch eligibility');

      setResults(data.exams || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsChecking(false);
    }
  };

  const handleToggleSave = async (examId) => {
    try {
      const userStr = localStorage.getItem('jobmitra_user');
      const token = userStr ? JSON.parse(userStr).token : '';
      if (!token) {
        alert("Please login to save exams!");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/users/exams/${examId}/save`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile(prev => ({
          ...prev,
          savedExams: data.savedExams
        }));
      }
    } catch (err) {
      console.error("Failed to toggle save", err);
    }
  };

  return (
    <div className="container padding-y">
      <div className="eligibility-header text-center">
        <h1 className="section-title">Check Your Eligibility</h1>
        <p className="section-desc">Enter your details to instantly find all government exams you can apply for.</p>
      </div>

      <div className="eligibility-content">
        {/* Form Section */}
        <div className="eligibility-form-container glass-panel">
          <div className="profile-react-card">
            <FaUserCircle size={56} className="profile-react-icon" />
            <div className="profile-react-text">
              <h2>{userProfile?.name || 'Your Profile'}</h2>
              <p>Update your details below</p>
            </div>
          </div>
          <form onSubmit={handleCheck}>
            <div className="form-grid">
              <SelectDropdown 
                label={<span className="flex-label"><Calendar size={16} /> Your Age</span>} 
                id="age" 
                options={ageOptions} 
                value={formData.age} 
                onChange={handleChange} 
                required 
              />
              <SelectDropdown 
                label={<span className="flex-label"><Award size={16} /> Highest Qualification</span>} 
                id="qualification" 
                options={qualOptions} 
                value={formData.qualification} 
                onChange={handleChange} 
                required 
              />
              <SelectDropdown 
                label={<span className="flex-label"><Briefcase size={16} /> Category</span>} 
                id="category" 
                options={catOptions} 
                value={formData.category} 
                onChange={handleChange} 
                required 
              />
              <SelectDropdown 
                label={<span className="flex-label"><MapPin size={16} /> State (Optional)</span>} 
                id="state" 
                options={stateOptions} 
                value={formData.state} 
                onChange={handleChange} 
              />
              
              {formData.state === 'Other' && (
                <InputField 
                  label={<span className="flex-label"><MapPin size={16} /> Please Specify Your State</span>} 
                  id="otherState" 
                  placeholder="Enter state name" 
                  value={formData.otherState} 
                  onChange={handleChange} 
                  required={formData.state === 'Other'}
                />
              )}
            </div>
            
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full checker-btn"
              disabled={isChecking}
            >
              {isChecking ? (
                <><Loader2 className="spinner" size={18} /> Checking...</>
              ) : (
                <><Search size={18} /> Check Eligibility</>
              )}
            </Button>
          </form>
        </div>

        {/* Results Section */}
        <div className="eligibility-results">
          {!results && !isChecking && (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <Search size={48} className="text-light" />
              </div>
              <h3>No results yet</h3>
              <p>Fill out the form and click "Check Eligibility" to see exams adapted to your profile.</p>
            </div>
          )}

          {isChecking && (
            <div className="loading-state">
              <Loader2 className="spinner-large" size={48} />
              <p>Analyzing matching exams for you...</p>
            </div>
          )}

          {results && !isChecking && (
            <div>
              <div className="results-header">
                <h3>Eligible Exams Found ({results.length})</h3>
                <span className="results-badge">Matches found</span>
              </div>
              <div className="results-grid">
                {results.map((exam) => (
                  <div key={exam._id} className="fade-in">
                    <ExamCard 
                      examId={exam._id}
                      title={exam.examName}
                      ageLimit={`${exam.minAge} - ${exam.maxAge} Years`}
                      qualification={exam.qualificationRequired?.join(', ') || ''}
                      description={exam.description}
                      examDate={exam.examDate}
                      isSaved={userProfile?.savedExams?.includes(exam._id)}
                      onToggleSave={handleToggleSave}
                      onViewDetails={() => setSelectedExam(exam)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Exam Details Modal (Reused) */}
      {selectedExam && (() => {
        const daysLeft = calculateDaysRemaining(selectedExam.examDate);
        let requiredHours = 0;
        if (daysLeft && selectedExam.estimatedPrepHours) {
          requiredHours = Math.ceil(selectedExam.estimatedPrepHours / daysLeft);
        }
        
        const userHours = userProfile?.dailyStudyHours || 0;
        let recommendationClass = '';
        let recommendationText = '';
        
        if (requiredHours > 0) {
          if (userHours === 0) {
            recommendationClass = 'text-gray-600 bg-gray-100';
            recommendationText = `You need ${requiredHours} hours/day. Please update your profile with your available study hours!`;
          } else if (userHours < requiredHours) {
            recommendationClass = 'text-red-700 bg-red-100 border-red-200';
            recommendationText = `⚠️ Warning: You only have ${userHours} hours/day allocated, but need ${requiredHours} hours/day to cover ${selectedExam.estimatedPrepHours} hours of prep in ${daysLeft} days.`;
            if (userProfile?.profession === 'Working Professional') {
              recommendationText += " As a working professional, consider heavily utilizing your weekends to catch up.";
            } else if (userProfile?.profession === 'Student') {
              recommendationText += " Look for gaps between classes to squeeze in extra reading.";
            }
          } else {
            recommendationClass = 'text-green-800 bg-green-100 border-green-200';
            recommendationText = `✅ Excellent! Your ${userHours} hours/day is sufficient to easily meet the ${requiredHours} hours/day requirement!`;
          }
        }

        return (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedExam.examName}</h2>
                <button className="close-btn" onClick={handleCloseModal}>
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-tags">
                  <span className="exam-badge">{selectedExam.examType}</span>
                  {daysLeft !== null && <span className="exam-badge bg-orange text-orange">🗓️ {daysLeft} Days Left</span>}
                </div>
                
                <div className="modal-details-grid">
                  <div className="md-item">
                    <span className="md-label">Age Limit</span>
                    <span className="md-value">{selectedExam.minAge} - {selectedExam.maxAge} Years</span>
                  </div>
                  <div className="md-item">
                    <span className="md-label">Exam Date</span>
                    <span className="md-value">{selectedExam.examDate ? new Date(selectedExam.examDate).toLocaleDateString() : 'TBA'}</span>
                  </div>
                  <div className="md-item">
                    <span className="md-label">Total Prep Time</span>
                    <span className="md-value">{selectedExam.estimatedPrepHours ? `${selectedExam.estimatedPrepHours} Hours` : 'N/A'}</span>
                  </div>
                </div>

                {recommendationText && (
                  <div className={`recommendation-box ${recommendationClass}`}>
                    <strong>Personalized Insight:</strong>
                    <p>{recommendationText}</p>
                  </div>
                )}

                <div className="modal-section">
                  <h3 className="flex items-center gap-2"><BookOpen size={18} /> Syllabus Topics</h3>
                  <div className="pill-container">
                    {selectedExam.syllabus && selectedExam.syllabus.length > 0 
                      ? selectedExam.syllabus.map((topic, i) => <span key={i} className="syllabus-pill">{topic}</span>)
                      : <p>No syllabus listed.</p>}
                  </div>
                </div>

                {selectedExam.roadmap && selectedExam.roadmap.length > 0 && (
                  <div className="modal-section roadmap-section">
                    <h3 className="flex items-center gap-2"><Compass size={18} /> Recommended Roadmap</h3>
                    <ul className="roadmap-list">
                      {selectedExam.roadmap.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedExam.strategies && selectedExam.strategies.length > 0 && (
                  <div className="modal-section strategy-section">
                    <h3 className="flex items-center gap-2"><Info size={18} /> Strategic Advice</h3>
                    <ul className="strategy-list">
                      {selectedExam.strategies.map((strat, i) => (
                        <li key={i}>{strat}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <Button variant="primary" onClick={handleCloseModal}>Close Details</Button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default CheckEligibilityPage;
