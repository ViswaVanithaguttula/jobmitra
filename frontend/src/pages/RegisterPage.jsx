import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import SelectDropdown from '../components/SelectDropdown';
import Button from '../components/Button';
import './RegisterPage.css';

const RegisterPage = () => {
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
    otherState: ''
  });

  const ageOptions = Array.from({ length: 23 }, (_, i) => `${i + 18}`);
  const qualOptions = ['10th Pass', '12th Pass', 'Graduate (Any Stream)', 'B.Tech/B.E.', 'Post Graduate', 'Diploma'];
  const catOptions = ['General', 'OBC', 'SC', 'ST', 'EWS'];
  const stateOptions = ['Andhra Pradesh', 'Delhi', 'Karnataka', 'Kerala', 'Maharashtra', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map otherState into state if "Other" is selected
      const finalData = { ...formData };
      if (finalData.state === 'Other') {
        finalData.state = finalData.otherState;
      }
      
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      console.log("User registered:", data);
      localStorage.setItem('jobmitra_user', JSON.stringify(data));
      navigate('/login');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header">
          <h2 className="auth-title">Create an Account</h2>
          <p className="auth-subtitle">Join JobMitra to supercharge your govt job preparation.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <InputField 
            label="Full Name" 
            id="name" 
            placeholder="e.g. Rahul Sharma" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
          <InputField 
            label="Email Address" 
            id="email" 
            type="email" 
            placeholder="rahul@example.com" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <InputField 
            label="Password" 
            id="password" 
            type="password" 
            placeholder="Min. 8 characters" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />

          <div className="form-row">
            <SelectDropdown 
              label="Age" 
              id="age" 
              options={ageOptions} 
              value={formData.age} 
              onChange={handleChange} 
              required 
            />
            <SelectDropdown 
              label="Qualification" 
              id="qualification" 
              options={qualOptions} 
              value={formData.qualification} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-row">
            <SelectDropdown 
              label="Category" 
              id="category" 
              options={catOptions} 
              value={formData.category} 
              onChange={handleChange} 
              required 
            />
            <SelectDropdown 
              label="State" 
              id="state" 
              options={stateOptions} 
              value={formData.state} 
              onChange={handleChange} 
              required 
            />
          </div>

          {formData.state === 'Other' && (
            <InputField 
              label="Please Specify Your State" 
              id="otherState" 
              placeholder="Enter state name" 
              value={formData.otherState} 
              onChange={handleChange} 
              required={formData.state === 'Other'} 
            />
          )}
          
          <InputField 
            label="Graduation Year (Optional)" 
            id="graduationYear" 
            type="number" 
            placeholder="e.g. 2023" 
            value={formData.graduationYear} 
            onChange={handleChange} 
          />

          <Button type="submit" variant="primary" className="w-full mt-4">Sign Up</Button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="text-orange">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
