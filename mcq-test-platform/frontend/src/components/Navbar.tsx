import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './NavbarPremium.css';

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      <nav className="navbar-professional">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            MCQ Platform
          </Link>

          {user && (
            <>
              <button
                className="mobile-menu-toggle"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button>

              <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
                <div className="navbar-links">
                  {isAdmin() ? (
                    <>
                      <Link
                        to="/admin"
                        className={`navbar-link ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/questions"
                        className={`navbar-link ${isActive('/admin/questions') ? 'active' : ''}`}
                      >
                        Questions
                      </Link>
                      <Link
                        to="/admin/test-modules"
                        className={`navbar-link ${isActive('/admin/test-modules') ? 'active' : ''}`}
                      >
                        Test Modules
                      </Link>
                      <Link
                        to="/admin/users"
                        className={`navbar-link ${isActive('/admin/users') ? 'active' : ''}`}
                      >
                        Users
                      </Link>
                      <Link
                        to="/admin/pending-users"
                        className={`navbar-link ${isActive('/admin/pending-users') ? 'active' : ''}`}
                      >
                        Pending
                      </Link>
                      <Link
                        to="/admin/reports"
                        className={`navbar-link ${isActive('/admin/reports') ? 'active' : ''}`}
                      >
                        Reports
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/"
                        className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/tests"
                        className={`navbar-link ${isActive('/tests') ? 'active' : ''}`}
                      >
                        Available Tests
                      </Link>
                      <Link
                        to="/history"
                        className={`navbar-link ${isActive('/history') ? 'active' : ''}`}
                      >
                        Test History
                      </Link>
                      <Link
                        to="/reports"
                        className={`navbar-link ${isActive('/reports') ? 'active' : ''}`}
                      >
                        Reports
                      </Link>
                    </>
                  )}
                </div>

                <div className="navbar-user">
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-role text-muted">{isAdmin() ? 'Administrator' : 'Student'}</span>
                  </div>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
      {mobileMenuOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
          }}
        />
      )}
    </>
  );
};

export default Navbar;