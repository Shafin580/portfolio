/**
 * Shared palette, type stacks and HTML primitives for the two contact emails —
 * `contact-request.ts` (to Shafin) and `contact-confirmation.ts` (to the visitor). They
 * are deliberately one system: same band, same rows, same button, so both inboxes show
 * the same hand.
 *
 * **Why plain template strings and not React Email.** The `resend` SDK plus
 * `@react-email/components` measured **1,791,420 bytes gzipped** inside the compiled
 * Cloudflare Worker — more than half of the free plan's entire 3 MiB script budget, to
 * render two emails whose markup never changes shape. Hand-written HTML plus a `fetch`
 * to Resend's REST API does the same job for nothing. See `app/api/contact/route.ts`.
 *
 * **The tradeoff, and the rule that follows from it.** React Email escaped interpolated
 * values for us; template strings do not. **Every value that comes from the request must
 * go through `esc()`** — all of it is untrusted input from a public form. There is no
 * exception for a field the schema validated: `zod` checks shape, not markup.
 *
 * **Why this markup looks dated.** Outlook for Windows renders through Word, which has no
 * flexbox, no grid, ignores `padding` on `<table>` and on inline elements, and ignores
 * `max-width`. Everything here is nested tables with padding on `<td>`, an MSO ghost table
 * for the fixed width, and VML for the buttons. That is the price of the one client that
 * cannot be talked out of its own layout engine.
 */

/**
 * Hex equivalents of the oklch design tokens in `app/globals.css`.
 *
 * Mail clients support neither oklch nor CSS variables, so the values are resolved here
 * once rather than per template. Every value below is the exact sRGB conversion of the
 * corresponding token — verified, not eyeballed — and every foreground/background pair
 * clears 4.5:1. Keep them in step with `globals.css` by hand; nothing enforces it.
 */
export const COLORS = {
  /** `--muted` — the ground behind the card. */
  page: "#F3F4F6",
  /** `--card` / `--background`. */
  white: "#FFFFFF",
  /** `--foreground`. 20.1:1 on white. */
  ink: "#030712",
  /** Body copy one step down from `--foreground`. */
  inkMuted: "#374151",
  /** `--primary`. 5.2:1 on white. */
  primary: "#2563EB",
  /** `--border`. */
  border: "#E5E7EB",
  /** `--muted-foreground`. 4.8:1 on white — at the AA floor, not under it. */
  label: "#6B7280",

  /** The `.dark` scale from `globals.css`, same conversion. */
  dark: {
    /** `.dark --background`. */
    page: "#030712",
    /** `.dark --card`. 18.9:1 against `.dark --foreground`. */
    card: "#040A1A",
    /** `.dark --muted` / `--border`. */
    fill: "#1F2937",
    /** `.dark --foreground`. */
    ink: "#F9FAFB",
    /** One step down from `--foreground`, for body copy. */
    inkMuted: "#D1D5DB",
    /** `.dark --muted-foreground`. 7.8:1 on the dark card. */
    label: "#9CA3AF",
    /** Lighter than `.dark --primary` on purpose — links sit on the dark card. */
    link: "#93C5FD",
  },
} as const;

/** Inter with fallbacks, mirroring `app/layout.tsx`. Most clients strip webfonts, so the
 *  fallback is what actually renders in Gmail and Outlook — the stack names real ones. */
export const FONT_BODY =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

/** Word has no webfonts at all. VML text is styled separately and gets this. */
const FONT_MSO = "Arial, Helvetica, sans-serif";

/**
 * HTML-escape an untrusted value.
 *
 * Covers the five characters that can break out of either an element body or a quoted
 * attribute. Never interpolate a request value into an email without this.
 */
export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Collapse anything that would break an email header onto one line.
 *
 * The schema already rejects CR/LF in `name`, so this is defence in depth for the subject
 * line — the layer that keeps holding if a field is added without that guard, or if the
 * transport stops being Resend's JSON API.
 */
export function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/**
 * Turn the newlines in an already-escaped value into `<br>`.
 *
 * **Must be applied after `esc()`, never before** — running it first would leave the `<`
 * of the `<br>` to be escaped into visible text.
 *
 * This exists because `white-space: pre-wrap` is not honoured by Word, so a
 * multi-paragraph enquiry arrived in Outlook as one unbroken block. Runs of three or more
 * newlines collapse to two so a visitor cannot stretch the card with blank lines.
 */
export function nl2br(escaped: string): string {
  return escaped
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n/g, "<br>");
}

/**
 * Percent-encode a value for use inside a `mailto:` URL.
 *
 * `encodeURIComponent` alone leaves `'` and `!` intact, which some clients mishandle, and
 * the result still has to be `esc()`d because it lands in an `href` attribute.
 */
