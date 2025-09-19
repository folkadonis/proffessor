import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
          MCQ Test Platform
        </Link>

        {user && (
          <>
            <button
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>

            <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
              {isAdmin() ? (
                <>
                  <Link to="/admin" onClick={closeMobileMenu}>Dashboard</Link>
                  <Link to="/admin/questions" onClick={closeMobileMenu}>Questions</Link>
                  <Link to="/admin/test-modules" onClick={closeMobileMenu}>Tests</Link>
                  <Link to="/admin/users" onClick={closeMobileMenu}>Users</Link>
                  <Link to="/admin/pending-users" onClick={closeMobileMenu}>Pending</Link>
                  <Link to="/admin/reports" onClick={closeMobileMenu}>Reports</Link>
                </>
              ) : (
                <>
                  <Link to="/tests" onClick={closeMobileMenu}>Available Tests</Link>
                  <Link to="/history" onClick={closeMobileMenu}>My History</Link>
                  <Link to="/reports" onClick={closeMobileMenu}>My Reports</Link>
                </>
              )}

              <div className="user-info">
                <span>Welcome, {user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;