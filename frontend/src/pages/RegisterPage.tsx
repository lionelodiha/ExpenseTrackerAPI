import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./RegisterPage.css";
import { useAuth } from "../hooks/auth-hook";

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await register(name, email, password);
      
      // Log response for debugging
      console.log('Register response:', response);
      
      // Check if registration was successful
      if (response?.success) {
        navigate('/login');
      } else {
        const errorMsg = response?.message || response?.errors?.[0] || 'Failed to register. Please try again.';
        console.error('Registration failed:', errorMsg);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err?.response?.data?.message 
        || err?.data?.message
        || err?.message 
        || 'Failed to register. Please try again.';
      setError(errorMessage);
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
            <h2 className="auth-page__welcome-title">Join Air Pay Today!</h2>
            <p className="auth-page__welcome-text">
              Create your account and start managing your finances like a pro with our beautiful and intuitive dashboard.
            </p>
          </div>

          <div className="auth-page__features">
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">🚀</div>
              <div className="auth-page__feature-text">
                <h3>Quick Setup</h3>
                <p>Get started in less than 2 minutes</p>
              </div>
            </div>
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">🔐</div>
              <div className="auth-page__feature-text">
                <h3>Secure & Private</h3>
                <p>Your data is encrypted and protected</p>
              </div>
            </div>
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">💎</div>
              <div className="auth-page__feature-text">
                <h3>Premium Features</h3>
                <p>Access to advanced analytics tools</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="auth-page__form-wrapper">
          <div className="auth-page__form-container">
            <div className="auth-page__form-header">
              <h2 className="auth-page__form-title">Create Account</h2>
              <p className="auth-page__form-subtitle">Fill in your details to get started</p>
            </div>

            {error && (
              <div className="auth-page__error">
                <span className="auth-page__error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-page__form">
              <div className="auth-page__field">
                <label htmlFor="name" className="auth-page__label">
                  Full Name
                </label>
                <div className="auth-page__input-wrapper">
                  <span className="auth-page__input-icon">👤</span>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="auth-page__input"
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
              </div>

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
                    placeholder="Minimum 6 characters"
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>

              <div className="auth-page__field">
                <label htmlFor="confirmPassword" className="auth-page__label">
                  Confirm Password
                </label>
                <div className="auth-page__input-wrapper">
                  <span className="auth-page__input-icon">🔑</span>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="auth-page__input"
                    placeholder="Re-enter your password"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="auth-page__terms">
                <label className="auth-page__checkbox">
                  <input type="checkbox" required />
                  <span>
                    I agree to the <a href="#terms" className="auth-page__link">Terms of Service</a> and <a href="#privacy" className="auth-page__link">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                className="auth-page__button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="auth-page__spinner"></span>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span className="auth-page__button-icon">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-page__divider">
              <span>or sign up with</span>
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
                Already have an account? 
                <Link to="/login" className="auth-page__link auth-page__link--bold"> Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
