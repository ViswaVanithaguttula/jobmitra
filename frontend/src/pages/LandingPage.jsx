import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, BookOpen, Clock, Briefcase, ArrowRight, Star } from 'lucide-react';
import Button from '../components/Button';
import FeatureCard from '../components/FeatureCard';
import './LandingPage.css';

const LandingPage = () => {
  const features = [
    {
      icon: CheckCircle,
      title: 'Eligibility Checker',
      description: 'Quickly find exams you are eligible for based on your precise age and latest qualification.'
    },
    {
      icon: BookOpen,
      title: 'Exam Details',
      description: 'Get deep, actionable insights into syllabus, pattern, and specific physical requirements.'
    },
    {
      icon: Clock,
      title: 'Strategy Planner',
      description: 'Create hyper-customized weekly study schedules to maximize your preparation efficiency.'
    },
    {
      icon: Briefcase,
      title: 'Backup Suggestions',
      description: 'Discover alternative exams with similar syllabus to secure your career effortlessly.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-shapes"></div>
        <div className="hero-floating-elements">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
        </div>
        
        <div className="container hero-content">
          <div className="hero-text-area fade-up-anim">
            <div className="hero-badge animate-pulse">
              <Star size={16} className="text-orange" />
              <span>The #1 Govt Job Prep Platform</span>
            </div>
            <h1 className="hero-title">
              Plan <span className="text-orange">Smart.</span><br />
              Qualify <span className="text-blue">Right.</span>
            </h1>
            <p className="hero-subtitle">
              Stop guessing your career path. JobMitra is your ultimate companion to find the right exams, check eligibility, and prepare using adaptive personalized strategies.
            </p>
            <div className="hero-actions">
              <Link to="/register">
                <Button variant="primary" size="lg" className="btn-icon-right hero-btn-glow">
                  Start For Free <ArrowRight size={20} />
                </Button>
              </Link>
              <a href="#features" onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <Button variant="outline" size="lg" className="hero-btn-outline">See How It Works</Button>
              </a>
            </div>
            
            <div className="hero-stats mt-4">
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Exams Covered</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Active Aspirants</span>
              </div>
            </div>
          </div>
          
          <div className="hero-image-area fade-up-anim-delay">
            <div className="hero-mockup glass">
              <div className="mockup-header">
                <div className="mockup-dots"><span></span><span></span><span></span></div>
              </div>
              <div className="mockup-body">
                <div className="mockup-stats">
                  <div className="stat-circle flex-center">
                    <span className="text-blue percent-text">85%</span>
                  </div>
                  <div className="stat-lines">
                    <div className="line line-1 highlight"></div>
                    <div className="line line-2"></div>
                    <div className="line line-3"></div>
                  </div>
                </div>
                
                <h4 className="mockup-subtitle">Your Recommended Exams</h4>
                <div className="mockup-cards">
                  <div className="m-card interactive">
                    <div className="m-icon bg-blue"></div>
                    <div className="m-text">
                      <div className="m-title">UPSC CSE</div>
                      <div className="m-desc">Match: 92%</div>
                    </div>
                  </div>
                  <div className="m-card interactive">
                    <div className="m-icon bg-orange"></div>
                    <div className="m-text">
                      <div className="m-title">SSC CGL</div>
                      <div className="m-desc">Match: 88%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header text-center fade-up-anim">
            <h2 className="section-title text-gradient">Master Your Preparation</h2>
            <p className="section-desc">We analyzed thousands of success stories to bring you these comprehensive tools.</p>
          </div>
          <div className="features-grid md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div className="fade-up-anim-delay" style={{animationDelay: `${index * 0.15}s`}} key={index}>
                <FeatureCard 
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container text-center">
          <div className="cta-box card glass">
            <h2>Start Your Govt Job Journey Today</h2>
            <p>Join thousands of aspirants who are planning smart with JobMitra.</p>
            <div className="flex-center mt-2">
              <Link to="/register">
                <Button variant="secondary" size="lg" className="hero-btn-glow">Create Free Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
