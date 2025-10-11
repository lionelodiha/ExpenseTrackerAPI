import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModernDashboardLayout from "../components/layout/ModernDashboardLayout";
import "../styles/modern-theme.css";
import { expenseService } from "../services/expense-service";
import { metadataService } from "../services/metadata-service";
import type { EnumOptionResponse } from "../dtos/metadata/enum-option-response";

const AddExpensePage: React.FC = () => {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [dateOfExpense, setDateOfExpense] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [paymentMethod, setPaymentMethod] = useState("");
  const [categories, setCategories] = useState<EnumOptionResponse[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<EnumOptionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [categoryResponse, paymentResponse] = await Promise.all([
          metadataService.getExpenseCategories(),
          metadataService.getPaymentMethods(),
        ]);

        const categoryOptions = categoryResponse.data ?? [];
        const paymentOptions = paymentResponse.data ?? [];

        setCategories(categoryOptions);
        setPaymentMethods(paymentOptions);

        if (categoryOptions.length && !category) {
          setCategory(categoryOptions[0].value);
        }

        if (paymentOptions.length && !paymentMethod) {
          setPaymentMethod(paymentOptions[0].value);
        }
      } catch (err) {
        setError("Unable to load categories or payment methods.");
      }
    };

    loadMetadata();
  }, [category, paymentMethod]);

  const headerActions = useMemo(
    () => (
      <Link to="/expenses" className="modern-btn modern-btn--secondary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Expenses
      </Link>
    ),
    [],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const parsedAmount = parseFloat(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    setLoading(true);

    try {
      await expenseService.create({
        amount: parsedAmount,
        category,
        description,
        dateOfExpense,
        paymentMethod,
      });

      navigate("/expenses");
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to create expense.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernDashboardLayout
      activeNav="expenses"
      headerTitle="Add Expense"
      headerSubtitle="Record a new transaction to keep your finances accurate"
      headerActions={headerActions}
    >
      {error && (
        <div className="modern-alert modern-alert--danger" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <div className="modern-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="modern-card__header">
          <div>
            <h2 className="modern-card__title">Expense Details</h2>
            <p className="modern-card__subtitle">
              Provide the required information below to save a new expense.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modern-grid modern-grid--2" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div className="modern-form-group">
              <label className="modern-label" htmlFor="amount">
                Amount *
              </label>
              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="modern-input"
                placeholder="0.00"
                required
              />
            </div>

            <div className="modern-form-group">
              <label className="modern-label" htmlFor="dateOfExpense">
                Date *
              </label>
              <input
                id="dateOfExpense"
                type="date"
                value={dateOfExpense}
                onChange={(event) => setDateOfExpense(event.target.value)}
                className="modern-input"
                required
              />
            </div>
          </div>

          <div className="modern-grid modern-grid--2" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div className="modern-form-group">
              <label className="modern-label" htmlFor="category">
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="modern-input"
                required
              >
                {categories.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="modern-form-group">
              <label className="modern-label" htmlFor="paymentMethod">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="modern-input"
              >
                {paymentMethods.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modern-form-group" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <label className="modern-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="modern-input"
              placeholder="Add an optional note about this expense..."
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-gray-200)' }}>
            <Link to="/expenses" className="modern-btn modern-btn--secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="modern-btn modern-btn--primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="modern-spinner" style={{ width: '16px', height: '16px' }} />
                  Saving...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Add Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </ModernDashboardLayout>
  );
};

export default AddExpensePage;
