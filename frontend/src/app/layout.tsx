import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import { FinancialProvider } from "@/context/FinancialContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LumenXo CFO | Strategic Financial Intelligence",
  description: "Executive financial instrument for venture founders. Runway, burn multiple, and margin — computed live, not once a quarter.",
  keywords: "CFO, startup finance, runway, burn multiple, venture reporting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} ${newsreader.variable} antialiased selection:bg-[#3D5A45]/15 selection:text-[#1B1D1C] bg-[var(--paper)] text-[var(--ink)]`}
      >
        <FinancialProvider>{children}</FinancialProvider>
      </body>
    </html>
  );
}
