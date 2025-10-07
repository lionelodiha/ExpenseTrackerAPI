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
      const response = await login(email, password);
      
      // Check if login was successful
      if (response?.success) {
        navigate('/dashboard');
      } else {
        setError(response?.message || 'Failed to log in. Please check your credentials.');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message 
        || err?.message 
        || 'Failed to log in. Please check your credentials.';
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
                <rect width="60" height="60" rx="15" fill="white" fillOpacity="0.2"/>
                <path d="M30 15L42 25H38V40C38 41.1046 37.1046 42 36 42H24C22.8954 42 22 41.1046 22 40V25H18L30 15Z" fill="white"/>
                <circle cx="30" cy="32" r="3" fill="#2d5f4d"/>
              </svg>
            </div>
            <h1 className="auth-page__logo-text">VINGOSI</h1>
          </div>
          
          <div className="auth-page__welcome">
            <h2 className="auth-page__welcome-title">Welcome Back!</h2>
            <p className="auth-page__welcome-text">
              Sign in to access your financial dashboard and manage your expenses with ease.
            </p>
          </div>

          <div className="auth-page__features">
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="auth-page__feature-text">
                <h3>Track Expenses</h3>
                <p>Monitor your spending in real-time</p>
              </div>
            </div>
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="auth-page__feature-text">
                <h3>Manage Budget</h3>
                <p>Stay on top of your financial goals</p>
              </div>
            </div>
            <div className="auth-page__feature">
              <div className="auth-page__feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 20V10M12 20V4M6 20V14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
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
                  <svg className="auth-page__input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 5.83333L10 10.8333L17.5 5.83333M3.33333 15H16.6667C17.5871 15 18.3333 14.2538 18.3333 13.3333V6.66667C18.3333 5.74619 17.5871 5 16.6667 5H3.33333C2.41286 5 1.66667 5.74619 1.66667 6.66667V13.3333C1.66667 14.2538 2.41286 15 3.33333 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                    <path d="M5.83333 8.33333V6.66667C5.83333 4.36548 7.69881 2.5 10 2.5C12.3012 2.5 14.1667 4.36548 14.1667 6.66667V8.33333M10 12.0833V13.75M6.66667 17.5H13.3333C14.2538 17.5 15 16.7538 15 15.8333V10C15 9.07953 14.2538 8.33333 13.3333 8.33333H6.66667C5.74619 8.33333 5 9.07953 5 10V15.8333C5 16.7538 5.74619 17.5 6.66667 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
                <svg className="auth-page__social-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.1713 8.36788H17.5001V8.33329H10.0001V11.6666H14.7096C14.0225 13.607 12.1763 15 10.0001 15C7.23882 15 5.00007 12.7612 5.00007 9.99996C5.00007 7.23871 7.23882 4.99996 10.0001 4.99996C11.2746 4.99996 12.4342 5.48079 13.3171 6.26621L15.6742 3.90913C14.1859 2.52204 12.1951 1.66663 10.0001 1.66663C5.39798 1.66663 1.66675 5.39788 1.66675 9.99996C1.66675 14.602 5.39798 18.3333 10.0001 18.3333C14.6021 18.3333 18.3334 14.602 18.3334 9.99996C18.3334 9.44121 18.2759 8.89579 18.1713 8.36788Z" fill="#FFC107"/>
                  <path d="M2.6275 6.12121L5.36542 8.12913C6.10625 6.29496 7.90042 4.99996 10.0004 4.99996C11.2754 4.99996 12.4346 5.48079 13.3175 6.26621L15.6746 3.90913C14.1863 2.52204 12.1954 1.66663 10.0004 1.66663C6.79917 1.66663 4.02334 3.47371 2.6275 6.12121Z" fill="##FF3D00"/>
                  <path d="M10.0004 18.3333C12.1525 18.3333 14.1092 17.5095 15.5871 16.162L13.0079 13.9874C12.1431 14.6452 11.0864 15.0008 10.0004 15C7.83252 15 5.99169 13.6179 5.29877 11.6891L2.58252 13.783C3.96044 16.4816 6.7596 18.3333 10.0004 18.3333Z" fill="#4CAF50"/>
                  <path d="M18.1713 8.36796H17.5V8.33337H10V11.6667H14.7096C14.3809 12.5902 13.7889 13.3972 13.0067 13.9879L13.0079 13.9871L15.5871 16.1617C15.4046 16.3275 18.3333 14.1667 18.3333 10C18.3333 9.44129 18.2758 8.89587 18.1713 8.36796Z" fill="#1976D2"/>
                </svg>
                <span>Google</span>
              </button>
              <button className="auth-page__social-btn" type="button">
                <svg className="auth-page__social-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 10C20 4.47715 15.5229 0 10 0C4.47715 0 0 4.47715 0 10C0 14.9912 3.65684 19.1283 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2146 3.90625C13.3084 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.95 6.5625 11.5625 7.3334 11.5625 8.125V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3432 19.1283 20 14.9912 20 10Z" fill="#1877F2"/>
                </svg>
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
