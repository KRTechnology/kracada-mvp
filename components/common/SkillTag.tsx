import { ReactNode } from "react";

interface SkillTagProps {
  children: ReactNode;
  className?: string;
}

/**
 * Reusable component for skill tags with consistent styling
 * and proper dark mode support
 */
export function SkillTag({ children, className = "" }: SkillTagProps) {
  return (
    <span
      className={`px-2 py-1 bg-warm-50 dark:bg-warm-900/20 text-warm-700 dark:text-warm-100 rounded text-xs ${className}`}
    >
      {children}
    </span>
  );
}
