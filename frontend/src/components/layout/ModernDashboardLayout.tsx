import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth-hook";
import "../../styles/modern-theme.css";
import "./ModernDashboardLayout.css";

type NavKey = "dashboard" | "expenses" | "savings" | "budgets" | "profile";

interface ModernDashboardLayoutProps {
  activeNav?: NavKey;
  headerTitle?: string;
  headerSubtitle?: string;
  headerActions?: ReactNode;
  children: ReactNode;
}

interface NavItem {
  key: NavKey;
  label: string;
  to: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    to: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    key: "expenses",
    label: "Expenses",
    to: "/expenses",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    key: "savings",
    label: "Savings",
    to: "/savings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"/>
        <path d="M2 9v1c0 1.1.9 2 2 2h1"/>
        <path d="M16 11h0"/>
      </svg>
    ),
  },
  {
    key: "budgets",
    label: "Budgets",
    to: "/budgets",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10"/>
        <line x1="18" y1="20" x2="18" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="16"/>
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Profile",
    to: "/profile",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

const ModernDashboardLayout = ({
  activeNav,
  headerTitle,
  headerSubtitle,
  headerActions,
  children,
}: ModernDashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.nickname || user?.name || "User";
  const initials = getInitials(displayName);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="modern-dashboard">
      {/* Sidebar */}
      <aside className={`modern-sidebar ${sidebarOpen ? "modern-sidebar--open" : ""}`}>
        <div className="modern-sidebar__header">
          <Link to="/dashboard" className="modern-sidebar__logo">
            <div className="modern-sidebar__logo-icon">V</div>
            <span className="modern-sidebar__logo-text">VINGOSI</span>
          </Link>
        </div>

        <nav className="modern-sidebar__nav">
          <div className="modern-nav-group">
            <div className="modern-nav-group__title">Menu</div>
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className={`modern-nav-item ${
                  activeNav === item.key ? "modern-nav-item--active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="modern-nav-item__icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="modern-nav-group">
            <div className="modern-nav-group__title">Settings</div>
            <button
              type="button"
              className="modern-nav-item"
              onClick={handleLogout}
              style={{ width: "100%", border: "none", background: "none", cursor: "pointer", textAlign: "left" }}
            >
              <span className="modern-nav-item__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </span>
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="modern-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="modern-main">
        {/* Header */}
        <header className="modern-header">
          <div className="modern-header__content">
            <div className="modern-header__left">
              <button
                type="button"
                className="modern-mobile-menu-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
              <div>
                <h1 className="modern-header__title">
                  {headerTitle || `Welcome back, ${displayName}!`}
                </h1>
                {headerSubtitle && (
                  <p className="modern-header__subtitle">{headerSubtitle}</p>
                )}
              </div>
            </div>

            <div className="modern-header__actions">
              {headerActions}

              {/* User Menu */}
              <div
                className="modern-user-menu"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <button
                  type="button"
                  className="modern-user-menu__trigger"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={displayName}
                      className="modern-user-menu__avatar"
                    />
                  ) : (
                    <div className="modern-user-menu__avatar modern-user-menu__avatar--placeholder">
                      {initials}
                    </div>
                  )}
                  <div className="modern-user-menu__info">
                    <div className="modern-user-menu__name">{displayName}</div>
                    <div className="modern-user-menu__email">{user?.email}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="modern-user-menu__dropdown">
                    <Link to="/profile" className="modern-user-menu__item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <span>Profile</span>
                    </Link>
                    <div className="modern-user-menu__divider" />
                    <button
                      type="button"
                      className="modern-user-menu__item modern-user-menu__item--danger"
                      onClick={handleLogout}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="modern-container">
          {children}
        </div>
      </main>
    </div>
  );
};

const getInitials = (name: string) => {
  const segments = name.trim().split(" ");
  if (!segments.length) return "U";

  if (segments.length === 1) {
    return segments[0].slice(0, 2).toUpperCase();
  }

  return (segments[0][0] + segments[segments.length - 1][0]).toUpperCase();
};

export default ModernDashboardLayout;
