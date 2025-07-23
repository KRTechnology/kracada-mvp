"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "./Header";
import Footer from "./Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Determine if we're in auth or dashboard routes
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/request-verification") ||
    pathname.startsWith("/signup-confirmation");

  const isDashboardRoute = pathname.startsWith("/dashboard");

  // Show only header for auth and dashboard routes
  const showFooter = !isAuthRoute && !isDashboardRoute;

  return (
    <div
      className={`flex flex-col min-h-screen ${isAuthRoute ? "bg-white" : ""}`}
    >
      <Header user={session?.user} />
      <main
        className={`${isDashboardRoute ? "flex-1 pt-[72px]" : isAuthRoute ? "flex-grow flex" : "flex-grow pt-[72px]"}`}
      >
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default ConditionalLayout;
