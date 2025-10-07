import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { DashboardSummaryResponse } from "../dtos/dashboards/dashboard-summary-response";
import { dashboardService } from "../services/dashboard-service";
import { useAuth } from "../hooks/auth-hook";
import "./DashboardPage.css";

const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const { user, logout } = useAuth();

  useEffect(() => {
    const controller = new AbortController();

    const fetchSummary = async () => {
      try {
        const response = await dashboardService.getDashboardSummary(controller.signal);
        setSummary(response.data ?? null);
      } catch (err: any) {
        if (err.name === "CanceledError") {
          console.log("Dashboard request cancelled");
          return;
        }
        setError("Failed to fetch dashboard summary.");
      }
    };

    fetchSummary();

    return () => {
      controller.abort();
    };
  }, []);

  const currentDate = new Date().toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  // Filter data based on selected period
  const getFilteredExpenses = () => {
    if (!summary) return 0;
    const now = new Date();
    const cutoffDate = new Date();
    cutoffDate.setMonth(now.getMonth() - selectedPeriod);
    
    // For now, use total expenses (can filter by date when we have dateOfExpense)
    return summary.totalExpenses;
  };

  const getFilteredSavings = () => {
    return summary ? summary.totalSavings : 0;
  };

  // Calculate percentages for spending statistics
  const filteredExpenses = getFilteredExpenses();
  const filteredSavings = getFilteredSavings();
  const incomeTarget = 5000; // You can make this configurable later
  const expensesPercentage = Math.min((filteredExpenses / incomeTarget) * 100, 100);
  const savingsPercentage = Math.min((filteredSavings / incomeTarget) * 100, 100);

  // Get chart data from daily trend
  const chartData = summary?.dailyTrend || [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Group by month for last 6 months
  const getMonthlyData = () => {
    const monthlyData: any[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthNames[date.getMonth()];
      
      // Calculate expenses for this month
      const monthExpenses = summary?.recentTransactions
        ?.filter(t => {
          const transDate = new Date(t.dateOfExpense || '');
          return transDate.getMonth() === date.getMonth() && 
                 transDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, t) => sum + t.amount, 0) || 0;
      
      monthlyData.push({
        month: monthName,
        income: 0, // Can add income tracking later
        outcome: monthExpenses
      });
    }
    
    return monthlyData;
  };

  const monthlyChartData = getMonthlyData();

  return (
    <div className="airpay">
      {/* Sidebar */}
      <aside className="airpay__sidebar">
        <div className="airpay__brand">
          <div className="airpay__logo">📱</div>
          <h1 className="airpay__title">Air Pay</h1>
        </div>

        <nav className="airpay__nav">
          <Link to="/dashboard" className="airpay__nav-item airpay__nav-item--active">
            <span className="airpay__nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/expenses" className="airpay__nav-item">
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
            <input type="text" placeholder="Search" className="airpay__search-input" />
          </div>
          
          <div className="airpay__header-actions">
            <div className="airpay__date">{currentDate}</div>
            <div className="airpay__lang">
              <span>En</span>
              <span className="airpay__dropdown-icon">▼</span>
            </div>
            <div className="airpay__user">
              <img 
                src="https://i.pravatar.cc/150?img=12" 
                alt={user?.name || "User"} 
                className="airpay__user-avatar"
              />
              <span className="airpay__user-name">{user?.name || "User"}</span>
              <span className="airpay__dropdown-icon">▼</span>
            </div>
          </div>
        </header>

        {error && <p className="airpay__error">{error}</p>}

        {/* Content Grid */}
        <div className="airpay__content">
          {/* Balance Card */}
          <div className="airpay__balance">
            <div className="airpay__balance-header">
              <div className="airpay__balance-label">Balance details</div>
              <button className="airpay__balance-menu">⋮</button>
            </div>
            <div className="airpay__balance-amount">$ {summary ? summary.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '10,000.00'}</div>
            <div className="airpay__balance-sub">€ {summary ? (summary.balance * 0.85).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '8,500.00'}</div>
            <div className="airpay__balance-footer">
              <div className="airpay__balance-account">
                <div className="airpay__balance-account-label">Starting Balance</div>
                <div className="airpay__balance-account-number">${summary ? summary.startingBalance.toLocaleString() : '10,000'}</div>
              </div>
            </div>
          </div>

          {/* Spending Statistics */}
          <div className="airpay__stats">
            <div className="airpay__stats-header">
              <h3 className="airpay__stats-title">SPENDING STATISTICS</h3>
              <select 
                className="airpay__period" 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
              >
                <option value={1}>1 month</option>
                <option value={3}>3 months</option>
                <option value={6}>6 months</option>
                <option value={12}>1 year</option>
              </select>
            </div>

            <div className="airpay__stats-grid">
              <div className="airpay__stat-item">
                <div className="airpay__stat-header">
                  <span className="airpay__stat-icon">💸</span>
                  <span className="airpay__stat-label">Total Expenses</span>
                </div>
                <div className="airpay__stat-value">${filteredExpenses.toFixed(2)}</div>
                <div className="airpay__stat-bar">
                  <div className="airpay__stat-progress" style={{ width: `${expensesPercentage}%` }}></div>
                </div>
                <div className="airpay__stat-percent">{expensesPercentage.toFixed(0)}% of budget</div>
              </div>

              <div className="airpay__stat-item">
                <div className="airpay__stat-header">
                  <span className="airpay__stat-icon">💰</span>
                  <span className="airpay__stat-label">Total Savings</span>
                </div>
                <div className="airpay__stat-value">${filteredSavings.toFixed(2)}</div>
                <div className="airpay__stat-bar airpay__stat-bar--yellow">
                  <div className="airpay__stat-progress" style={{ width: `${savingsPercentage}%` }}></div>
                </div>
                <div className="airpay__stat-percent">{savingsPercentage.toFixed(0)}% of target</div>
              </div>

              <div className="airpay__add-stat">
                <Link to="/expenses/add" className="airpay__add-stat-btn">+<br/>Add</Link>
              </div>
            </div>
          </div>

          {/* Transactions History */}
          <div className="airpay__transactions">
            <div className="airpay__transactions-header">
              <h3 className="airpay__transactions-title">TRANSACTIONS HISTORY</h3>
              <Link to="/expenses" className="airpay__transactions-link">See all →</Link>
            </div>

            <div className="airpay__transactions-list">
              {summary?.recentTransactions && summary.recentTransactions.length > 0 ? (
                summary.recentTransactions.slice(0, 4).map((transaction) => (
                  <div key={transaction.id} className="airpay__transaction">
                    <div className="airpay__transaction-icon">
                      {transaction.category === 'Food' ? '🍔' :
                       transaction.category === 'Transport' ? '🚗' :
                       transaction.category === 'Entertainment' ? '🎮' :
                       transaction.category === 'Healthcare' ? '💊' :
                       transaction.category === 'Shopping' ? '🛍️' : '💸'}
                    </div>
                    <div className="airpay__transaction-info">
                      <div className="airpay__transaction-name">{transaction.description || transaction.category}</div>
                      <div className="airpay__transaction-date">
                        {(() => {
                          if (!transaction.dateOfExpense) return 'Recently';
                          const date = new Date(transaction.dateOfExpense);
                          return date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                        })()}
                      </div>
                    </div>
                    <div className="airpay__transaction-amount">-${transaction.amount.toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <div className="airpay__transaction-empty">
                  <p>No transactions yet</p>
                  <Link to="/expenses/add" className="airpay__transaction-add-link">Add your first expense</Link>
                </div>
              )}
            </div>
          </div>

          {/* Expenses Classification Chart */}
          <div className="airpay__chart">
            <div className="airpay__chart-header">
              <h3 className="airpay__chart-title">EXPENSES CLASSIFICATION</h3>
              <select className="airpay__period">
                <option>6 months</option>
                <option>3 months</option>
                <option>1 year</option>
              </select>
            </div>

            <div className="airpay__chart-container">
              <div className="airpay__chart-bars">
                {monthlyChartData.map((data, index) => {
                  const maxValue = Math.max(...monthlyChartData.map(d => d.outcome), 100);
                  return (
                    <div key={index} className="airpay__chart-column">
                      <div className="airpay__chart-bar-group">
                        <div 
                          className="airpay__chart-bar airpay__chart-bar--income" 
                          style={{ height: `${(data.income / maxValue) * 100}%` }}
                          title={`Income: $${data.income.toFixed(0)}`}
                        ></div>
                        <div 
                          className="airpay__chart-bar airpay__chart-bar--outcome" 
                          style={{ height: `${(data.outcome / maxValue) * 100}%` }}
                          title={`Expenses: $${data.outcome.toFixed(0)}`}
                        ></div>
                      </div>
                      <div className="airpay__chart-label">{data.month}</div>
                    </div>
                  );
                })}
              </div>

              <div className="airpay__chart-legend">
                <div className="airpay__chart-legend-item">
                  <span className="airpay__chart-legend-color airpay__chart-legend-color--income"></span>
                  <span>Income</span>
                </div>
                <div className="airpay__chart-legend-item">
                  <span className="airpay__chart-legend-color airpay__chart-legend-color--outcome"></span>
                  <span>Outcome</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
