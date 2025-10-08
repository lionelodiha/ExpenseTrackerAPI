import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { CreateExpenseResponse } from "../dtos/expenses/create-expense-response";
import { expenseService } from "../services/expense-service";
import { useAuth } from "../hooks/auth-hook";
import { Icon, type IconName } from "../components/Icon";
import { ThemeToggle } from "../components/ThemeToggle";
import "./ExpensesPage.css";

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

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<CreateExpenseResponse[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseService.getAll();
      setExpenses(response.data ?? []);
      setError("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError("Failed to fetch expenses.");
      if (err?.response?.status === 404) {
        setExpenses([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      await expenseService.deleteById(id);
      fetchExpenses();
    } catch {
      setError("Failed to delete expense.");
    }
  };

  const allCategories = useMemo(() => {
    const set = new Set(expenses.map((expense) => expense.category));
    return ["All", ...Array.from(set).sort()];
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    if (selectedCategory === "All") {
      return expenses;
    }
    return expenses.filter((expense) => expense.category === selectedCategory);
  }, [expenses, selectedCategory]);

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  const monthExpenses = useMemo(() => {
    const now = new Date();
    return expenses
      .filter((expense) => {
        const date = new Date(expense.dateOfExpense);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const weekExpenses = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    return expenses
      .filter((expense) => {
        const date = new Date(expense.dateOfExpense);
        return date >= startOfWeek && date <= now;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const categoryBreakdown = useMemo(() => {
    const totals = expenses.reduce<Map<string, number>>((map, expense) => {
      map.set(expense.category, (map.get(expense.category) ?? 0) + expense.amount);
      return map;
    }, new Map());

    const sorted = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 4);
  }, [expenses]);

  const resolveCategoryIcon = (category: string): IconName => CATEGORY_ICON_MAP[category] ?? "other";

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

        <div className="airpay__premium">
          <div className="airpay__premium-badge">
            <Icon name="premium" size={22} />
          </div>
          <h3 className="airpay__premium-title">Insights Plus</h3>
          <p className="airpay__premium-text">
            Explore premium analytics, category trends, and automated budgeting recommendations.
          </p>
          <button className="airpay__premium-btn" type="button">
            <span>Upgrade</span>
            <Icon name="arrow-up-right" size={18} className="airpay__premium-icon" />
          </button>
        </div>

        <button onClick={logout} className="airpay__logout" type="button">
          <span>Logout</span>
          <Icon name="arrow-right" size={18} className="airpay__logout-icon" />
        </button>
      </aside>

      {/* Main Content */}
      <main className="airpay__main">
        <header className="airpay__header">
          <div className="airpay__search">
            <Icon name="search" size={20} className="airpay__search-icon" />
            <input type="search" placeholder="Search expenses..." className="airpay__search-input" />
          </div>

          <div className="airpay__header-actions">
            <ThemeToggle />
            <div className="airpay__date">
              <Icon name="calendar" size={18} />
              <span>{new Date().toLocaleDateString("en-GB")}</span>
            </div>
            <button type="button" className="airpay__notification" aria-label="Notifications">
              <Icon name="bell" size={18} />
            </button>
            <div className="airpay__user">
              <img
                src="https://i.pravatar.cc/150?img=39"
                alt={user?.firstName ?? "User avatar"}
                className="airpay__user-avatar"
              />
              <span className="airpay__user-name">{user?.firstName ?? user?.email ?? "Guest"}</span>
            </div>
          </div>
        </header>

        {error && <div className="airpay__error">{error}</div>}

        <div className="expenses">
          <section className="expenses__header">
            <div>
              <h2 className="expenses__title">Expenses overview</h2>
              <p className="expenses__subtitle">Track and manage every transaction with clarity.</p>
            </div>
            <Link to="/expenses/add" className="expenses__primary-action">
              <Icon name="plus" size={18} />
              <span>Add expense</span>
            </Link>
          </section>

          <section className="expenses__stats">
            <article className="expenses__stat-card">
              <div className="expenses__stat-icon">
                <Icon name="wallet" size={22} />
              </div>
              <div>
                <p className="expenses__stat-label">Total spent</p>
                <h3 className="expenses__stat-value">${totalExpenses.toFixed(2)}</h3>
              </div>
            </article>
            <article className="expenses__stat-card">
              <div className="expenses__stat-icon expenses__stat-icon--accent">
                <Icon name="trend-down" size={22} />
              </div>
              <div>
                <p className="expenses__stat-label">This month</p>
                <h3 className="expenses__stat-value">${monthExpenses.toFixed(2)}</h3>
              </div>
            </article>
            <article className="expenses__stat-card">
              <div className="expenses__stat-icon expenses__stat-icon--muted">
                <Icon name="clock" size={22} />
              </div>
              <div>
                <p className="expenses__stat-label">This week</p>
                <h3 className="expenses__stat-value">${weekExpenses.toFixed(2)}</h3>
              </div>
            </article>
            <article className="expenses__stat-card">
              <div className="expenses__stat-icon expenses__stat-icon--neutral">
                <Icon name="expenses" size={22} />
              </div>
              <div>
                <p className="expenses__stat-label">Transactions</p>
                <h3 className="expenses__stat-value">{expenses.length}</h3>
              </div>
            </article>
          </section>

          <section className="expenses__body">
            <div className="expenses__list-panel">
              <div className="expenses__list-header">
                <h3>Recent expenses</h3>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="expenses__filter"
                >
                  {allCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="expenses__empty">
                  <Icon name="inbox" size={32} />
                  <p>Loading expenses...</p>
                </div>
              ) : filteredExpenses.length > 0 ? (
                <ul className="expenses__list">
                  {filteredExpenses.map((expense) => (
                    <li key={expense.id} className="expenses__item">
                      <div className="expenses__item-icon">
                        <Icon name={resolveCategoryIcon(expense.category)} size={22} />
                      </div>

                      <div className="expenses__item-details">
                        <div className="expenses__item-heading">
                          <h4>{expense.description || expense.category}</h4>
                          <span className="expenses__item-amount">-${expense.amount.toFixed(2)}</span>
                        </div>
                        <div className="expenses__item-meta">
                          <span className="expenses__item-chip">{expense.category}</span>
                          <span>
                            {new Date(expense.dateOfExpense).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          {expense.paymentMethod && <span>{expense.paymentMethod}</span>}
                        </div>
                      </div>

                      <div className="expenses__item-actions">
                        <Link
                          to={`/expenses/edit/${expense.id}`}
                          className="expenses__action expenses__action--edit"
                          aria-label="Edit expense"
                        >
                          <Icon name="edit" size={18} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(expense.id)}
                          className="expenses__action expenses__action--delete"
                          aria-label="Delete expense"
                        >
                          <Icon name="trash" size={18} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="expenses__empty">
                  <Icon name="inbox" size={36} />
                  <h4>No expenses yet</h4>
                  <p>Start tracking your spending by adding your first record.</p>
                  <Link to="/expenses/add" className="expenses__primary-action expenses__primary-action--ghost">
                    <Icon name="plus" size={18} />
                    <span>Add your first expense</span>
                  </Link>
                </div>
              )}
            </div>

            <aside className="expenses__insights">
              <div className="expenses__insight-card">
                <h4>Top categories</h4>
                <ul>
                  {categoryBreakdown.length > 0 ? (
                    categoryBreakdown.map(([category, amount]) => (
                      <li key={category}>
                        <div className="expenses__insight-icon">
                          <Icon name={resolveCategoryIcon(category)} size={18} />
                        </div>
                        <div className="expenses__insight-details">
                          <span>{category}</span>
                          <small>{((amount / totalExpenses) * 100 || 0).toFixed(1)}% of total</small>
                        </div>
                        <strong>${amount.toFixed(2)}</strong>
                      </li>
                    ))
                  ) : (
                    <li className="expenses__insight-empty">
                      <Icon name="inbox" size={24} />
                      <span>No categories yet</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="expenses__insight-card">
                <h4>Quick actions</h4>
                <button type="button" className="expenses__quick-action">
                  <Icon name="arrow-up-right" size={18} />
                  <span>Export transactions</span>
                </button>
                <button type="button" className="expenses__quick-action">
                  <Icon name="filter" size={18} />
                  <span>Manage categories</span>
                </button>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ExpensesPage;




