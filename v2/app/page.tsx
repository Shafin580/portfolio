import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  ExternalLink,
  MapPin,
  Building,
  Download,
} from "lucide-react";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import Link from "next/link";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section id="about" className="relative py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Shafin-Ahmed-FWyvOShiYGHuAbiSDsMnQ2gidnPzfa.jpeg"
              alt="Shafin Ahmed"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-6 border-4 border-primary/20"
            />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              Hi, I'm <span className="text-primary">Shafin Ahmed</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              A versatile full-stack software engineer with more than 3 years of
              experience building sophisticated, responsive applications
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link
                href="/files/Shafin_Ahmed_Resume.pdf"
                target="_blank"
                download
              >
                <Button size="lg" className="gap-2 cursor-pointer">
                  Resume
                  <Download className="size-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              +8801711382280
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              shafinwork580@gmail.com
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Dhaka, Bangladesh
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-balance">
            Work Experience
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            My professional journey as a software engineer across different
            companies and roles.
          </p>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 md:-ml-0.5 top-0 bottom-0 w-0.5 bg-primary"></div>

            <div className="space-y-12">
              {/* Current Role */}
              <div className="relative flex items-center">
                <div className="absolute left-2 md:left-1/2 md:-ml-2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                <div className="ml-12 md:ml-0 md:w-1/2 md:pr-8">
                  <div className="text-sm text-muted-foreground mb-2">
                    Dec 2024 – Present
                  </div>
                </div>
                <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Software Engineer
                      </CardTitle>
                      <CardDescription className="text-primary font-medium flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        ARITS Limited • Baridhara DOHS, Dhaka
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                          • Spearheaded development of sophisticated, responsive
                          user interfaces with real-time data synchronization,
                          global state management, and multi-factor
                          authentication
                        </li>
                        <li>
                          • Implemented Tanstack Query for seamless database
                          interactions, leading to improved data consistency and
                          query performance
                        </li>
                        <li>
                          • Integrated Stripe payment gateway and notification
                          services across multiple projects
                        </li>
                        <li>
                          • Streamlined deployment workflows with Docker,
                          achieving 50% reduction in deployment time
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Previous Role */}
              <div className="relative flex items-center">
                <div className="absolute left-2 md:left-1/2 md:-ml-2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                <div className="ml-12 md:ml-0 md:w-1/2 md:pr-8 md:text-right">
                  <div className="text-sm text-muted-foreground mb-2">
                    Sept 2022 – June 2024
                  </div>
                </div>
                <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Junior Software Engineer
                      </CardTitle>
                      <CardDescription className="text-primary font-medium flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        ARITS Limited • Baridhara DOHS, Dhaka
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                          • Designed over a dozen complex and responsive UIs,
                          implementing advanced features like global state
                          management and authentication systems
                        </li>
                        <li>
                          • Built multiple Frontend reusable components using
                          Next.js, applied cryptography for data security
                        </li>
                        <li>
                          • Containerized applications with Docker, enhancing
                          full-stack development capabilities for over 40% of
                          deployments
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Internship */}
              <div className="relative flex items-center">
                <div className="absolute left-2 md:left-1/2 md:-ml-2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                <div className="ml-12 md:ml-0 md:w-1/2 md:pr-8">
                  <div className="text-sm text-muted-foreground mb-2">
                    June 2022 - Sept 2022
                  </div>
                </div>
                <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Internship Trainee
                      </CardTitle>
                      <CardDescription className="text-primary font-medium flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        ARITS Limited • Baridhara DOHS, Dhaka
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                          • Developed web applications with Next.js, emphasizing
                          server-side rendering and crafting engaging user
                          interfaces
                        </li>
                        <li>
                          • Gained hands-on experience in building and
                          integrating RESTful API endpoints while managing data
                          fetching and state
                        </li>
                        <li>
                          • Developed backend services and REST APIs using
                          Laravel, integrating Elasticsearch for optimized data
                          querying
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-balance">
            Skills & Expertise
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            A comprehensive set of technical skills and technologies I've worked
            with throughout my career.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {/* Programming Languages */}
            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <span className="text-sm font-medium text-center">
                TypeScript
              </span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-black font-bold text-sm">JS</span>
              </div>
              <span className="text-sm font-medium text-center">
                JavaScript
              </span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">PHP</span>
              </div>
              <span className="text-sm font-medium text-center">PHP</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">PY</span>
              </div>
              <span className="text-sm font-medium text-center">Python</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="text-sm font-medium text-center">Java</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-800 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">C++</span>
              </div>
              <span className="text-sm font-medium text-center">C++</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">H5</span>
              </div>
              <span className="text-sm font-medium text-center">HTML</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">CSS</span>
              </div>
              <span className="text-sm font-medium text-center">CSS</span>
            </div>

            {/* Frontend Technologies */}
            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">▲</span>
              </div>
              <span className="text-sm font-medium text-center">Next.js</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-black font-bold text-sm">⚛</span>
              </div>
              <span className="text-sm font-medium text-center">React</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">TW</span>
              </div>
              <span className="text-sm font-medium text-center">
                TailwindCSS
              </span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">◊</span>
              </div>
              <span className="text-sm font-medium text-center">GraphQL</span>
            </div>

            {/* Backend Technologies */}
            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-sm font-medium text-center">Node.js</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-sm font-medium text-center">Laravel</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-700 to-green-800 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">DJ</span>
              </div>
              <span className="text-sm font-medium text-center">Django</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-sm font-medium text-center">NestJS</span>
            </div>

            {/* Databases */}
            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-800 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">🐬</span>
              </div>
              <span className="text-sm font-medium text-center">MySQL</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">🐘</span>
              </div>
              <span className="text-sm font-medium text-center">
                PostgreSQL
              </span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">🍃</span>
              </div>
              <span className="text-sm font-medium text-center">MongoDB</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">ES</span>
              </div>
              <span className="text-sm font-medium text-center">
                Elasticsearch
              </span>
            </div>

            {/* Tools & Technologies */}
            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">🐳</span>
              </div>
              <span className="text-sm font-medium text-center">Docker</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">⎇</span>
              </div>
              <span className="text-sm font-medium text-center">Git</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">TQ</span>
              </div>
              <span className="text-sm font-medium text-center">
                TanStack Query
              </span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">🐻</span>
              </div>
              <span className="text-sm font-medium text-center">Zustand</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-sm font-medium text-center">WordPress</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">🎭</span>
              </div>
              <span className="text-sm font-medium text-center">Puppeteer</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">⚡</span>
              </div>
              <span className="text-sm font-medium text-center">Turborepo</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">📊</span>
              </div>
              <span className="text-sm font-medium text-center">JIRA</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">⚡</span>
              </div>
              <span className="text-sm font-medium text-center">Redux</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-balance">
            Featured Projects
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* HRMS Project */}
            <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-2">HRMS</div>
                  <div className="text-sm opacity-90">
                    Human Resource Management System
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  HRMS System
                </CardTitle>
                <CardDescription>
                  Next.js 15 • TypeScript • TurboRepo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Architected and developed a comprehensive HRMS web application
                  with SSO, dynamic form builders, and encrypted cookie sharing
                  across subdomains.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Next.js 15</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">TanStack Query</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Datafast Project */}
            <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-2">Datafast</div>
                  <div className="text-sm opacity-90">
                    Data Automation Platform
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  Datafast
                </CardTitle>
                <CardDescription>
                  Full-stack • Laravel • Electron
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Full-stack application with web automation using Puppeteer,
                  wrapped with Electron for desktop deployment and enhanced data
                  normalization.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Laravel</Badge>
                  <Badge variant="outline">Electron</Badge>
                  <Badge variant="outline">Puppeteer</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Calternatives Project */}
            <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-2">Calternatives</div>
                  <div className="text-sm opacity-90">
                    Alternative Software Directory
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  Calternatives.org
                </CardTitle>
                <CardDescription>Headless WordPress • GraphQL</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Headless WordPress integration with GraphQL and ACF, achieving
                  70% increase in development speed and 65% improvement in SEO
                  performance.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">WordPress</Badge>
                  <Badge variant="outline">GraphQL</Badge>
                  <Badge variant="outline">SEO</Badge>
                </div>
              </CardContent>
            </Card>

            {/* ARITS Ltd Project */}
            <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-2">ARITS Ltd</div>
                  <div className="text-sm opacity-90">Corporate Website</div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  aritsltd.com
                </CardTitle>
                <CardDescription>Headless WordPress • GraphQL</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Corporate website with headless WordPress integration,
                  achieving 40% increase in development speed and 45%
                  improvement in SEO performance.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">WordPress</Badge>
                  <Badge variant="outline">GraphQL</Badge>
                  <Badge variant="outline">SSG</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Sheraa Network Project */}
            <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-2">Sheraa</div>
                  <div className="text-sm opacity-90">
                    Entrepreneurship Platform
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  sheraa.network
                </CardTitle>
                <CardDescription>Headless WordPress • GraphQL</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Entrepreneurship platform with headless WordPress integration
                  and advanced SEO optimization for enhanced performance.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">WordPress</Badge>
                  <Badge variant="outline">GraphQL</Badge>
                  <Badge variant="outline">SSR</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Merlin App Project */}
            <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-2">Merlin</div>
                  <div className="text-sm opacity-90">Business Application</div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  merlinapp.co.uk
                </CardTitle>
                <CardDescription>Next.js 13 • Microservices</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Frontend application with dynamic form builder, data
                  normalization, and microservice architecture integration.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Next.js 13</Badge>
                  <Badge variant="outline">Microservices</Badge>
                  <Badge variant="outline">TanStack Query</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Education & Contact */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">
                      Bachelor of Science - Computer Science and Engineering
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      American International University-Bangladesh
                    </p>
                    <p className="text-sm text-muted-foreground">
                      GPA: 3.58/4.0 • Jan 2018 – April 2022
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Thesis: Machine Learning - Train AI to detect sentiment in
                      a sentence
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Responsive Web Development
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      CodersTrust • Mar 2020
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Let's Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    className="w-full justify-start gap-3 bg-transparent"
                    variant="outline"
                  >
                    <Mail className="w-4 h-4" />
                    shafinwork580@gmail.com
                  </Button>
                  <Button
                    className="w-full justify-start gap-3 bg-transparent"
                    variant="outline"
                  >
                    <Phone className="w-4 h-4" />
                    +8801711382280
                  </Button>
                  <Button
                    className="w-full justify-start gap-3 bg-transparent"
                    variant="outline"
                  >
                    <Github className="w-4 h-4" />
                    github.com/shafin580
                  </Button>
                  <Button
                    className="w-full justify-start gap-3 bg-transparent"
                    variant="outline"
                  >
                    <Linkedin className="w-4 h-4" />
                    linkedin.com/in/Shafin580
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-card/50 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Shafin Ahmed. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
