const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5068;
const SECRET_KEY = 'this-is-a-very-long-secret-key-for-development-only';

// In-memory storage (will reset on server restart)
const users = [];
const expenses = [];
const budgets = [];

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Helper function to create standardized API responses
const apiResponse = (success, data, message, errors = []) => ({
  success,
  data,
  message,
  timestamp: new Date().toISOString(),
  errors
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json(apiResponse(false, null, 'Invalid or missing token.'));
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json(apiResponse(false, null, 'Invalid or missing token.'));
    }
    req.user = user;
    next();
  });
};

// ============ AUTH ROUTES ============

// Register
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json(apiResponse(false, null, 'All fields are required.'));
    }

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json(apiResponse(false, null, 'User with this email already exists.'));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(user);

    res.status(201).json(apiResponse(true, null, 'User registered successfully.'));
  } catch (error) {
    res.status(500).json(apiResponse(false, null, 'Registration failed.', [error.message]));
  }
});

// Login
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json(apiResponse(false, null, 'Invalid email or password.'));
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json(apiResponse(false, null, 'Invalid email or password.'));
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '24h', issuer: 'ExpenseTrackerApp', audience: 'ExpenseTrackerUsers' }
    );

    const response = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      auth: {
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    };

    res.json(apiResponse(true, response, 'Login successful.'));
  } catch (error) {
    res.status(500).json(apiResponse(false, null, 'Login failed.', [error.message]));
  }
});

// Get current user
app.get('/api/v1/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json(apiResponse(false, null, 'User not found.'));
  }

  const userProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };

  res.json(apiResponse(true, userProfile, 'User retrieved successfully.'));
});

// Logout
app.post('/api/v1/auth/logout', authenticateToken, (req, res) => {
  res.json(apiResponse(true, null, 'Logged out successfully.'));
});

// ============ DASHBOARD ROUTES ============

app.get('/api/v1/dashboard/summary', authenticateToken, (req, res) => {
  // Get REAL user data
  const userExpenses = expenses.filter(e => e.userId === req.user.userId);
  const userGoals = budgets.filter(g => g.userId === req.user.userId && g.type === 'savings');
  
  // Calculate real totals
  const totalExpenses = userExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = userGoals.reduce((sum, g) => sum + (g.currentAmount || 0), 0);
  
  // Calculate category breakdown
  const categoryMap = {};
  userExpenses.forEach(expense => {
    if (!categoryMap[expense.category]) {
      categoryMap[expense.category] = 0;
    }
    categoryMap[expense.category] += expense.amount;
  });
  
  const categoryBreakdown = Object.keys(categoryMap).map(category => ({
    category,
    totalSpent: categoryMap[category]
  }));
  
  // Get recent transactions (last 10)
  const recentTransactions = userExpenses
    .sort((a, b) => new Date(b.dateOfExpense).getTime() - new Date(a.dateOfExpense).getTime())
    .slice(0, 10)
    .map(e => ({
      id: e.id,
      category: e.category,
      amount: e.amount,
      dateOfExpense: e.dateOfExpense,
      description: e.description
    }));
  
  // Calculate daily trend (last 7 days)
  const dailyTrend = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const dayTotal = userExpenses
      .filter(e => e.dateOfExpense.split('T')[0] === dateString)
      .reduce((sum, e) => sum + e.amount, 0);
    
    dailyTrend.push({
      date: dateString,
      amount: dayTotal
    });
  }
  
  // Calculate balance: Starting balance - expenses - savings
  const STARTING_BALANCE = 10000;
  const currentBalance = STARTING_BALANCE - totalExpenses - totalSavings;
  
  const dashboardData = {
    balance: currentBalance,
    startingBalance: STARTING_BALANCE,
    totalExpenses,
    totalSavings,
    budgets: [], // Can add budget tracking later
    categoryBreakdown,
    dailyTrend,
    recentTransactions,
    savingGoals: userGoals.map(g => ({
      id: g.id,
      title: g.title,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount || 0,
      status: g.status
    }))
  };

  res.json(apiResponse(true, dashboardData, 'Dashboard summary retrieved successfully.'));
});

// ============ EXPENSE ROUTES ============

// Get all expenses
app.get('/api/v1/expense/getall', authenticateToken, (req, res) => {
  const userExpenses = expenses.filter(e => e.userId === req.user.userId);
  res.json(apiResponse(true, userExpenses, 'Expenses retrieved successfully.'));
});

