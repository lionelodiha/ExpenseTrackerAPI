import { memo, type ReactNode } from "react";

type IconName =
  | "logo"
  | "dashboard"
  | "expenses"
  | "savings"
  | "budgets"
  | "settings"
  | "shield"
  | "alert"
  | "premium"
  | "arrow-right"
  | "arrow-up-right"
  | "search"
  | "calendar"
  | "wallet"
  | "trend-down"
  | "trend-up"
  | "piggy-bank"
  | "plus"
  | "edit"
  | "trash"
  | "filter"
  | "inbox"
  | "clock"
  | "user"
  | "bell"
  | "sun"
  | "moon"
  | "food"
  | "transport"
  | "entertainment"
  | "health"
  | "shopping"
  | "bills"
  | "other";

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  title?: string;
}

const IconComponent = ({
  name,
  size = 22,
  className = "",
  strokeWidth = 1.7,
  title,
}: IconProps) => {
  if (name === "logo") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        role="img"
        aria-hidden={title ? undefined : true}
        className={["ui-icon", className].filter(Boolean).join(" ")}
      >
        {title ? <title>{title}</title> : null}
        <defs>
          <linearGradient id="vingosi-gradient" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#bde9d4" />
            <stop offset="55%" stopColor="#66c19a" />
            <stop offset="100%" stopColor="#2a7b60" />
          </linearGradient>
          <linearGradient id="vingosi-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <rect x="2.5" y="2.5" width="27" height="27" rx="11" fill="url(#vingosi-gradient)" />
        <rect x="2.5" y="2.5" width="27" height="27" rx="11" fill="url(#vingosi-glow)" opacity="0.35" />
        <path
          d="M10.5 11.5L15.25 21l4.75-9.5"
          fill="none"
          stroke="#f6fffb"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.75 11.25h7.5M9.75 15.25h5.3M9.75 19.25h3.8"
          stroke="#e6fbf3"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="23.5" cy="9" r="1.8" fill="#143a2d" opacity="0.55" />
      </svg>
    );
  }

  const paths: Record<Exclude<IconName, "logo">, ReactNode> = {
    dashboard: (
      <>
        <path d="M4 4h7v7H4z" />
        <path d="M13 4h7v5h-7z" />
        <path d="M4 13h7v9H4z" />
        <path d="M13 12h7v10h-7z" />
      </>
    ),
    expenses: (
      <>
        <rect x="4" y="7" width="16" height="12" rx="3" />
        <path d="M4 11h16" />
        <path d="M10 15h.01" />
        <path d="M14 15h4" />
      </>
    ),
    savings: (
      <>
        <path d="M5 11c0-3.866 3.582-7 8-7s8 3.134 8 7v5.5A2.5 2.5 0 0 0 18.5 19H18" />
        <path d="M9 21h6.5A2.5 2.5 0 0 0 18 18.5V11" />
        <path d="M2 15h3a2 2 0 0 1 2 2v4" />
        <circle cx="13" cy="11" r="2" />
      </>
    ),
    budgets: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v9l6 3" />
      </>
    ),
    settings: (
      <>
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.18a1.65 1.65 0 0 0 1.64-.39l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
    shield: (
      <>
        <path d="M12 2 5 5v6c0 5.25 3.5 10.5 7 11 3.5-.5 7-5.75 7-11V5z" />
      </>
    ),
    alert: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </>
    ),
    premium: (
      <>
        <path d="m12 3 2.3 4.66 5.15.75-3.72 3.63.88 5.14L12 14.77l-4.61 2.41.88-5.14-3.72-3.63 5.15-.75z" />
      </>
    ),
    "arrow-right": (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    "arrow-up-right": (
      <>
        <path d="M7 17 17 7" />
        <path d="M7 7h10v10" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-3-3" />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M16 3v4" />
        <path d="M8 3v4" />
        <path d="M4 11h16" />
      </>
    ),
    wallet: (
      <>
        <rect x="3" y="7" width="18" height="12" rx="3" />
        <path d="M18 11h2.5a1.5 1.5 0 0 1 0 3H18" />
        <path d="M16 11a2 2 0 1 0 0 4" />
      </>
    ),
    "trend-down": (
      <>
        <path d="m21 7-9.5 9.5-5-5L3 15" />
        <path d="M21 11V7h-4" />
      </>
    ),
    "trend-up": (
      <>
        <path d="m3 17 9.5-9.5 5 5L21 9" />
        <path d="M3 13v4h4" />
      </>
    ),
    "piggy-bank": (
      <>
        <path d="M5 11c0-3.314 2.686-6 6-6h1a6 6 0 0 1 6 6v3.5a2.5 2.5 0 0 0 2.5 2.5H21" />
        <path d="M3 15h2a2 2 0 0 1 2 2v2" />
        <path d="M16 7h.01" />
        <path d="M7 19h4" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    edit: (
      <>
        <path d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 3 21l.5-4.5Z" />
        <path d="m15 5 4 4" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <rect x="5" y="6" width="14" height="15" rx="2" />
      </>
    ),
    filter: (
      <>
        <path d="M4 7h16" />
        <path d="M7 12h10" />
        <path d="M10 17h4" />
      </>
    ),
    inbox: (
      <>
        <path d="M21 13.4V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5.4a2 2 0 0 0 .4 1.2l2.8 3.6A2 2 0 0 0 8 19h8a2 2 0 0 0 1.8-1l2.8-3.6a2 2 0 0 0 .4-1.2z" />
        <path d="M3 13h4l2 3h6l2-3h4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l3 3" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m4.93 19.07 1.41-1.41" />
        <path d="m17.66 6.34 1.41-1.41" />
      </>
    ),
    moon: (
      <>
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
      </>
    ),
    food: (
      <>
        <path d="M4 3h2l2 10" />
        <path d="M10 3h2l-.5 5h2L13 3h2l-.5 5H16" />
        <path d="M5 21h6a2 2 0 0 0 2-2V11H3v8a2 2 0 0 0 2 2z" />
      </>
    ),
    transport: (
      <>
        <rect x="3" y="7" width="18" height="10" rx="3" />
        <path d="M3 12h18" />
        <circle cx="7.5" cy="17" r="1.5" />
        <circle cx="16.5" cy="17" r="1.5" />
      </>
    ),
    entertainment: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m7 9 3 2-3 2z" />
        <path d="M17 15h.01" />
      </>
    ),
    health: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="4" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </>
    ),
    shopping: (
      <>
        <path d="M6 3 3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-3-4Z" />
        <path d="M3 7h18" />
        <path d="M16 11a4 4 0 0 1-8 0" />
      </>
    ),
    bills: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8" />
        <path d="M8 11h5" />
        <path d="M8 15h6" />
      </>
    ),
    other: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7a3 3 0 0 1 0 6h-1" />
        <path d="M11 17h.01" />
      </>
    ),
  };

  const svg = paths[name];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-hidden={title ? undefined : true}
      className={["ui-icon", className].filter(Boolean).join(" ")}
    >
      {title ? <title>{title}</title> : null}
      {svg}
    </svg>
  );
};

export const Icon = memo(IconComponent);
export type { IconName, IconProps };
