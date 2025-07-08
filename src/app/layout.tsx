import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { PricingProvider } from "../context/PricingContext";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import ScrollManager from "../components/ScrollManager";// 👈 Import this
import { UserProvider } from "../context/UserContext";

config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "123Applied - AI Cover Letter Generator",
  description: "AI-powered job application automation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <ScrollManager /> {/* 👈 Add this for buttery smooth scroll */}
        <UserProvider>
          <PricingProvider>{children}</PricingProvider>
        </UserProvider>
      </body>
    </html>
  );
}
