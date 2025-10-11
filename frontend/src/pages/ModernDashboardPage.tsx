import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ModernDashboardLayout from "../components/layout/ModernDashboardLayout";
import type { DashboardSummaryResponse } from "../dtos/dashboards/dashboard-summary-response";
import { dashboardService } from "../services/dashboard-service";
import "../styles/modern-theme.css";
import "./ModernDashboardPage.css";

const ModernDashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getDashboardSummary(controller.signal);
        setSummary(response.data ?? null);
      } catch (err) {
        if (isAbortError(err)) {
          return;
        }

        const message =
          err instanceof Error
            ? err.message
            : (err as { message?: string })?.message ?? "Unknown error";

        setError(`Failed to fetch dashboard summary: ${message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();

    return () => {
      controller.abort();
    };
  }, []);

  const stats = useMemo(() => {
    const balanceChange = summary?.balance && summary?.startingBalance
      ? ((summary.balance - summary.startingBalance) / summary.startingBalance) * 100
      : 0;

    return {
      balance: summary?.balance ?? 0,
      totalExpenses: summary?.totalExpenses ?? 0,
      totalSavings: summary?.totalSavings ?? 0,
      balanceChange,
    };
  }, [summary]);

  const headerSubtitle = useMemo(() => {
    const formattedDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate;
  }, []);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Food: "🍽️",
      Transport: "🚗",
      Entertainment: "🎬",
      Shopping: "🛍️",
      Bills: "📄",
      Health: "💊",
      Other: "📦",
    };
    return icons[category] || "💳";
  };

  return (
    <ModernDashboardLayout
      activeNav="dashboard"
      headerTitle="Dashboard"
      headerSubtitle={headerSubtitle}
      headerActions={
        <Link to="/expenses/add" className="modern-btn modern-btn--primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Expense
        </Link>
      }
    >
      {error && (
        <div className="modern-alert modern-alert--danger">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="modern-grid modern-grid--3" style={{ marginBottom: "2rem" }}>
        <div className="modern-stat-card">
          <div className="modern-stat-card__header">
            <div className="modern-stat-card__icon">💵</div>
          </div>
          <p className="modern-stat-card__label">Current Balance</p>
          <h3 className="modern-stat-card__value">
            ${stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className={`modern-stat-card__trend ${stats.balanceChange >= 0 ? 'modern-stat-card__trend--up' : 'modern-stat-card__trend--down'}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {stats.balanceChange >= 0 ? (
                <polyline points="18 15 12 9 6 15"/>
              ) : (
                <polyline points="6 9 12 15 18 9"/>
              )}
            </svg>
            {Math.abs(stats.balanceChange).toFixed(1)}% from start
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-card__header">
            <div className="modern-stat-card__icon" style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>💸</div>
          </div>
          <p className="modern-stat-card__label">Total Expenses</p>
          <h3 className="modern-stat-card__value">
            ${stats.totalExpenses.toFixed(2)}
          </h3>
          <div className="modern-stat-card__trend">
            <span style={{ color: 'var(--color-gray-500)' }}>This month</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-card__header">
            <div className="modern-stat-card__icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>💰</div>
          </div>
          <p className="modern-stat-card__label">Total Savings</p>
          <h3 className="modern-stat-card__value">
            ${stats.totalSavings.toFixed(2)}
          </h3>
          <div className="modern-stat-card__trend modern-stat-card__trend--up">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            Saved to date
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="modern-grid modern-grid--2">
        {/* Recent Transactions */}
        <div className="modern-card">
          <div className="modern-card__header">
            <div>
              <h2 className="modern-card__title">Recent Transactions</h2>
              <p className="modern-card__subtitle">Your latest activity</p>
            </div>
            <Link to="/expenses" className="modern-btn modern-btn--ghost modern-btn--sm">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="modern-loading">
              <div className="modern-spinner" />
              <p>Loading transactions...</p>
            </div>
          ) : summary?.recentTransactions?.length ? (
            <div className="modern-transaction-list">
              {summary.recentTransactions.slice(0, 6).map((transaction, index) => (
                <div key={`${transaction.description}-${index}`} className="modern-transaction-item">
                  <div className="modern-transaction-item__icon">
                    {getCategoryIcon(transaction.category)}
                  </div>
                  <div className="modern-transaction-item__content">
                    <div className="modern-transaction-item__title">
                      {transaction.description || transaction.category}
                    </div>
                    <div className="modern-transaction-item__meta">
                      <span className="modern-badge modern-badge--gray">{transaction.category}</span>
                      <span className="modern-transaction-item__date">
                        {transaction.dateOfExpense
                          ? new Date(transaction.dateOfExpense).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                  <div className="modern-transaction-item__amount">
                    -${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="modern-empty-state">
              <div className="modern-empty-state__icon">📊</div>
              <h3 className="modern-empty-state__title">No transactions yet</h3>
              <p className="modern-empty-state__text">Start tracking your expenses to see them here</p>
              <Link to="/expenses/add" className="modern-btn modern-btn--primary modern-btn--sm">
                Add First Expense
              </Link>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="modern-card">
          <div className="modern-card__header">
            <div>
              <h2 className="modern-card__title">Spending by Category</h2>
              <p className="modern-card__subtitle">Top categories this month</p>
            </div>
          </div>

          {loading ? (
            <div className="modern-loading">
              <div className="modern-spinner" />
              <p>Loading categories...</p>
            </div>
          ) : summary?.categoryBreakdown?.length ? (
            <div className="modern-category-list">
              {summary.categoryBreakdown.slice(0, 6).map((category) => {
                const percentage = summary.totalExpenses > 0
                  ? (category.totalSpent / summary.totalExpenses) * 100
                  : 0;

                return (
                  <div key={category.category} className="modern-category-item">
                    <div className="modern-category-item__header">
                      <div className="modern-category-item__left">
                        <span className="modern-category-item__icon">
                          {getCategoryIcon(category.category)}
                        </span>
                        <span className="modern-category-item__name">{category.category}</span>
                      </div>
                      <span className="modern-category-item__amount">
                        ${category.totalSpent.toFixed(2)}
                      </span>
                    </div>
                    <div className="modern-progress-bar">
                      <div
                        className="modern-progress-bar__fill"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="modern-category-item__percentage">
                      {percentage.toFixed(1)}% of total
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="modern-empty-state">
              <div className="modern-empty-state__icon">📂</div>
              <h3 className="modern-empty-state__title">No categories yet</h3>
              <p className="modern-empty-state__text">Add expenses to see category breakdown</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="modern-quick-actions">
        <h3 className="modern-quick-actions__title">Quick Actions</h3>
        <div className="modern-quick-actions__grid">
          <Link to="/expenses/add" className="modern-quick-action-card">
            <div className="modern-quick-action-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div className="modern-quick-action-card__title">Add Expense</div>
            <div className="modern-quick-action-card__description">Track a new transaction</div>
          </Link>

          <Link to="/savings/add" className="modern-quick-action-card">
            <div className="modern-quick-action-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"/>
              </svg>
            </div>
            <div className="modern-quick-action-card__title">Create Goal</div>
            <div className="modern-quick-action-card__description">Set a new savings target</div>
          </Link>

          <Link to="/expenses" className="modern-quick-action-card">
            <div className="modern-quick-action-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="modern-quick-action-card__title">View All Expenses</div>
            <div className="modern-quick-action-card__description">Manage your transactions</div>
          </Link>

          <Link to="/savings" className="modern-quick-action-card">
            <div className="modern-quick-action-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="20" x2="12" y2="10"/>
                <line x1="18" y1="20" x2="18" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="16"/>
              </svg>
            </div>
            <div className="modern-quick-action-card__title">Savings Goals</div>
            <div className="modern-quick-action-card__description">Track your progress</div>
          </Link>
        </div>
      </div>
    </ModernDashboardLayout>
  );
};

const isAbortError = (err: unknown) => {
  if (!err) {
    return false;
  }

  if (err instanceof DOMException && err.name === "AbortError") {
    return true;
  }

  return (err as { name?: string }).name === "CanceledError";
};

export default ModernDashboardPage;
