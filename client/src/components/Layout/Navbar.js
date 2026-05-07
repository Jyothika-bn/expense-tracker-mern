import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/">
            <i className="fas fa-wallet"></i>
            <span>Expense Tracker</span>
          </Link>
        </div>
        
        {isAuthenticated ? (
          <div className="navbar-nav">
            <Link to="/dashboard" className="nav-link">
              <i className="fas fa-tachometer-alt"></i>
              Dashboard
            </Link>
            <Link to="/expenses" className="nav-link">
              <i className="fas fa-list"></i>
              Expenses
            </Link>
            <Link to="/add-expense" className="nav-link">
              <i className="fas fa-plus"></i>
              Add Expense
            </Link>
            <Link to="/analytics" className="nav-link">
              <i className="fas fa-chart-bar"></i>
              Analytics
            </Link>
            <Link to="/profile" className="nav-link">
              <i className="fas fa-user-circle"></i>
              Profile
            </Link>
          </div>
        ) : (
          <div className="navbar-nav">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
