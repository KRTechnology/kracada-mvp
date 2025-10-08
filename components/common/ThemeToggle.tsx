"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
  variant?: "icon-only" | "dropdown" | "inline" | "toggle";
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function ThemeToggle({
  variant = "icon-only",
  size = "md",
  className = "",
  label = "Dark Mode",
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside effect for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setIsDropdownOpen(false);
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-8 h-8";
      case "lg":
        return "w-12 h-12";
      default:
        return "w-10 h-10";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "lg":
        return "w-6 h-6";
      default:
        return "w-5 h-5";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "lg":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  if (variant === "toggle") {
    const isDark = theme === "dark";
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <span className="text-sm text-neutral-700 dark:text-neutral-300">
          {label}
        </span>
        <button
          onClick={() => handleThemeChange(isDark ? "light" : "dark")}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-warm-200 focus:ring-offset-2 ${
            isDark ? "bg-warm-200" : "bg-neutral-200"
          }`}
          role="switch"
          aria-checked={isDark}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isDark ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <span
          className={`${getTextSize()} text-neutral-700 dark:text-neutral-300`}
        >
          Theme
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleThemeChange("light")}
            className={`p-2 rounded-md transition-colors ${
              theme === "light"
                ? "text-warm-200 bg-warm-50 dark:bg-warm-900/20"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <Sun className={getIconSize()} />
          </button>
          <button
            onClick={() => handleThemeChange("dark")}
            className={`p-2 rounded-md transition-colors ${
              theme === "dark"
                ? "text-warm-200 bg-warm-50 dark:bg-warm-900/20"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <Moon className={getIconSize()} />
          </button>
          <button
            onClick={() => handleThemeChange("system")}
            className={`p-2 rounded-md transition-colors ${
              theme === "system"
                ? "text-warm-200 bg-warm-50 dark:bg-warm-900/20"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <Monitor className={getIconSize()} />
          </button>
        </div>
      </div>
    );
  }

  if (variant === "dropdown") {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`${getSizeClasses()} rounded-full flex items-center justify-center text-[#A4A7AE] hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors ${className}`}
        >
          {theme === "dark" ? (
            <Moon className={getIconSize()} />
          ) : theme === "light" ? (
            <Sun className={getIconSize()} />
          ) : (
            <Monitor className={getIconSize()} />
          )}
        </button>

        {/* Theme Dropdown */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-40 rounded-lg shadow-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 z-50"
            >
              <div className="p-2">
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`w-full flex items-center space-x-2 px-3 py-2 ${getTextSize()} rounded-md transition-colors ${
                    theme === "light"
                      ? "text-warm-200 dark:text-warm-200"
                      : "text-neutral-700 dark:text-neutral-300 hover:text-warm-200 dark:hover:text-warm-200"
                  }`}
                >
                  <Sun className={getIconSize()} />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`w-full flex items-center space-x-2 px-3 py-2 ${getTextSize()} rounded-md transition-colors ${
                    theme === "dark"
                      ? "text-warm-200 dark:text-warm-200"
                      : "text-neutral-700 dark:text-neutral-300 hover:text-warm-200 dark:hover:text-warm-200"
                  }`}
                >
                  <Moon className={getIconSize()} />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => handleThemeChange("system")}
                  className={`w-full flex items-center space-x-2 px-3 py-2 ${getTextSize()} rounded-md transition-colors ${
                    theme === "system"
                      ? "text-warm-200 dark:text-warm-200"
                      : "text-neutral-700 dark:text-neutral-300 hover:text-warm-200 dark:hover:text-warm-200"
                  }`}
                >
                  <Monitor className={getIconSize()} />
                  <span>System</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default: icon-only variant
  return (
    <button
      onClick={() => {
        // Cycle through themes: light -> dark -> system -> light
        if (theme === "light") {
          setTheme("dark");
        } else if (theme === "dark") {
          setTheme("system");
        } else {
          setTheme("light");
        }
      }}
      className={`${getSizeClasses()} rounded-full flex items-center justify-center text-[#A4A7AE] hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors ${className}`}
    >
      {theme === "dark" ? (
        <Moon className={getIconSize()} />
      ) : theme === "light" ? (
        <Sun className={getIconSize()} />
      ) : (
        <Monitor className={getIconSize()} />
      )}
    </button>
  );
}
