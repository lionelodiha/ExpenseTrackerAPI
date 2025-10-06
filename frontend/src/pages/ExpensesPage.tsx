import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { CreateExpenseResponse } from "../dtos/expenses/create-expense-response";
import { expenseService } from "../services/expense-service";
import { useAuth } from "../hooks/auth-hook";
import "./ExpensesPage.css";

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<CreateExpenseResponse[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseService.getAll();
      setExpenses(response.data ?? []);
    } catch (err: any) {
      setError("Failed to fetch expenses.");
      if (err.response && err.response.status === 404) {
        setExpenses([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await expenseService.deleteById(id);
      fetchExpenses();
    } catch {
      setError("Failed to delete expense.");
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      Food: '🍔',
      Transport: '🚗',
      Entertainment: '🎮',
      Healthcare: '💊',
      Shopping: '🛍️',
      Bills: '📄',
      Other: '💰'
    };
    return icons[category] || '💸';
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="airpay">
      {/* Sidebar */}
      <aside className="airpay__sidebar">
        <div className="airpay__brand">
          <div className="airpay__logo">📱</div>
          <h1 className="airpay__title">Air Pay</h1>
        </div>

        <nav className="airpay__nav">
          <Link to="/dashboard" className="airpay__nav-item">
            <span className="airpay__nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/expenses" className="airpay__nav-item airpay__nav-item--active">
            <span className="airpay__nav-icon">💸</span>
            <span>Expenses</span>
          </Link>
          <Link to="/savings" className="airpay__nav-item">
            <span className="airpay__nav-icon">💰</span>
            <span>Savings</span>
          </Link>
          <Link to="/budgets" className="airpay__nav-item">
            <span className="airpay__nav-icon">📈</span>
            <span>Budgets</span>
          </Link>
          <a href="#settings" className="airpay__nav-item">
            <span className="airpay__nav-icon">⚙️</span>
            <span>Settings</span>
          </a>
        </nav>

        <div className="airpay__premium">
          <div className="airpay__premium-badge">⭐</div>
          <h3 className="airpay__premium-title">Get Premium</h3>
          <p className="airpay__premium-text">Unlimited functions and encrypted recovery</p>
          <button className="airpay__premium-btn">
            <span>Upgrade</span>
            <span className="airpay__premium-icon">🔒</span>
          </button>
        </div>

        <button onClick={logout} className="airpay__logout">Logout</button>
      </aside>

      {/* Main Content */}
      <main className="airpay__main">
        {/* Header */}
        <header className="airpay__header">
          <div className="airpay__search">
            <span className="airpay__search-icon">🔍</span>
            <input type="text" placeholder="Search expenses..." className="airpay__search-input" />
          </div>
          
          <div className="airpay__header-actions">
            <div className="airpay__date">{new Date().toLocaleDateString('en-GB')}</div>
            <div className="airpay__user">
              <img 
                src="https://i.pravatar.cc/150?img=12" 
                alt="User" 
                className="airpay__user-avatar"
              />
              <span className="airpay__user-name">User</span>
            </div>
          </div>
        </header>

        {error && <div className="airpay__error">{error}</div>}

        {/* Content */}
        <div className="expenses-content">
          <div className="expenses-header">
            <div>
              <h2 className="expenses-title">My Expenses</h2>
              <p className="expenses-subtitle">Track and manage all your expenses</p>
            </div>
            <Link to="/expenses/add" className="btn-add-expense">
              <span>➕</span>
              <span>Add Expense</span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="expenses-stats">
            <div className="stat-card">
              <div className="stat-card__icon">💸</div>
              <div className="stat-card__content">
                <div className="stat-card__label">Total Expenses</div>
                <div className="stat-card__value">${totalExpenses.toFixed(2)}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon">📊</div>
              <div className="stat-card__content">
                <div className="stat-card__label">Total Transactions</div>
                <div className="stat-card__value">{expenses.length}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon">📅</div>
              <div className="stat-card__content">
                <div className="stat-card__label">This Month</div>
                <div className="stat-card__value">
                  ${expenses.filter(e => new Date(e.dateOfExpense).getMonth() === new Date().getMonth()).reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Expenses List */}
          <div className="expenses-list-container">
            <div className="expenses-list-header">
              <h3>Recent Expenses</h3>
              <select className="expenses-filter">
                <option>All Categories</option>
                <option>Food</option>
                <option>Transport</option>
                <option>Entertainment</option>
                <option>Healthcare</option>
                <option>Shopping</option>
              </select>
            </div>

            {loading ? (
              <div className="expenses-loading">Loading expenses...</div>
            ) : expenses.length > 0 ? (
              <div className="expenses-list">
                {expenses.map((expense) => (
                  <div key={expense.id} className="expense-card">
                    <div className="expense-card__icon">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div className="expense-card__details">
                      <div className="expense-card__header">
                        <h4 className="expense-card__title">{expense.description || expense.category}</h4>
                        <span className="expense-card__amount">-${expense.amount.toFixed(2)}</span>
                      </div>
                      <div className="expense-card__meta">
                        <span className="expense-card__category">{expense.category}</span>
                        <span className="expense-card__date">
                          {new Date(expense.dateOfExpense).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                        {expense.paymentMethod && (
                          <span className="expense-card__payment">{expense.paymentMethod}</span>
                        )}
                      </div>
                    </div>
                    <div className="expense-card__actions">
                      <Link to={`/expenses/edit/${expense.id}`} className="expense-card__action expense-card__action--edit">
                        ✏️
                      </Link>
                      <button 
                        onClick={() => handleDelete(expense.id)} 
                        className="expense-card__action expense-card__action--delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="expenses-empty">
                <div className="expenses-empty__icon">📝</div>
                <h3>No expenses yet</h3>
                <p>Start tracking your expenses by adding your first transaction</p>
                <Link to="/expenses/add" className="btn-add-expense">
                  Add First Expense
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExpensesPage;
