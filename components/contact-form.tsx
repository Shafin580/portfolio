"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Turnstile } from "@marsidev/react-turnstile";
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
import {
  contactSchema,
  PROJECT_TYPES,
  projectTypeLabel,
  type ContactInput,
} from "@/lib/contact-schema";
import { profile } from "@/lib/portfolio-data";
import { trackEvent } from "@/lib/analytics";

/**
 * The client half of the contact pipeline. Its server half is
 * `app/api/contact/route.ts`, and both parse the same schema — see `lib/contact-schema.ts`
 * for why `company` is a real field and `website` is the honeypot.
 *
 * The form never assumes it is configured. If the API answers `503 not_configured` —
 * which it does until the Resend and Turnstile keys are set — the submission falls back
 * to a pre-filled `mailto:` rather than showing the visitor an error for a problem that
 * is not theirs.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  // Remounting the widget is how it gets reset. The imperative `.reset()` needs a ref,
  // and reading a ref inside the submit handler that `handleSubmit` receives during
  // render trips react-hooks/refs — a key bump does the same job with no ref at all.
  const [captchaKey, setCaptchaKey] = useState(0);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      projectType: undefined,
      description: "",
      website: "",
      turnstileToken: "",
    },
  });

  function openMailto(values: ContactInput, description: string) {
    const subject = encodeURIComponent(`Project Inquiry: ${projectTypeLabel(values.projectType)}`);
    const body = encodeURIComponent(
      `Hi ${profile.name.split(" ")[0]},\n\nName: ${values.name}\nEmail: ${values.email}${
        values.company ? `\nCompany: ${values.company}` : ""
      }\nProject Type: ${projectTypeLabel(values.projectType)}\n\n${values.description}`,
    );
    window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`);
    toast.success("Opening your email client…", { description });
    form.reset();
  }

  function resetCaptcha() {
    setToken("");
    setCaptchaKey((k) => k + 1);
  }

  async function onSubmit(values: ContactInput) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken: token }),
      });

      if (response.ok) {
        // Only the project type is reported. Name, email, company and the message
        // body are personal data and must never reach Google Analytics.
        trackEvent("generate_lead", { project_type: values.projectType });
        toast.success("Message sent!", {
          description: "Thanks for reaching out. I'll get back to you within 24 hours.",
        });
        form.reset();
        resetCaptcha();
        return;
      }

      const { error } = (await response.json().catch(() => ({}))) as { error?: string };

      // Not configured yet — this is a deployment state, not the visitor's problem.
      if (response.status === 503 || error === "not_configured") {
        trackEvent("contact_not_configured");
        openMailto(values, "A pre-filled email has been prepared for you.");
        return;
      }

      if (response.status === 429) {
        trackEvent("contact_rate_limited");
        toast.error("Too many messages", {
          description: `Please wait a few minutes, or email me directly at ${profile.email}`,
        });
        resetCaptcha();
        return;
      }

      if (error === "captcha_failed") {
        trackEvent("contact_captcha_failed");
        toast.error("Verification failed", {
          description: "Please complete the verification again and resubmit.",
        });
        resetCaptcha();
        return;
      }

      throw new Error(error ?? "submission_failed");
    } catch {
      // Also reached on a network failure, which never produced a response above.
      trackEvent("contact_failed");
      toast.error("Something went wrong", {
        description: `Please try again or email me directly at ${profile.email}`,
      });
      resetCaptcha();
    } finally {
      setIsLoading(false);
    }
  }

  // With a site key configured, a submission without a token cannot pass the server
  // check — so the button waits for one rather than letting the visitor fail.
  const awaitingCaptcha = Boolean(SITE_KEY) && !token;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    autoComplete="name"
                    enterKeyHint="next"
                    {...field}
                  />
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
                  <Input
                    type="email"
                    inputMode="email"
                    placeholder="john@example.com"
                    autoComplete="email"
                    enterKeyHint="next"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company <span className="text-muted-foreground font-normal">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Acme Inc."
                    autoComplete="organization"
                    enterKeyHint="next"
                    {...field}
                    value={field.value ?? ""}
                  />
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

        {/*
          Honeypot. Hidden from sight, from assistive tech, and from the tab order, so
          only an automated filler ever populates it. The server treats a filled value as
          a bot and answers 200 without sending anything.
        */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("website")}
          />
        </div>

        {SITE_KEY ? (
          /*
            Turnstile's "flexible" size still has a hard 300px minimum width, which is
            wider than this column gets on a 320px screen — measured, it scrolled the
            whole document sideways by 21px. Containing the overflow here keeps the widget
            fully interactive and untransformed while the page itself stays put.
          */
          <div className="max-w-full overflow-x-auto">
            <Turnstile
              key={captchaKey}
              siteKey={SITE_KEY}
              options={{ theme: "auto", size: "flexible" }}
              onSuccess={setToken}
              onExpire={() => setToken("")}
              onError={() => setToken("")}
            />
          </div>
        ) : null}

        {/*
          The button below disables itself until Turnstile hands over a token. Without a
          word of explanation that reads as a broken form, so say what is happening —
          politely, in a live region, so it is announced rather than only seen.
        */}
        <p aria-live="polite" className="text-muted-foreground min-h-5 text-xs">
          {awaitingCaptcha ? "Waiting for the security check to finish…" : ""}
        </p>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading || awaitingCaptcha}>
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
