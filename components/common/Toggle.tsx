"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ToggleProps {
  isOn: boolean;
  onToggle: (value: boolean) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export function Toggle({
  isOn,
  onToggle,
  size = "md",
  disabled = false,
  className = "",
}: ToggleProps) {
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: {
      container: "w-8 h-4",
      thumb: "w-3 h-3",
      thumbOffset: "translate-x-0.5",
      thumbOffsetOn: "translate-x-4",
    },
    md: {
      container: "w-10 h-5",
      thumb: "w-4 h-4",
      thumbOffset: "translate-x-0.5",
      thumbOffsetOn: "translate-x-5",
    },
    lg: {
      container: "w-12 h-6",
      thumb: "w-5 h-5",
      thumbOffset: "translate-x-0.5",
      thumbOffsetOn: "translate-x-6",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={isOn}
      disabled={disabled}
      className={`
        relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-warm-200 focus:ring-offset-2
        ${isOn ? "bg-warm-200" : "bg-neutral-200 dark:bg-neutral-600"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${currentSize.container}
        ${className}
      `}
      onClick={() => !disabled && onToggle(!isOn)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <div
        className={`
          bg-white rounded-full shadow-sm absolute top-0.5 transition-transform
          ${currentSize.thumb}
          ${isOn ? currentSize.thumbOffsetOn : currentSize.thumbOffset}
        `}
      />
    </motion.button>
  );
}
