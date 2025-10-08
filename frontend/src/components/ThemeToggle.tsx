import { memo } from "react";
import { useTheme } from "../context/ThemeContext";
import { Icon } from "./Icon";
import "./ThemeToggle.css";

const ThemeToggleComponent = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Activate ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="theme-toggle__icon">
        <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
      </span>
      <span className="theme-toggle__label">{theme === "dark" ? "Dark" : "Light"} mode</span>
    </button>
  );
};

export const ThemeToggle = memo(ThemeToggleComponent);

