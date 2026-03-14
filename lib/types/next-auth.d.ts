import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    accountType?: string;
    emailVerified?: boolean;
    isAdmin?: boolean;
    adminRole?: string;
  }

  interface Session {
    user: {
      id: string;
      accountType?: string;
      emailVerified?: boolean;
      isAdmin?: boolean;
      adminRole?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accountType?: string;
    emailVerified?: boolean;
    isAdmin?: boolean;
    adminRole?: string;
  }
}
