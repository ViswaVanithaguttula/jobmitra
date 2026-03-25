import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
// NOTE: We will create these next
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckEligibilityPage from './pages/CheckEligibilityPage';
import EligibleExamsPage from './pages/EligibleExamsPage';
import StrategyPlannerPage from './pages/StrategyPlannerPage';
import BackupExamsPage from './pages/BackupExamsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';

import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="page-wrapper">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/check-eligibility" element={<CheckEligibilityPage />} />
            <Route path="/eligible-exams" element={<EligibleExamsPage />} />
            <Route path="/strategy" element={<StrategyPlannerPage />} />
            <Route path="/backup-exams" element={<BackupExamsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
