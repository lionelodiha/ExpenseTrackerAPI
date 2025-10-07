import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { savingGoalService } from "../services/saving-goal-service";
import type { CreateSavingGoalResponse } from "../dtos/saving-goals/create-saving-goal-response";
import { useAuth } from "../hooks/auth-hook";
import { Icon, type IconName } from "../components/Icon";
import "./SavingsPage.css";

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

const STATUS_ICON_MAP: Record<string, IconName> = {
  Completed: "trend-up",
  Active: "piggy-bank",
  Pending: "clock",
};

const SavingsPage: React.FC = () => {
  const [goals, setGoals] = useState<CreateSavingGoalResponse[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await savingGoalService.getAll();
      setGoals(response.data ?? []);
      setError("");
    } catch (err: any) {
      setError("Failed to fetch savings goals.");
      if (err?.response?.status === 404) {
        setGoals([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this savings goal?")) {
      return;
    }

    try {
      await savingGoalService.deleteById(id);
      fetchGoals();
    } catch {
      setError("Failed to delete saving goal.");
    }
  };

  const totals = useMemo(() => {
    const totalSaved = goals.reduce((sum, goal) => sum + (goal.currentAmount ?? 0), 0);
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const completed = goals.filter((goal) => goal.status === "Completed").length;
    const progress = totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;
    const averageProgress =
      goals.length > 0
        ? goals.reduce((sum, goal) => {
            if (!goal.targetAmount) {
              return sum;
            }
            const current = goal.currentAmount ?? 0;
            return sum + (current / goal.targetAmount) * 100;
          }, 0) / goals.length
        : 0;

    return { totalSaved, totalTarget, completed, active: goals.length - completed, progress, averageProgress };
  }, [goals]);

  return (
    <div className="airpay">
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
          <h3 className="airpay__premium-title">Plan ahead</h3>
          <p className="airpay__premium-text">
            Unlock automated savings journeys, goal templates, and contextual nudges.
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

      <main className="airpay__main">
        <header className="airpay__header">
          <div className="airpay__search">
            <Icon name="search" size={20} className="airpay__search-icon" />
            <input type="search" placeholder="Search savings goals..." className="airpay__search-input" />
          </div>

          <div className="airpay__header-actions">
            <div className="airpay__date">
              <Icon name="calendar" size={18} />
              <span>{new Date().toLocaleDateString("en-GB")}</span>
            </div>
            <button type="button" className="airpay__notification" aria-label="Notifications">
              <Icon name="bell" size={18} />
            </button>
            <div className="airpay__user">
              <img
                src="https://i.pravatar.cc/150?img=45"
                alt={user?.firstName ?? "User avatar"}
                className="airpay__user-avatar"
              />
              <span className="airpay__user-name">{user?.firstName ?? user?.email ?? "Guest"}</span>
            </div>
          </div>
        </header>

        {error && <div className="airpay__error">{error}</div>}

        <div className="savings">
          <section className="savings__header">
            <div>
              <h2>Savings goals</h2>
              <p>Build momentum toward every financial milestone.</p>
            </div>
            <Link to="/savings/add" className="savings__primary-action">
              <Icon name="plus" size={18} />
              <span>Add goal</span>
            </Link>
          </section>

          <section className="savings__overview">
            <article className="savings__progress-card">
              <div className="savings__progress-headline">
                <div>
                  <p>Total savings progress</p>
                  <strong>{totals.progress.toFixed(1)}%</strong>
                </div>
                <Icon name="piggy-bank" size={22} />
              </div>
              <div className="savings__progress-amounts">
                <div>
                  <span>Saved</span>
                  <h3>${totals.totalSaved.toFixed(2)}</h3>
                </div>
                <div>
                  <span>Target</span>
                  <h3>${totals.totalTarget.toFixed(2)}</h3>
                </div>
              </div>
              <div className="savings__progress-bar">
                <div style={{ width: `${totals.progress}%` }} />
              </div>
            </article>

            <div className="savings__stats">
              <div className="savings__stat-card">
                <Icon name="piggy-bank" size={20} />
                <div>
                  <span>Active goals</span>
                  <strong>{totals.active}</strong>
                </div>
              </div>
              <div className="savings__stat-card savings__stat-card--accent">
                <Icon name="trend-up" size={20} />
                <div>
                  <span>Completed</span>
                  <strong>{totals.completed}</strong>
                </div>
              </div>
              <div className="savings__stat-card savings__stat-card--neutral">
                <Icon name="wallet" size={20} />
                <div>
                  <span>Average progress</span>
                  <strong>
                    {totals.averageProgress.toFixed(1)}
                    %
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <section className="savings__body">
            {loading ? (
              <div className="savings__empty">
                <Icon name="inbox" size={32} />
                <p>Loading savings goals...</p>
              </div>
            ) : goals.length > 0 ? (
              <div className="savings__grid">
                {goals.map((goal) => {
                  const currentAmount = goal.currentAmount ?? 0;
                  const progress = goal.targetAmount > 0 ? Math.min((currentAmount / goal.targetAmount) * 100, 100) : 0;
                  return (
                    <article
                      key={goal.id}
                      className={`savings__goal-card ${goal.status === "Completed" ? "savings__goal-card--completed" : ""}`}
                    >
                      <header className="savings__goal-header">
                        <div>
                          <h3>{goal.title}</h3>
                          {goal.description ? <p>{goal.description}</p> : null}
                        </div>
                        <span className={`savings__status savings__status--${goal.status.toLowerCase()}`}>
                          <Icon name={STATUS_ICON_MAP[goal.status] ?? "piggy-bank"} size={16} />
                          {goal.status}
                        </span>
                      </header>

                      <div className="savings__goal-amounts">
                        <div>
                          <span>Current</span>
                          <strong>${(goal.currentAmount ?? 0).toFixed(2)}</strong>
                        </div>
                        <div>
                          <span>Target</span>
                          <strong>${goal.targetAmount.toFixed(2)}</strong>
                        </div>
                      </div>

                      <div className="savings__goal-progress">
                        <div style={{ width: `${progress}%` }} />
                      </div>
                      <span className="savings__goal-progress-text">{progress.toFixed(1)}% complete</span>

                      <div className="savings__goal-actions">
                        <Link to={`/savings/edit/${goal.id}`} className="savings__goal-action savings__goal-action--edit">
                          <Icon name="edit" size={18} />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(goal.id)}
                          className="savings__goal-action savings__goal-action--delete"
                        >
                          <Icon name="trash" size={18} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="savings__empty">
                <Icon name="inbox" size={36} />
                <h3>No savings goals yet</h3>
                <p>Start building your future by creating your first savings goal.</p>
                <Link to="/savings/add" className="savings__primary-action savings__primary-action--ghost">
                  <Icon name="plus" size={18} />
                  <span>Create first goal</span>
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default SavingsPage;