export function mailtoParam(value: string): string {
  return esc(encodeURIComponent(value));
}

/**
 * Dark-mode overrides, declared once and emitted under three different selectors.
 *
 * `prefers-color-scheme` covers Apple Mail and Outlook 2019+ on macOS. Outlook.com does
 * not support it at all — it rewrites the message, stamping `data-ogsc` on elements whose
 * text colour it changed and `data-ogsb` on those whose background it changed, and expects
 * you to have written selectors for them. Hand-maintaining three copies of the same
 * declarations is how they drift, so they are generated.
 */
const DARK_RULES: ReadonlyArray<readonly [string, string]> = [
  ["page", `background-color:${COLORS.dark.page} !important;`],
  [
    "card",
    `background-color:${COLORS.dark.card} !important; border-color:${COLORS.dark.fill} !important;`,
  ],
  [
    "fill",
    `background-color:${COLORS.dark.fill} !important; border-color:${COLORS.dark.fill} !important;`,
  ],
  ["heading", `color:${COLORS.dark.ink} !important;`],
  ["body-text", `color:${COLORS.dark.inkMuted} !important;`],
  ["value", `color:${COLORS.dark.ink} !important;`],
  ["label", `color:${COLORS.dark.label} !important;`],
  ["meta", `color:${COLORS.dark.label} !important;`],
  ["hair", `border-color:${COLORS.dark.fill} !important;`],
  ["link", `color:${COLORS.dark.link} !important;`],
  ["btn", `background-color:${COLORS.dark.ink} !important; color:${COLORS.dark.page} !important;`],
];

function darkDeclarations(prefix = ""): string {
  return DARK_RULES.map(([cls, decl]) => `${prefix}.${cls} { ${decl} }`).join("\n    ");
}

/**
 * Client resets, the responsive rules, and the dark-mode block — the CSS that cannot be
 * inlined because it is either a media query or an attribute selector.
 *
 * Everything here uses `!important`, because it has to beat the inline styles that carry
 * the same properties for the clients that strip `<style>` entirely.
 */
const EMAIL_CSS = `
  :root { color-scheme: light dark; supported-color-schemes: light dark; }

  html, body { margin:0 !important; padding:0 !important; width:100% !important; }
  body { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  td { mso-line-height-rule: exactly; }
  img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }

  /* An email address or a long URL is one unbreakable token and will not wrap on its
     own, which is what pushes content past the card edge. */
  .breakable { word-break: break-word; overflow-wrap: anywhere; }
  .btn { max-width: 100%; box-sizing: border-box; }

  /* iOS Mail turns addresses, dates and phone numbers into links and colours them its own
     blue — unreadable on the dark band. The two id selectors are the Gmail-iOS and
     Outlook.com-iOS equivalents of the same behaviour. */
  a[x-apple-data-detectors] {
    color: inherit !important; text-decoration: none !important;
    font-size: inherit !important; font-family: inherit !important;
    font-weight: inherit !important; line-height: inherit !important;
  }
  u + #body a, #MessageViewBody a {
    color: inherit; text-decoration: none; font-size: inherit;
  }

  @media only screen and (max-width: 600px) {
    .sm-gutter { padding-left: 12px !important; padding-right: 12px !important; }
    .sm-px { padding-left: 20px !important; padding-right: 20px !important; }
    .sm-py { padding-top: 28px !important; padding-bottom: 28px !important; }
    .sm-h1 { font-size: 26px !important; line-height: 32px !important; }
    .sm-value { font-size: 16px !important; line-height: 26px !important; }
    .sm-body { font-size: 16px !important; line-height: 27px !important; }
    .sm-btn {
      display: block !important;
      width: 100% !important;
      box-sizing: border-box !important;
      text-align: center !important;
      padding: 15px 20px !important;
    }
  }

  /* Small Android phones and the iPhone SE sit below 400px, where 32px of card padding
     leaves under 240px of measure. */
  @media only screen and (max-width: 400px) {
    .sm-gutter { padding-left: 8px !important; padding-right: 8px !important; }
    .sm-px { padding-left: 16px !important; padding-right: 16px !important; }
    .sm-py { padding-top: 24px !important; padding-bottom: 24px !important; }
    .sm-h1 { font-size: 22px !important; line-height: 28px !important; }
  }

  @media (prefers-color-scheme: dark) {
    ${darkDeclarations()}
  }
  ${darkDeclarations("[data-ogsc] ")}
  ${darkDeclarations("[data-ogsb] ")}
`;

/** One hidden div. Used for both halves of the preheader. */
function hidden(content: string): string {
  return `<div aria-hidden="true" style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${content}</div>`;
}

