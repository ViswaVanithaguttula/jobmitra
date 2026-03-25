import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import './Navbar.css';
import Button from './Button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  const publicLinks = [
    { name: 'Features', path: '/#features', isAnchor: true }
  ];

  const appLinks = [
    { name: 'Dashboard', path: '/home' },
    { name: 'Eligibility', path: '/check-eligibility' },
    { name: 'Exams', path: '/eligible-exams' },
    { name: 'Strategy', path: '/strategy' },
    { name: 'Profile', path: '/profile' }
  ];

  let isAdmin = false;
  const userStr = localStorage.getItem('jobmitra_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      isAdmin = user.isAdmin;
    } catch(e) {}
  }

  if (isAdmin && !isPublicPage) {
    appLinks.push({ name: 'Admin', path: '/admin' });
  }

  const currentLinks = isPublicPage ? publicLinks : appLinks;

  const handleLinkClick = (e, link) => {
    setMobileMenuOpen(false);
    if (link.isAnchor) {
      e.preventDefault();
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar">
        <Link to="/" className="navbar-logo">
          Job<span>Mitra</span>
        </Link>
        
        <div className="desktop-menu">
          <nav className="nav-links">
            {currentLinks.map((link) => (
              link.isAnchor ? (
                <a 
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link)}
                >
                  {link.name}
                </a>
              ) : (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={location.pathname === link.path ? 'active' : ''}
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>
          <div className="nav-actions">
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Dark Mode">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {isPublicPage ? (
              <>
                <Link to="/login"><Button variant="outline" size="sm">Login</Button></Link>
                <Link to="/register"><Button variant="primary" size="sm">Register</Button></Link>
              </>
            ) : (
              <Link to="/">
                <Button variant="outline" size="sm" className="btn-icon-right">
                  <LogOut size={16} /> Logout
                </Button>
              </Link>
            )}
          </div>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav-links">
            {currentLinks.map((link) => (
              link.isAnchor ? (
                <a 
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link)}
                >
                  {link.name}
                </a>
              ) : (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={location.pathname === link.path ? 'active' : ''}
                >
                  {link.name}
                </Link>
              )
            ))}
            <div className="mobile-nav-actions">
              {isPublicPage ? (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                </>
              ) : (
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-orange">Logout</Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
