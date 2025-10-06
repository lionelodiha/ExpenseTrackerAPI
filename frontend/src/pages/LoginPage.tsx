import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";
import { useAuth } from "../hooks/auth-hook";

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__background">
        <div className="auth-page__circle auth-page__circle--1"></div>
        <div className="auth-page__circle auth-page__circle--2"></div>
        <div className="auth-page__circle auth-page__circle--3"></div>
      </div>

      <div className="auth-page__container">
        {/* Left Side - Branding */}
        <div className="auth-page__brand">
          <div className="auth-page__logo">
            <div className="auth-page__logo-icon">📱</div>
            <h1 className="auth-page__logo-text">Air Pay</h1>
          </div>
          
          <div className="auth-page__welcome">
            <h2 className="auth-page__welcome-title">Welcome Back!</h2>
            <p className="auth-page__welcome-text">
              Sign in to access your financial dashboard and manage your expenses with ease.
            </p>
          </div>

          <div className="auth-page__features">
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">✨</div>
              <div className="auth-page__feature-text">
                <h3>Track Expenses</h3>
                <p>Monitor your spending in real-time</p>
              </div>
            </div>
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">💰</div>
              <div className="auth-page__feature-text">
                <h3>Manage Budget</h3>
                <p>Stay on top of your financial goals</p>
              </div>
            </div>
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">📊</div>
              <div className="auth-page__feature-text">
                <h3>Visual Analytics</h3>
                <p>Beautiful charts and insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-page__form-wrapper">
          <div className="auth-page__form-container">
            <div className="auth-page__form-header">
              <h2 className="auth-page__form-title">Sign In</h2>
              <p className="auth-page__form-subtitle">Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="auth-page__error">
                <span className="auth-page__error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-page__form">
              <div className="auth-page__field">
                <label htmlFor="email" className="auth-page__label">
                  Email Address
                </label>
                <div className="auth-page__input-wrapper">
                  <span className="auth-page__input-icon">📧</span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="auth-page__input"
                    placeholder="your.email@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="auth-page__field">
                <label htmlFor="password" className="auth-page__label">
                  Password
                </label>
                <div className="auth-page__input-wrapper">
                  <span className="auth-page__input-icon">🔒</span>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-page__input"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="auth-page__options">
                <label className="auth-page__checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="auth-page__link">Forgot password?</a>
              </div>

              <button 
                type="submit" 
                className="auth-page__button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="auth-page__spinner"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="auth-page__button-icon">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-page__divider">
              <span>or continue with</span>
            </div>

            <div className="auth-page__social">
              <button className="auth-page__social-btn" type="button">
                <span className="auth-page__social-icon">G</span>
                <span>Google</span>
              </button>
              <button className="auth-page__social-btn" type="button">
                <span className="auth-page__social-icon">f</span>
                <span>Facebook</span>
              </button>
            </div>

            <div className="auth-page__footer">
              <p>
                Don't have an account? 
                <Link to="/register" className="auth-page__link auth-page__link--bold"> Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
