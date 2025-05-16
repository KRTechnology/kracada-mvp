import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

// Geist Sans (already correctly configured in your code)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Geist Mono (already correctly configured in your code)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Adding Inter if you want to use it
const inter = Inter({
  variable: "--font-inter",
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
  metadataBase: new URL("https://kracada.com"), // Replace with actual domain when available
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
