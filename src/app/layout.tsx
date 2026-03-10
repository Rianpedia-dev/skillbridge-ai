import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SkillBridge AI — AI Powered Service Marketplace",
  description:
    "Platform marketplace jasa berbasis AI yang menghubungkan pencari jasa dengan penyedia jasa profesional terpercaya. Temukan freelancer terbaik dengan teknologi AI.",
  keywords: [
    "marketplace jasa",
    "freelancer",
    "AI",
    "service marketplace",
    "SkillBridge",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} antialiased overflow-x-hidden`}>
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
