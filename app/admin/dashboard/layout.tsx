"use client";

import AdminSidebar from "@/components/layout/AdminSidebar";
import { useState, useEffect } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(256); // 64 * 4 = 256px (w-64)

  useEffect(() => {
    const handleResize = () => {
      // Check if sidebar is collapsed by looking at localStorage or a more sophisticated state management
      const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
      setSidebarWidth(isCollapsed ? 64 : 256);
    };

    handleResize();
    window.addEventListener("storage", handleResize);
    return () => window.removeEventListener("storage", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-[72px] transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
