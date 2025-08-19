"use client";

import { useState, useRef, useEffect } from "react";
import { Edit3, X, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface JobPostDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onCloseJob: () => void;
  onDuplicate: () => void;
}

export function JobPostDropdown({
  isOpen,
  onClose,
  onEdit,
  onCloseJob,
  onDuplicate,
}: JobPostDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const menuItems = [
    {
      icon: <Edit3 className="w-4 h-4" />,
      label: "Edit Job Post",
      onClick: onEdit,
    },
    {
      icon: <X className="w-4 h-4" />,
      label: "Close Job",
      onClick: onCloseJob,
    },
    {
      icon: <Copy className="w-4 h-4" />,
      label: "Duplicate Job",
      onClick: onDuplicate,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute top-10 right-0 z-50 min-w-[180px] bg-white dark:bg-dark rounded-lg border border-skillPill-light-bg dark:border-neutral-700 shadow-lg"
        >
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="text-neutral-600 dark:text-neutral-400">
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
