import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth-hook";
import "../../styles/dashboard-theme.css";
import "./DashboardLayout.css";

type NavKey = "dashboard" | "expenses" | "savings" | "budgets" | "profile";

interface DashboardLayoutProps {
  activeNav?: NavKey;
  headerTitle?: string;
  headerSubtitle?: string;
  headerContent?: ReactNode;
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
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="5" rx="2" />
        <rect x="13" y="10" width="8" height="11" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
      </svg>
    ),
  },
  {
    key: "expenses",
    label: "Expenses",
    to: "/expenses",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          stroke="currentColor"
        />
        <path
          d="M4 9h16M9 13h2.5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          stroke="currentColor"
        />
        <circle cx="17" cy="13" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "savings",
    label: "Savings",
    to: "/savings",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 10c0-3.314 3.582-6 8-6s8 2.686 8 6v7a2 2 0 0 1-2 2h-1.5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          stroke="currentColor"
        />
        <path
          d="M4 13v4a2 2 0 0 0 2 2h7.5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          stroke="currentColor"
        />
        <path
          d="M12 10.5a1.5 1.5 0 1 0 0-3"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          stroke="currentColor"
        />
        <path
          d="M12 7v3.5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
      </svg>
    ),
  },
  {
    key: "budgets",
    label: "Budgets",
    to: "/budgets",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 14.5V19a1 1 0 0 0 1 1h3v-5.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V20h3v-8.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V20h1a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9.5Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          stroke="currentColor"
        />
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Profile",
    to: "/profile",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          stroke="currentColor"
        />
        <path
          d="M5 21.5c.86-3.43 3.93-6 7-6s6.14 2.57 7 6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          stroke="currentColor"
        />
      </svg>
    ),
  },
];

const DashboardLayout = ({
  activeNav,
  headerTitle,
  headerSubtitle,
  headerContent,
  headerActions,
  children,
}: DashboardLayoutProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.nickname || user?.name || "User";
  const initials = getInitials(displayName);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const defaultHeader = (
    <div className="dashboard__welcome">
      <h1 className="dashboard__welcome-title">
        {headerTitle ?? `Welcome back, ${displayName}!`}
      </h1>
      {(headerSubtitle ?? "Manage your finances with clarity and confidence.") && (
        <p className="dashboard__welcome-subtitle">
          {headerSubtitle ?? "Manage your finances with clarity and confidence."}
        </p>
      )}
    </div>
  );

  const headerLeft = headerContent ?? defaultHeader;

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="dashboard">
      <aside
        className={`dashboard__sidebar${sidebarOpen ? " dashboard__sidebar--open" : ""}`}
        aria-label="Primary"
      >
        <div className="dashboard__logo">
          <div className="dashboard__logo-icon" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 15L42 25H38V40C38 41.1046 37.1046 42 36 42H24C22.8954 42 22 41.1046 22 40V25H18L30 15Z" fill="white" />
              <circle cx="30" cy="32" r="3" fill="white" fillOpacity="0.7" />
            </svg>
          </div>
          <p className="dashboard__logo-text">VINGOSI</p>
        </div>

        <nav className="dashboard__nav">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className={`dashboard__nav-item${
                activeNav === item.key ? " dashboard__nav-item--active" : ""
              }`}
              onClick={closeSidebar}
            >
              <span className="dashboard__nav-icon">{item.icon}</span>
              <span className="dashboard__nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="dashboard__sidebar-overlay"
          aria-label="Close navigation menu"
          onClick={closeSidebar}
        />
      )}

      <main className="dashboard__main">
        <header className="dashboard__header">
          <div className="dashboard__header-main">
            <button
              type="button"
              className="dashboard__menu-button"
              aria-label="Toggle navigation menu"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <span />
              <span />
              <span />
            </button>
            {headerLeft}
          </div>
          <div className="dashboard__header-right">
            {headerActions ? (
              <div className="dashboard__header-actions">{headerActions}</div>
            ) : null}
            <div
              className="dashboard__user-menu"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <button
                type="button"
                className="dashboard__user-trigger"
                onClick={() => setShowUserMenu((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={showUserMenu}
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={displayName}
                    className="dashboard__user-avatar"
                  />
                ) : (
                  <div className="dashboard__user-avatar dashboard__user-avatar--placeholder">
                    {initials}
                  </div>
                )}
                <svg
                  className="dashboard__user-caret"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M3 4.5L6 7.5L9 4.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {showUserMenu ? (
                <div className="dashboard__user-dropdown" role="menu">
                  <div className="dashboard__user-dropdown-header">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={displayName}
                        className="dashboard__user-dropdown-avatar"
                      />
                    ) : (
                      <div className="dashboard__user-dropdown-avatar dashboard__user-avatar--placeholder">
                        {initials}
                      </div>
                    )}
                    <div className="dashboard__user-dropdown-info">
                      <p className="dashboard__user-dropdown-name">{displayName}</p>
                      {user?.email ? (
                        <p className="dashboard__user-dropdown-email">{user.email}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="dashboard__user-dropdown-divider" />
                  <Link to="/profile" className="dashboard__user-dropdown-item" role="menuitem">
                    Profile
                  </Link>
                  <Link to="/settings" className="dashboard__user-dropdown-item" role="menuitem">
                    Settings
                  </Link>
                  <button
                    type="button"
                    className="dashboard__user-dropdown-item dashboard__user-dropdown-item--danger"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div className="dashboard__content-wrapper">{children}</div>
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

export default DashboardLayout;
