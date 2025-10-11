import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ModernDashboardLayout from "../components/layout/ModernDashboardLayout";
import "../styles/dashboard-forms.css";
import type { EnumOptionResponse } from "../dtos/metadata/enum-option-response";
import type { CreateExpenseResponse } from "../dtos/expenses/create-expense-response";
import type { UpdateExpenseRequest } from "../dtos/expenses/update-expense-request";
import { metadataService } from "../services/metadata-service";
import { expenseService } from "../services/expense-service";

const EditExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<EnumOptionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesRes = await metadataService.getExpenseCategories();
        setCategories(categoriesRes.data ?? []);

        if (!id) {
          return;
        }

        const expenseRes = await expenseService.getById(id);
        const expense: CreateExpenseResponse | null = expenseRes.data ?? null;

        if (expense) {
          setDescription(expense.description ?? "");
          setAmount(String(expense.amount));
          setDate(expense.dateOfExpense);
          setCategory(expense.category);
        }
      } catch {
        setError("Failed to fetch expense details.");
      }
    };

    loadData();
  }, [id]);

  const headerActions = useMemo(
    () => (
      <Link to="/expenses" className="dashboard-button dashboard-button--secondary">
        Back to Expenses
      </Link>
    ),
    [],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    setLoading(true);

    const payload: UpdateExpenseRequest = {
      id,
      description,
      amount: parsedAmount,
      dateOfExpense: date,
      category,
    };

    try {
      await expenseService.update(payload);
      navigate("/expenses");
    } catch {
      setError("Failed to update expense.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernDashboardLayout
      activeNav="expenses"
      headerTitle="Edit Expense"
      headerSubtitle="Update the transaction details below"
      headerActions={headerActions}
    >
      <section className="dashboard-form-page">
        {error ? <div className="dashboard__error">{error}</div> : null}

        <div className="dashboard-form-card">
          <div className="dashboard-form-card__header">
            <h2 className="dashboard-form-card__title">Expense information</h2>
            <p className="dashboard-form-card__subtitle">
              Make any adjustments and save to keep your records accurate.
            </p>
          </div>

          <form className="dashboard-form" onSubmit={handleSubmit}>
            <div className="dashboard-form__field">
              <label className="dashboard-form__label" htmlFor="description">
                Description
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="dashboard-input"
                placeholder="What was this expense for?"
                required
              />
            </div>

            <div className="dashboard-form__grid">
              <div className="dashboard-form__field">
                <label className="dashboard-form__label" htmlFor="amount">
                  Amount *
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="dashboard-input"
                  required
                />
              </div>

              <div className="dashboard-form__field">
                <label className="dashboard-form__label" htmlFor="date">
                  Date *
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="dashboard-input"
                  required
                />
              </div>
            </div>

            <div className="dashboard-form__field">
              <label className="dashboard-form__label" htmlFor="category">
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="dashboard-select"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="dashboard-form__actions">
              <Link to="/expenses" className="dashboard-button dashboard-button--secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="dashboard-button dashboard-button--primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Update Expense"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </ModernDashboardLayout>
  );
};

export default EditExpensePage;
