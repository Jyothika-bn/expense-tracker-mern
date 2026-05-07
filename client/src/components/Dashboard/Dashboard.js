import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { token, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    categoryStats: [],
    totalAmount: 0,
    totalTransactions: 0,
    averagePerTransaction: 0,
    averagePerCategory: 0
  });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const [statsRes, expensesRes] = await Promise.all([
        axios.get('/api/expenses/stats', config),
        axios.get('/api/expenses?limit=5', config)
      ]);
      
      console.log('Dashboard stats data:', statsRes.data);
      console.log('Dashboard expenses data:', expensesRes.data);
      setStats(statsRes.data);
      setRecentExpenses(expensesRes.data.expenses);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [fetchDashboardData, isAuthenticated, token]);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Food: 'fas fa-utensils',
      Transportation: 'fas fa-car',
      Entertainment: 'fas fa-film',
      Shopping: 'fas fa-shopping-bag',
      Bills: 'fas fa-file-invoice',
      Healthcare: 'fas fa-heartbeat',
      Education: 'fas fa-graduation-cap',
      Travel: 'fas fa-plane',
      Other: 'fas fa-ellipsis-h'
    };
    return icons[category] || 'fas fa-circle';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>
            <i className="fas fa-tachometer-alt"></i>
            Dashboard
          </h1>
          <p>Welcome back! Here's your expense overview.</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card total-expenses">
            <div className="stat-icon">
              <i className="fas fa-rupee-sign"></i>
            </div>
            <div className="stat-content">
              <h3>Total Expenses</h3>
              <p className="stat-value">{formatCurrency(stats.totalAmount)}</p>
              <span className="stat-period">This month</span>
            </div>
          </div>

          <div className="stat-card total-categories">
            <div className="stat-icon">
              <i className="fas fa-tags"></i>
            </div>
            <div className="stat-content">
              <h3>Categories</h3>
              <p className="stat-value">{stats.categoryStats.length}</p>
              <span className="stat-period">Active categories</span>
            </div>
          </div>

        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>
                <i className="fas fa-chart-pie"></i>
                Top Categories
              </h2>
              <Link to="/analytics" className="btn btn-primary">
                View Analytics
              </Link>
            </div>
            
            <div className="category-list">
              {stats.categoryStats.slice(0, 5).map((category, index) => (
                <div key={category._id || index} className="category-item">
                  <div className="category-info">
                    <i className={getCategoryIcon(category._id)}></i>
                    <span className="category-name">{category._id}</span>
                  </div>
                  <div className="category-stats">
                    <span className="category-amount">{formatCurrency(category.total || 0)}</span>
                    <span className="category-count">{category.count || 0} transactions</span>
                  </div>
                </div>
              ))}
              {stats.categoryStats.length === 0 && (
                <div className="empty-state">
                  <i className="fas fa-chart-pie"></i>
                  <p>No expense categories yet</p>
                  <Link to="/add-expense" className="btn btn-primary">
                    Add Your First Expense
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>
                <i className="fas fa-clock"></i>
                Recent Expenses
              </h2>
              <Link to="/expenses" className="btn btn-primary">
                View All
              </Link>
            </div>
            
            <div className="expense-list">
              {recentExpenses.map((expense) => (
                <div key={expense._id} className="expense-item">
                  <div className="expense-icon">
                    <i className={getCategoryIcon(expense.category)}></i>
                  </div>
                  <div className="expense-details">
                    <h4>{expense.title}</h4>
                    <p>{expense.category} • {formatDate(expense.date)}</p>
                  </div>
                  <div className="expense-amount">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
              ))}
              {recentExpenses.length === 0 && (
                <div className="empty-state">
                  <i className="fas fa-receipt"></i>
                  <p>No recent expenses</p>
                  <Link to="/add-expense" className="btn btn-primary">
                    Add Your First Expense
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/add-expense" className="action-btn">
              <i className="fas fa-plus"></i>
              <span>Add Expense</span>
            </Link>
            <Link to="/expenses" className="action-btn">
              <i className="fas fa-list"></i>
              <span>View Expenses</span>
            </Link>
            <Link to="/analytics" className="action-btn">
              <i className="fas fa-chart-bar"></i>
              <span>Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
