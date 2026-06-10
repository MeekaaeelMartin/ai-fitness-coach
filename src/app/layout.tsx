import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AppReadyProvider } from "@/components/providers/app-ready-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
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
  title: "AI Fitness Coach | Personalised Workout & Meal Plans for South Africa",
  description:
    "Get a fully personalised workout and meal plan in Rands, tailored to your body, goals, and budget. Start for free. From R500/month.",
  keywords: [
    "AI fitness coach",
    "personalised workout plan",
    "meal plan",
    "fitness assessment",
    "nutrition plan",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>
          <AppReadyProvider>
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </AppReadyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
