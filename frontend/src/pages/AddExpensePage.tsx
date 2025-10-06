import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { expenseService } from "../services/expense-service";
import { metadataService } from "../services/metadata-service";
import { useAuth } from "../hooks/auth-hook";
import "./AddExpensePage.css";

const AddExpensePage: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [dateOfExpense, setDateOfExpense] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [catResponse, payResponse] = await Promise.all([
        metadataService.getExpenseCategories(),
        metadataService.getPaymentMethods()
      ]);
      setCategories(catResponse.data || []);
      setPaymentMethods(payResponse.data || []);
      
      if (catResponse.data && catResponse.data.length > 0) {
        setCategory(catResponse.data[0].label);
      }
      if (payResponse.data && payResponse.data.length > 0) {
        setPaymentMethod(payResponse.data[0].label);
      }
    } catch (err) {
      console.error("Failed to fetch metadata", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!category) {
      setError("Please select a category");
      return;
    }

    setLoading(true);

    try {
      await expenseService.create({
        amount: parseFloat(amount),
        category,
        description,
        dateOfExpense,
        paymentMethod
      });

      navigate("/expenses");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

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
          <Link to="/expenses" className="airpay__nav-item airpay__nav-item--active">
            <span className="airpay__nav-icon">💸</span>
            <span>Expenses</span>
          </Link>
          <Link to="/savings" className="airpay__nav-item">
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
            <Link to="/expenses" className="back-button">
              ← Back to Expenses
            </Link>
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

        {/* Form Content */}
        <div className="form-content">
          <div className="form-header">
            <h2 className="form-title">Add New Expense</h2>
            <p className="form-subtitle">Track your spending by adding a new expense</p>
          </div>

          <div className="form-container">
            {error && (
              <div className="form-error">
                <span className="form-error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="expense-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="amount" className="form-label">
                    Amount *
                  </label>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">💵</span>
                    <input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfExpense" className="form-label">
                    Date *
                  </label>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">📅</span>
                    <input
                      id="dateOfExpense"
                      type="date"
                      value={dateOfExpense}
                      onChange={(e) => setDateOfExpense(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category" className="form-label">
                    Category *
                  </label>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">📁</span>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="form-select"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.label}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="paymentMethod" className="form-label">
                    Payment Method
                  </label>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">💳</span>
                    <select
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="form-select"
                    >
                      {paymentMethods.map((method) => (
                        <option key={method.value} value={method.label}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <div className="form-input-wrapper">
                  <span className="form-input-icon">📝</span>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-textarea"
                    placeholder="Add a note about this expense..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="form-actions">
                <Link to="/expenses" className="btn-secondary">
                  Cancel
                </Link>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Adding..." : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddExpensePage;
