import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Download, ExternalLink, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    title: "Better Bangladesh",
    description:
      "Better Bangladesh is a project for voicing the concerns and connect with people from all backgrounds and engage in thought provoking discussions to find solutions to the core problems of society.",
    image: "/img/better-bangladesh.png",
    stacks: [
      "Next.js",
      "TypeScript",
      "MongoDB",
      "Tanstack Query",
      "Context API",
    ],
    live: "https://betterbangladesh.io/",
    repo: null,
  },
  {
    title: "Arits Limited",
    description:
      "Established in 2015, ARITS Limited is a leading provider of complete IT solutions including outsourcing bespoke software development, web development and design, mobile applications and beyond.",
    image: "/img/arits-image.png",
    stacks: [
      "Next.js",
      "Typescript",
      "Headless Wordpress",
      "GraphQL",
      "ACF",
      "Tanstack Query",
    ],
    live: "https://www.aritsltd.com/",
    repo: null,
  },
  {
    title: "SheRAA",
    description:
      "The Women's Climate Coalition in Bangladesh launched SheRAA website to initiate a collaboration, aimed at empowering women to play a leading role in climate action and sustainable development",
    image: "/img/sheraa.png",
    stacks: [
      "Next.js",
      "Typescript",
      "Headless Wordpress",
      "GraphQL",
      "ACF",
      "Tanstack Query",
    ],
    live: "https://sheraa.network/",
    repo: null,
  },
  {
    title: "Merlin",
    description:
      "Merlin offers a comprehensive MERL solution that is both user-friendly and intuitive. With Merlin, you can efficiently manage your interventions, enabling you to make timely and informed decisions.",
    image: "/img/merlin.png",
    stacks: [
      "Next.js",
      "Docker",
      "Cryptography",
      "Typescript",
      "Microservice",
      "Tanstack Query",
    ],
    live: "https://merlinapp.co.uk/",
    repo: null,
  },
  {
    title: "Weather App",
    description:
      "This project is a simple weather application which lets the user enter city name and shows the user the weather condition of the city.",
    image: "/img/weatherAppSS.png",
    stacks: ["React.js", "OpenWeatherMap"],
    live: "https://weatherappshafindev.netlify.app/",
    repo: "https://github.com/Shafin580/react-weather-app",
  },
  {
    title: "Keeper App",
    description:
      "This project is an application built with React.js with a feature for users to create notes or to-do list and also delete them.",
    image: "/img/keeperSS.png",
    stacks: ["React.js", "Javascript"],
    live: "https://keepershafindev.netlify.app/",
    repo: "https://github.com/Shafin580/react-keeper-app",
  },
  {
    title: "Fence Jumper",
    description:
      "This project is a simple game developed using javascript and p5.js.",
    image: "/img/fenceJumperSS.png",
    stacks: ["Javascript", "p5.js"],
    live: "https://shafin580.github.io/fenceJumper.github.io/",
    repo: "https://github.com/Shafin580/fenceJumper.github.io",
  },
];

const skills = {
  Languages: [
    "Javascript",
    "TypeScript",
    "C++",
    "C#",
    "PHP",
    "Python",
    "Java",
    "SQL",
  ],
  Frontend: ["React", "Next.js", "HTML5", "CSS", "Bootstrap", "Tailwindcss"],
  Backend: ["Node.js", "Django", "Laravel", "Nest.js"],
  Database: ["PostgreSQL", "MongoDB", "Elasticsearch", "MySql"],
  Cloud: ["AWS", "Docker"],
  Tools: ["Git", "JIRA", "CI/CD"],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/">
              <Image
                src="/img/logo.png"
                alt="Shafin Ahmed - Portfolio"
                width={90}
                height={90}
              />
            </Link>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon">
                  <Link href="https://github.com/Shafin580" target="_blank">
                    <Github className="h-5 w-5" />
                  </Link>
                </Button>
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon">
                  <Link
                    href="https://www.linkedin.com/in/shafin580/"
                    target="_blank"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                </Button>
              </a>
              <a
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                href="/files/Shafin Ahmed_CV.pdf"
                download={true}
              >
                <Download className="mr-2 h-4 w-4" /> Resume
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">Software Engineer</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Building elegant solutions to complex problems with modern
                technologies
              </p>
              <p className="text-muted-foreground">
                3+ years of experience in full-stack development, specializing
                in scalable web applications and cloud architecture.
              </p>
            </div>
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary group">
              <Image
                src="/img/Shafin-Ahmed.jpeg"
                alt="Shafin Ahmed - Software Engineer"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-lg font-semibold">
                  Shafin Ahmed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Skills & Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, items]) => (
              <Card key={category} className="p-6">
                <h3 className="font-semibold mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.title} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.stacks.map((stack) => (
                      <Badge key={stack} variant="outline">
                        {stack}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" /> Live
                        </Button>
                      </a>
                    )}
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          <Github className="mr-2 h-4 w-4" /> Code
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">
              © 2024 Shafin Ahmed. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:shafinwork580@gmail.com"
                className="text-muted-foreground hover:text-foreground"
              >
                shafinwork580@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
