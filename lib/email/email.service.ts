import { Resend } from "resend";

export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendWelcomeEmail(params: {
    email: string;
    fullName: string;
    verificationLink: string;
  }) {
    const { email, fullName, verificationLink } = params;

    try {
      const { data, error } = await this.resend.emails.send({
        from: `Kracada <${process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"}>`,
        to: email,
        subject: "Welcome to Kracada - Please Verify Your Email",
        react: await this.renderWelcomeEmail({
          fullName,
          verificationLink,
        }),
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      throw error;
    }
  }

  async sendPasswordResetEmail(params: { email: string; resetLink: string }) {
    const { email, resetLink } = params;

    try {
      const { data, error } = await this.resend.emails.send({
        from: `Kracada <${process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"}>`,
        to: email,
        subject: "Reset Your Kracada Password",
        react: await this.renderPasswordResetEmail({
          resetLink,
        }),
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      throw error;
    }
  }

  async sendPasswordChangedEmail(params: { email: string; fullName: string }) {
    const { email, fullName } = params;

    try {
      const { data, error } = await this.resend.emails.send({
        from: `Kracada <${process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"}>`,
        to: email,
        subject: "Your Kracada Password Has Been Changed",
        react: await this.renderPasswordChangedEmail({
          fullName,
        }),
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to send password changed email:", error);
      throw error;
    }
  }

  // Dynamic imports to avoid server component issues
  private async renderWelcomeEmail(props: {
    fullName: string;
    verificationLink: string;
  }) {
    const { default: WelcomeEmail } = await import("./templates/welcome-email");
    return WelcomeEmail(props);
  }

  private async renderPasswordResetEmail(props: { resetLink: string }) {
    const { default: PasswordResetEmail } = await import(
      "./templates/password-reset-email"
    );
    return PasswordResetEmail(props);
  }

  private async renderPasswordChangedEmail(props: { fullName: string }) {
    const { default: PasswordChangedEmail } = await import(
      "./templates/password-changed-email"
    );
    return PasswordChangedEmail(props);
  }
}

// Create a singleton instance
export const emailService = new EmailService();
