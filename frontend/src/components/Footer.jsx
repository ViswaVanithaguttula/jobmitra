import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Job<span>Mitra</span>
          </Link>
          <p className="footer-desc">
            Plan Smart. Qualify Right. Find the right government exams and prepare efficiently.
          </p>
        </div>
        <div className="footer-links-group">
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/home">Dashboard</Link></li>
              <li><Link to="/check-eligibility">Eligibility Checker</Link></li>
              <li><Link to="/strategy">Strategy Planner</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h3>Exams</h3>
            <ul>
              <li><Link to="/eligible-exams">UPSC</Link></li>
              <li><Link to="/eligible-exams">SSC</Link></li>
              <li><Link to="/eligible-exams">Banking</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container flex-center">
          <p>&copy; {new Date().getFullYear()} JobMitra. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
