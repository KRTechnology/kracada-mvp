"use client";

import { Logo } from "@/components/common/Logo";
import { Spinner } from "@/components/common/spinner";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { AnimatePresence, motion } from "framer-motion";
import {
  LogOut,
  Menu,
  Settings,
  User,
  X,
  Bell,
  CircleUserRound,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";

const Header = () => {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();

  // Refs for click outside detection
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const isLoading = status === "loading";

  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";
  const isDashboardPage = pathname.startsWith("/dashboard");

  // Monitor session changes and close menus when unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      setIsProfileMenuOpen(false);
      setIsMenuOpen(false);
    }
  }, [status]);

  // Click outside effect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut({ callbackUrl: "/" });

      // Close menus
      setIsProfileMenuOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center min-w-0">
          <Logo />
          {/* Responsive Navigation: spacing and scroll */}
          <nav className="hidden md:flex items-center ml-5 space-x-4 xl:space-x-8 overflow-x-auto scrollbar-none min-w-0">
            <Link
              href="/jobs"
              className="text-[#414651] dark:text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-200 font-semibold whitespace-nowrap transition-colors"
            >
              Jobs
            </Link>
            <Link
              href="/news"
              className="text-[#414651] dark:text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-200 font-semibold whitespace-nowrap transition-colors"
            >
              News
            </Link>
            <Link
              href="/lifestyle"
              className="text-[#414651] dark:text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-200 font-semibold whitespace-nowrap transition-colors"
            >
              Lifestyle
            </Link>
            <Link
              href="/entertainment"
              className="text-[#414651] dark:text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-200 font-semibold whitespace-nowrap transition-colors"
            >
              Entertainment
            </Link>
            <Link
              href="/cv-optimization"
              className="text-[#414651] dark:text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-200 font-semibold whitespace-nowrap transition-colors"
            >
              CV Optimization
            </Link>
            <Link
              href="/hotels-restaurants"
              className="text-[#414651] dark:text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-200 font-semibold whitespace-nowrap transition-colors"
            >
              Hotels & Restaurants
            </Link>
            <Link
              href="/travel-tourism"
              className="text-[#414651] dark:text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-200 font-semibold whitespace-nowrap transition-colors"
            >
              Travel & Tourism
            </Link>
          </nav>
        </div>

        {/* Auth Buttons or User Profile */}
        <div className="hidden md:flex items-center space-x-4 ml-8">
          {!user && !isLoading ? (
            // Unauthenticated state - show login/signup buttons and theme toggle
            <>
              <ThemeToggle />
              <Link
                href="/login"
                className={`h-11 px-4 rounded-lg ${
                  isLoginPage
                    ? "bg-white dark:bg-neutral-800 text-[#A4A7AE] border border-[#E9EAEB] dark:border-neutral-700 cursor-default pointer-events-none"
                    : "border border-[#D5D7DA] dark:border-neutral-600 text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                } text-base font-medium whitespace-nowrap flex items-center justify-center transition-colors shadow-sm`}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className={`h-11 px-4 rounded-lg ${
                  isSignupPage
                    ? "bg-[#F5F5F5] dark:bg-neutral-700 text-[#A4A7AE] cursor-default pointer-events-none"
                    : "bg-peach-200 hover:bg-peach-300 text-white"
                } text-base font-medium whitespace-nowrap flex items-center justify-center transition-colors shadow-sm`}
              >
                Sign up
              </Link>
            </>
          ) : user ? (
            // Authenticated state - show settings, notification, and profile icons
            <div className="flex items-center space-x-3">
              {/* Settings Icon */}
              <button
                onClick={() => router.push("/dashboard")}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#A4A7AE] hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Notifications Icon */}
              <button
                onClick={() => {
                  /* Handle notifications */
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#A4A7AE] hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {/* Optional notification dot */}
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Dark Mode Toggle */}
              <ThemeToggle />

              {/* Profile Icon with Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 px-2 py-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-warm-200 flex items-center justify-center text-white">
                    {user.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <p className="font-medium text-neutral-800 dark:text-neutral-200 text-sm">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {user.email || "user@example.com"}
                    </p>
                  </div>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 z-50"
                    >
                      <div className="p-4">
                        {/* Header with Menu text */}
                        <div className="mb-4">
                          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                            Menu
                          </h3>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center space-x-3 mb-6 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                          <div className="w-12 h-12 rounded-full bg-warm-200 flex items-center justify-center text-white relative">
                            {user.name ? (
                              user.name.charAt(0).toUpperCase()
                            ) : (
                              <User className="w-6 h-6" />
                            )}
                            {/* Online indicator */}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-neutral-700"></div>
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-neutral-100">
                              {user.name || "[User's Name]"}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              {user.email || "usersmail@mail.com"}
                            </p>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-1">
                          <Link
                            href="/dashboard"
                            className="flex items-center space-x-3 px-3 py-3 text-neutral-700 dark:text-neutral-300 hover:text-warm-200 dark:hover:text-warm-200 rounded-xl transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <CircleUserRound className="w-5 h-5" />
                            <span>View profile</span>
                          </Link>

                          <Link
                            href="/settings"
                            className="flex items-center space-x-3 px-3 py-3 text-neutral-700 dark:text-neutral-300 hover:text-warm-200 dark:hover:text-warm-200 rounded-xl transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                          </Link>

                          <div className="flex items-center space-x-3 px-3 py-3 text-neutral-700 dark:text-neutral-300 hover:text-warm-200 dark:hover:text-warm-200 rounded-xl transition-colors">
                            <div className="w-5 h-5 rounded-full border-2 border-neutral-400 flex items-center justify-center">
                              <span className="text-xs">?</span>
                            </div>
                            <span>Support</span>
                          </div>

                          <button
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="w-full flex items-center space-x-3 px-3 py-3 text-neutral-700 dark:text-neutral-300 hover:text-warm-200 dark:hover:text-warm-200 rounded-xl transition-colors"
                          >
                            {isSigningOut ? (
                              <Spinner size="sm" className="w-5 h-5" />
                            ) : (
                              <LogOut className="w-5 h-5" />
                            )}
                            <span>
                              {isSigningOut ? "Signing out..." : "Sign out"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse"></div>
            </div>
          ) : null}
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
                <Menu
                  size={28}
                  className="text-neutral-700 dark:text-neutral-300"
                />
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
                <X
                  size={32}
                  className="text-neutral-700 dark:text-neutral-300"
                />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed top-[72px] left-0 w-full z-50 bg-white dark:bg-neutral-900 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="p-6 flex flex-col">
              <nav className="flex flex-col gap-6 mb-8">
                <Link
                  href="/jobs"
                  className="text-neutral-900 dark:text-neutral-100 text-base font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Jobs
                </Link>
                <Link
                  href="/news"
                  className="text-neutral-900 dark:text-neutral-100 text-base font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  News
                </Link>
                <Link
                  href="/lifestyle"
                  className="text-neutral-900 dark:text-neutral-100 text-base font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Lifestyle
                </Link>
                <Link
                  href="/entertainment"
                  className="text-neutral-900 dark:text-neutral-100 text-base font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entertainment
                </Link>
                <Link
                  href="/cv-optimization"
                  className="text-neutral-900 dark:text-neutral-100 text-base font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  CV Optimization
                </Link>
                <Link
                  href="/hotels-restaurants"
                  className="text-neutral-900 dark:text-neutral-100 text-base font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hotels & Restaurants
                </Link>
                <Link
                  href="/travel-tourism"
                  className="text-neutral-900 dark:text-neutral-100 text-base font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Travel & Tourism
                </Link>
              </nav>
              <div className="border-b border-neutral-100 dark:border-neutral-800 mb-4" />

              {/* Auth buttons or profile */}
              {!user && !isLoading ? (
                // Unauthenticated mobile view
                <div className="flex flex-col gap-4">
                  <ThemeToggle />
                  <Link
                    href="/signup"
                    className={`h-14 rounded-xl ${
                      isSignupPage
                        ? "bg-[#F5F5F5] dark:bg-neutral-700 text-[#A4A7AE] cursor-default pointer-events-none"
                        : "bg-peach-200 hover:bg-peach-300 text-white"
                    } text-lg font-medium flex items-center justify-center transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/login"
                    className={`h-14 rounded-xl ${
                      isLoginPage
                        ? "bg-white dark:bg-neutral-800 text-[#A4A7AE] border border-[#E9EAEB] dark:border-neutral-700 cursor-default pointer-events-none"
                        : "border border-[#D5D7DA] dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                    } text-lg font-medium flex items-center justify-center transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                </div>
              ) : user ? (
                // Authenticated mobile view
                <div className="flex flex-col gap-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-warm-200 flex items-center justify-center text-white text-lg">
                      {user.name ? (
                        user.name.charAt(0).toUpperCase()
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {user.name || "User"}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {user.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 px-4 py-3 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center space-x-2 px-4 py-3 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  <div className="px-4 py-3">
                    <ThemeToggle variant="inline" size="sm" />
                  </div>
                  <div className="flex items-center space-x-3 px-4 py-3 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                    <div className="w-5 h-5 rounded-full border-2 border-neutral-400 flex items-center justify-center">
                      <span className="text-xs">?</span>
                    </div>
                    <span>Support</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-left transition-colors"
                  >
                    {isSigningOut ? (
                      <Spinner size="sm" className="mr-2" />
                    ) : (
                      <LogOut className="w-5 h-5" />
                    )}
                    <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
