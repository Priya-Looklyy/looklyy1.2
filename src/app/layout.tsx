import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "Looklyy - What if You could see Why some Outfits Work for you",
  description: "What if you could see why some outfits work for you? Join the waitlist.",
  keywords: "fashion, styling, fashion app, waitlist",
  icons: {
    icon: [
      { url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/favicon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: ["/favicon.svg"],
    apple: ["/apple-touch-icon.svg"],
  },
  openGraph: {
    title: "Looklyy - What if You could see Why some Outfits Work for you",
    description: "What if you could see why some outfits work for you? Join the waitlist.",
    type: "website",
    siteName: "Looklyy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Looklyy - What if You could see Why some Outfits Work for you",
    description: "What if you could see why some outfits work for you? Join the waitlist.",
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
      <head>
        {/* Favicon - L Logo */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.svg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/tt-norms" rel="stylesheet" />
        {/* Privacy-friendly analytics by Plausible */}
        <Script
          async
          src="https://plausible.io/js/pa-3se6lzrrvi2jmFwU7Ut8v.js"
          strategy="afterInteractive"
        />
        <Script
          id="plausible-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
              plausible.init()
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
