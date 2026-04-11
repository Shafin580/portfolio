import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const description =
  "Shafin Ahmed is a Full-Stack Software Engineer with 4+ years of experience building scalable web applications using Next.js, React, TypeScript, Laravel, and Docker. Based in Dhaka, Bangladesh — currently at ARITS Limited, delivering projects like HRMS, Bullwip, Datafast, Better Bangladesh, and calternatives.org. Expert in frontend, backend, microservices, cloud architecture, and technical SEO.";

export const metadata: Metadata = {
  title: "Shafin Ahmed — Full-Stack Software Engineer",
  description,
  authors: {
    name: "Shafin Ahmed",
    url: "https://shafinwebology.com/",
  },
  category: "website",
  keywords: [
    "Shafin Ahmed",
    "Shafin Ahmed portfolio",
    "Software Engineer",
    "Full-Stack Developer",
    "Full-Stack Developer Bangladesh",
    "Software Engineer Dhaka",
    "Next.js developer",
    "React developer",
    "TypeScript developer",
    "Laravel developer",
    "Node.js developer",
    "NestJS developer",
    "HRMS developer",
    "Bullwip platform",
    "Datafast",
    "calternatives.org",
    "Better Bangladesh project",
    "ARITS Limited",
    "SheRAA website",
    "Docker expert",
    "Turborepo",
    "Zustand",
    "Redux developer",
    "TanStack Query",
    "Electron developer",
    "Puppeteer automation",
    "Headless WordPress",
    "GraphQL API",
    "PostgreSQL",
    "MongoDB",
    "Elasticsearch",
    "AWS cloud",
    "web development Bangladesh",
    "software engineering projects",
  ],
  metadataBase: new URL("https://shafinwebology.com/"),
  openGraph: {
    countryName: "Bangladesh",
    description,
    locale: "en_US",
    siteName: "Shafin Ahmed — Full-Stack Software Engineer",
    title: "Shafin Ahmed — Full-Stack Software Engineer",
    type: "website",
    url: "https://shafinwebology.com/",
    emails: "shafinwork580@gmail.com",
    images: {
      url: "https://shafinwebology.com/img/seo-image.png",
      alt: "Shafin Ahmed — Full-Stack Software Engineer Portfolio",
      width: 1280,
      height: 720,
    },
  },
  robots: "index, follow",
  twitter: {
    card: "summary_large_image",
    description,
    title: "Shafin Ahmed — Full-Stack Software Engineer",
    images: {
      url: "https://shafinwebology.com/img/seo-image.png",
      alt: "Shafin Ahmed — Full-Stack Software Engineer Portfolio",
      width: 1280,
      height: 720,
    },
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shafin Ahmed",
  jobTitle: "Software Engineer",
  url: "https://shafinwebology.com",
  email: "shafinwork580@gmail.com",
  sameAs: [
    "https://github.com/Shafin580",
    "https://www.linkedin.com/in/shafin580/",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  worksFor: {
    "@type": "Organization",
    name: "ARITS Limited",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "American International University-Bangladesh",
  },
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
        </ThemeProvider>
        <Script
          id="person-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
