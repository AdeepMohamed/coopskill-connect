import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "CoopSkill Connect | From Rural Skills to Real Opportunities",
  description: "AI & LMS-Enabled Cooperative Capacity Building, ERP & Employment Ecosystem. NCCT | Ministry of Cooperation, Government of India.",
  keywords: "cooperative training, NCCT, LMS, skill development, employment, CoopSkill AI, Smart India Hackathon",
  authors: [{ name: "NCCT | Ministry of Cooperation" }],
  openGraph: {
    title: "CoopSkill Connect",
    description: "Train • Empower • Certify • Employ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="bg-[#f9f9ff] font-sans antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
