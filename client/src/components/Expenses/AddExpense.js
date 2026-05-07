import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import './Expenses.css';

const AddExpense = () => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: new Date()
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
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

  const { title, amount, category, description, date } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !amount || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/expenses', {
        title,
        amount: parseFloat(amount),
        category,
        description,
        date
      });

      toast.success('Expense added successfully!');
      navigate('/expenses');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="add-expense">
      <div className="container">
        <div className="page-header">
          <h1>
            <i className="fas fa-plus"></i>
            Add New Expense
          </h1>
          <p>Track your spending by adding a new expense</p>
        </div>

        <div className="expense-form-container">
          <form onSubmit={onSubmit} className="expense-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">
                  <i className="fas fa-tag"></i>
                  Expense Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={onChange}
                  className="form-control"
                  placeholder="e.g., Lunch at restaurant"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">
                  <i className="fas fa-rupee-sign"></i>
                  Amount *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={amount}
                  onChange={onChange}
                  className="form-control"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">
                  <i className="fas fa-list"></i>
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={onChange}
                  className="form-control"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-calendar"></i>
                  Date *
                </label>
                <DatePicker
                  selected={date}
                  onChange={onDateChange}
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date()}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">
                <i className="fas fa-comment"></i>
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={onChange}
                className="form-control"
                placeholder="Add any additional notes about this expense..."
                rows="3"
              />
            </div>

            {category && (
              <div className="category-preview">
                <div className="preview-icon">
                  <i className={getCategoryIcon(category)}></i>
                </div>
                <span>Category: {category}</span>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/expenses')}
                className="btn btn-secondary"
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus"></i>
                    Add Expense
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="expense-tips">
            <h3>
              <i className="fas fa-lightbulb"></i>
              Tips for Better Expense Tracking
            </h3>
            <ul>
              <li>
                <i className="fas fa-check"></i>
                Add expenses as soon as possible to avoid forgetting
              </li>
              <li>
                <i className="fas fa-check"></i>
                Use descriptive titles to easily identify expenses later
              </li>
              <li>
                <i className="fas fa-check"></i>
                Choose the most appropriate category for better analytics
              </li>
              <li>
                <i className="fas fa-check"></i>
                Add descriptions for unusual or important expenses
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
