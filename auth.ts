import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authService } from "@/lib/auth/auth-service";
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

          // Authenticate user with email and password
          const user = await authService.authenticateUser(email, password);

          if (!user) {
            console.log("Invalid credentials");
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
      }

      // Update session last active on each request
      if (token.sub && token.jti) {
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
      }
      return session;
    },
    // Add signIn callback to create session record
    async signIn({ user, account, profile, email, credentials }) {
      if (user?.id) {
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
