import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/Geist-variable.ttf",
  weight: "100 900",
  style: "normal",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-variable.ttf",
  weight: "100 900",
  style: "normal",
  variable: "--font-geist-mono",
  display: "swap",
});

const playfairDisplay = localFont({
  src: "./fonts/PlayfairDisplay-variable.ttf",
  weight: "400 700",
  style: "normal",
  variable: "--font-playfair",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/Inter-variable.ttf",
  weight: "300 600",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Louise & Christoph Hörl-Scheiber - Hochzeitsgalerie",
  description: "Alles Gute zur Hochzeit! Louise & Christoph Hörl-Scheiber - 18. Juli 2025",
  keywords: ["Hochzeit", "Wedding", "Louise", "Christoph", "Hörl-Scheiber", "Galerie"],
  authors: [{ name: "Thomas Scheiber" }],
  openGraph: {
    title: "Louise & Christoph Hörl-Scheiber - Hochzeitsgalerie",
    description: "Alles Gute zur Hochzeit! Louise & Christoph Hörl-Scheiber - 18. Juli 2025",
    type: "website",
    locale: "de_DE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
