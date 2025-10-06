import { useState } from 'react';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('1 month');
  const [expensePeriod, setExpensePeriod] = useState('6 months');

  return (
    <div className="landing">
      {/* Sidebar */}
      <aside className="landing__sidebar">
        <h1 className="landing__logo">Air Pay</h1>
        
        <nav className="landing__nav">
          <a href="#" className="landing__nav-item landing__nav-item--active">
            <span className="landing__nav-icon">📊</span>
            Dashboard
          </a>
          <a href="#" className="landing__nav-item">
            <span className="landing__nav-icon">💳</span>
            My wallet
          </a>
          <a href="#" className="landing__nav-item">
            <span className="landing__nav-icon">🔄</span>
            Transactions
          </a>
          <a href="#" className="landing__nav-item">
            <span className="landing__nav-icon">📈</span>
            Statistics
          </a>
          <a href="#" className="landing__nav-item">
            <span className="landing__nav-icon">⚙️</span>
            Settings
          </a>
        </nav>

        <div className="landing__premium">
          <div className="landing__premium-content">
            <h3 className="landing__premium-title">Get Premium ⭐</h3>
            <p className="landing__premium-text">Unlimited functions and encrypted memory</p>
            <button className="landing__premium-btn">Upgrade 🔒</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="landing__main">
        {/* Top Header */}
        <header className="landing__header">
          <div className="landing__search">
            <span className="landing__search-icon">🔍</span>
            <input type="text" placeholder="Search" className="landing__search-input" />
          </div>
          
          <div className="landing__header-actions">
            <div className="landing__date-picker">
              <span>20.06.2021</span>
              <span className="landing__calendar-icon">📅</span>
            </div>
            
            <div className="landing__language">
              <span>EN</span>
              <span className="landing__dropdown-icon">▼</span>
            </div>
            
            <div className="landing__user">
              <div className="landing__user-avatar">SM</div>
              <span className="landing__user-name">Sarah Miller</span>
              <span className="landing__dropdown-icon">⋮</span>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="landing__content">
          {/* Balance Card */}
          <div className="landing__balance-card">
            <div className="landing__balance-header">
              <span>Balance details</span>
              <button className="landing__more-btn">⋮</button>
            </div>
            <h2 className="landing__balance-amount">$ 25,657.00</h2>
            <p className="landing__balance-change">+ 20.86%</p>
            <div className="landing__account-number">
              <span className="landing__account-label">Account number</span>
              <span className="landing__account-value">826814676327/PP566bi</span>
            </div>
          </div>

          {/* Spending Statistics */}
          <div className="landing__spending-stats">
            <div className="landing__stats-header">
              <h3>SPENDING STATISTICS</h3>
              <select 
                className="landing__period-select"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option>1 month</option>
                <option>3 months</option>
                <option>6 months</option>
              </select>
            </div>
            
            <div className="landing__stats-grid">
              <div className="landing__stat-item">
                <span className="landing__stat-icon">💰</span>
                <div>
                  <p className="landing__stat-label">Transactions</p>
                  <p className="landing__stat-value">$546</p>
                  <p className="landing__stat-percent">21% of income</p>
                </div>
                <div className="landing__stat-circle">
                  <svg viewBox="0 0 36 36" className="landing__circular-chart">
                    <path className="landing__circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="landing__circle"
                      strokeDasharray="67, 100"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="landing__percentage">67%</text>
                  </svg>
                </div>
              </div>

              <div className="landing__stat-item">
                <span className="landing__stat-icon">🎬</span>
                <div>
                  <p className="landing__stat-label">Entertainment</p>
                  <p className="landing__stat-value">$245</p>
                  <p className="landing__stat-percent">19% of income</p>
                </div>
                <div className="landing__stat-circle">
                  <svg viewBox="0 0 36 36" className="landing__circular-chart">
                    <path className="landing__circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="landing__circle landing__circle--yellow"
                      strokeDasharray="34, 100"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="landing__percentage">34%</text>
                  </svg>
                </div>
              </div>

              <button className="landing__add-category">
                <span className="landing__add-icon">+</span>
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Transactions History */}
          <div className="landing__transactions">
            <div className="landing__section-header">
              <h3>TRANSACTIONS HISTORY</h3>
              <a href="#" className="landing__see-all">See all →</a>
            </div>

            <div className="landing__transaction-list">
              <div className="landing__transaction-item">
                <span className="landing__transaction-icon">💊</span>
                <div className="landing__transaction-info">
                  <p className="landing__transaction-name">Pharmacy</p>
                  <p className="landing__transaction-date">14 mar ago</p>
                </div>
                <span className="landing__transaction-amount">-145</span>
              </div>

              <div className="landing__transaction-item">
                <span className="landing__transaction-icon">💸</span>
                <div className="landing__transaction-info">
                  <p className="landing__transaction-name">Money transfer</p>
                  <p className="landing__transaction-date">14 mar ago</p>
                </div>
                <span className="landing__transaction-amount">-1005</span>
              </div>

              <div className="landing__transaction-item">
                <span className="landing__transaction-icon">🎬</span>
                <div className="landing__transaction-info">
                  <p className="landing__transaction-name">Cinema tickets</p>
                  <p className="landing__transaction-date">14 oct, 12:56 2020</p>
                </div>
                <span className="landing__transaction-amount landing__transaction-amount--large">-26,505</span>
              </div>

              <div className="landing__transaction-item">
                <span className="landing__transaction-icon">🛒</span>
                <div className="landing__transaction-info">
                  <p className="landing__transaction-name">Food market</p>
                  <p className="landing__transaction-date">14 oct, 12:56 2020</p>
                </div>
                <span className="landing__transaction-amount">-345</span>
              </div>
            </div>
          </div>

          {/* Expenses Classification */}
          <div className="landing__expenses">
            <div className="landing__section-header">
              <h3>EXPENSES CLASSIFICATION</h3>
              <select 
                className="landing__period-select"
                value={expensePeriod}
                onChange={(e) => setExpensePeriod(e.target.value)}
              >
                <option>6 months</option>
                <option>1 year</option>
              </select>
            </div>

            <div className="landing__chart">
              <div className="landing__chart-bars">
                {[
                  { month: 'March', income: 3000, outcome: 2400 },
                  { month: 'April', income: 2000, outcome: 1800 },
                  { month: 'May', income: 1500, outcome: 2000 },
                  { month: 'June', income: 2500, outcome: 1500 },
                  { month: 'July', income: 1800, outcome: 2200 },
                  { month: 'August', income: 2200, outcome: 1900 }
                ].map((data, index) => (
                  <div key={index} className="landing__chart-bar-group">
                    <div className="landing__chart-bars-wrapper">
                      <div 
                        className="landing__chart-bar landing__chart-bar--income"
                        style={{ height: `${(data.income / 3000) * 100}%` }}
                      ></div>
                      <div 
                        className="landing__chart-bar landing__chart-bar--outcome"
                        style={{ height: `${(data.outcome / 3000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="landing__chart-label">{data.month}</span>
                  </div>
                ))}
              </div>

              <div className="landing__chart-legend">
                <div className="landing__legend-item">
                  <span className="landing__legend-dot landing__legend-dot--income"></span>
                  Income
                </div>
                <div className="landing__legend-item">
                  <span className="landing__legend-dot landing__legend-dot--outcome"></span>
                  Outcome
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
