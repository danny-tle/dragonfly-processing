import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter is the brand workhorse (Brand Guidelines 6.2–6.3).
// It's a variable font, so every weight from Light to Bold ships in one file.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// IvyPresto Display (the italic accent face) is licensed through Adobe Fonts,
// so it can't come from next/font/google. Until Dragonfly shares their Adobe
// Fonts kit, --font-display in globals.css falls back to a system serif.

export const metadata: Metadata = {
  title: "Dragonfly | Utah's Craft Cannabis",
  description:
    "Utah's craft cannabis brand, built for the curious and the committed. Find Dragonfly at licensed medical cannabis pharmacies across Utah.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
