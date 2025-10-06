import { useEffect, useState } from "react";
import type { DashboardSummaryResponse } from "../dtos/dashboards/dashboard-summary-response";
import { dashboardService } from "../services/dashboard-service";
import { useAuth } from "../hooks/auth-hook";
import "./DashboardPage.css";

const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("1 month");
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

  // Calculate percentages for spending statistics
  const transactionPercentage = summary ? Math.min((summary.totalExpenses / 1000) * 100, 100) : 0;
  const entertainmentSpending = summary?.categoryBreakdown.find(c => c.category === 'Entertainment')?.totalSpent || 0;
  const entertainmentPercentage = Math.min((entertainmentSpending / 500) * 100, 100);

  // Get monthly data for chart (last 6 months)
  const months = ['March', 'April', 'May', 'June', 'July', 'August'];
  const chartData = months.map((month, index) => ({
    month,
    income: Math.random() * 2000 + 1000,
    outcome: Math.random() * 2000 + 500
  }));

  return (
    <div className="airpay">
      {/* Sidebar */}
      <aside className="airpay__sidebar">
        <div className="airpay__brand">
          <div className="airpay__logo">📱</div>
          <h1 className="airpay__title">Air Pay</h1>
        </div>

        <nav className="airpay__nav">
          <a href="#dashboard" className="airpay__nav-item airpay__nav-item--active">
            <span className="airpay__nav-icon">📊</span>
            <span>Dashboard</span>
          </a>
          <a href="#wallet" className="airpay__nav-item">
            <span className="airpay__nav-icon">💳</span>
            <span>My wallet</span>
          </a>
          <a href="#transactions" className="airpay__nav-item">
            <span className="airpay__nav-icon">🔄</span>
            <span>Transactions</span>
          </a>
          <a href="#statistics" className="airpay__nav-item">
            <span className="airpay__nav-icon">📈</span>
            <span>Statistics</span>
          </a>
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
                alt="Sarah Miller" 
                className="airpay__user-avatar"
              />
              <span className="airpay__user-name">Sarah Miller</span>
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
            <div className="airpay__balance-amount">$ {summary ? summary.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '25,657.00'}</div>
            <div className="airpay__balance-sub">€ {summary ? (summary.totalExpenses * 0.85).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '20,882.92'}</div>
            <div className="airpay__balance-footer">
              <div className="airpay__balance-account">
                <div className="airpay__balance-account-label">Account number</div>
                <div className="airpay__balance-account-number">82568147C942F9F566b1</div>
              </div>
            </div>
          </div>

          {/* Spending Statistics */}
          <div className="airpay__stats">
            <div className="airpay__stats-header">
              <h3 className="airpay__stats-title">SPENDING STATISTICS</h3>
              <select className="airpay__period" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                <option>1 month</option>
                <option>3 months</option>
                <option>6 months</option>
                <option>1 year</option>
              </select>
            </div>

            <div className="airpay__stats-grid">
              <div className="airpay__stat-item">
                <div className="airpay__stat-header">
                  <span className="airpay__stat-icon">💰</span>
                  <span className="airpay__stat-label">Transactions</span>
                </div>
                <div className="airpay__stat-value">${summary ? summary.totalExpenses.toFixed(0) : '546'}</div>
                <div className="airpay__stat-bar">
                  <div className="airpay__stat-progress" style={{ width: `${transactionPercentage}%` }}></div>
                </div>
                <div className="airpay__stat-percent">{transactionPercentage.toFixed(0)}% of income</div>
              </div>

              <div className="airpay__stat-item">
                <div className="airpay__stat-header">
                  <span className="airpay__stat-icon">🎮</span>
                  <span className="airpay__stat-label">Entertainment</span>
                </div>
                <div className="airpay__stat-value">${entertainmentSpending.toFixed(0)}</div>
                <div className="airpay__stat-bar airpay__stat-bar--yellow">
                  <div className="airpay__stat-progress" style={{ width: `${entertainmentPercentage}%` }}></div>
                </div>
                <div className="airpay__stat-percent">{entertainmentPercentage.toFixed(0)}% of income</div>
              </div>

              <div className="airpay__add-stat">
                <button className="airpay__add-stat-btn">+<br/>Add</button>
              </div>
            </div>
          </div>

          {/* Transactions History */}
          <div className="airpay__transactions">
            <div className="airpay__transactions-header">
              <h3 className="airpay__transactions-title">TRANSACTIONS HISTORY</h3>
              <a href="#all" className="airpay__transactions-link">See all →</a>
            </div>

            <div className="airpay__transactions-list">
              {summary?.recentTransactions.slice(0, 4).map((transaction) => (
                <div key={transaction.id} className="airpay__transaction">
                  <div className="airpay__transaction-icon">
                    {transaction.category === 'Pharmacy' ? '💊' :
                     transaction.category === 'Transfer' ? '💸' :
                     transaction.category === 'Cinema' ? '🎬' :
                     transaction.category === 'Food' ? '🍔' : '🛒'}
                  </div>
                  <div className="airpay__transaction-info">
                    <div className="airpay__transaction-name">{transaction.category}</div>
                    <div className="airpay__transaction-date">
                      {transaction.dateOfExpense ? new Date(transaction.dateOfExpense).toLocaleDateString() : '14 min ago'}
                    </div>
                  </div>
                  <div className="airpay__transaction-amount">-{transaction.amount}</div>
                </div>
              ))}
              
              {(!summary || summary.recentTransactions.length === 0) && (
                <>
                  <div className="airpay__transaction">
                    <div className="airpay__transaction-icon">💊</div>
                    <div className="airpay__transaction-info">
                      <div className="airpay__transaction-name">Pharmacy</div>
                      <div className="airpay__transaction-date">14 min ago</div>
                    </div>
                    <div className="airpay__transaction-amount">-145</div>
                  </div>
                  <div className="airpay__transaction">
                    <div className="airpay__transaction-icon">💸</div>
                    <div className="airpay__transaction-info">
                      <div className="airpay__transaction-name">Money transfer</div>
                      <div className="airpay__transaction-date">Today, 13:27</div>
                    </div>
                    <div className="airpay__transaction-amount">-1005</div>
                  </div>
                  <div className="airpay__transaction">
                    <div className="airpay__transaction-icon">🎬</div>
                    <div className="airpay__transaction-info">
                      <div className="airpay__transaction-name">Cinema tickets</div>
                      <div className="airpay__transaction-date">Today, 12:56:2021</div>
                    </div>
                    <div className="airpay__transaction-amount">-26,505</div>
                  </div>
                  <div className="airpay__transaction">
                    <div className="airpay__transaction-icon">🍔</div>
                    <div className="airpay__transaction-info">
                      <div className="airpay__transaction-name">Food market</div>
                      <div className="airpay__transaction-date">13.08, 12:56:2021</div>
                    </div>
                    <div className="airpay__transaction-amount">-345</div>
                  </div>
                </>
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
                {chartData.map((data, index) => (
                  <div key={index} className="airpay__chart-column">
                    <div className="airpay__chart-bar-group">
                      <div 
                        className="airpay__chart-bar airpay__chart-bar--income" 
                        style={{ height: `${(data.income / 3000) * 100}%` }}
                        data-value={`$${data.income.toFixed(0)}`}
                      ></div>
                      <div 
                        className="airpay__chart-bar airpay__chart-bar--outcome" 
                        style={{ height: `${(data.outcome / 3000) * 100}%` }}
                        data-value={`$${data.outcome.toFixed(0)}`}
                      ></div>
                    </div>
                    <div className="airpay__chart-label">{data.month}</div>
                  </div>
                ))}
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
