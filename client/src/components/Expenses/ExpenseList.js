import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Expenses.css';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [editingExpense, setEditingExpense] = useState(null);

  const categories = [
    'All',
    'Food',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills',
    'Healthcare',
    'Education',
    'Travel',
    'Other'
  ];

  useEffect(() => {
    fetchExpenses();
  }, [filters, pagination.currentPage]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 10,
        ...(filters.category !== 'All' && { category: filters.category }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await axios.get(`/api/expenses?${params}`);
      setExpenses(response.data.expenses);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`/api/expenses/${id}`);
        toast.success('Expense deleted successfully');
        fetchExpenses();
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense({
      ...expense,
      date: new Date(expense.date).toISOString().split('T')[0]
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/expenses/${editingExpense._id}`, {
        title: editingExpense.title,
        amount: parseFloat(editingExpense.amount),
        category: editingExpense.category,
        description: editingExpense.description,
        date: editingExpense.date
      });
      toast.success('Expense updated successfully');
      setEditingExpense(null);
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to update expense');
    }
  };

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

  const clearFilters = () => {
    setFilters({
      category: 'All',
      startDate: '',
      endDate: ''
    });
    setPagination({ ...pagination, currentPage: 1 });
  };

  return (
    <div className="expense-list">
      <div className="container">
        <div className="page-header">
          <h1>
            <i className="fas fa-list"></i>
            My Expenses
          </h1>
          <Link to="/add-expense" className="btn btn-primary">
            <i className="fas fa-plus"></i>
            Add Expense
          </Link>
        </div>

        <div className="filters-section">
          <div className="filters">
            <div className="filter-group">
              <label>Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="form-control"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>

            <div className="filter-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>

            <button onClick={clearFilters} className="btn btn-secondary">
              <i className="fas fa-times"></i>
              Clear
            </button>
          </div>

          <div className="results-info">
            <span>Showing {expenses.length} of {pagination.total} expenses</span>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="expenses-grid">
              {expenses.map((expense) => (
                <div key={expense._id} className="expense-card">
                  <div className="expense-header">
                    <div className="expense-icon">
                      <i className={getCategoryIcon(expense.category)}></i>
                    </div>
                    <div className="expense-actions">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="btn-icon"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="btn-icon delete"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="expense-content">
                    <h3>{expense.title}</h3>
                    <p className="expense-category">{expense.category}</p>
                    <p className="expense-date">{formatDate(expense.date)}</p>
                    {expense.description && (
                      <p className="expense-description">{expense.description}</p>
                    )}
                  </div>
                  
                  <div className="expense-amount">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
              ))}
            </div>

            {expenses.length === 0 && (
              <div className="empty-state">
                <i className="fas fa-receipt"></i>
                <h3>No expenses found</h3>
                <p>Start tracking your expenses by adding your first one!</p>
                <Link to="/add-expense" className="btn btn-primary">
                  <i className="fas fa-plus"></i>
                  Add Your First Expense
                </Link>
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="btn btn-secondary"
                >
                  <i className="fas fa-chevron-left"></i>
                  Previous
                </button>
                
                <span className="page-info">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="btn btn-secondary"
                >
                  Next
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {editingExpense && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Expense</h3>
              <button
                onClick={() => setEditingExpense(null)}
                className="btn-icon"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="modal-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editingExpense.title}
                  onChange={(e) => setEditingExpense({
                    ...editingExpense,
                    title: e.target.value
                  })}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={editingExpense.amount}
                  onChange={(e) => setEditingExpense({
                    ...editingExpense,
                    amount: e.target.value
                  })}
                  className="form-control"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={editingExpense.category}
                  onChange={(e) => setEditingExpense({
                    ...editingExpense,
                    category: e.target.value
                  })}
                  className="form-control"
                  required
                >
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={editingExpense.date}
                  onChange={(e) => setEditingExpense({
                    ...editingExpense,
                    date: e.target.value
                  })}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingExpense.description}
                  onChange={(e) => setEditingExpense({
                    ...editingExpense,
                    description: e.target.value
                  })}
                  className="form-control"
                  rows="3"
                />
              </div>
              
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
