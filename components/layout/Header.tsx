"use client";

import { Logo } from "@/components/common/Logo";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 border-b border-neutral-100 bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center min-w-0">
          <Logo />
          {/* Responsive Navigation: spacing and scroll */}
          <nav className="hidden md:flex items-center ml-5 space-x-4 xl:space-x-8 overflow-x-auto scrollbar-none min-w-0">
            <Link
              href="/jobs"
              className="text-neutral-500 hover:text-neutral-600 font-medium whitespace-nowrap"
            >
              Jobs
            </Link>
            <Link
              href="/news"
              className="text-neutral-500 hover:text-neutral-600 font-medium whitespace-nowrap"
            >
              News
            </Link>
            <Link
              href="/lifestyle"
              className="text-neutral-500 hover:text-neutral-600 font-medium whitespace-nowrap"
            >
              Lifestyle
            </Link>
            <Link
              href="/entertainment"
              className="text-neutral-500 hover:text-neutral-600 font-medium whitespace-nowrap"
            >
              Entertainment
            </Link>
            <Link
              href="/cv-optimization"
              className="text-neutral-500 hover:text-neutral-600 font-medium whitespace-nowrap"
            >
              CV Optimization
            </Link>
            <Link
              href="/hotels-restaurants"
              className="text-neutral-500 hover:text-neutral-600 font-medium whitespace-nowrap"
            >
              Hotels & Restaurants
            </Link>
            <Link
              href="/travel-tourism"
              className="text-neutral-500 hover:text-neutral-600 font-medium whitespace-nowrap"
            >
              Travel & Tourism
            </Link>
          </nav>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4 ml-8">
          <Link
            href="/login"
            className="h-12 px-6 rounded-lg border border-neutral-200 text-neutral-500 bg-white hover:bg-neutral-50 text-base font-medium whitespace-nowrap flex items-center justify-center transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="h-12 px-6 rounded-lg bg-peach-200 hover:bg-peach-300 text-white text-base font-medium whitespace-nowrap flex items-center justify-center transition-colors"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden z-20 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg transition-colors"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {!isMenuOpen ? (
              <motion.span
                key="menu"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                <Menu size={28} className="text-neutral-700" />
              </motion.span>
            ) : (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                <X size={32} className="text-neutral-700" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu Overlay - Figma style */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed top-[72px] left-0 w-full z-50 bg-white shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="p-6 flex flex-col">
              <nav className="flex flex-col gap-6 mb-8">
                <Link
                  href="/jobs"
                  className="text-neutral-900 text-base font-bold"
                >
                  Jobs
                </Link>
                <Link
                  href="/news"
                  className="text-neutral-900 text-base font-bold"
                >
                  News
                </Link>
                <Link
                  href="/lifestyle"
                  className="text-neutral-900 text-base font-bold"
                >
                  Lifestyle
                </Link>
                <Link
                  href="/entertainment"
                  className="text-neutral-900 text-base font-bold"
                >
                  Entertainment
                </Link>
                <Link
                  href="/cv-optimization"
                  className="text-neutral-900 text-base font-bold"
                >
                  CV Optimization
                </Link>
                <Link
                  href="/hotels-restaurants"
                  className="text-neutral-900 text-base font-bold"
                >
                  Hotels & Restaurants
                </Link>
                <Link
                  href="/travel-tourism"
                  className="text-neutral-900 text-base font-bold"
                >
                  Travel & Tourism
                </Link>
              </nav>
              <div className="border-b border-neutral-100 mb-4" />
              {/* Auth buttons */}
              <div className="flex flex-col gap-4">
                <Link
                  href="/signup"
                  className="h-14 rounded-xl bg-peach-200 hover:bg-peach-300 text-white text-lg font-medium flex items-center justify-center transition-colors"
                >
                  Sign up
                </Link>
                <Link
                  href="/login"
                  className="h-14 rounded-xl border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 text-lg font-medium flex items-center justify-center transition-colors"
                >
                  Log in
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
