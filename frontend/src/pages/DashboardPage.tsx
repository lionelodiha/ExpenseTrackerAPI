import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { DashboardSummaryResponse } from "../dtos/dashboards/dashboard-summary-response";
import { dashboardService } from "../services/dashboard-service";
import { useAuth } from "../hooks/auth-hook";
import { Icon, type IconName } from "../components/Icon";
import { ThemeToggle } from "../components/ThemeToggle";
import "./DashboardPage.css";

type NavItem =
  | { label: string; icon: IconName; to: string }
  | { label: string; icon: IconName; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", to: "/dashboard", icon: "dashboard" },
  { label: "Expenses", to: "/expenses", icon: "expenses" },
  { label: "Savings", to: "/savings", icon: "savings" },
  { label: "Budgets", to: "/budgets", icon: "budgets" },
  { label: "Settings", href: "#settings", icon: "settings" },
];

const CATEGORY_ICON_MAP: Record<string, IconName> = {
  Food: "food",
  Transport: "transport",
  Entertainment: "entertainment",
  Healthcare: "health",
  Shopping: "shopping",
  Bills: "bills",
  Savings: "piggy-bank",
};

const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(3);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();

    dashboardService
      .getDashboardSummary(controller.signal)
      .then((response) => {
        setSummary(response.data ?? null);
        setError("");
      })
      .catch((err: any) => {
        if (err?.name === "CanceledError") {
          return;
        }
        setError(`Failed to fetch dashboard summary: ${err?.message || "Unknown error"}`);
      });

    return () => controller.abort();
  }, []);

  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    []
  );

  const filteredExpenses = useMemo(() => {
    if (!summary?.recentTransactions?.length) {
      return summary?.totalExpenses ?? 0;
    }

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - (selectedPeriod - 1));
    cutoff.setDate(1);

    return summary.recentTransactions
      .filter((transaction) => {
        if (!transaction.dateOfExpense) {
          return false;
        }
        const date = new Date(transaction.dateOfExpense);
        return date >= cutoff;
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [selectedPeriod, summary]);

  const filteredSavings = summary?.totalSavings ?? 0;
  const incomeTarget = 5000;
  const expensesPercentage = Math.min((filteredExpenses / incomeTarget) * 100, 100);
  const savingsPercentage = Math.min((filteredSavings / incomeTarget) * 100, 100);

  const monthlyChartData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const monthlyData: Array<{ month: string; income: number; outcome: number }> = [];

    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthNames[date.getMonth()];

      if (!summary?.recentTransactions?.length) {
        monthlyData.push({ month: monthName, income: 0, outcome: 0 });
        continue;
      }

      const monthExpenses = summary.recentTransactions
        .filter((transaction) => {
          if (!transaction.dateOfExpense) {
            return false;
          }
          const transactionDate = new Date(transaction.dateOfExpense);
          return (
            transactionDate.getMonth() === date.getMonth() &&
            transactionDate.getFullYear() === date.getFullYear()
          );
        })
        .reduce((total, transaction) => total + transaction.amount, 0);

      monthlyData.push({ month: monthName, income: 0, outcome: monthExpenses });
    }

    return monthlyData;
  }, [summary]);

  const resolveCategoryIcon = (category: string): IconName => CATEGORY_ICON_MAP[category] ?? "other";

  const maxOutcomeValue = useMemo(() => {
    if (!monthlyChartData.length) {
      return 100;
    }
    const maxValue = Math.max(...monthlyChartData.map((data) => data.outcome));
    return Math.max(maxValue, 100);
  }, [monthlyChartData]);

  return (
    <div className="airpay">
      {/* Sidebar */}
      <aside className="airpay__sidebar">
        <div className="airpay__brand">
          <div className="airpay__logo">
            <Icon name="logo" size={34} />
          </div>
          <div>
            <h1 className="airpay__title">VINGOSI ET</h1>
            <span className="airpay__subtitle">Personal finance studio</span>
          </div>
        </div>

        <nav className="airpay__nav">
          {NAV_ITEMS.map((item) => {
            if ("to" in item) {
              const isActive = location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`airpay__nav-item${isActive ? " airpay__nav-item--active" : ""}`}
                >
                  <Icon name={item.icon} size={20} className="airpay__nav-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <a key={item.label} href={item.href} className="airpay__nav-item">
                <Icon name={item.icon} size={20} className="airpay__nav-icon" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <button onClick={logout} className="airpay__logout" type="button">
          <span>Logout</span>
          <Icon name="arrow-right" size={18} className="airpay__logout-icon" />
        </button>
      </aside>

      {/* Main Content */}
      <main className="airpay__main">
        {/* Header */}
        <header className="airpay__header">
          <div className="airpay__search">
            <Icon name="search" size={20} className="airpay__search-icon" />
            <input type="search" placeholder="Search anything..." className="airpay__search-input" />
          </div>

          <div className="airpay__header-actions">
            <ThemeToggle />
            <div className="airpay__date">
              <Icon name="calendar" size={18} />
              <span>{currentDate}</span>
            </div>
            <button type="button" className="airpay__notification" aria-label="Notifications">
              <Icon name="bell" size={18} />
            </button>
            <div className="airpay__user">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt={user?.firstName ?? "User avatar"}
                className="airpay__user-avatar"
              />
              <span className="airpay__user-name">{user?.firstName ?? user?.email ?? "Guest"}</span>
            </div>
          </div>
        </header>

        {error && <div className="airpay__error">{error}</div>}

        <div className="airpay__content">

          <div className="airpay__balance">
            <div className="airpay__balance-header">
              <div>
                <p className="airpay__balance-label">Current Balance</p>
                <h2 className="airpay__balance-value">${Number(summary?.balance ?? 0).toFixed(2)}</h2>
              </div>
              <div className="airpay__balance-trend">
                <Icon name="trend-up" size={18} className="airpay__balance-trend-icon" />
                <span className="airpay__balance-trend-value">+12.5%</span>
              </div>
            </div>

            <div className="airpay__balance-chart">
              <div className="airpay__balance-chart-bar airpay__balance-chart-bar--1" />
              <div className="airpay__balance-chart-bar airpay__balance-chart-bar--2" />
              <div className="airpay__balance-chart-bar airpay__balance-chart-bar--3" />
              <div className="airpay__balance-chart-bar airpay__balance-chart-bar--4" />
            </div>

            <div className="airpay__balance-footer">
              <div>
                <p className="airpay__balance-caption">Monthly change</p>
                <strong className="airpay__balance-delta">$427.32</strong>
              </div>
              <div>
                <p className="airpay__balance-caption">Avg. spend</p>
                <strong className="airpay__balance-delta">$162.11</strong>
              </div>
            </div>
          </div>


          <div className="airpay__stats">
            <div className="airpay__stat-item">
              <div className="airpay__stat-header">
                <Icon name="wallet" size={20} className="airpay__stat-icon" />
                <span className="airpay__stat-label">Total Expenses</span>
              </div>
              <div className="airpay__stat-value">${filteredExpenses.toFixed(2)}</div>
              <div className="airpay__stat-bar">
                <div className="airpay__stat-progress" style={{ width: `${expensesPercentage}%` }} />
              </div>
              <div className="airpay__stat-percent">{expensesPercentage.toFixed(0)}% of budget</div>
            </div>

            <div className="airpay__stat-item">
              <div className="airpay__stat-header">
                <Icon name="piggy-bank" size={20} className="airpay__stat-icon airpay__stat-icon--accent" />
                <span className="airpay__stat-label">Total Savings</span>
              </div>
              <div className="airpay__stat-value">${filteredSavings.toFixed(2)}</div>
              <div className="airpay__stat-bar airpay__stat-bar--yellow">
                <div className="airpay__stat-progress" style={{ width: `${savingsPercentage}%` }} />
              </div>
              <div className="airpay__stat-percent">{savingsPercentage.toFixed(0)}% of target</div>
            </div>

            <div className="airpay__add-stat">
              <Link to="/expenses/add" className="airpay__add-stat-btn">
                <Icon name="plus" size={18} />
                <span>New expense</span>
              </Link>
            </div>
          </div>


          <div className="airpay__transactions">
            <div className="airpay__transactions-header">
              <h3 className="airpay__transactions-title">Transactions history</h3>
              <Link to="/expenses" className="airpay__transactions-link">
                <span>See all</span>
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>

            <div className="airpay__transactions-list">
              {summary?.recentTransactions && summary.recentTransactions.length > 0 ? (
                summary.recentTransactions.slice(0, 4).map((transaction) => (
                  <div key={transaction.id} className="airpay__transaction">
                    <div className="airpay__transaction-icon">
                      <Icon name={resolveCategoryIcon(transaction.category)} size={22} />
                    </div>
                    <div className="airpay__transaction-info">
                      <div className="airpay__transaction-name">
                        {transaction.description || transaction.category}
                      </div>
                      <div className="airpay__transaction-date">
                        <Icon name="clock" size={14} />
                        <span>
                          {(() => {
                            if (!transaction.dateOfExpense) {
                              return "Recently";
                            }
                            const date = new Date(transaction.dateOfExpense);
                            return date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            });
                          })()}
                        </span>
                      </div>
                    </div>
                    <div className="airpay__transaction-amount">-${transaction.amount.toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <div className="airpay__transaction-empty">
                  <Icon name="inbox" size={32} className="airpay__transaction-empty-icon" />
                  <p>No transactions yet</p>
                  <Link to="/expenses/add" className="airpay__transaction-add-link">
                    Add your first expense
                  </Link>
                </div>
              )}
            </div>
          </div>


          <div className="airpay__chart">
            <div className="airpay__chart-header">
              <h3 className="airpay__chart-title">Expenses classification</h3>
              <select
                className="airpay__period"
                value={selectedPeriod}
                onChange={(event) => setSelectedPeriod(Number(event.target.value))}
              >
                <option value={1}>Last month</option>
                <option value={3}>Last 3 months</option>
                <option value={6}>Last 6 months</option>
                <option value={12}>Last year</option>
              </select>
            </div>

            <div className="airpay__chart-container">
              <div className="airpay__chart-bars">
                {monthlyChartData.map((data) => (
                  <div key={data.month} className="airpay__chart-column">
                    <div className="airpay__chart-bar-group">
                      <div
                        className="airpay__chart-bar airpay__chart-bar--income"
                        style={{ height: `${(data.income / maxOutcomeValue) * 100}%` }}
                        title={`Income: $${data.income.toFixed(0)}`}
                      />
                      <div
                        className="airpay__chart-bar airpay__chart-bar--outcome"
                        style={{ height: `${(data.outcome / maxOutcomeValue) * 100}%` }}
                        title={`Expenses: $${data.outcome.toFixed(0)}`}
                      />
                    </div>
                    <div className="airpay__chart-label">{data.month}</div>
                  </div>
                ))}
              </div>

              <div className="airpay__chart-legend">
                <div className="airpay__chart-legend-item">
                  <span className="airpay__chart-legend-color airpay__chart-legend-color--income" />
                  <span>Income</span>
                </div>
                <div className="airpay__chart-legend-item">
                  <span className="airpay__chart-legend-color airpay__chart-legend-color--outcome" />
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






