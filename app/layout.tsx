import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ROBOTS_TXT from "./robots";

const inter = Inter({ subsets: ["latin"] });

const description =
  "Discover Shafin Ahmed's portfolio as a Software Engineer and Full-Stack Developer with 3+ years of experience in creating scalable, efficient web applications using Next.js, React, TypeScript, and MongoDB. Shafin showcases expertise through projects like Better Bangladesh, ARITS Limited, SheRAA, and more. Skilled in frontend, backend, and cloud architecture, including Docker, GraphQL, and AWS, Shafin builds innovative solutions for modern digital needs.";

export const metadata: Metadata = {
  title: "Shafin Ahmed - Software Engineer - Portfolio",
  description: description,
  authors: {
    name: "Shafin Ahmed - Software Engineer - Portfolio",
    url: "https://shafinwebology.com/",
  },
  category: "website",
  keywords: [
    "Shafin Ahmed portfolio",
    "Software Engineer",
    "Full-Stack Developer",
    "Next.js development",
    "React Developer",
    "TypeScript projects",
    "MongoDB database",
    "Better Bangladesh project",
    "ARITS Limited",
    "SheRAA website",
    "cloud architecture",
    "Docker expertise",
    "GraphQL API",
    "web development",
    "AWS solutions",
    "backend development",
    "frontend technologies",
    "JavaScript developer",
    "Python programming",
    "Laravel backend",
    "Nest.js framework",
    "AWS cloud",
    "software engineering projects",
  ],
  metadataBase: new URL("https://shafinwebology.com/"),
  openGraph: {
    countryName: "Bangladesh",
    description: description,
    locale: "en_US",
    siteName: "Shafin Ahmed - Software Engineer - Portfolio",
    title: "Shafin Ahmed - Software Engineer - Portfolio",
    type: "website",
    url: "https://shafinwebology.com/",
    emails: "contact@aritsltd.com",
    images: {
      url: `https://shafinwebology.com/img/seo-image.png`,
      alt: `Shafin Ahmed - Software Engineer - Portfolio`,
      width: 1280,
      height: 720,
    },
  },
  robots: "index, follow",
  twitter: {
    card: "summary_large_image",
    description: description,
    title: "Shafin Ahmed - Software Engineer - Portfolio",
    images: {
      url: `https://shafinwebology.com/img/seo-image.png`,
      alt: "Shafin Ahmed - Software Engineer - Portfolio",
      width: 1280,
      height: 720,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
