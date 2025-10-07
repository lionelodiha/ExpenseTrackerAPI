import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  const { user } = useAuth(); // ← clean now

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="lp">
      <div className="lp__bg" aria-hidden />

      <header className="lp__nav">
        <div className="lp__brand">ET<span>Pay</span></div>
        <nav className="lp__links" aria-label="Primary">
          <a href="#features">Features</a>
          <a href="#security">Security</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="lp__cta">
          <Link to="/login" className="btn btn--ghost">Sign in</Link>
          <Link to="/register" className="btn">Create account</Link>
        </div>
      </header>

      <main className="lp__main">
        <section className="lp__hero">
          <h1>Track money like a pro.</h1>
          <p>Clean dashboards, smooth charts, and a calm green vibe—just like your mockup.</p>
          <div className="lp__actions">
            <Link to="/register" className="btn btn--lg">Get started</Link>
            <Link to="/login" className="btn btn--lg btn--ghost">I already have an account</Link>
          </div>
          <ul className="lp__metrics">
            <li><strong>24k+</strong><span>Tracked expenses</span></li>
            <li><strong>99.9%</strong><span>Uptime</span></li>
            <li><strong>&lt;1s</strong><span>Fast auth</span></li>
          </ul>
        </section>

        <aside className="lp__preview" aria-label="Design preview">
          <div className="card card--wallet">
            <div className="card__label">Balance details</div>
            <div className="card__value">$ 25,657.00</div>
            <div className="card__sub">€ 20,882.92</div>
          </div>

          <div className="card card--stats">
            <div className="stat">
              <div className="stat__title">Transactions</div>
              <div className="stat__value">$546</div>
            </div>
            <div className="stat">
              <div className="stat__title">Entertainment</div>
              <div className="stat__value">$245</div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default LandingPage;
