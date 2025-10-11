import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./SavingsPage.css";
import type { CreateSavingGoalResponse } from "../dtos/saving-goals/create-saving-goal-response";
import { savingGoalService } from "../services/saving-goal-service";

const SavingsPage: React.FC = () => {
  const [goals, setGoals] = useState<CreateSavingGoalResponse[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const response = await savingGoalService.getAll();
        setGoals(response.data ?? []);
        setError("");
      } catch {
        setError("Failed to fetch savings goals.");
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const totals = useMemo(() => {
    const totalSaved = goals.reduce((sum, goal) => sum + (goal.currentAmount ?? 0), 0);
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const progress = totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

    return { totalSaved, totalTarget, progress };
  }, [goals]);

  const headerActions = useMemo(
    () => (
      <Link to="/savings/add" className="dashboard-button dashboard-button--primary">
        Create Goal
      </Link>
    ),
    [],
  );

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this savings goal?");
    if (!confirmed) {
      return;
    }

    try {
      await savingGoalService.deleteById(id);
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
    } catch {
      setError("Failed to delete saving goal.");
    }
  };

  return (
    <DashboardLayout
      activeNav="savings"
      headerTitle="Savings Goals"
      headerSubtitle="Stay motivated and watch your progress grow"
      headerActions={headerActions}
    >
      {error ? <div className="dashboard__error">{error}</div> : null}

      <section className="savings-page">
        <div className="savings-page__overview">
          <div className="savings-page__summary-card">
            <div className="savings-page__summary-header">
              <h2>Total progress</h2>
              <span className="savings-page__summary-percentage">
                {totals.progress.toFixed(1)}%
              </span>
            </div>
            <div className="savings-page__summary-amounts">
              <div>
                <p className="savings-page__summary-label">Saved</p>
                <p className="savings-page__summary-value">${totals.totalSaved.toFixed(2)}</p>
              </div>
              <div>
                <p className="savings-page__summary-label">Target</p>
                <p className="savings-page__summary-value">${totals.totalTarget.toFixed(2)}</p>
              </div>
            </div>
            <div className="savings-page__progress">
              <div
                className="savings-page__progress-bar"
                style={{ width: `${totals.progress}%` }}
                aria-valuenow={totals.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          <div className="savings-page__stat-grid">
            <div className="savings-page__stat-card">
              <div className="savings-page__stat-icon">🎯</div>
              <div>
                <p className="savings-page__stat-label">Active goals</p>
                <p className="savings-page__stat-value">{goals.length}</p>
              </div>
            </div>
            <div className="savings-page__stat-card">
              <div className="savings-page__stat-icon">✅</div>
              <div>
                <p className="savings-page__stat-label">Completed</p>
                <p className="savings-page__stat-value">
                  {goals.filter((goal) => goal.status === "Completed").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="savings-page__placeholder">Loading savings goals...</div>
        ) : goals.length ? (
          <div className="savings-page__grid">
            {goals.map((goal) => {
              const progress =
                goal.targetAmount > 0
                  ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
                  : 0;
              const statusVariant = goal.status
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z-]/g, "");

              return (
                <article
                  key={goal.id}
                  className={`savings-goal-card savings-goal-card--${statusVariant}`}
                >
                  <header className="savings-goal-card__header">
                    <h3>{goal.title}</h3>
                    <span className={`savings-goal-card__status savings-goal-card__status--${statusVariant}`}>
                      {goal.status}
                    </span>
                  </header>

                  {goal.description ? (
                    <p className="savings-goal-card__description">{goal.description}</p>
                  ) : null}

                  <div className="savings-goal-card__amounts">
                    <div>
                      <p className="savings-goal-card__label">Current</p>
                      <p className="savings-goal-card__value">
                        ${goal.currentAmount?.toFixed(2) ?? "0.00"}
                      </p>
                    </div>
                    <div>
                      <p className="savings-goal-card__label">Target</p>
                      <p className="savings-goal-card__value">${goal.targetAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="savings-goal-card__progress">
                    <div className="savings-goal-card__progress-track">
                      <div
                        className="savings-goal-card__progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="savings-goal-card__progress-text">
                      {progress.toFixed(1)}% complete
                    </span>
                  </div>

                  <div className="savings-goal-card__actions">
                    <Link
                      to={`/savings/edit/${goal.id}`}
                      className="savings-goal-card__action"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="savings-goal-card__action savings-goal-card__action--danger"
                      onClick={() => handleDelete(goal.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="savings-page__empty">
            <div className="savings-page__empty-icon">💡</div>
            <h3>No savings goals yet</h3>
            <p>Create your first goal to start building momentum.</p>
            <Link to="/savings/add" className="dashboard-button dashboard-button--secondary">
              Create Goal
            </Link>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default SavingsPage;
