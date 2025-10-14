import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authService } from "@/lib/auth/auth-service";
import { adminAuthService } from "@/lib/auth/admin-auth-service";
import {
  createUserSession,
  updateSessionLastActive,
  validateSession,
  invalidateSession,
} from "@/lib/auth/session-utils";
import { headers } from "next/headers";

// Extend session with additional properties
type ExtendedUser = {
  id: string;
  email: string;
  name: string;
  accountType: string;
  emailVerified: boolean;
  isAdmin?: boolean;
  adminRole?: string;
};

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials, req) {
        try {
          // Basic validation for credentials
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = credentials.email as string;
          const password = credentials.password as string;
          const isAdminLogin = credentials.isAdmin === "true";

          // If admin login, authenticate as admin
          if (isAdminLogin) {
            const admin = await adminAuthService.authenticateAdmin(
              email,
              password
            );

            if (!admin) {
              return null;
            }

            // Return the admin object (will be stored in the session)
            const authUser = {
              id: admin.id,
              email: admin.email,
              name: `${admin.firstName} ${admin.lastName}`,
            };

            // Store custom properties in a way NextAuth can process
            (authUser as any).isAdmin = true;
            (authUser as any).adminRole = admin.role;
            (authUser as any).accountType = "Admin";
            (authUser as any).emailVerified = true;

            return authUser;
          }

          // Otherwise, authenticate as regular user
          const user = await authService.authenticateUser(email, password);

          if (!user) {
            return null;
          }

          // Return the user object (will be stored in the session)
          const authUser = {
            id: user.id,
            email: user.email,
            name: user.fullName,
          };

          // Store custom properties in a way NextAuth can process
          (authUser as any).accountType = user.accountType;
          (authUser as any).emailVerified = user.emailVerified;
          (authUser as any).isAdmin = false;

          return authUser;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Add JWT callback to include custom user data in token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // Use type assertion to handle custom properties
        token.accountType = (user as any).accountType;
        token.emailVerified = (user as any).emailVerified;
        token.isAdmin = (user as any).isAdmin;
        token.adminRole = (user as any).adminRole;
      }

      // Update session last active on each request (skip for admins)
      if (token.sub && token.jti && !token.isAdmin) {
        try {
          await updateSessionLastActive(token.jti as string);
        } catch (error) {
          console.error("Failed to update session last active:", error);
        }
      }

      return token;
    },
    // Add session callback to make user data available client-side
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // Add custom properties to session
        (session.user as any).accountType = token.accountType;
        (session.user as any).emailVerified = token.emailVerified;
        (session.user as any).isAdmin = token.isAdmin;
        (session.user as any).adminRole = token.adminRole;
      }

      return session;
    },
    // Add signIn callback to create session record
    async signIn({ user, account, profile, email, credentials }) {
      // Skip session tracking for admin users
      const isAdminLogin = (credentials as any)?.isAdmin === "true";

      if (user?.id && !isAdminLogin) {
        try {
          // Get request headers for user agent and IP
          const headersList = await headers();
          const userAgent = headersList.get("user-agent") || "";
          const forwardedFor = headersList.get("x-forwarded-for");
          const realIp = headersList.get("x-real-ip");
          const ipAddress = forwardedFor?.split(",")[0] || realIp || "";

          // Create session record
          await createUserSession({
            userId: user.id,
            sessionToken: createId(), // Generate a unique session token
            userAgent,
            ipAddress,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          });
        } catch (error) {
          console.error("Failed to create session record:", error);
          // Don't fail the sign in for session tracking errors
        }
      }
      return true;
    },
  },
});

// Helper function to create unique session tokens
function createId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
