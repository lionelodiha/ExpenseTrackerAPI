import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { savingGoalService } from "../services/saving-goal-service";
import type { CreateSavingGoalResponse } from "../dtos/saving-goals/create-saving-goal-response";
import { useAuth } from "../hooks/auth-hook";
import "./SavingsPage.css";

const SavingsPage = () => {
  const [goals, setGoals] = useState<CreateSavingGoalResponse[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await savingGoalService.getAll();
      setGoals(response.data || []);
    } catch (err: any) {
      setError("Failed to fetch savings goals.");
      if (err.response && err.response.status === 404) {
        setGoals([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this savings goal?')) return;
    
    try {
      await savingGoalService.deleteById(id);
      fetchGoals();
    } catch {
      setError("Failed to delete saving goal.");
    }
  };

  const totalSaved = goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="airpay">
      {/* Sidebar */}
      <aside className="airpay__sidebar">
        <div className="airpay__brand">
          <div className="airpay__logo">📱</div>
          <h1 className="airpay__title">Air Pay</h1>
        </div>

        <nav className="airpay__nav">
          <Link to="/dashboard" className="airpay__nav-item">
            <span className="airpay__nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/expenses" className="airpay__nav-item">
            <span className="airpay__nav-icon">💸</span>
            <span>Expenses</span>
          </Link>
          <Link to="/savings" className="airpay__nav-item airpay__nav-item--active">
            <span className="airpay__nav-icon">💰</span>
            <span>Savings</span>
          </Link>
          <Link to="/budgets" className="airpay__nav-item">
            <span className="airpay__nav-icon">📈</span>
            <span>Budgets</span>
          </Link>
          <a href="#settings" className="airpay__nav-item">
            <span className="airpay__nav-icon">⚙️</span>
            <span>Settings</span>
          </a>
        </nav>

        <div className="airpay__premium">
          <div className="airpay__premium-badge">⭐</div>
          <h3 className="airpay__premium-title">Get Premium</h3>
          <p className="airpay__premium-text">Unlimited functions and encrypted recovery</p>
          <button className="airpay__premium-btn">
            <span>Upgrade</span>
            <span className="airpay__premium-icon">🔒</span>
          </button>
        </div>

        <button onClick={logout} className="airpay__logout">Logout</button>
      </aside>

      {/* Main Content */}
      <main className="airpay__main">
        {/* Header */}
        <header className="airpay__header">
          <div className="airpay__search">
            <span className="airpay__search-icon">🔍</span>
            <input type="text" placeholder="Search savings goals..." className="airpay__search-input" />
          </div>
          
          <div className="airpay__header-actions">
            <div className="airpay__date">{new Date().toLocaleDateString('en-GB')}</div>
            <div className="airpay__user">
              <img 
                src="https://i.pravatar.cc/150?img=12" 
                alt="User" 
                className="airpay__user-avatar"
              />
              <span className="airpay__user-name">User</span>
            </div>
          </div>
        </header>

        {error && <div className="airpay__error">{error}</div>}

        {/* Content */}
        <div className="savings-content">
          <div className="savings-header">
            <div>
              <h2 className="savings-title">Savings Goals</h2>
              <p className="savings-subtitle">Track your progress towards financial goals</p>
            </div>
            <Link to="/savings/add" className="btn-add-savings">
              <span>➕</span>
              <span>Add Savings Goal</span>
            </Link>
          </div>

          {/* Overall Progress */}
          <div className="savings-overview">
            <div className="overview-card">
              <div className="overview-card__header">
                <h3>Total Savings Progress</h3>
                <div className="overview-card__percentage">{overallProgress.toFixed(1)}%</div>
              </div>
              <div className="overview-card__amounts">
                <div className="overview-amount">
                  <span className="overview-amount__label">Saved</span>
                  <span className="overview-amount__value">${totalSaved.toFixed(2)}</span>
                </div>
                <div className="overview-amount">
                  <span className="overview-amount__label">Target</span>
                  <span className="overview-amount__value">${totalTarget.toFixed(2)}</span>
                </div>
              </div>
              <div className="overview-progress">
                <div className="overview-progress__bar" style={{ width: `${Math.min(overallProgress, 100)}%` }}></div>
              </div>
            </div>

            <div className="savings-stats-grid">
              <div className="savings-stat">
                <div className="savings-stat__icon">🎯</div>
                <div className="savings-stat__content">
                  <div className="savings-stat__value">{goals.length}</div>
                  <div className="savings-stat__label">Active Goals</div>
                </div>
              </div>
              <div className="savings-stat">
                <div className="savings-stat__icon">✅</div>
                <div className="savings-stat__content">
                  <div className="savings-stat__value">{goals.filter(g => g.status === 'Completed').length}</div>
                  <div className="savings-stat__label">Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Goals Grid */}
          {loading ? (
            <div className="savings-loading">Loading savings goals...</div>
          ) : goals.length > 0 ? (
            <div className="savings-grid">
              {goals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id} className={`goal-card ${goal.status === 'Completed' ? 'goal-card--completed' : ''}`}>
                    <div className="goal-card__header">
                      <h3 className="goal-card__title">{goal.title}</h3>
                      <span className={`goal-card__status goal-card__status--${goal.status.toLowerCase()}`}>
                        {goal.status}
                      </span>
                    </div>

                    {goal.description && (
                      <p className="goal-card__description">{goal.description}</p>
                    )}

                    <div className="goal-card__amounts">
                      <div className="goal-card__amount">
                        <span className="goal-card__amount-label">Current</span>
                        <span className="goal-card__amount-value">${goal.currentAmount?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="goal-card__amount">
                        <span className="goal-card__amount-label">Target</span>
                        <span className="goal-card__amount-value">${goal.targetAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="goal-card__progress">
                      <div className="goal-card__progress-bar" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                    <div className="goal-card__progress-text">{progress.toFixed(1)}% complete</div>

                    <div className="goal-card__actions">
                      <Link to={`/savings/edit/${goal.id}`} className="goal-card__action goal-card__action--edit">
                        ✏️ Edit
                      </Link>
                      <button onClick={() => handleDelete(goal.id)} className="goal-card__action goal-card__action--delete">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="savings-empty">
              <div className="savings-empty__icon">💰</div>
              <h3>No savings goals yet</h3>
              <p>Start building your future by creating your first savings goal</p>
              <Link to="/savings/add" className="btn-add-savings">
                Create First Goal
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SavingsPage;