// Get expense by ID
app.get('/api/v1/expense/:id', authenticateToken, (req, res) => {
  const expense = expenses.find(e => e.id === req.params.id && e.userId === req.user.userId);
  if (!expense) {
    return res.status(404).json(apiResponse(false, null, 'Expense not found.'));
  }
  res.json(apiResponse(true, expense, 'Expense retrieved successfully.'));
});

// Create expense
app.post('/api/v1/expense', authenticateToken, (req, res) => {
  const { amount, category, description, dateOfExpense, paymentMethod } = req.body;

  if (!amount || !category) {
    return res.status(400).json(apiResponse(false, null, 'Amount and category are required.'));
  }

  const expense = {
    id: Date.now().toString(),
    userId: req.user.userId,
    amount: parseFloat(amount),
    category,
    description: description || '',
    dateOfExpense: dateOfExpense || new Date().toISOString(),
    paymentMethod: paymentMethod || 'Cash',
    createdAt: new Date().toISOString()
  };

  expenses.push(expense);
  res.status(201).json(apiResponse(true, expense, 'Expense created successfully.'));
});

// Update expense
app.put('/api/v1/expense/:id', authenticateToken, (req, res) => {
  const index = expenses.findIndex(e => e.id === req.params.id && e.userId === req.user.userId);
  
  if (index === -1) {
    return res.status(404).json(apiResponse(false, null, 'Expense not found.'));
  }

  const { amount, category, description, dateOfExpense, paymentMethod } = req.body;
  
  expenses[index] = {
    ...expenses[index],
    amount: amount !== undefined ? parseFloat(amount) : expenses[index].amount,
    category: category || expenses[index].category,
    description: description !== undefined ? description : expenses[index].description,
    dateOfExpense: dateOfExpense || expenses[index].dateOfExpense,
    paymentMethod: paymentMethod || expenses[index].paymentMethod,
    updatedAt: new Date().toISOString()
  };

  res.json(apiResponse(true, expenses[index], 'Expense updated successfully.'));
});

// Delete expense
app.delete('/api/v1/expense/:id', authenticateToken, (req, res) => {
  const index = expenses.findIndex(e => e.id === req.params.id && e.userId === req.user.userId);
  
  if (index === -1) {
    return res.status(404).json(apiResponse(false, null, 'Expense not found.'));
  }

  expenses.splice(index, 1);
  res.json(apiResponse(true, null, 'Expense deleted successfully.'));
});

// ============ SAVINGS GOAL ROUTES ============

// Get all savings goals
app.get('/api/v1/savings/getall', authenticateToken, (req, res) => {
  const userGoals = budgets.filter(g => g.userId === req.user.userId && g.type === 'savings');
  res.json(apiResponse(true, userGoals, 'Savings goals retrieved successfully.'));
});

// Get savings goal by ID
app.get('/api/v1/savings/:id', authenticateToken, (req, res) => {
  const goal = budgets.find(g => g.id === req.params.id && g.userId === req.user.userId);
  if (!goal) {
    return res.status(404).json(apiResponse(false, null, 'Savings goal not found.'));
  }
  res.json(apiResponse(true, goal, 'Savings goal retrieved successfully.'));
});

// Create savings goal
app.post('/api/v1/savings', authenticateToken, (req, res) => {
  const { title, targetAmount, description, deadline } = req.body;

  if (!title || !targetAmount) {
    return res.status(400).json(apiResponse(false, null, 'Title and target amount are required.'));
  }

  const goal = {
    id: Date.now().toString(),
    userId: req.user.userId,
    title,
    targetAmount: parseFloat(targetAmount),
    currentAmount: 0,
    description: description || '',
    deadline: deadline || null,
    status: 'Active',
    type: 'savings',
    createdAt: new Date().toISOString()
  };

  budgets.push(goal);
  res.status(201).json(apiResponse(true, goal, 'Savings goal created successfully.'));
});

// Update savings goal
app.put('/api/v1/savings/:id', authenticateToken, (req, res) => {
  const index = budgets.findIndex(g => g.id === req.params.id && g.userId === req.user.userId);
  
  if (index === -1) {
    return res.status(404).json(apiResponse(false, null, 'Savings goal not found.'));
  }

  const { title, targetAmount, description, deadline, status } = req.body;
  
  budgets[index] = {
    ...budgets[index],
    title: title || budgets[index].title,
    targetAmount: targetAmount !== undefined ? parseFloat(targetAmount) : budgets[index].targetAmount,
    description: description !== undefined ? description : budgets[index].description,
    deadline: deadline !== undefined ? deadline : budgets[index].deadline,
    status: status || budgets[index].status,
    updatedAt: new Date().toISOString()
  };

  res.json(apiResponse(true, budgets[index], 'Savings goal updated successfully.'));
});

