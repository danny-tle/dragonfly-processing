import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AgeGate } from "@/components/age-gate";
import { AGE_COOKIE } from "@/lib/age-gate";
import "./globals.css";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Dragonfly | Utah's Craft Cannabis",
  description:
    "Utah's craft cannabis brand, built for the curious and the committed. Find Dragonfly at licensed medical cannabis pharmacies across Utah.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const ageVerified = (await cookies()).get(AGE_COOKIE)?.value === "1";

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {!ageVerified && <AgeGate />}
      </body>
    </html>
  );
}
