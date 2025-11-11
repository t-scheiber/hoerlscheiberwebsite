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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