// Add contribution to savings goal
app.post('/api/v1/savings/contribute', authenticateToken, (req, res) => {
  const { savingGoalId, amount } = req.body;
  
  const index = budgets.findIndex(g => g.id === savingGoalId && g.userId === req.user.userId);
  
  if (index === -1) {
    return res.status(404).json(apiResponse(false, null, 'Savings goal not found.'));
  }

  budgets[index].currentAmount = (budgets[index].currentAmount || 0) + parseFloat(amount);
  
  if (budgets[index].currentAmount >= budgets[index].targetAmount) {
    budgets[index].status = 'Completed';
  }

  res.json(apiResponse(true, budgets[index], 'Contribution added successfully.'));
});

// Delete savings goal
app.delete('/api/v1/savings/:id', authenticateToken, (req, res) => {
  const index = budgets.findIndex(g => g.id === req.params.id && g.userId === req.user.userId);
  
  if (index === -1) {
    return res.status(404).json(apiResponse(false, null, 'Savings goal not found.'));
  }

  budgets.splice(index, 1);
  res.json(apiResponse(true, null, 'Savings goal deleted successfully.'));
});

// ============ METADATA ROUTES ============

app.get('/api/v1/metadata/expense-categories', (req, res) => {
  const categories = [
    { value: 0, label: 'Food' },
    { value: 1, label: 'Transport' },
    { value: 2, label: 'Entertainment' },
    { value: 3, label: 'Healthcare' },
    { value: 4, label: 'Shopping' },
    { value: 5, label: 'Bills' },
    { value: 6, label: 'Other' }
  ];
  res.json(apiResponse(true, categories, 'Expense categories retrieved successfully.'));
});

app.get('/api/v1/metadata/payment-methods', (req, res) => {
  const methods = [
    { value: 0, label: 'Cash' },
    { value: 1, label: 'CreditCard' },
    { value: 2, label: 'DebitCard' },
    { value: 3, label: 'BankTransfer' },
    { value: 4, label: 'MobilePay' }
  ];
  res.json(apiResponse(true, methods, 'Payment methods retrieved successfully.'));
});

app.get('/api/v1/metadata/saving-goal-statuses', (req, res) => {
  const statuses = [
    { value: 0, label: 'Active' },
    { value: 1, label: 'Completed' },
    { value: 2, label: 'Archived' }
  ];
  res.json(apiResponse(true, statuses, 'Saving goal statuses retrieved successfully.'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock backend is running!', timestamp: new Date().toISOString() });
});

// Scalar documentation redirect
app.get('/scalar/v1', (req, res) => {
  res.send(`
    <html>
      <head><title>Mock API Documentation</title></head>
      <body style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
        <h1>🎭 Air Pay Mock Backend</h1>
        <p>This is a mock backend server for testing the frontend without .NET installed.</p>
        <h2>Available Endpoints:</h2>
        <ul>
          <li><strong>POST</strong> /api/v1/auth/register - Register new user</li>
          <li><strong>POST</strong> /api/v1/auth/login - Login user</li>
          <li><strong>GET</strong> /api/v1/auth/me - Get current user (requires auth)</li>
          <li><strong>POST</strong> /api/v1/auth/logout - Logout (requires auth)</li>
          <li><strong>GET</strong> /api/v1/dashboard/summary - Get dashboard data (requires auth)</li>
          <li><strong>GET</strong> /api/v1/metadata/expense-categories - Get expense categories</li>
          <li><strong>GET</strong> /api/v1/metadata/payment-methods - Get payment methods</li>
          <li><strong>GET</strong> /api/v1/metadata/saving-goal-statuses - Get saving goal statuses</li>
        </ul>
        <h2>Note:</h2>
        <p>Data is stored in memory and will be lost when the server restarts.</p>
        <p>Users registered: ${users.length}</p>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🎭 ========================================');
  console.log('    Air Pay Mock Backend Server');
  console.log('========================================');
  console.log('');
  console.log(`✅ Server running on: http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/scalar/v1`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('📝 Available endpoints:');
  console.log('   - POST /api/v1/auth/register');
  console.log('   - POST /api/v1/auth/login');
  console.log('   - GET  /api/v1/auth/me');
  console.log('   - GET  /api/v1/dashboard/summary');
  console.log('');
  console.log('🔥 Ready to accept requests!');
  console.log('========================================');
  console.log('');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(apiResponse(false, null, 'Internal server error.', [err.message]));
});
