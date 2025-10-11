import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { DashboardSummaryResponse } from "../dtos/dashboards/dashboard-summary-response";
import { dashboardService } from "../services/dashboard-service";
import { useAuth } from "../hooks/auth-hook";
import "./DashboardPageNew.css";

const DashboardPageRedesigned: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [error, setError] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  const handleLogout = () => {
    logout();
    navigate("/login");
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
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard__main">
        {/* Header with User Menu */}
        <header className="dashboard__header">
          <div className="dashboard__welcome">
            <h1 className="dashboard__welcome-title">Welcome back, {user?.nickname || user?.name || "User"}!</h1>
            <p className="dashboard__welcome-subtitle">Here's your financial overview • {currentDate}</p>
          </div>
          
          {/* User Dropdown */}
          <div 
            className="dashboard__user-menu"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <div className="dashboard__user-trigger">
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={user?.nickname || user?.name || "User"} 
                  className="dashboard__user-avatar"
                />
              ) : (
                <div className="dashboard__user-avatar dashboard__user-avatar--placeholder">
                  {getInitials(user?.nickname || user?.name)}
                </div>
              )}
              <svg className="dashboard__user-caret" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {showUserMenu && (
              <div className="dashboard__user-dropdown">
                <div className="dashboard__user-dropdown-header">
                  <div className="dashboard__user-dropdown-avatar">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt={user?.nickname || user?.name || "User"} />
                    ) : (
                      <div className="dashboard__user-avatar--placeholder">
                        {getInitials(user?.nickname || user?.name)}
                      </div>
                    )}
                  </div>
                  <div className="dashboard__user-dropdown-info">
                    <p className="dashboard__user-dropdown-name">{user?.nickname || user?.name || "User"}</p>
                    <p className="dashboard__user-dropdown-email">{user?.email || ""}</p>
                  </div>
                </div>
                <div className="dashboard__user-dropdown-divider"></div>
                <button 
                  className="dashboard__user-dropdown-item"
                  onClick={() => navigate("/profile")}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10ZM10 12.5C6.66667 12.5 0 14.175 0 17.5V20H20V17.5C20 14.175 13.3333 12.5 10 12.5Z" fill="currentColor"/>
                  </svg>
                  <span>My Profile</span>
                </button>
                <button 
                  className="dashboard__user-dropdown-item dashboard__user-dropdown-item--danger"
                  onClick={handleLogout}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H7M14 15L19 10M19 10L14 5M19 10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {error && <div className="dashboard__error">{error}</div>}

        {/* Stats Cards */}
        <div className="dashboard__stats">
          {/* Balance Card */}
          <div className="dashboard__stat-card dashboard__stat-card--primary">
            <div className="dashboard__stat-icon">💵</div>
            <div className="dashboard__stat-content">
              <p className="dashboard__stat-label">Current Balance</p>
              <h3 className="dashboard__stat-value">
                ${summary?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '10,000.00'}
              </h3>
              <p className="dashboard__stat-change">
                From ${summary?.startingBalance?.toLocaleString() || '10,000'} starting
              </p>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="dashboard__stat-card dashboard__stat-card--danger">
            <div className="dashboard__stat-icon">💸</div>
            <div className="dashboard__stat-content">
              <p className="dashboard__stat-label">Total Expenses</p>
              <h3 className="dashboard__stat-value">
                ${summary?.totalExpenses?.toFixed(2) || '0.00'}
              </h3>
              <p className="dashboard__stat-change">
                This month
              </p>
            </div>
          </div>

          {/* Total Savings */}
          <div className="dashboard__stat-card dashboard__stat-card--success">
            <div className="dashboard__stat-icon">💰</div>
            <div className="dashboard__stat-content">
              <p className="dashboard__stat-label">Total Savings</p>
              <h3 className="dashboard__stat-value">
                ${summary?.totalSavings?.toFixed(2) || '0.00'}
              </h3>
              <p className="dashboard__stat-change">
                Saved so far
              </p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="dashboard__content">
          {/* Recent Transactions */}
          <div className="dashboard__card dashboard__card--transactions">
            <div className="dashboard__card-header">
              <h3 className="dashboard__card-title">
                <span className="dashboard__card-title-icon">📝</span>
                Recent Transactions
              </h3>
              <Link to="/expenses" className="dashboard__card-link">
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
          <div className="dashboard__card dashboard__card--categories">
            <div className="dashboard__card-header">
              <h3 className="dashboard__card-title">
                <span className="dashboard__card-title-icon">📂</span>
                Top Categories
              </h3>
            </div>
            {summary && summary.categoryBreakdown && summary.categoryBreakdown.length > 0 ? (
              <div className="dashboard__categories">
                {summary.categoryBreakdown.slice(0, 5).map((cat, index) => (
                  <div key={index} className="dashboard__category">
                    <div className="dashboard__category-header">
                      <span className="dashboard__category-name">
                        {getCategoryIcon(cat.category)} {cat.category}
                      </span>
                      <span className="dashboard__category-amount">
                        ${cat.totalSpent.toFixed(2)}
                      </span>
                    </div>
                    <div className="dashboard__category-bar">
                      <div 
                        className="dashboard__category-bar-fill"
                        style={{
                          width: `${Math.min((cat.totalSpent / (summary.totalExpenses || 1)) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard__empty">
                <div className="dashboard__empty-icon">📂</div>
                <p className="dashboard__empty-text">No categories yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPageRedesigned;