/**
 * The inbox preview line, plus the spacer that stops the card copy following it.
 *
 * Clients show the first readable text after the subject. Without the run of zero-width
 * characters below, that is whatever the card happens to start with, so the preview reads
 * "Project type Web Application Company…" instead of the sentence written for it.
 */
function preheader(preview: string): string {
  const spacer = "&#847;&zwnj;&nbsp;&#8199;&#65279;".repeat(30);
  return hidden(esc(preview)) + hidden(spacer);
}

/**
 * The document shell both emails share.
 *
 * Four things in the head are load-bearing:
 *
 * - **The viewport meta.** Without it a mobile client lays the message out at its ~980px
 *   desktop default and scales the result down, so the text arrives small — and the
 *   `@media (max-width: 600px)` block can never match, because the viewport never reports
 *   a width below 600.
 * - **`x-apple-disable-message-reformatting`.** Stops iOS Mail applying its own scaling
 *   on top of ours.
 * - **The `[if mso]` block.** `PixelsPerInch` 96 stops Outlook multiplying every fixed
 *   pixel by 1.25 at 125% Windows display scaling, and the `font-family` override gives
 *   Word Arial deliberately instead of the Times New Roman it otherwise falls back to.
 * - **The `[if !mso]` guard on the webfont link.** That fallback to Times is triggered by
 *   the presence of the Google Fonts stylesheet itself, so Outlook must not see it.
 *
 * `preview` is escaped here regardless of what the caller passed.
 */
export function emailDocument({
  title,
  preview,
  body,
}: {
  title: string;
  preview: string;
  body: string;
}): string {
  return `<!doctype html>
<html lang="en" dir="ltr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
<title>${esc(title)}</title>
<!--[if mso]>
<xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
<style>* { font-family: ${FONT_MSO} !important; }</style>
<![endif]-->
<!--[if !mso]><!-->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
<!--<![endif]-->
<style>${EMAIL_CSS}</style>
</head>
<body id="body" class="page" style="margin:0;padding:0;width:100%;background-color:${COLORS.page};font-family:${FONT_BODY};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<div role="article" aria-roledescription="email" aria-label="${esc(title)}" lang="en">
${preheader(preview)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.page};">
<tr><td align="center" class="sm-gutter page" style="padding:32px 12px;">
<!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;">
${body}
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</div>
</body>
</html>`;
}

/**
 * A button that survives Word.
 *
 * Outlook ignores `padding` on an `<a>`, so the styled-anchor version renders there as a
 * bare text link with no shape at all. The VML `roundrect` is the only construct Word
 * draws as a real button, and the two branches are mutually exclusive by conditional
 * comment so no client ever sees both.
 *
 * Two constraints come from VML rather than from taste:
 *
 * - **Its width is a fixed pixel value and its text cannot wrap**, so the width is derived
 *   from the label length rather than set per call site. Callers keep labels short.
 * - **`text-transform` does nothing inside VML**, so the label is uppercased in TypeScript
 *   and the `<a>` branch does not set `text-transform` — otherwise the two branches would
 *   disagree about what the button says.
 *
 * `href` must already be escaped. `label` is **raw text** and is escaped here, after it is
 * uppercased — the other order would turn an escaped `&amp;` into the invalid `&AMP;`.
 */
export function button(
  href: string,
  label: string,
  opts: { bg?: string; fg?: string } = {},
): string {
  const bg = opts.bg ?? COLORS.ink;
  const fg = opts.fg ?? "#FFFFFF";
  const raw = label.toUpperCase();
  const text = esc(raw);
  const width = Math.min(520, 40 + raw.length * 9);

  return `<tr><td style="padding-top:24px;">
    <!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:48px;v-text-anchor:middle;width:${width}px;" arcsize="17%" stroke="f" fillcolor="${bg}">
      <w:anchorlock/>
      <center style="color:${fg};font-family:${FONT_MSO};font-size:13px;font-weight:600;letter-spacing:1.5px;">${text}</center>
    </v:roundrect>
    <![endif]-->
    <!--[if !mso]><!-->
    <a class="btn sm-btn" href="${href}" style="display:inline-block;background-color:${bg};color:${fg};font-family:${FONT_BODY};font-size:13px;line-height:20px;font-weight:600;letter-spacing:0.12em;text-decoration:none;padding:14px 32px;border-radius:8px;">${text}</a>
    <!--<![endif]-->
  </td></tr>`;
}

/**
 * The dark header band.
 *
 * `eyebrow`, `heading` and `sub` must already be escaped. `sub` may contain safe markup —
 * the callers wrap an address in an explicit `<a>` there so iOS cannot restyle it into its
 * own blue, which on this background is unreadable. `action.label` is raw text, matching
 * `button()`; `action.href` must already be escaped.
 */
