import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import type { DashboardSummaryResponse } from "../dtos/dashboards/dashboard-summary-response";
import { dashboardService } from "../services/dashboard-service";

const DashboardPageRedesigned: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchSummary = async () => {
      try {
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
      }
    };

    fetchSummary();

    return () => {
      controller.abort();
    };
  }, []);

  const headerSubtitle = useMemo(() => {
    const formattedDate = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return `Here is your financial overview - ${formattedDate}`;
  }, []);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Food: "🍽️",
      Transport: "🚌",
      Entertainment: "🎬",
      Shopping: "🛍️",
      Bills: "🧾",
      Health: "💊",
      Other: "📦",
    };

    return icons[category] || "💸";
  };

  return (
    <DashboardLayout activeNav="dashboard" headerSubtitle={headerSubtitle}>
      {error ? <div className="dashboard__error">{error}</div> : null}

      <div className="dashboard__stats">
        <div className="dashboard__stat-card dashboard__stat-card--primary">
          <div className="dashboard__stat-icon">💵</div>
          <div className="dashboard__stat-content">
            <p className="dashboard__stat-label">Current Balance</p>
            <h3 className="dashboard__stat-value">
              ${summary?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? "0.00"}
            </h3>
            <p className="dashboard__stat-change">
              From ${summary?.startingBalance?.toLocaleString() ?? "0.00"} starting
            </p>
          </div>
        </div>

        <div className="dashboard__stat-card dashboard__stat-card--danger">
          <div className="dashboard__stat-icon">💸</div>
          <div className="dashboard__stat-content">
            <p className="dashboard__stat-label">Total Expenses</p>
            <h3 className="dashboard__stat-value">
              ${summary?.totalExpenses?.toFixed(2) ?? "0.00"}
            </h3>
            <p className="dashboard__stat-change">This month</p>
          </div>
        </div>

        <div className="dashboard__stat-card dashboard__stat-card--success">
          <div className="dashboard__stat-icon">💰</div>
          <div className="dashboard__stat-content">
            <p className="dashboard__stat-label">Total Savings</p>
            <h3 className="dashboard__stat-value">
              ${summary?.totalSavings?.toFixed(2) ?? "0.00"}
            </h3>
            <p className="dashboard__stat-change">Saved so far</p>
          </div>
        </div>
      </div>

      <div className="dashboard__content">
        <div className="dashboard__card dashboard__card--transactions">
          <div className="dashboard__card-header">
            <h3 className="dashboard__card-title">
              <span className="dashboard__card-title-icon">📝</span>
              Recent Transactions
            </h3>
            <Link to="/expenses" className="dashboard__card-link">
              View All &gt;
            </Link>
          </div>

          {summary?.recentTransactions?.length ? (
            <ul className="dashboard__transactions">
              {summary.recentTransactions.slice(0, 5).map((transaction, index) => (
                <li key={`${transaction.description}-${index}`} className="dashboard__transaction">
                  <div className="dashboard__transaction-icon">
                    {getCategoryIcon(transaction.category)}
                  </div>
                  <div className="dashboard__transaction-info">
                    <p className="dashboard__transaction-name">
                      {transaction.description || transaction.category}
                    </p>
                    <p className="dashboard__transaction-date">
                      {transaction.dateOfExpense
                        ? new Date(transaction.dateOfExpense).toLocaleDateString()
                        : "Recently"}
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

        <div className="dashboard__card dashboard__card--categories">
          <div className="dashboard__card-header">
            <h3 className="dashboard__card-title">
              <span className="dashboard__card-title-icon">📂</span>
              Top Categories
            </h3>
          </div>

          {summary?.categoryBreakdown?.length ? (
            <div className="dashboard__categories">
              {summary.categoryBreakdown.slice(0, 5).map((category) => (
                <div key={category.category} className="dashboard__category">
                  <div className="dashboard__category-header">
                    <span className="dashboard__category-name">
                      {getCategoryIcon(category.category)} {category.category}
                    </span>
                    <span className="dashboard__category-amount">
                      ${category.totalSpent.toFixed(2)}
                    </span>
                  </div>
                  <div className="dashboard__category-bar">
                    <div
                      className="dashboard__category-bar-fill"
                      style={{
                        width: `${Math.min(
                          (category.totalSpent / (summary?.totalExpenses || 1)) * 100,
                          100,
                        )}%`,
                      }}
                    />
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
    </DashboardLayout>
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

export default DashboardPageRedesigned;
