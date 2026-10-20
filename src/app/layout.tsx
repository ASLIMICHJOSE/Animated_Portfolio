import type { Metadata, Viewport } from "next";
import { Cinzel, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#201C19",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://aslimichjose.dev"),
  title: "ASLI MICH JOSE | Creative Frontend Developer & UI/UX Engineer",
  description:
    "A cinematic anime-inspired developer portfolio for Asli Mich Jose. Featuring autumn landscapes, fluid GSAP animations, editorial typography, and high-performance React engineering.",
  keywords: [
    "Asli Mich Jose",
    "Creative Developer",
    "Frontend Developer",
    "Next.js",
    "React",
    "TypeScript",
    "GSAP",
    "Anime Portfolio",
    "Autumn Aesthetics"
  ],
  authors: [{ name: "Asli Mich Jose" }],
  openGraph: {
    title: "ASLI MICH JOSE | Creative Developer Portfolio",
    description:
      "A cinematic anime-inspired portfolio exploring autumn scenery, fluid motion, and modern web engineering.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/hero-autumn-city.jpg",
        width: 1920,
        height: 1080,
        alt: "Asli Mich Jose - Cinematic Autumn Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ASLI MICH JOSE | Creative Developer",
    description: "Cinematic anime-inspired developer portfolio in an autumn golden-hour aesthetic.",
    images: ["/images/hero-autumn-city.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${jakarta.variable} ${mono.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#201C19] text-[#F5EFE5] font-sans selection:bg-[#C96F3B]/30 selection:text-[#F5EFE5] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
