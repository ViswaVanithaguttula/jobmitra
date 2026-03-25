import React, { useState, useEffect } from 'react';
import { Filter, X, Search, Calendar, BookOpen, Compass, Info, Loader2 } from 'lucide-react';
import ExamCard from '../components/ExamCard';
import Button from '../components/Button';
import './EligibleExamsPage.css';

const EligibleExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyEligible, setShowOnlyEligible] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('jobmitra_user'));
        if (userInfo && userInfo.token) {
          const profileRes = await fetch('http://localhost:5000/api/users/profile', {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setUserProfile(profileData);
          }
        }

        const res = await fetch('http://localhost:5000/api/exams');
        const data = await res.json();
        if (res.ok) {
          setExams(data.exams || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleCloseModal = () => setSelectedExam(null);

  const filters = ['All', ...new Set(exams.map(e => e.examType))];

  const isEligible = (exam, profile) => {
    if (!profile || !profile.qualification) return false;
    return exam.qualificationRequired.includes(profile.qualification);
  };

  const filteredExams = exams.filter(exam => {
    const matchesFilter = activeFilter === 'All' || exam.examType === activeFilter;
    const matchesSearch = exam.examName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEligible = showOnlyEligible ? isEligible(exam, userProfile) : true;
    return matchesFilter && matchesSearch && matchesEligible;
  });

  const calculateDaysRemaining = (examDate) => {
    if (!examDate) return null;
    const today = new Date();
    const date = new Date(examDate);
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  return (
    <div className="container padding-y">
      <div className="exams-header">
        <h1 className="section-title text-left mb-2">Explore Government Exams</h1>
        <p className="section-desc">Find customized details, timelines, and study roadmaps based on your profile.</p>
      </div>

      <div className="search-filter-panel card">
        <div className="search-bar">
          <Search size={20} className="search-icon text-light" />
          <input 
            type="text" 
            placeholder="Search exams by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        {userProfile && (
          <div className="preference-toggle">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={showOnlyEligible} 
                onChange={() => setShowOnlyEligible(!showOnlyEligible)} 
              />
              Show Only Exams I'm Eligible For
            </label>
            <span className="profile-hint">
              {userProfile.profession && `(As a ${userProfile.profession})`}
            </span>
          </div>
        )}
      </div>

      <div className="filter-section">
        <div className="filter-icon-wrapper">
          <Filter size={20} />
          <span>Filter by Agency:</span>
        </div>
        <div className="filter-chips">
          {filters.map(filter => (
            <button 
              key={filter}
              className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader2 className="spinner-large" size={48} />
          <p>Loading the latest exam data...</p>
        </div>
      ) : (
        <>
          <div className="exams-grid md:grid-cols-3">
            {filteredExams.length > 0 ? filteredExams.map(exam => (
              <ExamCard 
                key={exam._id}
                title={exam.examName}
                ageLimit={`${exam.minAge} - ${exam.maxAge} Years`}
                qualification={exam.qualificationRequired.join(', ')}
                description={exam.description}
                examDate={exam.examDate}
                onViewDetails={() => setSelectedExam(exam)}
              />
            )) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No exams match your criteria.
              </div>
            )}
          </div>
        </>
      )}

      {/* Exam Details Modal */}
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

export default EligibleExamsPage;
