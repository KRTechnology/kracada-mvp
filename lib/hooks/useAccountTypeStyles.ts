import { useEffect, useState } from "react";
import { getAccountTypeColors } from "@/lib/utils/account-type-colors";

export function useAccountTypeStyles(accountType: string) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const accountColors = getAccountTypeColors(accountType);

  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();

    // Watch for changes in dark mode
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const getPillStyles = () => {
    if (isDarkMode) {
      return {
        backgroundColor: accountColors.dark.background,
        borderColor: accountColors.dark.border,
        color: accountColors.dark.text,
      };
    }

    return {
      backgroundColor: accountColors.light.background,
      borderColor: accountColors.light.border,
      color: accountColors.light.text,
    };
  };

  const getStatusColor = () => accountColors.light.status;

  return {
    pillStyles: getPillStyles(),
    statusColor: getStatusColor(),
    isDarkMode,
  };
}
