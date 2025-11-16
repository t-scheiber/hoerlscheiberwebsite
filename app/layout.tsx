import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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
