import type { NextAuthConfig } from "next-auth";

// Define session strategy
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/signup") ||
        nextUrl.pathname.startsWith("/forgot-password") ||
        nextUrl.pathname.startsWith("/reset-password");

      // Protect dashboard routes - redirect to login if not logged in
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Will redirect to login
      }

      // Redirect to dashboard if trying to access auth pages while logged in
      if (isOnAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // Allow access to all other pages
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
