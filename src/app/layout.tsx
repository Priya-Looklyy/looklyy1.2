import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Looklyy - Recreate Fashion Looks from Your Wardrobe",
  description: "Stop scrolling endlessly. See a look you love? Looklyy shows you how to recreate it with clothes you already own. Pre-register for early access.",
  keywords: "fashion, wardrobe, styling, personal styling, fashion app, wardrobe management, AI fashion",
  icons: {
    icon: [
      { url: "/favicon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: ["/favicon-32x32.svg"],
    apple: ["/apple-touch-icon.svg"],
  },
  openGraph: {
    title: "Looklyy - Recreate Fashion Looks from Your Wardrobe",
    description: "Stop scrolling endlessly. See a look you love? Looklyy shows you how to recreate it with clothes you already own.",
    type: "website",
    siteName: "Looklyy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Looklyy - Recreate Fashion Looks from Your Wardrobe",
    description: "Stop scrolling endlessly. See a look you love? Looklyy shows you how to recreate it with clothes you already own.",
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
