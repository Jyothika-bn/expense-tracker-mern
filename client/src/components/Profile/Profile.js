import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user, token, loadUser, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const { name, email, currentPassword, newPassword, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      await axios.put('/api/auth/profile', { name, email }, config);
      toast.success('Profile updated successfully!');
      loadUser();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }

    setLoading(false);
  };

  const onSubmitPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      await axios.put('/api/auth/password', { 
        currentPassword, 
        newPassword 
      }, config);
      
      toast.success('Password updated successfully!');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    }

    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <span className="profile-badge">
              <i className="fas fa-calendar"></i>
              Member since {new Date(user.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long'
              })}
            </span>
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <i className="fas fa-user"></i>
            Profile Info
          </button>
          <button
            className={`tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <i className="fas fa-lock"></i>
            Change Password
          </button>
          <button
            className={`tab ${activeTab === 'logout' ? 'active' : ''}`}
            onClick={() => setActiveTab('logout')}
          >
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'info' && (
            <div className="profile-section">
              <h2>
                <i className="fas fa-edit"></i>
                Edit Profile Information
              </h2>
              <form onSubmit={onSubmitProfile} className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">
                    <i className="fas fa-user"></i>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="fas fa-envelope"></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Update Profile
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="profile-section">
              <h2>
                <i className="fas fa-key"></i>
                Change Password
              </h2>
              <form onSubmit={onSubmitPassword} className="profile-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">
                    <i className="fas fa-lock"></i>
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">
                    <i className="fas fa-key"></i>
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Enter new password"
                    required
                    minLength="6"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <i className="fas fa-check"></i>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Confirm new password"
                    required
                    minLength="6"
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Update Password
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'logout' && (
            <div className="profile-section logout-section">
              <h2>
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </h2>
              <p>Are you sure you want to logout from your account?</p>
              <div className="logout-actions">
                <button
                  onClick={handleLogout}
                  className="btn btn-danger"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Yes, Logout
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className="btn btn-secondary"
                >
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
