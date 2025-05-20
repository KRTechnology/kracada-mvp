import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  fullName: string;
  verificationLink: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kracada.com";

export default function WelcomeEmail({
  fullName,
  verificationLink,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to Kracada - Your one-stop shop for everything important
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/images/kracada_logo.png`}
            width="140"
            height="40"
            alt="Kracada"
            style={logo}
          />
          <Heading style={heading}>Welcome to Kracada!</Heading>
          <Section>
            <Text style={paragraph}>Hello {fullName},</Text>
            <Text style={paragraph}>
              Thank you for joining Kracada, your one-stop shop for everything
              that is important to you. We're excited to have you on board!
            </Text>
            <Text style={paragraph}>
              To get started, please verify your email address by clicking the
              button below:
            </Text>
            <Button style={button} href={verificationLink}>
              Verify Your Email
            </Button>
            <Text style={paragraph}>
              If you didn't create this account, you can safely ignore this
              email.
            </Text>
            <Text style={paragraph}>
              This verification link will expire in 24 hours.
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              © {new Date().getFullYear()} Kracada. All rights reserved.
            </Text>
            <Text style={footer}>
              <Link href={`${baseUrl}/privacy-policy`} style={link}>
                Privacy Policy
              </Link>{" "}
              •{" "}
              <Link href={`${baseUrl}/terms-and-conditions`} style={link}>
                Terms of Service
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "8px",
  maxWidth: "600px",
};

const logo = {
  margin: "0 auto 24px",
  display: "block",
};

const heading = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "32px 0",
};

const paragraph = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const button = {
  backgroundColor: "#FF6F00", // warm-200 from tailwind config
  borderRadius: "4px",
  color: "#fff",
  display: "block",
  fontSize: "16px",
  fontWeight: 600,
  margin: "24px auto",
  padding: "12px 20px",
  textAlign: "center" as const,
  textDecoration: "none",
  width: "220px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "20px",
  textAlign: "center" as const,
};

const link = {
  color: "#FF6F00", // warm-200 from tailwind config
  textDecoration: "underline",
};
