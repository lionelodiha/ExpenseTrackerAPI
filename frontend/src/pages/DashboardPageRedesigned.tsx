import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { DashboardSummaryResponse } from "../dtos/dashboards/dashboard-summary-response";
import { dashboardService } from "../services/dashboard-service";
import { useAuth } from "../hooks/auth-hook";
import "./DashboardPageNew.css";

const DashboardPageRedesigned: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchSummary = async () => {
      try {
        console.log("Fetching dashboard summary...");
        const response = await dashboardService.getDashboardSummary(controller.signal);
        console.log("Dashboard response:", response);
        setSummary(response.data ?? null);
      } catch (err: any) {
        if (err.name === "CanceledError") {
          console.log("Dashboard request cancelled");
          return;
        }
        console.error("Dashboard error:", err);
        setError("Failed to fetch dashboard summary: " + (err.message || "Unknown error"));
      }
    };

    fetchSummary();

    return () => {
      controller.abort();
    };
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Food': '🍔',
      'Transport': '🚗',
      'Entertainment': '🎮',
      'Shopping': '🛍️',
      'Bills': '📄',
      'Health': '🏥',
      'Other': '📌'
    };
    return icons[category] || '💰';
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard__sidebar">
        <div className="dashboard__logo">
          <div className="dashboard__logo-icon">
            <svg width="30" height="30" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 15L42 25H38V40C38 41.1046 37.1046 42 36 42H24C22.8954 42 22 41.1046 22 40V25H18L30 15Z" fill="white"/>
              <circle cx="30" cy="32" r="3" fill="white" fillOpacity="0.7"/>
            </svg>
          </div>
          <h1 className="dashboard__logo-text">VINGOSI</h1>
        </div>

        <nav className="dashboard__nav">
          <Link to="/dashboard" className="dashboard__nav-item dashboard__nav-item--active">
            <span className="dashboard__nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/expenses" className="dashboard__nav-item">
            <span className="dashboard__nav-icon">💰</span>
            <span>Expenses</span>
          </Link>
          <Link to="/savings" className="dashboard__nav-item">
            <span className="dashboard__nav-icon">💎</span>
            <span>Savings</span>
          </Link>
          <Link to="/budgets" className="dashboard__nav-item">
            <span className="dashboard__nav-icon">📈</span>
            <span>Budgets</span>
          </Link>
          <Link to="/profile" className="dashboard__nav-item">
            <span className="dashboard__nav-icon">👤</span>
            <span>Profile</span>
          </Link>
        </nav>

        <div className="dashboard__user-card">
          <div className="dashboard__user-info" onClick={() => navigate('/profile')}>
            {user?.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={user?.nickname || user?.name || "User"} 
                className="dashboard__user-avatar"
              />
            ) : (
              <div className="dashboard__user-avatar" style={{ 
                background: 'linear-gradient(135deg, #2d5f4d 0%, #4a7266 100%)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '1rem'
              }}>
                {getInitials(user?.nickname || user?.name)}
              </div>
            )}
            <div className="dashboard__user-details">
              <p className="dashboard__user-name">{user?.nickname || user?.name || "User"}</p>
              <p className="dashboard__user-email">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="dashboard__logout">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard__main">
        {/* Header */}
        <header className="dashboard__header">
          <div className="dashboard__welcome">
            <h1 className="dashboard__welcome-title">Welcome back, {user?.nickname || user?.name}!</h1>
            <p className="dashboard__welcome-subtitle">Here's your financial overview</p>
          </div>
          <div className="dashboard__header-actions">
            <div className="dashboard__date">{currentDate}</div>
          </div>
        </header>

        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        {/* Stats Cards */}
        <div className="dashboard__content">
          {/* Balance Card */}
          <div className="dashboard__card">
            <div className="dashboard__card-header">
              <h3 className="dashboard__card-title">Current Balance</h3>
              <div className="dashboard__card-icon">💵</div>
            </div>
            <p className="dashboard__card-value">
              ${summary?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '10,000.00'}
            </p>
            <p className="dashboard__card-change">
              From ${summary?.startingBalance?.toLocaleString() || '10,000'} starting
            </p>
          </div>

          {/* Total Expenses */}
          <div className="dashboard__card">
            <div className="dashboard__card-header">
              <h3 className="dashboard__card-title">Total Expenses</h3>
              <div className="dashboard__card-icon">💸</div>
            </div>
            <p className="dashboard__card-value">
              ${summary?.totalExpenses?.toFixed(2) || '0.00'}
            </p>
            <p className="dashboard__card-change dashboard__card-change--negative">
              This month
            </p>
          </div>

          {/* Total Savings */}
          <div className="dashboard__card">
            <div className="dashboard__card-header">
              <h3 className="dashboard__card-title">Total Savings</h3>
              <div className="dashboard__card-icon">💰</div>
            </div>
            <p className="dashboard__card-value">
              ${summary?.totalSavings?.toFixed(2) || '0.00'}
            </p>
            <p className="dashboard__card-change">
              Saved so far
            </p>
          </div>

          {/* Recent Transactions */}
          <div className="dashboard__card dashboard__card--wide">
            <div className="dashboard__card-header">
              <h3 className="dashboard__card-title">Recent Transactions</h3>
              <Link to="/expenses" style={{ color: '#2d5f4d', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600' }}>
                View All →
              </Link>
            </div>
            {summary && summary.recentTransactions && summary.recentTransactions.length > 0 ? (
              <ul className="dashboard__transactions">
                {summary.recentTransactions.slice(0, 5).map((transaction, index) => (
                  <li key={index} className="dashboard__transaction">
                    <div className="dashboard__transaction-icon">
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div className="dashboard__transaction-info">
                      <p className="dashboard__transaction-name">{transaction.description || transaction.category}</p>
                      <p className="dashboard__transaction-date">
                        {transaction.dateOfExpense ? new Date(transaction.dateOfExpense).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                    <div className="dashboard__transaction-amount">
                      -${transaction.amount.toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="dashboard__empty">
                <div className="dashboard__empty-icon">📊</div>
                <p className="dashboard__empty-text">No transactions yet</p>
                <Link to="/expenses/add" className="dashboard__empty-button">
                  Add Your First Expense
                </Link>
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="dashboard__card">
            <div className="dashboard__card-header">
              <h3 className="dashboard__card-title">Top Categories</h3>
              <div className="dashboard__card-icon">📂</div>
            </div>
            {summary && summary.categoryBreakdown && summary.categoryBreakdown.length > 0 ? (
              <div style={{ marginTop: '1rem' }}>
                {summary.categoryBreakdown.slice(0, 5).map((cat, index) => (
                  <div key={index} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
                        {getCategoryIcon(cat.category)} {cat.category}
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#2d5f4d' }}>
                        ${cat.totalSpent.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ background: '#f0f9f4', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                      <div style={{
                        background: 'linear-gradient(to right, #2d5f4d, #4a7266)',
                        width: `${Math.min((cat.totalSpent / (summary.totalExpenses || 1)) * 100, 100)}%`,
                        height: '100%',
                        borderRadius: '999px',
                        transition: 'width 0.3s'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#666' }}>
                <p>No categories yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPageRedesigned;
