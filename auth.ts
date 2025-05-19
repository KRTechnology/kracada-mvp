import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authService } from "@/lib/auth/auth-service";

// Create a login validation schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

// Extend session with additional properties
type ExtendedUser = {
  id: string;
  email: string;
  name: string;
  accountType: string;
  emailVerified: boolean;
};

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          // Validate the credentials
          const parsedCredentials = loginSchema.safeParse(credentials);

          if (!parsedCredentials.success) {
            console.log("Invalid credentials format");
            return null;
          }

          const { email, password } = parsedCredentials.data;

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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Use type assertion to handle custom properties
        token.accountType = (user as any).accountType;
        token.emailVerified = (user as any).emailVerified;
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
  },
});
