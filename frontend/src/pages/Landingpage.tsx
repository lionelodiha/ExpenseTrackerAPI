import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  const { user } = useAuth();

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="landing">
      {/* Animated Background */}
      <div className="landing__bg">
        <div className="landing__circle landing__circle--1"></div>
        <div className="landing__circle landing__circle--2"></div>
        <div className="landing__circle landing__circle--3"></div>
      </div>

      {/* Navigation */}
      <nav className="landing__nav">
        <div className="landing__nav-content">
          <div className="landing__brand">
            <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="60" rx="15" fill="white" fillOpacity="0.2"/>
              <path d="M30 15L42 25H38V40C38 41.1046 37.1046 42 36 42H24C22.8954 42 22 41.1046 22 40V25H18L30 15Z" fill="white"/>
              <circle cx="30" cy="32" r="3" fill="#0d9488"/>
            </svg>
            <span className="landing__brand-text">VINGOSI</span>
          </div>
          <div className="landing__nav-links">
            <a href="#features" className="landing__nav-link">Features</a>
            <a href="#how-it-works" className="landing__nav-link">How it Works</a>
            <a href="#pricing" className="landing__nav-link">Pricing</a>
          </div>
          <div className="landing__nav-actions">
            <Link to="/login" className="landing__btn landing__btn--ghost">Sign In</Link>
            <Link to="/register" className="landing__btn landing__btn--primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing__hero">
        <div className="landing__hero-content">
          <div className="landing__hero-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0L10.5 5.5L16 8L10.5 10.5L8 16L5.5 10.5L0 8L5.5 5.5L8 0Z" fill="currentColor"/>
            </svg>
            <span>Smart Financial Management</span>
          </div>
          <h1 className="landing__hero-title">
            Track Your Money,<br />
            <span className="landing__hero-title-gradient">Achieve Your Goals</span>
          </h1>
          <p className="landing__hero-description">
            Take control of your finances with beautiful dashboards, powerful analytics,
            and intelligent insights. Your financial freedom starts here.
          </p>
          <div className="landing__hero-actions">
            <Link to="/register" className="landing__btn landing__btn--large landing__btn--primary">
              Start Free Trial
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.16669 10H15.8334M15.8334 10L10 4.16669M15.8334 10L10 15.8334" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/login" className="landing__btn landing__btn--large landing__btn--secondary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18.3334C14.6024 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6024 1.66669 10 1.66669C5.39765 1.66669 1.66669 5.39765 1.66669 10C1.66669 14.6024 5.39765 18.3334 10 18.3334Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 6.66669V10L12.5 11.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Watch Demo
            </Link>
          </div>
          <div className="landing__hero-stats">
            <div className="landing__stat">
              <div className="landing__stat-value">50K+</div>
              <div className="landing__stat-label">Active Users</div>
            </div>
            <div className="landing__stat">
              <div className="landing__stat-value">$10M+</div>
              <div className="landing__stat-label">Tracked</div>
            </div>
            <div className="landing__stat">
              <div className="landing__stat-value">99.9%</div>
              <div className="landing__stat-label">Uptime</div>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="landing__hero-preview">
          <div className="landing__preview-card landing__preview-card--main">
            <div className="landing__preview-header">
              <div className="landing__preview-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="landing__preview-title">Dashboard Overview</div>
            </div>
            <div className="landing__preview-content">
              <div className="landing__preview-balance">
                <div className="landing__preview-balance-label">Total Balance</div>
                <div className="landing__preview-balance-value">$25,847.32</div>
                <div className="landing__preview-balance-change">+12.5% from last month</div>
              </div>
              <div className="landing__preview-stats">
                <div className="landing__preview-stat">
                  <div className="landing__preview-stat-icon landing__preview-stat-icon--income">↑</div>
                  <div className="landing__preview-stat-info">
                    <div className="landing__preview-stat-label">Income</div>
                    <div className="landing__preview-stat-value">$8,432</div>
                  </div>
                </div>
                <div className="landing__preview-stat">
                  <div className="landing__preview-stat-icon landing__preview-stat-icon--expense">↓</div>
                  <div className="landing__preview-stat-info">
                    <div className="landing__preview-stat-label">Expenses</div>
                    <div className="landing__preview-stat-value">$4,621</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="landing__preview-card landing__preview-card--secondary">
            <div className="landing__preview-mini-header">Recent Transactions</div>
            <div className="landing__preview-transactions">
              <div className="landing__preview-transaction">
                <div className="landing__preview-transaction-icon">🛒</div>
                <div className="landing__preview-transaction-info">
                  <div className="landing__preview-transaction-name">Grocery Shopping</div>
                  <div className="landing__preview-transaction-date">Today, 2:30 PM</div>
                </div>
                <div className="landing__preview-transaction-amount">-$127.50</div>
              </div>
              <div className="landing__preview-transaction">
                <div className="landing__preview-transaction-icon">💼</div>
                <div className="landing__preview-transaction-info">
                  <div className="landing__preview-transaction-name">Salary Deposit</div>
                  <div className="landing__preview-transaction-date">Yesterday</div>
                </div>
                <div className="landing__preview-transaction-amount landing__preview-transaction-amount--positive">+$4,200</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing__features">
        <div className="landing__section-header">
          <div className="landing__section-badge">Features</div>
          <h2 className="landing__section-title">Everything you need to manage your finances</h2>
          <p className="landing__section-description">
            Powerful features designed to give you complete control over your money
          </p>
        </div>

        <div className="landing__features-grid">
          <div className="landing__feature-card">
            <div className="landing__feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="landing__feature-title">Expense Tracking</h3>
            <p className="landing__feature-description">
              Track every dollar with ease. Categorize expenses automatically and see where your money goes.
            </p>
          </div>

          <div className="landing__feature-card">
            <div className="landing__feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="landing__feature-title">Visual Analytics</h3>
            <p className="landing__feature-description">
              Beautiful charts and graphs that make understanding your finances simple and intuitive.
            </p>
          </div>

          <div className="landing__feature-card">
            <div className="landing__feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="landing__feature-title">Savings Goals</h3>
            <p className="landing__feature-description">
              Set goals and track your progress. Stay motivated with visual progress indicators.
            </p>
          </div>

          <div className="landing__feature-card">
            <div className="landing__feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="landing__feature-title">Budget Planning</h3>
            <p className="landing__feature-description">
              Create monthly budgets and get alerts when you're close to your limits.
            </p>
          </div>

          <div className="landing__feature-card">
            <div className="landing__feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="landing__feature-title">Real-time Updates</h3>
            <p className="landing__feature-description">
              Your data syncs instantly across all devices. Always stay up to date.
            </p>
          </div>

          <div className="landing__feature-card">
            <div className="landing__feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="landing__feature-title">Bank-level Security</h3>
            <p className="landing__feature-description">
              Your financial data is encrypted and protected with industry-leading security.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing__cta">
        <div className="landing__cta-content">
          <h2 className="landing__cta-title">Ready to take control of your finances?</h2>
          <p className="landing__cta-description">
            Join thousands of users who are already achieving their financial goals with VINGOSI
          </p>
          <div className="landing__cta-actions">
            <Link to="/register" className="landing__btn landing__btn--large landing__btn--primary">
              Get Started Free
            </Link>
            <Link to="/login" className="landing__btn landing__btn--large landing__btn--ghost">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="landing__footer-content">
          <div className="landing__footer-brand">
            <svg width="32" height="32" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="60" rx="15" fill="white" fillOpacity="0.2"/>
              <path d="M30 15L42 25H38V40C38 41.1046 37.1046 42 36 42H24C22.8954 42 22 41.1046 22 40V25H18L30 15Z" fill="white"/>
              <circle cx="30" cy="32" r="3" fill="#0d9488"/>
            </svg>
            <span>VINGOSI</span>
          </div>
          <div className="landing__footer-text">
            © 2025 VINGOSI. All rights reserved. Made with passion for your financial freedom.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
