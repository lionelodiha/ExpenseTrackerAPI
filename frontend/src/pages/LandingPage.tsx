import { Fragment } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Icon, type IconName } from "../components/Icon";
import "./LandingPage.css";

const HERO_METRICS = [
  { label: "Tracked expenses", value: "24k+", icon: "wallet" },
  { label: "Uptime", value: "99.9%", icon: "trend-up" },
  { label: "Auth speed", value: "<1s", icon: "arrow-up-right" },
] as const;

const FEATURE_HIGHLIGHTS: Array<{ title: string; description: string; icon: IconName }> = [
  {
    title: "Smart categorisation",
    description: "Automatically group spending with clear labels and meaningful segments.",
    icon: "budgets",
  },
  {
    title: "Realtime dashboards",
    description: "Live insights with elegant cards, smooth charts, and calming gradients.",
    icon: "dashboard",
  },
  {
    title: "Secure by design",
    description: "Encrypted sync, multi-factor support, and privacy-first analytics.",
    icon: "shield",
  },
] as const;

const LandingPage: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Fragment>
      <div className="lp">
        <div className="lp__bg" aria-hidden />

        <header className="lp__nav">
          <div className="lp__brand">
            <Icon name="logo" size={34} />
            <span>VINGOSI ET</span>
          </div>
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
            <h1>Bring clarity to every transaction.</h1>
            <p>
              Clean dashboards, smooth charts, and a calm green glow&#8212;all crafted to make money
              tracking feel effortless.
            </p>
            <div className="lp__actions">
              <Link to="/register" className="btn btn--lg">
                <Icon name="arrow-right" size={18} />
                <span>Get started</span>
              </Link>
              <Link to="/login" className="btn btn--lg btn--ghost">
                <Icon name="user" size={18} />
                <span>I already have an account</span>
              </Link>
            </div>
            <ul className="lp__metrics">
              {HERO_METRICS.map((metric) => (
                <li key={metric.label}>
                  <Icon name={metric.icon} size={20} />
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <aside className="lp__preview" aria-label="Interface preview">
            <div className="card card--wallet">
              <div className="card__label">Balance details</div>
              <div className="card__value">$ 25,657.00</div>
              <div className="card__sub">GBP 20,882.92</div>
              <div className="card__footer">
                <span className="card__trend">
                  <Icon name="trend-up" size={16} />
                  +12.5%
                </span>
                <span className="card__badge">Live sync</span>
              </div>
            </div>

            <div className="card card--stats">
              <div className="stat">
                <div className="stat__icon">
                  <Icon name="expenses" size={20} />
                </div>
                <div>
                  <div className="stat__title">Transactions</div>
                  <div className="stat__value">$546</div>
                </div>
              </div>
              <div className="stat">
                <div className="stat__icon stat__icon--accent">
                  <Icon name="entertainment" size={20} />
                </div>
                <div>
                  <div className="stat__title">Entertainment</div>
                  <div className="stat__value">$245</div>
                </div>
              </div>
              <div className="stat">
                <div className="stat__icon stat__icon--neutral">
                  <Icon name="piggy-bank" size={20} />
                </div>
                <div>
                  <div className="stat__title">Savings boost</div>
                  <div className="stat__value">$1,250</div>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>

      <section className="lp__features" id="features">
        {FEATURE_HIGHLIGHTS.map((feature) => (
          <article key={feature.title} className="lp__feature-card">
            <div className="lp__feature-icon">
              <Icon name={feature.icon} size={22} />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="lp__security" id="security">
        <div className="lp__security-copy">
          <h2>Security and privacy built-in.</h2>
          <p>
            From encrypted storage to audit trails, VINGOSI ET keeps your financial data protected while
            you stay productive. Enable multi-factor authentication, manage trusted devices, and keep
            your backups safe with a single click.
          </p>
        </div>
        <div className="lp__security-list">
          <div>
            <Icon name="shield" size={22} />
            <span>End-to-end encryption</span>
          </div>
          <div>
            <Icon name="bell" size={22} />
            <span>Smart anomaly alerts</span>
          </div>
          <div>
            <Icon name="piggy-bank" size={22} />
            <span>Automated savings locks</span>
          </div>
        </div>
      </section>

      <section className="lp__pricing" id="pricing">
        <div className="lp__pricing-card">
          <h2>Ready to start?</h2>
          <p>Use VINGOSI ET for free, then upgrade whenever you are ready for deeper insights.</p>
          <div className="lp__pricing-actions">
            <Link to="/register" className="btn btn--lg">
              <Icon name="arrow-right" size={18} />
              <span>Create free account</span>
            </Link>
            <a href="#compare" className="btn btn--lg btn--ghost">
              Compare plans
            </a>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default LandingPage;

