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
            <div className="auth-page__logo-icon">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="60" height="60" rx="12" fill="white" fillOpacity="0.2"/>
                <path d="M30 15L42 25V40C42 41.1046 41.1046 42 40 42H20C18.8954 42 18 41.1046 18 40V25L30 15Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M25 30H35M30 25V35" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="auth-page__logo-text">VINGOSI</h1>
          </div>
          
          <div className="auth-page__welcome">
            <h2 className="auth-page__welcome-title">Join VINGOSI Today!</h2>
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
                  <svg className="auth-page__input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10C12.21 10 14 8.21 14 6C14 3.79 12.21 2 10 2C7.79 2 6 3.79 6 6C6 8.21 7.79 10 10 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 18C2 14.69 5.69 12 10 12C14.31 12 18 14.69 18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
                  <svg className="auth-page__input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4H17C18.1 4 19 4.9 19 6V14C19 15.1 18.1 16 17 16H3C1.9 16 1 15.1 1 14V6C1 4.9 1.9 4 3 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 6L10 11L1 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
                  <svg className="auth-page__input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="9" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M6 9V6C6 3.79086 7.79086 2 10 2C12.2091 2 14 3.79086 14 6V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
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
                  <svg className="auth-page__input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 7C14 9.21 12.21 11 10 11C7.79 11 6 9.21 6 7C6 4.79 7.79 3 10 3C12.21 3 14 4.79 14 7Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 11L10 17M10 17L7 14M10 17L13 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
                <svg className="auth-page__social-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.2 10.2c0-4.4-3.6-8-8-8s-8 3.6-8 8c0 4 2.9 7.3 6.7 7.9v-5.6H6.7v-2.3h2.2V8.3c0-2.2 1.3-3.4 3.3-3.4.9 0 1.9.2 1.9.2v2.1h-1.1c-1.1 0-1.4.7-1.4 1.4v1.7h2.4l-.4 2.3h-2v5.6c3.8-.6 6.7-3.9 6.7-7.9z" fill="#1877F2"/>
                </svg>
                <span>Facebook</span>
              </button>
              <button className="auth-page__social-btn" type="button">
                <svg className="auth-page__social-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.2 10.2c0-.8-.1-1.5-.2-2.3H10v2.3h4.6c-.2 1.1-.8 2-1.7 2.6v2.1h2.7c1.6-1.5 2.5-3.7 2.5-6.3z" fill="#4285F4"/>
                  <path d="M10 18.5c2.3 0 4.2-.8 5.6-2.1l-2.7-2.1c-.8.5-1.8.8-2.9.8-2.2 0-4.1-1.5-4.8-3.5H2.4v2.2c1.4 2.8 4.3 4.7 7.6 4.7z" fill="#34A853"/>
                  <path d="M5.2 11.6c-.2-.5-.3-1-.3-1.6s.1-1.1.3-1.6V6.2H2.4C1.6 7.7 1.2 9.3 1.2 10s.4 2.3 1.2 3.8l2.8-2.2z" fill="#FBBC05"/>
                  <path d="M10 4.2c1.2 0 2.3.4 3.2 1.2l2.4-2.4C14.2 1.6 12.2.7 10 .7 6.7.7 3.8 2.6 2.4 5.4l2.8 2.2c.7-2 2.6-3.4 4.8-3.4z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
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
