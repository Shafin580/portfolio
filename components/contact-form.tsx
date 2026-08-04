"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  company: z.string().optional(),
  projectType: z.string().min(1, "Please select a project type"),
  description: z
    .string()
    .min(20, "Please describe your project in at least 20 characters"),
});

type FormValues = z.infer<typeof schema>;

const PROJECT_TYPES = [
  { value: "web-app", label: "Web Application" },
  { value: "ecommerce", label: "E-commerce Platform" },
  { value: "landing-page", label: "Landing Page / Marketing Site" },
  { value: "dashboard", label: "Admin Dashboard" },
  { value: "api-backend", label: "Backend API / Microservice" },
  { value: "fullstack", label: "Full-Stack Product" },
  { value: "other", label: "Other" },
];

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      projectType: "",
      description: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_URL;

      if (!endpoint) {
        // Fallback: open email client with pre-filled content
        const subject = encodeURIComponent(
          `Project Inquiry: ${PROJECT_TYPES.find((t) => t.value === values.projectType)?.label ?? values.projectType}`
        );
        const body = encodeURIComponent(
          `Hi Shafin,\n\nName: ${values.name}\nEmail: ${values.email}${values.company ? `\nCompany: ${values.company}` : ""}\nProject Type: ${values.projectType}\n\n${values.description}`
        );
        window.open(`mailto:shafinwork580@gmail.com?subject=${subject}&body=${body}`);
        toast.success("Opening your email client…", {
          description: "A pre-filled email has been prepared for you.",
        });
        form.reset();
        return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("Message sent!", {
          description:
            "Thanks for reaching out. I'll get back to you within 24 hours.",
        });
        form.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      toast.error("Something went wrong", {
        description:
          "Please try again or email me directly at shafinwork580@gmail.com",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Type *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROJECT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell me about your project — goals, timeline, tech preferences, and any specific requirements…"
                  className="min-h-36 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
