import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ModernDashboardLayout from "../components/layout/ModernDashboardLayout";
import "../styles/modern-theme.css";
import "./ModernSavingsPage.css";
import type { CreateSavingGoalResponse } from "../dtos/saving-goals/create-saving-goal-response";
import { savingGoalService } from "../services/saving-goal-service";

const ModernSavingsPage: React.FC = () => {
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

  const activeGoals = useMemo(() => goals.filter(g => g.status !== "Completed"), [goals]);
  const completedGoals = useMemo(() => goals.filter(g => g.status === "Completed"), [goals]);

  const headerActions = (
    <Link to="/savings/add" className="modern-btn modern-btn--primary">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Create Goal
    </Link>
  );

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this savings goal?");
    if (!confirmed) return;

    try {
      await savingGoalService.deleteById(id);
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
    } catch {
      setError("Failed to delete saving goal.");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      "Completed": "modern-badge--success",
      "In Progress": "modern-badge--info",
      "Active": "modern-badge--info",
      "Paused": "modern-badge--warning",
    };
    return statusMap[status] || "modern-badge--gray";
  };

  return (
    <ModernDashboardLayout
      activeNav="savings"
      headerTitle="Savings Goals"
      headerSubtitle="Track and achieve your financial targets"
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

      {/* Overview Stats */}
      <div className="modern-card" style={{ marginBottom: "2rem" }}>
        <div className="savings-overview">
          <div className="savings-overview__left">
            <h3 className="savings-overview__title">Total Progress</h3>
            <div className="savings-overview__amount">${totals.totalSaved.toFixed(2)}</div>
            <div className="savings-overview__target">of ${totals.totalTarget.toFixed(2)} goal</div>
            <div className="savings-overview__progress">
              <div className="savings-overview__progress-bar">
                <div
                  className="savings-overview__progress-fill"
                  style={{ width: `${totals.progress}%` }}
                />
              </div>
              <span className="savings-overview__percentage">{totals.progress.toFixed(1)}%</span>
            </div>
          </div>
          <div className="savings-overview__stats">
            <div className="savings-overview__stat">
              <div className="savings-overview__stat-icon" style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}>🎯</div>
              <div>
                <div className="savings-overview__stat-label">Active Goals</div>
                <div className="savings-overview__stat-value">{activeGoals.length}</div>
              </div>
            </div>
            <div className="savings-overview__stat">
              <div className="savings-overview__stat-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>✅</div>
              <div>
                <div className="savings-overview__stat-label">Completed</div>
                <div className="savings-overview__stat-value">{completedGoals.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="modern-loading">
          <div className="modern-spinner" />
          <p>Loading savings goals...</p>
        </div>
      ) : goals.length ? (
        <div className="modern-savings-grid">
          {goals.map((goal) => {
            const progress = goal.targetAmount > 0
              ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
              : 0;

            return (
              <div key={goal.id} className="modern-savings-card">
                <div className="modern-savings-card__header">
                  <h3 className="modern-savings-card__title">{goal.title}</h3>
                  <span className={`modern-badge ${getStatusBadge(goal.status)}`}>
                    {goal.status}
                  </span>
                </div>

                {goal.description && (
                  <p className="modern-savings-card__description">{goal.description}</p>
                )}

                <div className="modern-savings-card__amounts">
                  <div className="modern-savings-card__amount-item">
                    <div className="modern-savings-card__amount-label">Current</div>
                    <div className="modern-savings-card__amount-value">
                      ${goal.currentAmount?.toFixed(2) ?? "0.00"}
                    </div>
                  </div>
                  <div className="modern-savings-card__amount-divider" />
                  <div className="modern-savings-card__amount-item">
                    <div className="modern-savings-card__amount-label">Target</div>
                    <div className="modern-savings-card__amount-value">
                      ${goal.targetAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="modern-savings-card__progress">
                  <div className="modern-savings-card__progress-bar">
                    <div
                      className="modern-savings-card__progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="modern-savings-card__progress-info">
                    <span className="modern-savings-card__progress-text">
                      {progress.toFixed(1)}% complete
                    </span>
                    <span className="modern-savings-card__progress-remaining">
                      ${(goal.targetAmount - goal.currentAmount).toFixed(2)} to go
                    </span>
                  </div>
                </div>

                <div className="modern-savings-card__actions">
                  <Link
                    to={`/savings/edit/${goal.id}`}
                    className="modern-btn modern-btn--secondary modern-btn--sm"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(goal.id)}
                    className="modern-btn modern-btn--ghost modern-btn--sm modern-btn--danger"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="modern-empty-state" style={{ marginTop: '3rem' }}>
          <div className="modern-empty-state__icon">💡</div>
          <h3 className="modern-empty-state__title">No savings goals yet</h3>
          <p className="modern-empty-state__text">
            Create your first goal to start building your financial future
          </p>
          <Link to="/savings/add" className="modern-btn modern-btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create First Goal
          </Link>
        </div>
      )}
    </ModernDashboardLayout>
  );
};

export default ModernSavingsPage;
