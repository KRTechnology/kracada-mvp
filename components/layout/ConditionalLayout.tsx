"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = usePathname();

  // Determine if we're in auth, dashboard, or admin routes
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/request-verification") ||
    pathname.startsWith("/signup-confirmation");

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isDashboardPage = pathname === "/dashboard";
  const isEditProfilePage = pathname === "/dashboard/edit";
  const isSetupPage = pathname === "/setup";
  const isSettingsPage = pathname === "/settings";
  const isAdminRoute = pathname.startsWith("/admin");

  // Admin routes handle their own layout completely
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Show only header for auth, dashboard, setup, and settings routes
  const showFooter =
    !isAuthRoute && !isDashboardRoute && !isSetupPage && !isSettingsPage;

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isAuthRoute
          ? "bg-white dark:bg-neutral-900"
          : isDashboardPage || isEditProfilePage
            ? "bg-neutral-50 dark:bg-dark-bg"
            : ""
      }`}
    >
      <Header />
      <main
        className={`${
          isDashboardRoute || isSetupPage || isSettingsPage
            ? "flex-1 pt-[72px]"
            : isAuthRoute
              ? "flex-grow flex"
              : "flex-grow pt-[72px]"
        }`}
      >
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default ConditionalLayout;
