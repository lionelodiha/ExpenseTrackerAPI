import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ModernDashboardLayout from "../components/layout/ModernDashboardLayout";
import type { CreateExpenseResponse } from "../dtos/expenses/create-expense-response";
import { expenseService } from "../services/expense-service";
import "../styles/modern-theme.css";
import "./ModernExpensesPage.css";

const ModernExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<CreateExpenseResponse[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await expenseService.getAll(controller.signal);
        setExpenses(response.data ?? []);
        setError("");
      } catch (err) {
        if (isAbortError(err)) {
          return;
        }

        setError("Failed to fetch expenses.");
        if ((err as { response?: { status?: number } })?.response?.status === 404) {
          setExpenses([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();

    return () => controller.abort();
  }, []);

  const filteredExpenses = useMemo(() => {
    if (!filter) return expenses;
    return expenses.filter((expense) => expense.category === filter);
  }, [expenses, filter]);

  const totalExpenses = useMemo(
    () => filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [filteredExpenses],
  );

  const thisMonthExpenses = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return filteredExpenses
      .filter((expense) => {
        const date = new Date(expense.dateOfExpense);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  const categories = useMemo(() => {
    return Array.from(new Set(expenses.map((e) => e.category)));
  }, [expenses]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmed) {
      return;
    }

    try {
      await expenseService.deleteById(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch {
      setError("Failed to delete expense.");
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Food: "🍽️",
      Transport: "🚗",
      Entertainment: "🎬",
      Healthcare: "🏥",
      Shopping: "🛍️",
      Bills: "📄",
      Other: "📦",
    };

    return icons[category] || "💳";
  };

  const headerActions = (
    <Link to="/expenses/add" className="modern-btn modern-btn--primary">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Add Expense
    </Link>
  );

  return (
    <ModernDashboardLayout
      activeNav="expenses"
      headerTitle="Expenses"
      headerSubtitle="Track and manage your transactions"
      headerActions={headerActions}
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

      {/* Stats */}
      <div className="modern-grid modern-grid--3" style={{ marginBottom: "2rem" }}>
        <div className="modern-stat-card">
          <div className="modern-stat-card__header">
            <div className="modern-stat-card__icon" style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>💸</div>
          </div>
          <p className="modern-stat-card__label">Total Expenses</p>
          <h3 className="modern-stat-card__value">${totalExpenses.toFixed(2)}</h3>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-card__header">
            <div className="modern-stat-card__icon" style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}>📊</div>
          </div>
          <p className="modern-stat-card__label">Transactions</p>
          <h3 className="modern-stat-card__value">{filteredExpenses.length}</h3>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-card__header">
            <div className="modern-stat-card__icon" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>📅</div>
          </div>
          <p className="modern-stat-card__label">This Month</p>
          <h3 className="modern-stat-card__value">${thisMonthExpenses.toFixed(2)}</h3>
        </div>
      </div>

      {/* Table */}
      <div className="modern-card">
        <div className="modern-card__header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 className="modern-card__title">All Transactions</h2>
            <p className="modern-card__subtitle">Review and manage your expense history</p>
          </div>

          {/* Filter */}
          <div className="modern-filter">
            <label htmlFor="category-filter" className="modern-filter__label">Category:</label>
            <select
              id="category-filter"
              className="modern-input"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: 'auto', minWidth: '150px' }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="modern-loading">
            <div className="modern-spinner" />
            <p>Loading expenses...</p>
          </div>
        ) : filteredExpenses.length ? (
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>
                      <div className="modern-table-category">
                        <span className="modern-table-category__icon">{getCategoryIcon(expense.category)}</span>
                        <span className="modern-badge modern-badge--gray">{expense.category}</span>
                      </div>
                    </td>
                    <td>
                      <div className="modern-table-description">
                        {expense.description || expense.category}
                      </div>
                    </td>
                    <td>
                      <div className="modern-table-date">
                        {new Date(expense.dateOfExpense).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td>
                      {expense.paymentMethod ? (
                        <span className="modern-badge modern-badge--info">{expense.paymentMethod}</span>
                      ) : (
                        <span className="modern-table-empty">—</span>
                      )}
                    </td>
                    <td>
                      <div className="modern-table-amount">
                        ${expense.amount.toFixed(2)}
                      </div>
                    </td>
                    <td>
                      <div className="modern-table-actions">
                        <Link
                          to={`/expenses/edit/${expense.id}`}
                          className="modern-btn modern-btn--ghost modern-btn--sm"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(expense.id)}
                          className="modern-btn modern-btn--ghost modern-btn--sm modern-btn--danger"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="modern-empty-state">
            <div className="modern-empty-state__icon">🧾</div>
            <h3 className="modern-empty-state__title">No expenses found</h3>
            <p className="modern-empty-state__text">
              {filter ? "Try changing your filter or add a new expense" : "Add your first transaction to start tracking"}
            </p>
            <Link to="/expenses/add" className="modern-btn modern-btn--primary modern-btn--sm">
              Add Expense
            </Link>
          </div>
        )}
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

export default ModernExpensesPage;
