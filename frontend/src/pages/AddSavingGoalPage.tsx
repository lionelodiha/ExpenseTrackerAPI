import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModernDashboardLayout from "../components/layout/ModernDashboardLayout";
import "../styles/dashboard-forms.css";
import { savingGoalService } from "../services/saving-goal-service";

const AddSavingGoalPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const headerActions = useMemo(
    () => (
      <Link to="/savings" className="dashboard-button dashboard-button--secondary">
        Back to Savings
      </Link>
    ),
    [],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const parsedAmount = parseFloat(targetAmount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid target amount greater than zero.");
      return;
    }

    if (!title.trim()) {
      setError("Please provide a name for this goal.");
      return;
    }

    setLoading(true);

    try {
      await savingGoalService.create({
        title,
        description,
        targetAmount: parsedAmount,
        deadline: deadline || undefined,
      });

      navigate("/savings");
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to create savings goal.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernDashboardLayout
      activeNav="savings"
      headerTitle="Create Savings Goal"
      headerSubtitle="Set a new target and stay focused on what matters"
      headerActions={headerActions}
    >
      <section className="dashboard-form-page">
        {error ? <div className="dashboard__error">{error}</div> : null}

        <div className="dashboard-form-card">
          <div className="dashboard-form-card__header">
            <h2 className="dashboard-form-card__title">Goal details</h2>
            <p className="dashboard-form-card__subtitle">
              Define what you are saving for and when you would like to reach it.
            </p>
          </div>

          <form className="dashboard-form" onSubmit={handleSubmit} noValidate>
            <div className="dashboard-form__field">
              <label className="dashboard-form__label" htmlFor="title">
                Goal name *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="dashboard-input"
                placeholder="e.g., Emergency Fund, Vacation, New Car"
                required
              />
            </div>

            <div className="dashboard-form__grid">
              <div className="dashboard-form__field">
                <label className="dashboard-form__label" htmlFor="targetAmount">
                  Target amount *
                </label>
                <input
                  id="targetAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={targetAmount}
                  onChange={(event) => setTargetAmount(event.target.value)}
                  className="dashboard-input"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="dashboard-form__field">
                <label className="dashboard-form__label" htmlFor="deadline">
                  Target date
                </label>
                <input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  className="dashboard-input"
                />
                <span className="dashboard-form__help">
                  Optional - choose when you would like to reach this goal.
                </span>
              </div>
            </div>

            <div className="dashboard-form__field">
              <label className="dashboard-form__label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="dashboard-textarea"
                placeholder="Why is this goal important to you?"
              />
            </div>

            <div className="dashboard-form__actions">
              <Link to="/savings" className="dashboard-button dashboard-button--secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="dashboard-button dashboard-button--primary"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Goal"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </ModernDashboardLayout>
  );
};

export default AddSavingGoalPage;
