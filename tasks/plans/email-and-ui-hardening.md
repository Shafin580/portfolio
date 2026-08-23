# Portfolio: Email Templates + Site-Wide UI/UX Hardening

## Context

Two related pieces of work, agreed with you up front:

**A. The contact emails.** The pipeline already sends two, and both templates already exist —
[emails/contact-request.ts](emails/contact-request.ts) is the **receiving** side (lands in
`CONTACT_TO_EMAIL`, with `reply_to` set to the visitor so Reply answers them directly,
[app/api/contact/route.ts:188](app/api/contact/route.ts#L188)) and
[emails/contact-confirmation.ts](emails/contact-confirmation.ts) is the **replying** side (the
visitor's auto-reply, sent last and best-effort,
[app/api/contact/route.ts:212-227](app/api/contact/route.ts#L212-L227)). They render correctly in
webmail and Apple Mail but have concrete defects in Outlook for Windows, Outlook.com dark mode, and
iOS Mail, they have a single 600px breakpoint with nothing for 320–400px screens, and there is no
way to actually look at the output — so "responsive in all viewports" is currently an untested
claim.

**B. The site UI.** Scope agreed: whole site, **fix-only** — no visual redesign, the existing look
is kept. Weighted toward the performance and jank concern you raised. Baseline comes from a real
Chrome DevTools pass, not from reading files.

The two share a constraint worth stating once: the compiled Cloudflare Worker has a **3,145,728 byte
gzipped ceiling** and currently sits at ~1,365,979. Nothing below adds a runtime dependency. The
email templates stay plain template strings (the `resend` SDK plus `@react-email/components`
measured 1,791,420 bytes gzipped for two POSTs), and anything computable once goes in `scripts/`
and is emitted to `public/`.

**Intended outcome:** both emails render correctly from 320px through desktop across Gmail, Apple
Mail, Outlook desktop 2016–2021, Outlook.com and Yahoo in light and dark, verifiable locally; and
the site clears measurable UI/UX floors — 44px touch targets, working reduced-motion, no
JS-dependent invisible content, no layout shift, and a materially lighter image payload.

---

# Step 0 — Knowledge graph

[.graphifyignore](.graphifyignore) already exists and is correct for this repo (`.open-next/`,
`.wrangler/` and `*.tsbuildinfo` are covered transitively through `.gitignore`, which graphify
respects). Add one line for the new preview output before building:

```
# Local email preview renders (scripts/preview-emails.ts).
.email-preview/
```

Then run `/graphify ./`, and query the graph before further Grep/Glob/Read.

---

# Step 1 — Chrome DevTools baseline

Runs first, before any edit, so every UI change below is measured rather than guessed. Requires
`pnpm dev`.

1. `pnpm dev`, then `navigate_page` to `http://localhost:3000`.
2. `performance_start_trace` with reload+autoStop, then `performance_analyze_insight` for LCP
   breakdown, CLS culprits, and render-blocking resources. Repeat on `/projects/humr`.
3. `lighthouse_audit` (performance + accessibility + best-practices + SEO) on `/` and on one case
   study. Record the numbers — they are the before/after evidence.
4. `emulate` / `resize_page` at **320, 375, 414, 768, 1024, 1440** and `take_screenshot` at each,
   on `/`, `/projects/humr`, and the contact section. Look for horizontal overflow, clipped text,
   and controls that collide.
5. `take_snapshot` on each page for the accessibility tree — landmark names, heading order,
   unlabelled controls.
6. `list_console_messages` and `list_network_requests` — hydration warnings, 404s, and the actual
   transfer size of every image.
7. Re-run `/` with JavaScript-driven reveal disabled and with `prefers-reduced-motion: reduce`
   emulated, to confirm the two defects in Part B below.

Everything found here gets folded into the Part B work list before implementing.

---

# Part A — Email templates

## A0. Defects found (each verified by opening the cited line)

| # | Defect | Where | Consequence |
|---|---|---|---|
| 1 | Buttons are styled `<a>` with `padding` | [shared.ts:171](emails/shared.ts#L171), [shared.ts:231](emails/shared.ts#L231) | Outlook desktop ignores padding on inline elements — the button renders as bare text |
| 2 | `padding:32px` set on a `<table>` | [shared.ts:188](emails/shared.ts#L188) | Word engine drops padding on `<table>`; card copy runs edge to edge |
| 3 | `.sm-px` targets that same `<table>` | [shared.ts:188](emails/shared.ts#L188) | The mobile padding override lands on an element that never honoured padding |
| 4 | Google Fonts `<link>` not hidden from Outlook | [shared.ts:141](emails/shared.ts#L141) | Outlook falls back to Times New Roman for the whole message |
| 5 | No `OfficeDocumentSettings` / `PixelsPerInch` | head | At 125% Windows scaling Outlook scales fixed px ~1.25× and the layout breaks |
| 6 | `white-space:pre-wrap` for the description | [shared.ts:201](emails/shared.ts#L201), [shared.ts:209](emails/shared.ts#L209) | Outlook collapses newlines — a multi-paragraph enquiry arrives as one block |
| 7 | Dark mode only via `prefers-color-scheme` | [shared.ts:107-119](emails/shared.ts#L107-L119) | Outlook.com dark (`[data-ogsc]`/`[data-ogsb]`) unhandled; it force-inverts |
| 8 | No `x-apple-data-detectors` / `format-detection` resets | head + CSS | iOS Mail auto-links the address in blue — unreadable on the dark band |
| 9 | Preheader has no spacer | [shared.ts:145](emails/shared.ts#L145) | Card copy bleeds into the inbox preview line |
| 10 | Confirmation preheader repeats the subject | [contact-confirmation.ts:41](emails/contact-confirmation.ts#L41) | Wastes the extra line the inbox gives you |
| 11 | Single breakpoint at 600px | [shared.ts:93](emails/shared.ts#L93) | 320–400px keeps 32px card padding and a 30px heading |
| 12 | No `<title>`, no `x-apple-disable-message-reformatting` | head | No accessible document title; iOS applies its own reformatting |
| 13 | `export function document` shadows the DOM global | [shared.ts:133](emails/shared.ts#L133) | Confusing at both call sites; trivial to rename |
| 14 | Dark hexes eyeballed, not derived | [shared.ts:107-119](emails/shared.ts#L107-L119) | `#040A1A` does not correspond to `--card` `oklch(0.1493 0.0364 264.235)` |

The escaping discipline, the plain-text alternatives, and the copy are all correct and carry over
unchanged.

## A1. Rewrite `emails/shared.ts`

Same exports and call shapes; hardened internals.

**Document shell.** Rename `document` → `emailDocument`, add a `title` alongside `preview`/`body`:

```html
<!doctype html>
<html lang="en" dir="ltr"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office">
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
<style>* { font-family: Arial, Helvetica, sans-serif !important; }</style>
<![endif]-->
<!--[if !mso]><!-->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
<!--<![endif]-->
<style>${EMAIL_CSS}</style>
</head>
```

The `xmlns` attributes are what make the VML buttons work. The `[if mso]` style block gives Outlook
Arial deliberately instead of an unpredictable Times fallback (defects 4, 5, 12).

**Body wrapper** — MSO ghost table replaces the `width="600"` attribute, so the real table can use
`max-width` cleanly everywhere else:

```html
<body class="page" style="margin:0;padding:0;width:100%;background-color:${COLORS.page};
     font-family:${FONT_BODY};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<div role="article" aria-roledescription="email" aria-label="${esc(title)}" lang="en">
  ${preheader(preview)}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.page};">
  <tr><td align="center" class="sm-gutter" style="padding:32px 12px;">
    <!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;">
      ${body}
    </table>
    <!--[if mso]></td></tr></table><![endif]-->
  </td></tr>
  </table>
</div>
</body>
```

**`preheader()` — new private helper (defect 9).** Two hidden divs: the preview text, then ~30
`&#847;&zwnj;&nbsp;&#8199;&#65279;` spacer entities so card copy cannot leak into the inbox line.
Both carry `display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;`
and `aria-hidden="true"`.

**`EMAIL_CSS` additions** on top of what is there:

```css
html, body { margin:0 !important; padding:0 !important; height:100% !important; width:100% !important; }
body { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }

/* iOS Mail / Gmail iOS / Outlook.com iOS auto-link restyling (defect 8) */
a[x-apple-data-detectors] { color:inherit !important; text-decoration:none !important;
  font-size:inherit !important; font-family:inherit !important;
  font-weight:inherit !important; line-height:inherit !important; }
u + #body a, #MessageViewBody a { color:inherit; text-decoration:none; font-size:inherit; }
```

Two breakpoints instead of one (defect 11), both prefixed `only screen and` so older Outlook.com
does not misparse them:

```css
@media only screen and (max-width:600px) {
  .sm-gutter { padding-left:12px !important; padding-right:12px !important; }
  .sm-px { padding-left:20px !important; padding-right:20px !important; }
  .sm-py { padding-top:28px !important; padding-bottom:28px !important; }
  .sm-h1 { font-size:26px !important; line-height:32px !important; }
  .sm-value, .sm-body { font-size:16px !important; line-height:26px !important; }
  .sm-btn { display:block !important; width:100% !important; box-sizing:border-box !important;
            text-align:center !important; padding:15px 20px !important; }
}
@media only screen and (max-width:400px) {
  .xs-px { padding-left:16px !important; padding-right:16px !important; }
  .xs-h1 { font-size:22px !important; line-height:28px !important; }
  .xs-py { padding-top:24px !important; padding-bottom:24px !important; }
}
```

Media-query classes go on `<td>` and `<div>` only, never on `<table>` (defect 3).

Dark mode gets each rule three times — `@media (prefers-color-scheme: dark)`, plus `[data-ogsc]`
(foreground) and `[data-ogsb]` (background) for Outlook.com (defect 7). Extract the declarations
into a `DARK_RULES` string and emit it under all three selector prefixes rather than hand-maintaining
three copies.

**`COLORS` (defect 14).** Recompute the dark hexes from the actual `.dark` oklch tokens in
[app/globals.css:40-56](app/globals.css#L40-L56) rather than the current approximations, and add
them as a `dark` sub-object so both scales live in one place. Verify every foreground/background
pair clears 4.5:1 before committing; keep the existing inline contrast comments.

**`button()` — bulletproof (defect 1).** Signature becomes
`button(href, label, opts: { bg?: string; fg?: string } = {})`, emitting VML for Outlook and a
styled `<a>` for everything else:

```html
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
  href="${href}" style="height:48px;v-text-anchor:middle;width:${width}px;"
  arcsize="17%" stroke="f" fillcolor="${bg}">
  <w:anchorlock/>
  <center style="color:${fg};font-family:Arial,sans-serif;font-size:13px;font-weight:600;letter-spacing:1.5px;">${label}</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<a class="btn sm-btn" href="${href}" style="display:inline-block;background-color:${bg};color:${fg};…">${label}</a>
<!--<![endif]-->
```

Two details that matter: **VML width is a fixed pixel value and cannot wrap** — derive it from the
label as `Math.min(520, 40 + label.length * 9)`; and **`text-transform` does not apply inside VML**
— uppercase the label in TypeScript so both branches read identically, and drop `text-transform`
from the `<a>`. `arcsize="17%"` on a 48px box is ≈8px, matching the `<a>` branch. The band's white
button becomes `button(href, label, { bg: "#FFFFFF", fg: COLORS.ink })` rather than a second
hand-written copy inside `band()`.

**`card()` — padding on a `<td>` (defect 2):**

```html
<tr><td style="padding-top:16px;">
  <table role="presentation" class="card" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:${COLORS.white};border:1px solid ${COLORS.border};border-radius:12px;">
    <tr><td class="sm-px xs-px" style="padding:32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${inner}</table>
    </td></tr>
  </table>
</td></tr>
```

`band()` gets the same treatment, with `class="sm-px xs-px sm-py xs-py"` on the padded cell.

**`nl2br()` — new export (defect 6):**

```ts
/** Applied AFTER esc(). The description is the one field carrying user line breaks. */
export function nl2br(escaped: string): string {
  return escaped.replace(/\r\n|\r|\n/g, "<br>");
}
```

`panel()` and `field()` drop `white-space:pre-wrap` and callers pass `nl2br(esc(value))`. Keeping
both would double-space every line.

**Accessibility.** `band()` heading becomes an `<h1 style="margin:0;…">`; `hairline()` and
`accentRule()` get `aria-hidden="true"`; layout tables keep `role="presentation"` (already correct);
the band's address is wrapped in an explicit `<a class="link-on-dark" style="color:#D1D5DB;text-decoration:none;">`
so iOS cannot restyle it into unreadable blue on the dark band.

## A2. `emails/contact-request.ts` (receiving)

Content unchanged, rebuilt on the new primitives.

- `document(` → `emailDocument(`, `title: "New project enquiry"`.
- `panel("Project description", nl2br(esc(data.description)))`.
- Reply button label uses the first name, clamped:
  `oneLine(data.name).split(" ")[0].slice(0, 18)` — keeps the VML width sane and survives a
  pathological 120-character name.
- Band `sub`: the address as an explicit anchor per above, still `.breakable`.
- Text alternative gains an explicit `Reply to: ${data.email}` line.
- **Every interpolated request value keeps its `esc()`.** This is the untrusted-input path and
  nothing in the rewrite relaxes it.

## A3. `emails/contact-confirmation.ts` (replying)

- Same primitive swap, `title: "Message received"`.
- Preheader stops repeating the subject (defect 10) — `"Reply within 24 hours. Here is what you sent."`
- `panel("What you sent", nl2br(esc(data.description)))`.
- `button(esc(SITE_URL), "View portfolio")`.
- Send semantics unchanged: last, best-effort, inside its own try/catch.

**No changes to [app/api/contact/route.ts](app/api/contact/route.ts).** The five-gate order, the
`to`-from-config rule and the `reply_to` wiring stay exactly as they are.

## A4. `scripts/preview-emails.ts`

A `tsx` script matching the [scripts/generate-og.tsx](scripts/generate-og.tsx) pattern — nothing in
`scripts/` enters the server graph, so it costs zero Worker bytes.

Renders both templates against four fixtures into a gitignored `.email-preview/`:

| Fixture | Purpose |
|---|---|
| `typical` | Short name, company present, two-paragraph description |
| `minimal` | No company, one-line description |
| `stress` | 60-char name, 5000-char description, a 120-char unbreakable URL, hard line breaks |
| `hostile` | `O'Brien & Sons <script>alert(1)</script>` in every field — proves `esc()` |

Writes `<fixture>-<template>.html` plus the `.txt` alternative for each, and an `index.html` that
frames every render at **320 / 375 / 414 / 600 / 800px** side by side with a light/dark toggle. That
page is how "responsive in all viewports" gets checked in one glance — and it is also a Chrome
DevTools target, so the same `resize_page` + `take_screenshot` pass used on the site applies to the
emails.

Wire-up: `package.json` → `"preview:email": "tsx scripts/preview-emails.ts"`; `.gitignore` →
`/.email-preview/`; `.graphifyignore` → `.email-preview/` (added in Step 0).

---

# Part B — Site UI/UX, fix-only

Scope: whole site — homepage, the 7 case studies, header/footer, contact form. No visual redesign.
Ranked by severity; the Step 1 DevTools numbers may reorder the performance items.

## B1. Everything below the hero is invisible without JavaScript — **highest severity**

[app/globals.css:178-180](app/globals.css#L178-L180) sets `[data-animate] { opacity: 0 }`, and
[components/animated-section.tsx:21-37](components/animated-section.tsx#L21-L37) is the only thing
that ever adds `.in-view`. So:

- With JS disabled or failed, every section from `#about` down stays at `opacity: 0` permanently.
  The homepage uses `AnimatedSection` at ~14 places ([app/page.tsx:214](app/page.tsx#L214) onward).
- `prefers-reduced-motion` is handled for the hero and float/pulse
  ([globals.css:166-175](app/globals.css#L166-L175)) but **not** for `[data-animate]` — the 0.6s
  opacity+transform transition still runs for users who asked for less motion.
- It is also an LCP/INP risk: content below the fold cannot paint until hydration plus an
  IntersectionObserver callback.

Fix, in CSS plus a one-line component change:

```css
/* Reveal is a progressive enhancement — only arm it once JS says so. */
.js [data-animate] { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  [data-animate], .js [data-animate] { opacity: 1 !important; transform: none !important; transition: none !important; }
}
```

Add the `js` class to `<html>` from a tiny inline script in
[app/layout.tsx](app/layout.tsx) (before paint, so there is no flash), and have `AnimatedSection`
bail out of observing entirely when `matchMedia("(prefers-reduced-motion: reduce)").matches`.

## B2. Touch targets below 44px

[components/ui/button.tsx:24-31](components/ui/button.tsx#L24-L31) — `sm` is `h-8` (32px), `icon`
is `size-9` (36px), `icon-sm` is `size-8` (32px). Used at
[app/page.tsx:450](app/page.tsx#L450), [:463](app/page.tsx#L463), [:475](app/page.tsx#L475) for the
project-card actions, and for the header's GitHub/LinkedIn/theme/menu buttons
([components/site-header.tsx](components/site-header.tsx)).

Fix without changing the visual size: keep the painted box, extend the hit area. Add a
`before:absolute before:-inset-1.5 before:content-['']` pseudo-element (or `min-h-11 min-w-11` on
the touch-primary controls) so the pointer target clears 44×44 while the button still *looks* small.
Verify with DevTools' tap-target check in the Lighthouse accessibility run.

## B3. Image payload — the likeliest jank source

`public/img/` ships PNGs at 1.29 MB (`sheraa.png`), 892 KB (`shaathi.png`), 664 KB
(`arits-image.png`), 601 KB (`tazcreates.png`), 522 KB (`weatherAppSS.png`), 397 KB, 304 KB, 297 KB
— about 5 MB of source assets. `next/image` is used correctly in
[components/project-media.tsx](components/project-media.tsx) (`fill` + `sizes` + `priority`), and
optimization is on, but the originals still ship into `.open-next/assets` and are what the optimizer
reads on a cold request.

Fix: a `scripts/optimize-images.ts` pass that re-encodes each source to WebP at a sane max width
(≈1600px) and rewrites the `image` paths in [lib/portfolio-data.ts](lib/portfolio-data.ts). Expect
roughly an 80% reduction. This is the same "compute it once at build time" rule that
`scripts/generate-og.tsx` follows. Confirm the before/after transfer sizes from the Step 1
`list_network_requests` output rather than assuming.

## B4. Viewport meta — verify before changing

[app/layout.tsx:107-113](app/layout.tsx#L107-L113) exports `viewport` with `themeColor` and
`colorScheme` but no `width` / `initialScale`. Next.js is documented to supply
`width=device-width, initial-scale=1` by default, but a partial `viewport` export replacing rather
than merging that default would break every mobile layout on the site. **Check the rendered
`<meta name="viewport">` in the DevTools pass first**; only add `width: "device-width",
initialScale: 1` if it is genuinely absent.

## B5. Unnamed `<section>` landmarks

On the case-study page, the stats strip
([app/projects/[slug]/page.tsx:278](app/projects/%5Bslug%5D/page.tsx#L278)), the screenshot
([:332](app/projects/%5Bslug%5D/page.tsx#L332)) and prev/next
([:450](app/projects/%5Bslug%5D/page.tsx#L450)) are `<section>` elements with no heading and no
accessible name, so they surface as anonymous "region" landmarks in the a11y tree. Give each an
`aria-label`, or demote it to a `<div>` where it is not really a region.

## B6. Contact form

The form is in better shape than it first looks — every control is wrapped in `<FormControl>`, which
is what injects `aria-invalid` / `aria-describedby`, and `autoComplete` is set on name, email and
organization ([components/contact-form.tsx:153-256](components/contact-form.tsx#L153-L256)).
Remaining gaps:

- The textarea has no `autoComplete`, and no `inputMode`/`enterKeyHint` anywhere — set
  `enterKeyHint="next"` on the text inputs and `"send"` on the last field for mobile keyboards.
- The submit button is disabled while `awaitingCaptcha`
  ([:272](components/contact-form.tsx#L272)) with no visible reason, which reads as a broken form.
  Add a short status line (`aria-live="polite"`) explaining the wait.
- Confirm from the DevTools snapshot that `FormMessage` errors are actually announced, and that the
  `503 → mailto:` fallback path ([:76-77](components/contact-form.tsx#L76-L77)) is reachable by
  keyboard.

## B7. Anything the DevTools pass surfaces

Console errors, hydration warnings, render-blocking resources, CLS culprits, and contrast failures
from the Lighthouse accessibility category. Fix what is real; report what is not worth fixing rather
than silently skipping it.

---

# Files touched

| File | Change |
|---|---|
| [emails/shared.ts](emails/shared.ts) | Substantial rewrite — head, CSS, VML button, td padding, `nl2br`, dark scale, rename |
| [emails/contact-request.ts](emails/contact-request.ts) | Rebuilt on new primitives; reply label clamp; text alt line |
| [emails/contact-confirmation.ts](emails/contact-confirmation.ts) | Rebuilt on new primitives; preheader copy |
| `scripts/preview-emails.ts` | New |
| `scripts/optimize-images.ts` | New (B3) |
| [app/globals.css](app/globals.css) | `.js [data-animate]` gating + reduced-motion reset (B1) |
| [components/animated-section.tsx](components/animated-section.tsx) | Reduced-motion bail-out (B1) |
| [app/layout.tsx](app/layout.tsx) | `js` class script; viewport only if B4 confirms it is needed |
| [components/ui/button.tsx](components/ui/button.tsx) | Hit-area fix on small/icon sizes (B2) |
| [app/page.tsx](app/page.tsx), [app/projects/[slug]/page.tsx](app/projects/%5Bslug%5D/page.tsx) | Landmark labels, touch-target classes |
| [components/contact-form.tsx](components/contact-form.tsx) | Mobile keyboard hints, captcha status line (B6) |
| [lib/portfolio-data.ts](lib/portfolio-data.ts) | Image paths only, after B3 re-encode |
| [package.json](package.json), [.gitignore](.gitignore), [.graphifyignore](.graphifyignore) | Script entries and ignores |

**Not touched:** [app/api/contact/route.ts](app/api/contact/route.ts),
[lib/contact-schema.ts](lib/contact-schema.ts), [lib/structured-data.ts](lib/structured-data.ts),
[lib/site.ts](lib/site.ts), anything under `app/sitemap.ts` / `app/robots.ts` / the `llms.txt`
routes.

# Reused, not rewritten

- `esc()`, `oneLine()`, `mailtoParam()` — [emails/shared.ts:45-73](emails/shared.ts#L45-L73). The
  escaping contract is correct and stays exactly as documented in the module header.
- `projectTypeLabel()` — [lib/contact-schema.ts:31](lib/contact-schema.ts#L31)
- `SITE_URL` — [lib/site.ts:9](lib/site.ts#L9); `profile` — [lib/portfolio-data.ts:127](lib/portfolio-data.ts#L127)
- `cn()` — [lib/utils.ts](lib/utils.ts), for every conditional class in Part B
- The oklch scale in [app/globals.css](app/globals.css) is the source the email hexes mirror
- The existing `prefers-reduced-motion` block at [globals.css:166-175](app/globals.css#L166-L175) is
  extended, not replaced
- `ProjectMedia` — [components/project-media.tsx](components/project-media.tsx) already handles both
  the image and the gradient placeholder correctly; B3 only changes what it is pointed at

---

# Verification

1. `npx tsc --noEmit` — there is no `pnpm typecheck` script in this repo.
2. `pnpm lint`
3. `pnpm preview:email`, open `.email-preview/index.html`. Every fixture at every frame width: no
   horizontal scroll, nothing under 14px, the button full-width below 600px, the long URL wrapping
   inside the panel, and the `hostile` fixture rendering its script tag as visible text.
4. Escaping audit — `rg 'data\.(name|email|company|description|projectType)' emails/`, confirm every
   hit sits inside `esc(...)` or a plain-text block.
5. Chrome DevTools re-run of Step 1 against the same pages and the same six widths. Lighthouse
   performance and accessibility must both be **at or above** the Step 1 baseline, with LCP, CLS and
   total image transfer explicitly compared before/after.
6. Bundle guard, since the contact pipeline is in the server graph:
   ```bash
   pnpm run build:cf && pnpm exec wrangler deploy --dry-run --outdir /tmp/wr
   find /tmp/wr -type f ! -name '*.map' -exec cat {} + | gzip -c | wc -c
   ```
   Expect ≈1,365,979 bytes, unchanged. Materially above that means something pulled a package in.
7. `pnpm build` — routes and metadata are touched, so a production build must pass.

## Manual, not run here

- **Real email clients.** Paste both HTML files into Litmus or Email on Acid, or send one of each to
  a Gmail, an Outlook.com and an Apple Mail account. VML is the one thing no browser preview can
  prove — Chrome ignores it entirely.
- **`security-reviewer`** over the diff. `emails/` is part of the contact pipeline and
  [CLAUDE.md](CLAUDE.md) requires that agent after touching it.
- No test suite is configured in this repo, so none is run.

---

# How this was researched

File reading was routed through the remote LM Studio model
(`gemma-4-26b-a4b-it-qat@q4_k_xl`) in four batched calls covering `emails/*`, the contact route,
the schema, the form, `app/page.tsx`, the case-study page, `app/globals.css`, `app/layout.tsx`,
`components/ui/button.tsx`, `components/animated-section.tsx`, `components/project-media.tsx`,
`components/site-header.tsx` and `package.json`. Every claim that became a defect above was then
verified by opening the cited line directly. `graphify-out/` did not exist at research time, which
is why Step 0 builds it; the Chrome DevTools findings do not exist yet, which is why Step 1 runs
before any edit.

---

# Results

Everything below was measured, not assumed. Chrome DevTools against `pnpm dev` on
localhost:3000; the email numbers against the generated previews on a static server.

## Corrections to this plan

Three items in the plan above were wrong, and the measurements are what caught them.

1. **Defect 14 (dark hexes "eyeballed") did not exist.** Converting every `.dark` oklch
   token in `app/globals.css` to sRGB reproduces the values already in `shared.ts` exactly —
   `#040A1A` *is* `oklch(0.1493 0.0364 264.235)`. Every foreground/background pair clears
   4.5:1 (dark card 18.9:1, dark muted-foreground 7.8:1, primary 5.4:1). No change made.
2. **B3's "80% image reduction" did not apply.** A fully-revealed homepage transfers
   **196 KB** of images across 14 requests — `next/image` already serves every project card
   at `w=640&q=75`. The 5 MB of source PNGs never reach a browser. `scripts/optimize-images.ts`
   was **not** written; the real image finding turned out to be the hero avatar (below).
3. **B4's viewport concern was unfounded.** `<meta name="viewport" content="width=device-width,
   initial-scale=1">` is present — Next supplies it despite the partial `viewport` export.
   No change made.

The 320px overflow was also misattributed in the plan: the hero blur orb at
`app/page.tsx:76` is clipped by its section's existing `overflow-hidden`. The real cause was
the contact grid (below).

## Part A — emails

| | Before | After |
|---|---|---|
| Outlook button | styled `<a>` with padding — renders as bare text | VML `roundrect` + `<a>`, mutually exclusive by conditional comment |
| Card padding | on `<table>` — dropped by Word | on an inner `<td>` |
| Webfont link | visible to Outlook — whole message falls back to Times | wrapped in `<!--[if !mso]>`, with an explicit Arial override for mso |
| Windows 125% scaling | unhandled | `OfficeDocumentSettings` / `PixelsPerInch 96` |
| Description newlines | `white-space: pre-wrap` — collapsed by Word | `nl2br()` after `esc()` |
| Dark mode | `prefers-color-scheme` only | plus `[data-ogsc]` / `[data-ogsb]`, generated from one `DARK_RULES` list |
| iOS auto-linking | unhandled | `format-detection`, `a[x-apple-data-detectors]`, `#MessageViewBody a`, explicit anchor on the band address |
| Breakpoints | one, at 600px | 600px and 400px |
| Preheader | no spacer — card copy leaked into the inbox line | spacer run; confirmation no longer repeats its subject |
| `<title>` | absent | present, plus `role="article"` and an `<h1>` in the band |

Verified with `pnpm preview:email` + Chrome DevTools over the rendered files:

- **48 overflow checks** — 6 files x light/dark x 4 widths (320/375/414/600) — **0 failures.**
- The `hostile` fixture (`<script>alert(1)</script>` in every field) produces **0 `<script>`
  tags** in the rendered document. Escaping holds.
- Largest render is 17,500 bytes, well under Gmail's 102 KB clip threshold.
- One real bug was found this way and fixed: the band `<h1>` is `esc(data.name)`, untrusted
  and arbitrarily long, and had no wrap rule — a 55-character name overflowed 320px by 8px.
  It now carries `.breakable`.

A footgun in the new `button()` was caught while wiring it up: it uppercases its label, so an
already-escaped `&amp;` would have become the invalid `&AMP;`. The contract now takes raw
text and escapes after uppercasing.

## Part B — site

| Finding | Before | After |
|---|---|---|
| Content hidden without JS | 36 of 36 `[data-animate]` at `opacity: 0`; full-page screenshot blank below the hero | 0 — reveal is scoped to `.js`, set by a blocking inline script |
| `prefers-reduced-motion` on the reveal | unhandled | forced to `opacity: 1; transform: none; transition: none`, and `AnimatedSection` skips observing entirely |
| Horizontal overflow at 320px | 47px on `/` | 0 across 3 pages x 6 widths (18 checks) |
| Touch targets under 44x44 (390px) | 46 of 69 | 8 — 7 are inline links inside headings (exempt under WCAG 2.5.5) and one is Radix's 1px hidden native `<select>` |
| Hero avatar | 41,760-byte raw JPEG, client-rendered by Radix, 444ms LCP load delay, distorted by `aspect-square` with no `object-cover` | 8,830 bytes via `next/image`, `<link rel="preload" as="image">` in the HTML, `object-cover` |
| Lighthouse (mobile) | A11y 100 · Best Practices 96 · SEO 100 · Agentic 67 · **2 failed** | **100 / 100 / 100 / 100 · 0 failed** |

Root causes worth keeping:

- The 320px overflow was the contact grid resolving `grid-template-columns: 350px` inside a
  288px container. A grid item defaults to `min-width: auto`, so it refuses to shrink below
  the min-content of `linkedin.com/in/shafin580`. Fixed with `[&>*]:min-w-0` plus
  `[overflow-wrap:anywhere]` on the address rows.
- The remaining 21px came from Turnstile: `size: "flexible"` still has a hard **300px
  minimum**, wider than the column ever gets at 320px. Contained with `overflow-x-auto` so
  the widget stays untransformed and interactive while the page does not move.
- `llms.txt` carried zero markdown links, which is what failed Lighthouse's `llms-txt`
  audit. Now 15, per llmstxt.org.

## Bundle

```
1,368,068 bytes gzipped   (baseline 1,365,979 — +2,089, +0.15%)
budget    3,145,728       (43.5% used)
```

No dependency added. The increase is the extra email CSS and markup.

## Not done, and why

- **`scripts/optimize-images.ts`** — dropped once the 196 KB measurement showed the premise
  was wrong. Re-encoding the source PNGs is still a deploy-size and cold-optimize win, but
  it is not a page-weight one and it was not worth changing `lib/portfolio-data.ts` for.
- **Real email clients.** Chrome ignores VML, so the Outlook branch cannot be proven locally.
  Litmus / Email on Acid, or a send to a Gmail + Outlook.com + Apple Mail trio, is still
  outstanding.
- **`security-reviewer` on the diff.** `emails/` is part of the contact pipeline and
  `CLAUDE.md` asks for that agent before committing such a change.
