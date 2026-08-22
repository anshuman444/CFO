import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "LumenXo CFO | Institutional Financial Intelligence",
  description: "Premium AI-powered CFO advisory platform for venture-backed startups. Real-time financial analytics, investor-grade metrics, and strategic intelligence.",
  keywords: "CFO, startup finance, runway, burn rate, investor metrics, AI advisory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
