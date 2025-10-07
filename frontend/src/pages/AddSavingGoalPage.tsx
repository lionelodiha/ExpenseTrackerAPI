import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { savingGoalService } from "../services/saving-goal-service";
import { useAuth } from "../hooks/auth-hook";
import "./AddSavingGoalPage.css";

const AddSavingGoalPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      setError('Please enter a valid target amount');
      return;
    }

    setLoading(true);

    try {
      await savingGoalService.create({
        title,
        description,
        targetAmount: parseFloat(targetAmount),
        deadline: deadline || undefined,
      });
      navigate('/savings');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create savings goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="airpay">
      <aside className="airpay__sidebar">
        <div className="airpay__brand">
          <div className="airpay__logo">📱</div>
          <h1 className="airpay__title">VINGOSI ET</h1>
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

      <main className="airpay__main">
        <header className="airpay__header">
          <div className="airpay__search">
            <Link to="/savings" className="back-button">
              ← Back to Savings
            </Link>
          </div>
          
          <div className="airpay__header-actions">
            <div className="airpay__date">{new Date().toLocaleDateString('en-GB')}</div>
            <div className="airpay__user">
              <img src="https://i.pravatar.cc/150?img=12" alt="User" className="airpay__user-avatar" />
              <span className="airpay__user-name">User</span>
            </div>
          </div>
        </header>

        <div className="form-content">
          <div className="form-header">
            <h2 className="form-title">Create Savings Goal</h2>
            <p className="form-subtitle">Set a new financial goal and track your progress</p>
          </div>

          <div className="form-container">
            {error && (
              <div className="form-error">
                <span className="form-error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="expense-form">
              <div className="form-group">
                <label htmlFor="title" className="form-label">Goal Name *</label>
                <div className="form-input-wrapper">
                  <span className="form-input-icon">🎯</span>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="form-input"
                    placeholder="e.g., Emergency Fund, Vacation, New Car"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="targetAmount" className="form-label">Target Amount *</label>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">💵</span>
                    <input
                      id="targetAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      required
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="deadline" className="form-label">Target Date (Optional)</label>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">📅</span>
                    <input
                      id="deadline"
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <div className="form-input-wrapper">
                  <span className="form-input-icon">📝</span>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-textarea"
                    placeholder="Why is this goal important to you?"
                    rows={4}
                  />
                </div>
              </div>

              <div className="form-actions">
                <Link to="/savings" className="btn-secondary">Cancel</Link>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Creating..." : "Create Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddSavingGoalPage;

