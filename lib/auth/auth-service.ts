import { db } from "@/lib/db/drizzle";
import {
  users,
  passwordResetTokens,
  emailVerificationTokens,
  type NewUser,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

// Generate a salt and hash the password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify a password against a hash
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate a random token
export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

// User Authentication Service
export const authService = {
  // Create a new user
  async createUser(
    userData: Omit<NewUser, "id" | "passwordHash"> & { password: string }
  ): Promise<{ id: string }> {
    const passwordHash = await hashPassword(userData.password);

    const [newUser] = await db
      .insert(users)
      .values({
        id: createId(),
        fullName: userData.fullName,
        email: userData.email,
        passwordHash,
        accountType: userData.accountType,
        emailVerified: false,
        termsAccepted: userData.termsAccepted || false,
      })
      .returning({ id: users.id });

    return { id: newUser.id };
  },

  // Find a user by email
  async getUserByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user || null;
  },

  // Find a user by ID
  async getUserById(id: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user || null;
  },

  // Authenticate a user
  async authenticateUser(email: string, password: string) {
    const user = await this.getUserByEmail(email);

    if (!user) return null;

    const passwordValid = await verifyPassword(password, user.passwordHash);

    if (!passwordValid) return null;

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      accountType: user.accountType,
      emailVerified: user.emailVerified,
    };
  },

  // Create a password reset token
  async createPasswordResetToken(userId: string) {
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

    // Delete any existing tokens for this user
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, userId));

    // Create a new token
    await db.insert(passwordResetTokens).values({
      userId,
      token,
      expiresAt,
    });

    return token;
  },

  // Verify a password reset token
  async verifyPasswordResetToken(token: string) {
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1);

    if (!resetToken) return null;

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      // Delete expired token
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, resetToken.id));
      return null;
    }

    return resetToken;
  },

  // Reset password using token
  async resetPassword(token: string, newPassword: string) {
    const resetToken = await this.verifyPasswordResetToken(token);

    if (!resetToken) return false;

    const passwordHash = await hashPassword(newPassword);

    // Update user's password
    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, resetToken.userId));

    // Delete the used token
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, resetToken.id));

    return true;
  },

  // Create email verification token
  async createEmailVerificationToken(userId: string) {
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

    // Delete any existing tokens for this user
    await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.userId, userId));

    // Create a new token
    await db.insert(emailVerificationTokens).values({
      userId,
      token,
      expiresAt,
    });

    return token;
  },

  // Verify email
  async verifyEmail(token: string) {
    const [verificationToken] = await db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token))
      .limit(1);

    if (!verificationToken) return false;

    // Check if token is expired
    if (verificationToken.expiresAt < new Date()) {
      // Delete expired token
      await db
        .delete(emailVerificationTokens)
        .where(eq(emailVerificationTokens.id, verificationToken.id));
      return false;
    }

    // Update user's email verification status
    await db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, verificationToken.userId));

    // Delete the used token
    await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.id, verificationToken.id));

    return true;
  },
};