export function band({
  eyebrow,
  heading,
  sub,
  action,
}: {
  eyebrow: string;
  heading: string;
  sub: string;
  action?: { href: string; label: string };
}): string {
  const cta = action ? button(action.href, action.label, { bg: "#FFFFFF", fg: COLORS.ink }) : "";

  return `<tr><td style="background-color:${COLORS.ink};border-radius:12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td class="sm-px sm-py" style="padding:36px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="font-family:${FONT_BODY};font-size:13px;line-height:16px;letter-spacing:2px;text-transform:uppercase;color:${COLORS.dark.label};">${eyebrow}</td></tr>
        <tr><td class="sm-h1 breakable" style="padding-top:8px;"><h1 class="breakable" style="margin:0;padding:0;font-family:${FONT_BODY};font-size:30px;line-height:38px;font-weight:700;letter-spacing:-0.02em;color:#FFFFFF;">${heading}</h1></td></tr>
        <tr><td class="breakable" style="padding-top:6px;font-family:${FONT_BODY};font-size:15px;line-height:24px;color:${COLORS.dark.inkMuted};">${sub}</td></tr>
        ${cta}
      </table>
    </td></tr>
  </table>
</td></tr>`;
}

/**
 * The white body card.
 *
 * The padding sits on an inner `<td>` rather than on the table, because Word drops
 * `padding` declared on a `<table>` and the copy then runs edge to edge. The responsive
 * padding classes have to live on that same cell for the same reason.
 *
 * `inner` is raw rows and must already be escaped.
 */
export function card(inner: string): string {
  return `<tr><td style="padding-top:16px;">
  <table role="presentation" class="card" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.white};border:1px solid ${COLORS.border};border-radius:12px;">
    <tr><td class="sm-px sm-py" style="padding:32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${inner}
      </table>
    </td></tr>
  </table>
</td></tr>`;
}

/** One label/value pair. Returns "" for an empty optional value, so the row disappears
 *  rather than rendering blank. `label` and `value` must already be escaped. */
export function field(label: string, value: string | undefined, fallback = ""): string {
  const resolved = value && value !== "" ? value : fallback;
  if (!resolved) return "";
  return `<tr><td style="padding-bottom:16px;">
    <div class="label" style="font-family:${FONT_BODY};font-size:13px;line-height:18px;letter-spacing:1.1px;text-transform:uppercase;color:${COLORS.label};">${label}</div>
    <div class="value sm-value breakable" style="margin-top:3px;font-family:${FONT_BODY};font-size:16px;line-height:26px;color:${COLORS.ink};">${resolved}</div>
  </td></tr>`;
}

/** A filled panel for a long block of copy. `content` must already be escaped, and if it
 *  can contain newlines it must also have been through `nl2br()`. */
export function panel(label: string, content: string): string {
  return `<tr><td>
    <div class="label" style="font-family:${FONT_BODY};font-size:13px;line-height:18px;letter-spacing:1.1px;text-transform:uppercase;color:${COLORS.label};">${label}</div>
    <div class="fill value sm-value breakable" style="margin-top:8px;background-color:${COLORS.page};border:1px solid ${COLORS.border};border-radius:8px;padding:16px 18px;font-family:${FONT_BODY};font-size:16px;line-height:26px;color:${COLORS.ink};">${content}</div>
  </td></tr>`;
}

/** Hairline in `--border`. Decorative. */
export function hairline(): string {
  return `<tr><td aria-hidden="true" style="padding:24px 0;"><div class="hair" style="border-top:1px solid ${COLORS.border};font-size:0;line-height:0;">&nbsp;</div></td></tr>`;
}

/** The short accent bar the site uses to close a section. Decorative. */
export function accentRule(): string {
  return `<tr><td aria-hidden="true" style="padding-top:28px;"><div style="width:48px;height:2px;background-color:${COLORS.primary};font-size:0;line-height:2px;">&nbsp;</div></td></tr>`;
}

/** Small trailing note. `content` must already be escaped (it may contain safe markup). */
export function meta(content: string): string {
  return `<tr><td class="meta breakable" style="padding-top:16px;font-family:${FONT_BODY};font-size:13px;line-height:20px;color:${COLORS.label};">${content}</td></tr>`;
}

/** Body paragraph on the light card. `content` must already be escaped. */
export function paragraph(content: string): string {
  return `<tr><td class="body-text sm-body" style="font-family:${FONT_BODY};font-size:16px;line-height:27px;color:${COLORS.inkMuted};">${content}</td></tr>`;
}
