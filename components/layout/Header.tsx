"use client";

import { Logo } from "@/components/common/Logo";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, Settings, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOutAction } from "@/app/(auth)/actions";
import { Spinner } from "@/components/common/spinner";
import { toast } from "sonner";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

interface HeaderProps {
  user?: User;
}

const Header = ({ user }: HeaderProps = {}) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";
  const isDashboardPage = pathname === "/dashboard";

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
      const result = await signOutAction();

      if (result.success) {
        // Close any open menus
        setIsProfileMenuOpen(false);
        setIsMenuOpen(false);

        // Redirect to home page
        router.push("/");
        // router.refresh();
      } else {
        // toast.error(result.message || "Failed to sign out");
      }
    } catch (error) {
      // console.error("Sign out error:", error);
      // toast.error("An error occurred during sign out");
    } finally {
      setIsSigningOut(false);
    }
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
              className="text-[#414651] hover:text-neutral-600 font-semibold whitespace-nowrap"
            >
              Jobs
            </Link>
            <Link
              href="/news"
              className="text-[#414651] hover:text-neutral-600 font-semibold whitespace-nowrap"
            >
              News
            </Link>
            <Link
              href="/lifestyle"
              className="text-[#414651] hover:text-neutral-600 font-semibold whitespace-nowrap"
            >
              Lifestyle
            </Link>
            <Link
              href="/entertainment"
              className="text-[#414651] hover:text-neutral-600 font-semibold whitespace-nowrap"
            >
              Entertainment
            </Link>
            <Link
              href="/cv-optimization"
              className="text-[#414651] hover:text-neutral-600 font-semibold whitespace-nowrap"
            >
              CV Optimization
            </Link>
            <Link
              href="/hotels-restaurants"
              className="text-[#414651] hover:text-neutral-600 font-semibold whitespace-nowrap"
            >
              Hotels & Restaurants
            </Link>
            <Link
              href="/travel-tourism"
              className="text-[#414651] hover:text-neutral-600 font-semibold whitespace-nowrap"
            >
              Travel & Tourism
            </Link>
          </nav>
        </div>

        {/* Auth Buttons or User Profile */}
        <div className="hidden md:flex items-center space-x-4 ml-8">
          {!user ? (
            // Unauthenticated state - show login/signup buttons
            <>
              <Link
                href="/login"
                className={`h-11 px-4 rounded-lg ${
                  isLoginPage
                    ? "bg-white text-[#A4A7AE] border border-[#E9EAEB] cursor-default pointer-events-none"
                    : "border border-[#D5D7DA] text-neutral-500 bg-white hover:bg-neutral-50"
                } text-base font-medium whitespace-nowrap flex items-center justify-center transition-colors shadow-sm`}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className={`h-11 px-4 rounded-lg ${
                  isSignupPage
                    ? "bg-[#F5F5F5] text-[#A4A7AE] cursor-default pointer-events-none"
                    : "bg-peach-200 hover:bg-peach-300 text-white"
                } text-base font-medium whitespace-nowrap flex items-center justify-center transition-colors shadow-sm`}
              >
                Sign up
              </Link>
            </>
          ) : (
            // Authenticated state - show user profile and settings buttons
            <div className="relative flex items-center">
              <div className="flex items-center space-x-3 pr-3">
                <button
                  onClick={() => {}}
                  className={`w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center ${isDashboardPage ? "text-warm-200" : "text-neutral-500 hover:bg-neutral-200"}`}
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 px-2 py-1 rounded-full hover:bg-neutral-100"
                >
                  <div className="w-10 h-10 rounded-full bg-warm-200 flex items-center justify-center text-white">
                    {user.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <span className="font-medium text-neutral-800">
                    {user.name || "User"}
                  </span>
                </button>
              </div>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg bg-white border border-neutral-200 z-50"
                  >
                    <div className="p-2">
                      <div className="border-b border-neutral-100 pb-2 mb-2">
                        <p className="px-3 py-2 text-sm font-medium text-neutral-900">
                          {user.name || "User"}
                        </p>
                        <p className="px-3 py-1 text-xs text-neutral-500">
                          {user.email || "user@example.com"}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-md"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-md"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                      >
                        {isSigningOut ? (
                          <Spinner size="sm" className="mr-2" />
                        ) : (
                          <LogOut className="w-4 h-4" />
                        )}
                        <span>
                          {isSigningOut ? "Signing out..." : "Sign out"}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed top-[72px] left-0 w-full z-50 bg-white shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
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

              {/* Auth buttons or profile */}
              {!user ? (
                // Unauthenticated mobile view
                <div className="flex flex-col gap-4">
                  <Link
                    href="/signup"
                    className={`h-14 rounded-xl ${
                      isSignupPage
                        ? "bg-[#F5F5F5] text-[#A4A7AE] cursor-default pointer-events-none"
                        : "bg-peach-200 hover:bg-peach-300 text-white"
                    } text-lg font-medium flex items-center justify-center transition-colors`}
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/login"
                    className={`h-14 rounded-xl ${
                      isLoginPage
                        ? "bg-white text-[#A4A7AE] border border-[#E9EAEB] cursor-default pointer-events-none"
                        : "border border-[#D5D7DA] text-neutral-700 bg-white hover:bg-neutral-50"
                    } text-lg font-medium flex items-center justify-center transition-colors`}
                  >
                    Log in
                  </Link>
                </div>
              ) : (
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
                      <p className="font-medium text-neutral-900">
                        {user.name || "User"}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {user.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 px-4 py-3 text-neutral-800 hover:bg-neutral-100 rounded-lg"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center space-x-2 px-4 py-3 text-neutral-800 hover:bg-neutral-100 rounded-lg"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-left"
                  >
                    {isSigningOut ? (
                      <Spinner size="sm" className="mr-2" />
                    ) : (
                      <LogOut className="w-5 h-5" />
                    )}
                    <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
