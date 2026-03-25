import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, List, Map } from 'lucide-react';
import Button from '../components/Button';
import './HomePage.css';

const HomePage = () => {
  const [userName, setUserName] = useState("Aspirant");

  useEffect(() => {
    const userStr = localStorage.getItem('jobmitra_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.name) {
          // Extract first name
          setUserName(user.name.split(' ')[0]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <div className="home-page container">
      {/* Banner Area */}
      <section className="dashboard-banner card">
        <div className="banner-content">
          <h1 className="banner-title">Welcome back, {userName}!</h1>
          <p className="banner-tagline">Your personalized government job preparation dashboard.</p>
          <div className="banner-actions">
            <Link to="/check-eligibility">
              <Button variant="primary">Check Eligibility</Button>
            </Link>
            <Link to="/strategy">
              <Button variant="secondary">Plan Strategy</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions / Feature Shortcuts */}
      <section className="quick-actions-section">
        <h2 className="section-title text-left">Quick Actions</h2>
        <div className="quick-actions-grid md:grid-cols-3">
          
          <Link to="/check-eligibility" className="shortcut-card card">
            <div className="sc-icon-wrapper bg-blue-light">
              <CheckSquare className="sc-icon text-blue" size={28} />
            </div>
            <h3>Check Eligibility</h3>
            <p>Find out which exams you can apply for based on your profile.</p>
          </Link>

          <Link to="/eligible-exams" className="shortcut-card card">
            <div className="sc-icon-wrapper bg-orange-light">
              <List className="sc-icon text-orange" size={28} />
            </div>
            <h3>Get Exam Details</h3>
            <p>Browse through syllabus, age limits, and required qualifications.</p>
          </Link>

          <Link to="/backup-exams" className="shortcut-card card">
            <div className="sc-icon-wrapper bg-blue-light">
              <Map className="sc-icon text-blue" size={28} />
            </div>
            <h3>Find Backup Exams</h3>
            <p>Discover alternative exams with similar preparation syllabus.</p>
          </Link>

        </div>
      </section>

      {/* Recent Updates Area (Static Mock) */}
      <section className="updates-section">
        <div className="updates-box card">
          <h3 className="updates-title">Latest Updates</h3>
          <ul className="updates-list">
            <li>
              <span className="update-date">May 15</span>
              <span>UPSC CSE 2024 Notification Released. Last date to apply is June 5.</span>
            </li>
            <li>
              <span className="update-date">May 12</span>
              <span>SSC CGL Tier 1 Exam Dates announced. Start your revision.</span>
            </li>
            <li>
              <span className="update-date">May 10</span>
              <span>IBPS PO Final Results declared. Check out the backup exams list if needed.</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
