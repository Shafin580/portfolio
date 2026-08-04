import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { profile } from "@/lib/portfolio-data";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const title = `${profile.name} — ${profile.title}`;

const description =
  "Shafin Ahmed is a Full-Stack Software Engineer with 4+ years of experience building scalable web applications using Next.js, React, TypeScript, Laravel, and Docker. Based in Dhaka, Bangladesh — currently at ARITS Limited, delivering projects like HumR, Oporajita, Bullwip, Datafast, and calternatives.org.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s | ${profile.name}`,
  },
  description,
  applicationName: title,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",
  // Deliberately short. Search engines ignore this tag, and a 35-term list
  // reads as stuffing to quality classifiers.
  keywords: [
    "Shafin Ahmed",
    "Full-Stack Software Engineer",
    "Next.js developer",
    "React developer",
    "TypeScript developer",
    "Laravel developer",
    "software engineer Dhaka",
    "web developer Bangladesh",
    "ARITS Limited",
    "hire full-stack developer",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    firstName: "Shafin",
    lastName: "Ahmed",
    username: "Shafin580",
    title,
    description,
    siteName: title,
    url: SITE_URL,
    locale: "en_US",
    countryName: profile.countryName,
    emails: profile.email,
    // Image comes from app/opengraph-image.tsx via the file convention.
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    // Image comes from app/twitter-image.tsx via the file convention.
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Lets answer engines quote at length and show the OG card — the whole
      // point of the AEO work.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1c" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
