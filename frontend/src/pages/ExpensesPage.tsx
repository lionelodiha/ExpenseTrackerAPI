import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import type { CreateExpenseResponse } from "../dtos/expenses/create-expense-response";
import { expenseService } from "../services/expense-service";
import "./ExpensesPage.css";

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<CreateExpenseResponse[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

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

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );

  const thisMonthExpenses = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return expenses
      .filter((expense) => {
        const date = new Date(expense.dateOfExpense);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const headerActions = (
    <Link to="/expenses/add" className="dashboard-button dashboard-button--primary">
      Add Expense
    </Link>
  );

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
      Transport: "🚌",
      Entertainment: "🎬",
      Healthcare: "🏥",
      Shopping: "🛍️",
      Bills: "🧾",
      Other: "📦",
    };

    return icons[category] || "💳";
  };

  return (
    <DashboardLayout
      activeNav="expenses"
      headerTitle="Expenses"
      headerSubtitle="Track and manage every transaction"
      headerActions={headerActions}
    >
      {error ? <div className="dashboard__error">{error}</div> : null}

      <section className="expenses-page">
        <div className="expenses-page__stats">
          <article className="expenses-page__stat-card">
            <div className="expenses-page__stat-icon">💸</div>
            <div>
              <p className="expenses-page__stat-label">Total Expenses</p>
              <p className="expenses-page__stat-value">${totalExpenses.toFixed(2)}</p>
            </div>
          </article>

          <article className="expenses-page__stat-card">
            <div className="expenses-page__stat-icon">🧾</div>
            <div>
              <p className="expenses-page__stat-label">Total Transactions</p>
              <p className="expenses-page__stat-value">{expenses.length}</p>
            </div>
          </article>

          <article className="expenses-page__stat-card">
            <div className="expenses-page__stat-icon">📅</div>
            <div>
              <p className="expenses-page__stat-label">This Month</p>
              <p className="expenses-page__stat-value">${thisMonthExpenses.toFixed(2)}</p>
            </div>
          </article>
        </div>

        <div className="expenses-page__card">
          <div className="expenses-page__card-header">
            <div>
              <h2 className="expenses-page__card-title">Recent Expenses</h2>
              <p className="expenses-page__card-subtitle">
                Review the latest activity across all categories
              </p>
            </div>

            <div className="expenses-page__filters">
              <label className="expenses-page__filter">
                <span>Category</span>
                <select>
                  <option value="">All</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
          </div>

          {loading ? (
          <div className="expenses-page__placeholder">Loading expenses...</div>
          ) : expenses.length ? (
            <div className="expenses-page__list">
              {expenses.map((expense) => (
                <article key={expense.id} className="expenses-page__item">
                  <div className="expenses-page__item-icon">{getCategoryIcon(expense.category)}</div>
                  <div className="expenses-page__item-body">
                    <div className="expenses-page__item-header">
                      <h3>{expense.description || expense.category}</h3>
                      <span className="expenses-page__item-amount">
                        -${expense.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="expenses-page__item-meta">
                      <span className="expenses-page__pill">{expense.category}</span>
                      <span>
                        {new Date(expense.dateOfExpense).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {expense.paymentMethod ? (
                        <span className="expenses-page__pill expenses-page__pill--ghost">
                          {expense.paymentMethod}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="expenses-page__item-actions">
                    <Link
                      to={`/expenses/edit/${expense.id}`}
                      className="expenses-page__item-action"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(expense.id)}
                      className="expenses-page__item-action expenses-page__item-action--danger"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="expenses-page__empty">
              <div className="expenses-page__empty-icon">🧾</div>
              <h3>No expenses yet</h3>
              <p>Add your first transaction to start tracking your spending.</p>
              <Link to="/expenses/add" className="dashboard-button dashboard-button--secondary">
                Add First Expense
              </Link>
            </div>
          )}
        </div>
      </section>
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

export default ExpensesPage;
