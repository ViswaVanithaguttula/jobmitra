import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      console.log("User logged in:", data);
      localStorage.setItem('jobmitra_user', JSON.stringify(data));
      navigate('/home');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Login to your JobMitra account to continue your preparation.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
            placeholder="Enter your password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />

          <div className="forgot-password">
            <Link to="#" className="text-blue">Forgot Password?</Link>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-4">Login</Button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="text-orange">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
