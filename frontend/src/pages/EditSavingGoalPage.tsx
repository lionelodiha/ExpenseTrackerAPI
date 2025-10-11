import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ModernDashboardLayout from "../components/layout/ModernDashboardLayout";
import "../styles/dashboard-forms.css";
import type { UpdateSavingGoalRequest } from "../dtos/saving-goals/update-saving-goal-request";
import { savingGoalService } from "../services/saving-goal-service";

const EditSavingGoalPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchGoal = async () => {
      try {
        const response = await savingGoalService.getById(id);
        const goal = response.data;

        if (!goal) {
          setError("Saving goal not found.");
          return;
        }

        setTitle(goal.title);
        setDescription(goal.description ?? "");
        setTargetAmount(goal.targetAmount.toString());
        setDeadline(goal.deadline ?? "");
      } catch {
        setError("Failed to fetch saving goal details.");
      }
    };

    fetchGoal();
  }, [id]);

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

    if (!id) {
      return;
    }

    const parsedAmount = parseFloat(targetAmount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid target amount greater than zero.");
      return;
    }

    setLoading(true);

    const payload: UpdateSavingGoalRequest = {
      title,
      description,
      targetAmount: parsedAmount,
      deadline: deadline || undefined,
    };

    try {
      await savingGoalService.update(id, payload);
      navigate("/savings");
    } catch {
      setError("Failed to update saving goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernDashboardLayout
      activeNav="savings"
      headerTitle="Edit Savings Goal"
      headerSubtitle="Update your goal details and keep your plan on track"
      headerActions={headerActions}
    >
      <section className="dashboard-form-page">
        {error ? <div className="dashboard__error">{error}</div> : null}

        <div className="dashboard-form-card">
          <div className="dashboard-form-card__header">
            <h2 className="dashboard-form-card__title">Goal information</h2>
            <p className="dashboard-form-card__subtitle">
              Adjust any of the fields below and save your changes.
            </p>
          </div>

          <form className="dashboard-form" onSubmit={handleSubmit}>
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
                required
              />
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
                placeholder="Provide a short note about this goal (optional)."
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
                <span className="dashboard-form__help">Optional - leave blank if not needed.</span>
              </div>
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
                {loading ? "Saving..." : "Update Goal"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </ModernDashboardLayout>
  );
};

export default EditSavingGoalPage;
