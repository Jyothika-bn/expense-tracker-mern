const express = require('express');
const { body, validationResult } = require('express-validator');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/expenses
// @desc    Get all expenses for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    let query = { user: req.user.id };
    
    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Expense.countDocuments(query);
    
    res.json({
      expenses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/expenses/stats
// @desc    Get expense statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    console.log('=== STATS API CALLED ===');
    console.log('User ID:', req.user.id);
    console.log('Query params:', req.query);
    
    // Build match query with optional date filtering
    let matchQuery = { user: req.user.id };
    
    // Add date filtering if year/month provided
    if (req.query.year && req.query.year !== 'undefined' && req.query.year !== '') {
      const year = parseInt(req.query.year) || new Date().getFullYear();
      const month = req.query.month && req.query.month !== '' ? parseInt(req.query.month) : null;
      
      if (month) {
        // Filter by specific month and year
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        matchQuery.date = { $gte: startDate, $lte: endDate };
      } else {
        // Filter by year only
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);
        matchQuery.date = { $gte: startDate, $lte: endDate };
      }
    }
    
    console.log('Match query:', matchQuery);
    
    // Get all expenses for this user with filtering
    const expensesData = await Expense.find(matchQuery);
    console.log('Filtered expenses count:', expensesData.length);
    
    // Calculate total manually as backup
    const manualTotal = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
    console.log('Manual total calculation:', manualTotal);
    
    // Define all possible categories
    const allCategories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Travel', 'Other'];
    
    // Calculate category stats
    const categoryStats = allCategories.map(category => {
      const categoryExpenses = expensesData.filter(exp => exp.category === category);
      const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      return {
        _id: category,
        total: total,
        count: categoryExpenses.length
      };
    }).filter(cat => cat.count > 0); // Only show categories with expenses
    
    // Sort by total amount
    categoryStats.sort((a, b) => b.total - a.total);
    
    // Get total expenses with same filtering
    const totalExpenses = await Expense.aggregate([
      { $match: matchQuery },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    console.log('Category stats result:', categoryStats);
    console.log('Aggregation total result:', totalExpenses);
    
    // Calculate additional statistics
    const totalTransactions = expensesData.length;  // Use the actual count of expenses
    const averagePerCategory = categoryStats.length > 0 ? (totalExpenses[0]?.total || manualTotal) / categoryStats.length : 0;

    const result = {
      categoryStats: categoryStats,
      totalAmount: totalExpenses[0]?.total || manualTotal,
      totalTransactions: totalTransactions,
      averagePerCategory: averagePerCategory
    };
    
    console.log('Final API response:', result);
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/expenses
// @desc    Add new expense
// @access  Private
router.post('/', [
  auth,
  body('title', 'Title is required').notEmpty(),
  body('amount', 'Amount must be a positive number').isFloat({ min: 0.01 }),
  body('category', 'Category is required').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, amount, category, description, date } = req.body;

    const expense = new Expense({
      title,
      amount,
      category,
      description,
      date: date || new Date(),
      user: req.user.id
    });

    await expense.save();
    res.json(expense);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private
router.put('/:id', [
  auth,
  body('title', 'Title is required').notEmpty(),
  body('amount', 'Amount must be a positive number').isFloat({ min: 0.01 }),
  body('category', 'Category is required').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, amount, category, description, date } = req.body;

    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount, category, description, date },
      { new: true }
    );

    res.json(expense);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
