"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, User } from "lucide-react";

export function DashboardNavigation() {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: pathname === "/dashboard",
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      current: pathname === "/dashboard/settings",
    },
  ];

  return (
    <nav className="bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  item.current
                    ? "border-warm-200 text-warm-200 dark:text-[#FF7D1A]"
                    : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
