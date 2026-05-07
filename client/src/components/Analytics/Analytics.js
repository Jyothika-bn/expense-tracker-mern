import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { token, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    categoryStats: [],
    totalAmount: 0,
    totalTransactions: 0,
    averagePerTransaction: 0,
    averagePerCategory: 0
  });
  const [timeFilter, setTimeFilter] = useState({
    year: '',
    month: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Only add year/month params if they have values
      if (timeFilter.year && timeFilter.year !== '') {
        params.append('year', timeFilter.year);
      }
      if (timeFilter.month && timeFilter.month !== '') {
        params.append('month', timeFilter.month);
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      console.log('Fetching analytics with params:', params.toString());
      const response = await axios.get(`/api/expenses/stats?${params}`, config);
      console.log('Analytics response:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, [timeFilter, token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchAnalytics();
    }
  }, [fetchAnalytics, isAuthenticated, token]);


  const handleFilterChange = (e) => {
    setTimeFilter({ ...timeFilter, [e.target.name]: e.target.value });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getCategoryColors = () => {
    const colors = [
      '#667eea',
      '#764ba2',
      '#f093fb',
      '#f5576c',
      '#4facfe',
      '#00f2fe',
      '#43e97b',
      '#38f9d7',
      '#ffecd2',
      '#fcb69f'
    ];
    return colors;
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

  const barChartData = {
    labels: stats.categoryStats.map(stat => stat._id),
    datasets: [
      {
        label: 'Amount Spent',
        data: stats.categoryStats.map(stat => stat.total),
        backgroundColor: getCategoryColors().slice(0, stats.categoryStats.length),
        borderColor: getCategoryColors().slice(0, stats.categoryStats.length),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const pieChartData = {
    labels: stats.categoryStats.map(stat => stat._id),
    datasets: [
      {
        data: stats.categoryStats.map(stat => stat.total),
        backgroundColor: getCategoryColors().slice(0, stats.categoryStats.length),
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 10
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#667eea',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${formatCurrency(context.parsed)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#667eea',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
          }
        }
      }
    }
  };

  const months = [
    { value: '', label: 'All Year' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const years = [{ value: '', label: 'All Years' }];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push({ value: i, label: i.toString() });
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="loading">
        <p>Please log in to view analytics</p>
      </div>
    );
  }

  return (
    <div className="analytics">
      <div className="container">
        <div className="page-header">
          <h1>
            <i className="fas fa-chart-bar"></i>
            Expense Analytics
          </h1>
          <p>Visualize your spending patterns and insights</p>
        </div>

        <div className="analytics-filters">
          <div className="filter-group">
            <label>Year</label>
            <select
              name="year"
              value={timeFilter.year}
              onChange={handleFilterChange}
              className="form-control"
            >
              {years.map(year => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Month</label>
            <select
              name="month"
              value={timeFilter.month}
              onChange={handleFilterChange}
              className="form-control"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="analytics-summary">
          <div className="summary-card">
            <div className="summary-icon">
              <i className="fas fa-rupee-sign"></i>
            </div>
            <div className="summary-content">
              <h3>Total Expenses</h3>
              <p className="summary-value">{formatCurrency(stats.totalAmount)}</p>
              <span className="summary-period">
                {timeFilter.month && timeFilter.year
                  ? `${months.find(m => m.value === timeFilter.month)?.label} ${timeFilter.year}`
                  : timeFilter.year || 'All Time'
                }
              </span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <i className="fas fa-tags"></i>
            </div>
            <div className="summary-content">
              <h3>Categories</h3>
              <p className="summary-value">{stats.categoryStats.length}</p>
              <span className="summary-period">Active categories</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <i className="fas fa-crown"></i>
            </div>
            <div className="summary-content">
              <h3>Top Category</h3>
              <p className="summary-value">
                {stats.categoryStats.length > 0 ? stats.categoryStats[0]._id : 'None'}
              </p>
              <span className="summary-period">
                {stats.categoryStats.length > 0 
                  ? formatCurrency(stats.categoryStats[0].total)
                  : 'No data'
                }
              </span>
            </div>
          </div>
        </div>

        {stats.categoryStats.length > 0 ? (
          <div className="analytics-content">
            <div className="chart-section">
              <div className="chart-card">
                <h3>
                  <i className="fas fa-chart-bar"></i>
                  Spending by Category
                </h3>
                <div className="chart-container">
                  <Bar data={barChartData} options={chartOptions} />
                </div>
              </div>

              <div className="chart-card">
                <h3>
                  <i className="fas fa-chart-pie"></i>
                  Expense Distribution
                </h3>
                <div className="chart-container">
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              </div>
            </div>

            <div className="category-breakdown">
              <h3>
                <i className="fas fa-list-alt"></i>
                Category Breakdown
              </h3>
              <div className="breakdown-list">
                {stats.categoryStats.map((category, index) => {
                  const percentage = ((category.total / stats.totalAmount) * 100).toFixed(1);
                  return (
                    <div key={category._id} className="breakdown-item">
                      <div className="breakdown-info">
                        <div className="breakdown-icon">
                          <i className={getCategoryIcon(category._id)}></i>
                        </div>
                        <div className="breakdown-details">
                          <h4>{category._id}</h4>
                          <p>{category.count} transactions</p>
                        </div>
                      </div>
                      <div className="breakdown-stats">
                        <div className="breakdown-amount">{formatCurrency(category.total)}</div>
                        <div className="breakdown-percentage">{percentage}%</div>
                        <div 
                          className="breakdown-bar"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: getCategoryColors()[index]
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-analytics">
            <i className="fas fa-chart-bar"></i>
            <h3>No Data Available</h3>
            <p>No expenses found for the selected time period.</p>
            <p>Try selecting a different time range or add some expenses to see analytics.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
