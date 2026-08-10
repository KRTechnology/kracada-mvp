"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, FolderInput, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LifestyleArticle {
  id: string;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
}

interface LifestyleArticleCardProps {
  article: LifestyleArticle;
  index: number;
  isEntertainment?: boolean;
  /** Turns on the Apple-style long-press (or right-click) context menu */
  enableContextMenu?: boolean;
  /** Called when "Move" is selected in the context menu */
  onMove?: (article: LifestyleArticle) => void;
  // /** Called when "Delete" is selected in the context menu */
  onDelete?: (article: LifestyleArticle) => void;
}

const LONG_PRESS_MS = 450;

export function LifestyleArticleCard({
  article,
  index,
  isEntertainment = false,
  enableContextMenu = false,
  onDelete,
  onMove,
}: LifestyleArticleCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [pressing, setPressing] = useState(false);

  const href = isEntertainment
    ? `/entertainment/${article.id}`
    : `/lifestyle/${article.id}`;

  // Function to get category color based on index
  const getCategoryColor = (categoryIndex: number) => {
    const colors = [
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
      "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    ];
    return colors[categoryIndex % colors.length];
  };

  const clearPressTimer = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const openMenu = useCallback(() => {
    if (!enableContextMenu) return;
    longPressFired.current = true;
    setMenuOpen(true);
    setPressing(false);
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(10);
    }
  }, [enableContextMenu]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!enableContextMenu || e.button === 2) return;
    longPressFired.current = false;
    setPressing(true);
    pressTimer.current = setTimeout(openMenu, LONG_PRESS_MS);
  };

  const handlePointerUp = () => {
    clearPressTimer();
    setPressing(false);
  };

  const handlePointerLeave = () => {
    clearPressTimer();
    setPressing(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!enableContextMenu) return;
    e.preventDefault();
    openMenu();
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    // Swallow the click that follows a long press so it doesn't navigate.
    if (longPressFired.current) {
      e.preventDefault();
      e.stopPropagation();
      longPressFired.current = false;
    }
  };

  const closeMenu = () => setMenuOpen(false);

  const handleMove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
    onMove?.(article);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
    onDelete?.(article);
  };

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div
      ref={cardRef}
      className="relative h-full select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      onContextMenu={handleContextMenu}
      onClickCapture={handleClickCapture}
    >
      <Link
        href={href}
        className="h-full block"
        onClick={(e) => {
          if (longPressFired.current) e.preventDefault();
        }}
      >
        <motion.div
          animate={{ scale: pressing ? 0.97 : 1 }}
          transition={{ duration: 0.15 }}
          className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group cursor-pointer h-full flex flex-col"
        >
          {/* Article Image */}
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Article Content */}
          <div className="p-6 space-y-4 flex-1 flex flex-col">
            {/* Author and Date */}
            <div className="flex items-center text-sm">
              <span className="text-orange-500 font-medium">
                {article.author}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400 mx-2">
                •
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">
                {article.date}
              </span>
            </div>

            {/* Title with External Link Icon */}
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight flex-1 pr-2">
                {article.title}
              </h3>
              <ExternalLink className="w-5 h-5 text-neutral-400 dark:text-neutral-500 flex-shrink-0 mt-1" />
            </div>

            {/* Description */}
            <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed flex-1">
              {article.description}
            </p>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mt-auto">
              {article.categories.map((category, categoryIndex) => (
                <span
                  key={categoryIndex}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                    categoryIndex,
                  )}`}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Long-press / right-click context menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
              }}
            />
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.9, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-3 right-3 z-50 w-40 overflow-hidden rounded-xl border border-black/5 bg-white/95 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-neutral-800/95"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleMove}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-700/60"
              >
                <FolderInput className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                Move
              </button>
              <div className="h-px bg-neutral-100 dark:bg-neutral-700" />
              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
