import * as z from "zod";

/**
 * The one contract the contact form and `app/api/contact/route.ts` share.
 *
 * The route re-parses every submission against this schema rather than trusting the
 * client: the endpoint is public and can be POSTed directly, so client-side validation
 * counts for nothing there.
 */

/**
 * Project types offered in the form's select.
 *
 * Kept here rather than in the component so the API route and the email templates can
 * render the same human label the visitor picked, instead of echoing the raw slug.
 */
export const PROJECT_TYPES = [
  { value: "web-app", label: "Web Application" },
  { value: "ecommerce", label: "E-commerce Platform" },
  { value: "landing-page", label: "Landing Page / Marketing Site" },
  { value: "dashboard", label: "Admin Dashboard" },
  { value: "api-backend", label: "Backend API / Microservice" },
  { value: "fullstack", label: "Full-Stack Product" },
  { value: "other", label: "Other" },
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number]["value"];

const PROJECT_TYPE_VALUES = PROJECT_TYPES.map((t) => t.value) as [ProjectType, ...ProjectType[]];

export function projectTypeLabel(value: string): string {
  return PROJECT_TYPES.find((t) => t.value === value)?.label ?? value;
}

/**
 * Field notes:
 *
 * - `company` is a REAL, visible, optional field on this form. It is **not** the honeypot
 *   — reusing it as one would reject every legitimate submission that filled it in.
 * - `website` is the honeypot: rendered hidden and off the tab order, so only an
 *   automated filler ever populates it.
 * - `turnstileToken` is optional in the schema and enforced by the route. The form omits
 *   it entirely when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is unset, and the route answers
 *   `503 not_configured` in that case rather than failing a check the visitor cannot pass.
 */
/**
 * No CR or LF in any value that reaches an email header.
 *
 * `name` lands in the subject line of both sends. Delivery goes over Resend's JSON REST
 * API, which builds the headers itself, so a newline is not exploitable there today —
 * but header injection is exactly the class of bug that appears the moment someone swaps
 * the transport, and a real person's name never contains a line break.
 */
const NO_NEWLINES = /^[^\r\n]*$/;

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(120)
    .regex(NO_NEWLINES, "Name cannot contain line breaks"),
  email: z.email("Please enter a valid email address").max(200),
  company: z.string().max(160).regex(NO_NEWLINES, "Company cannot contain line breaks").optional(),
  projectType: z.enum(PROJECT_TYPE_VALUES, { error: "Please select a project type" }),
  description: z
    .string()
    .min(20, "Please describe your project in at least 20 characters")
    .max(5000),
  /** Honeypot. Anything here means a bot. */
  website: z.string().max(200).optional(),
  turnstileToken: z.string().max(4096).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
