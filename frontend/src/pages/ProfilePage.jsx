import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, Award, MapPin, Briefcase, Clock, Loader } from 'lucide-react';
import { FaUserCircle } from 'react-icons/fa';
import InputField from '../components/InputField';
import Button from '../components/Button';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    qualification: '',
    category: '',
    graduationYear: '',
    state: '',
    profession: '',
    dailyStudyHours: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('jobmitra_user'));
        if (!userInfo || !userInfo.token) {
          navigate('/login');
          return;
        }

        const res = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');

        setFormData({
          name: data.name || '',
          email: data.email || '',
          password: '', // Kept empty for security
          age: data.age || '',
          qualification: data.qualification || '',
          category: data.category || '',
          graduationYear: data.graduationYear || '',
          state: data.state || '',
          profession: data.profession || '',
          dailyStudyHours: data.dailyStudyHours?.toString() || ''
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    setError('');
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('jobmitra_user'));
      
      // Only include password if user typed one
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');

      // Update local storage with new info and token
      userInfo.name = data.name;
      userInfo.email = data.email;
      userInfo.token = data.token;
      localStorage.setItem('jobmitra_user', JSON.stringify(userInfo));

      setMessage('Profile updated successfully!');
      setFormData({ ...formData, password: '' });
      setIsSaving(false);
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <Loader className="spinner" size={48} />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container page-transition fade-in">
      <div className="profile-hero">
        <div className="profile-glass-card">
          <div className="profile-header">
            <FaUserCircle size={100} className="profile-avatar-icon" />
            <div>
              <h1 className="profile-title">My Profile</h1>
              <p className="profile-subtitle">Manage your personal information and preferences.</p>
            </div>
          </div>

          {message && <div className="alert-success">{message}</div>}
          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-grid">
              
              <div className="input-group">
                <label htmlFor="name" className="input-label">
                  <User size={16} /> Full Name
                </label>
                <input type="text" id="name" className="modern-input" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label htmlFor="email" className="input-label">
                  <Mail size={16} /> Email Address
                </label>
                <input type="email" id="email" className="modern-input" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  <Shield size={16} /> New Password
                </label>
                <input type="password" id="password" className="modern-input" placeholder="Leave blank to keep current" value={formData.password} onChange={handleChange} />
              </div>

              <div className="input-group">
                <label htmlFor="age" className="input-label">
                  <Calendar size={16} /> Age
                </label>
                <input type="number" id="age" className="modern-input" value={formData.age} onChange={handleChange} />
              </div>

              <div className="input-group">
                <label htmlFor="qualification" className="input-label">
                  <Award size={16} /> Highest Qualification
                </label>
                <select id="qualification" className="modern-input select-input" value={formData.qualification} onChange={handleChange}>
                  <option value="">Select Qualification</option>
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post-Graduate">Post-Graduate</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="category" className="input-label">
                  <Briefcase size={16} /> Category
                </label>
                <select id="category" className="modern-input select-input" value={formData.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="graduationYear" className="input-label">
                  <Calendar size={16} /> Graduation Year
                </label>
                <input type="number" id="graduationYear" className="modern-input" value={formData.graduationYear} onChange={handleChange} />
              </div>

              <div className="input-group">
                <label htmlFor="state" className="input-label">
                  <MapPin size={16} /> State
                </label>
                <input type="text" id="state" className="modern-input" value={formData.state} onChange={handleChange} />
              </div>

              <div className="input-group">
                <label htmlFor="profession" className="input-label">
                  <Briefcase size={16} /> Current Profession
                </label>
                <select id="profession" className="modern-input select-input" value={formData.profession} onChange={handleChange}>
                  <option value="">Select Profession</option>
                  <option value="Student">Student</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="Full-Time Aspirant">Full-Time Aspirant</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="dailyStudyHours" className="input-label">
                  <Clock size={16} /> Daily Study Hours
                </label>
                <input type="number" id="dailyStudyHours" className="modern-input" placeholder="e.g. 4" min="1" max="24" value={formData.dailyStudyHours} onChange={handleChange} />
              </div>

            </div>
            
            <div className="profile-actions">
              <Button type="submit" variant="primary" className="save-btn" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
