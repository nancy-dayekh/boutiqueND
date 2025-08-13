import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";

import "./globals.css";
import NavBar from "./components/navbar.jsx";
import Footer from "./components/footer";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-playfair",
});

// Page metadata
export const metadata: Metadata = {
  title: "ND Boutique",
  description: "Fashion & Style with Elegance",
};

// Root layout wrapper
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="mdl-js">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${playfair.variable}
          antialiased
          font-sans
          bg-white
          text-black
        `}
      >
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
