"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Users,
  FileStack,
  CreditCard,
  Building,
  Headphones,
  BarChart3,
  Hotel,
  Mail,
  BookOpen,
  Settings,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useState } from "react";
import { Spinner } from "@/components/common/spinner";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/common/Logo";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    href: "/admin/dashboard/admin-management",
    label: "Admin Management",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    href: "/admin/dashboard/cv-review",
    label: "CV Review",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    href: "/admin/dashboard/user-management",
    label: "User Management",
    icon: <Users className="w-5 h-5" />,
  },
  {
    href: "/admin/dashboard/content-management",
    label: "Content Management",
    icon: <FileStack className="w-5 h-5" />,
    badge: 8,
  },
  {
    href: "/admin/dashboard/news",
    label: "News Management",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    href: "/admin/dashboard/lifestyle",
    label: "Lifestyle Management",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    href: "/admin/dashboard/payments",
    label: "Payment & Transactions",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    href: "/admin/dashboard/business-listings",
    label: "Business listings",
    icon: <Building className="w-5 h-5" />,
  },
  {
    href: "/admin/dashboard/customer-support",
    label: "Customer support",
    icon: <Headphones className="w-5 h-5" />,
  },
  {
    href: "/admin/dashboard/analytics",
    label: "Analytics & Report",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    href: "/admin/dashboard/hospitality",
    label: "Hotel, Restaurant, or Travel Agency",
    icon: <Hotel className="w-5 h-5" />,
  },
  {
    href: "/admin/dashboard/mailing-list",
    label: "Mailing list",
    icon: <Mail className="w-5 h-5" />,
  },
  {
    href: "/admin/dashboard/quizzes",
    label: "Quizzes",
    icon: <BookOpen className="w-5 h-5" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const admin = session?.user;

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut({ callbackUrl: "/admin/login" });
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    } finally {
      setIsSigningOut(false);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const SidebarContent = () => (
    <>
      {/* Sidebar Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="bg-gradient-to-br from-warm-200 via-warm-700 to-warm-800 rounded-xl p-4 shadow-lg">
          <h2 className="text-white font-bold text-lg mb-1">Admin Portal</h2>
          <p className="text-warm-50 text-xs">Manage your platform</p>
        </div>
      </div>

      {/* Sidebar content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {/* Navigation items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-warm-100 to-warm-200/20 dark:from-warm-900/30 dark:to-warm-800/20 border border-warm-200/30 dark:border-warm-700/30 text-warm-700 dark:text-warm-300 shadow-sm"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-warm-50 dark:hover:bg-neutral-800 hover:border hover:border-warm-100 dark:hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={
                      isActive
                        ? "scale-110"
                        : "group-hover:scale-110 transition-transform"
                    }
                  >
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-warm-200 to-warm-700 text-xs text-white font-semibold shadow">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Settings section at bottom */}
      <div className="border-t border-warm-200/30 dark:border-neutral-800 px-4 py-4 space-y-4 bg-warm-50/30 dark:bg-neutral-900/50">
        {/* Settings header */}
        <div className="flex items-center space-x-2 text-warm-700 dark:text-warm-300">
          <Settings className="w-4 h-4" />
          <span className="text-sm font-semibold">Settings</span>
        </div>

        {/* Dark Mode Toggle */}
        <ThemeToggle variant="toggle" className="w-full" />

        {/* User profile section */}
        <div className="flex items-center space-x-3 px-3 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-warm-200 flex items-center justify-center text-white relative">
            {admin?.name ? (
              admin.name.charAt(0).toUpperCase()
            ) : (
              <User className="w-5 h-5" />
            )}
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-neutral-800"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {admin?.name || "Admin"}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {admin?.email || "admin@example.com"}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            title="Sign out"
          >
            {isSigningOut ? (
              <Spinner size="sm" className="w-5 h-5" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="px-4 py-6 border-b border-neutral-200 dark:border-neutral-800">
          <Logo />
        </div>
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <Logo />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-neutral-700 dark:text-neutral-300"
        >
          <AnimatePresence mode="wait" initial={false}>
            {!isMobileMenuOpen ? (
              <motion.span
                key="menu"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={28} />
              </motion.span>
            ) : (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <X size={32} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={closeMobileMenu}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-64 z-50 flex flex-col bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800"
            >
              <div className="px-4 py-6 border-b border-neutral-200 dark:border-neutral-800">
                <Logo />
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
