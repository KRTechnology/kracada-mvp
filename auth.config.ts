import type { NextAuthConfig } from "next-auth";

// Define session strategy
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    // JWT callback for Edge runtime - ensures custom claims are available
    async jwt({ token, user }) {
      if (user) {
        // Copy custom properties from user to token
        token.isAdmin = (user as any).isAdmin;
        token.adminRole = (user as any).adminRole;
        token.accountType = (user as any).accountType;
      }
      return token;
    },
    // Session callback for Edge runtime - makes token claims available in session
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).isAdmin = token.isAdmin;
        (session.user as any).adminRole = token.adminRole;
        (session.user as any).accountType = token.accountType;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = (auth?.user as any)?.isAdmin === true;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isOnAdminLogin = nextUrl.pathname === "/admin/login";
      const isOnAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/signup") ||
        nextUrl.pathname.startsWith("/forgot-password") ||
        nextUrl.pathname.startsWith("/reset-password");

      // Debug logging for admin routes
      if (isOnAdminRoute) {
        console.log("🔐 Admin route check:", {
          path: nextUrl.pathname,
          isLoggedIn,
          isAdmin,
          user: auth?.user
            ? { email: auth.user.email, isAdmin: (auth.user as any)?.isAdmin }
            : null,
        });
      }

      // Admin login page - allow if not logged in, or redirect if logged in as admin
      if (isOnAdminLogin) {
        if (isLoggedIn && isAdmin) {
          return Response.redirect(new URL("/admin/dashboard", nextUrl));
        }
        // Allow access to admin login page
        return true;
      }

      // Admin route protection
      if (isOnAdminRoute) {
        // If logged in as regular user (not admin), redirect to home
        if (isLoggedIn && !isAdmin) {
          return Response.redirect(new URL("/", nextUrl));
        }
        // If not logged in at all, redirect to admin login
        if (!isLoggedIn) {
          return Response.redirect(new URL("/admin/login", nextUrl));
        }
        // If admin, allow access
        return true;
      }

      // Protect dashboard routes
      if (isOnDashboard) {
        // If admin trying to access regular dashboard, redirect to admin dashboard
        if (isLoggedIn && isAdmin) {
          return Response.redirect(new URL("/admin/dashboard", nextUrl));
        }
        // If regular user logged in, allow access
        if (isLoggedIn) return true;
        // If not logged in, redirect to login
        return false;
      }

      // Redirect to appropriate dashboard if trying to access auth pages while logged in
      if (isOnAuthPage && isLoggedIn) {
        if (isAdmin) {
          return Response.redirect(new URL("/admin/dashboard", nextUrl));
        }
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // Allow access to all other pages
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
