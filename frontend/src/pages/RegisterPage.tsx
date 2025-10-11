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
                <rect width="60" height="60" rx="15" fill="white" fillOpacity="0.2"/>
                <path d="M30 15L42 25H38V40C38 41.1046 37.1046 42 36 42H24C22.8954 42 22 41.1046 22 40V25H18L30 15Z" fill="white"/>
                <circle cx="30" cy="32" r="3" fill="#0d9488"/>
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
                    <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10ZM10 12.5C6.66667 12.5 0 14.175 0 17.5V20H20V17.5C20 14.175 13.3333 12.5 10 12.5Z" fill="currentColor"/>
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
                    <path d="M12.5 8.33333C14.3409 8.33333 15.8333 6.84095 15.8333 5C15.8333 3.15905 14.3409 1.66667 12.5 1.66667C10.659 1.66667 9.16663 3.15905 9.16663 5C9.16663 5.38384 9.22404 5.75461 9.32996 6.10417L2.49996 12.9342V17.5H7.06579L9.89579 14.67C10.2454 14.776 10.6161 14.8333 11 14.8333C11.3838 14.8333 11.7546 14.776 12.1042 14.67L12.5 15.0658V17.5H15V15.0658L16.4342 13.6317C16.7783 13.2875 17 12.8142 17 12.3183V11.6667C17 10.5621 16.1046 9.66667 15 9.66667H13.3333L12.5 8.83333V8.33333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <path d="M18.1713 8.36788H17.5001V8.33329H10.0001V11.6666H14.7096C14.0225 13.607 12.1763 15 10.0001 15C7.23882 15 5.00007 12.7612 5.00007 9.99996C5.00007 7.23871 7.23882 4.99996 10.0001 4.99996C11.2746 4.99996 12.4342 5.48079 13.3171 6.26621L15.6742 3.90913C14.1859 2.52204 12.1951 1.66663 10.0001 1.66663C5.39798 1.66663 1.66675 5.39788 1.66675 9.99996C1.66675 14.602 5.39798 18.3333 10.0001 18.3333C14.6021 18.3333 18.3334 14.602 18.3334 9.99996C18.3334 9.44121 18.2759 8.89579 18.1713 8.36788Z" fill="#FFC107"/>
                  <path d="M2.6275 6.12121L5.36542 8.12913C6.10625 6.29496 7.90042 4.99996 10.0004 4.99996C11.2754 4.99996 12.4346 5.48079 13.3175 6.26621L15.6746 3.90913C14.1863 2.52204 12.1954 1.66663 10.0004 1.66663C6.79917 1.66663 4.02334 3.47371 2.6275 6.12121Z" fill="#FF3D00"/>
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
