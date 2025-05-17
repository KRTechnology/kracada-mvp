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

interface PasswordChangedEmailProps {
  fullName: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kracada.com";

export default function PasswordChangedEmail({
  fullName,
}: PasswordChangedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Kracada password has been changed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/images/logo.png`}
            width="140"
            height="40"
            alt="Kracada"
            style={logo}
          />
          <Heading style={heading}>Password Changed Successfully</Heading>
          <Section>
            <Text style={paragraph}>Hello {fullName},</Text>
            <Text style={paragraph}>
              Your password for Kracada has been successfully changed.
            </Text>
            <Text style={paragraph}>
              If you made this change, no further action is required.
            </Text>
            <Text style={paragraph}>
              If you did not change your password, please contact us immediately
              at{" "}
              <Link href="mailto:support@kracada.com" style={textLink}>
                support@kracada.com
              </Link>
              .
            </Text>
            <Button style={button} href={`${baseUrl}/login`}>
              Log In to Your Account
            </Button>
            <Hr style={hr} />
            <Text style={footer}>
              © {new Date().getFullYear()} Kracada. All rights reserved.
            </Text>
            <Text style={footer}>
              <Link href={`${baseUrl}/privacy-policy`} style={textLink}>
                Privacy Policy
              </Link>{" "}
              •{" "}
              <Link href={`${baseUrl}/terms-and-conditions`} style={textLink}>
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

const textLink = {
  color: "#FF6F00", // warm-200 from tailwind config
  textDecoration: "underline",
};
