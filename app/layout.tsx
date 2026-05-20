import { Toaster } from "@/components/common/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { RecaptchaProvider } from "@/components/providers/RecaptchaProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Kracada",
    default: "Kracada - One stop shop for everything important to you",
  },
  description:
    "Kracada is a lifestyle blog in Nigeria for everything you can think of. Jobs, News, Lifestyle, Entertainment, and CV Optimization.",
  keywords: [
    "kracada",
    "lifestyle blog",
    "nigeria",
    "jobs",
    "news",
    "entertainment",
    "cv optimization",
  ],
  metadataBase: new URL("https://kracada.com"),
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Kracada",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <ConditionalLayout>
              <Toaster richColors />
              <RecaptchaProvider>{children}</RecaptchaProvider>
            </ConditionalLayout>
          </SessionProvider>
        </ThemeProvider>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-V5BB7HB943"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V5BB7HB943');
          `}
        </Script>
      </body>
    </html>
  );
}
