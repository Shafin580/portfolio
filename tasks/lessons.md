# Lessons

Patterns worth not relearning. Newest last.

## Measure before planning a performance fix (2026-08-23)

A plan asserted "~80% image reduction" from re-encoding `public/img/*.png`. The actual
transferred payload for a fully-revealed homepage is **196 KB** — `next/image` already
serves every card at `w=640&q=75`, and the 5 MB of source PNGs never reach a browser. The
real image problem was somewhere else entirely: the hero avatar bypassed the optimizer
because Radix Avatar renders its `<img>` client-side after a load check.

**Rule:** for any perf claim, get the number from `list_network_requests` or
`performance.getEntriesByType('resource')` first. Source file size is not payload.

## A scroll loop can starve IntersectionObserver (2026-08-23)

Scrolling the page in 500px steps with 70ms waits left 12 of 36 `[data-animate]` sections
without `.in-view` and reported them as a bug. They were fine — the observer just had not
delivered. Two `requestAnimationFrame`s plus ~150ms per step fixed the measurement.

Related: `getBoundingClientRect()` includes ancestor transforms, so an element inside a
mid-reveal `scale(0.92)` measures 40px when its computed height is 44px. Let animations
settle before measuring size.

## `grid` items do not shrink below min-content (2026-08-23)

`grid lg:grid-cols-2` resolved to `grid-template-columns: 350px` inside a 288px container
and scrolled the whole document sideways by 47px at 320px wide. A grid item defaults to
`min-width: auto`, so the longest unbreakable token in it — here `linkedin.com/in/shafin580`
— sets the floor.

**Rule:** any grid or flex child that can contain a URL, an email address, or user-supplied
text needs `min-w-0`, and the text itself needs `overflow-wrap: anywhere`. This applies to
the email templates too: the band `<h1>` is `esc(data.name)` and needed `.breakable`.

## Turnstile's "flexible" size has a 300px floor (2026-08-23)

`options={{ size: "flexible" }}` does not mean fluid down to zero. Below ~340px of column
it overflows. Contain it (`max-w-full overflow-x-auto`) rather than transforming it.

## A JS-armed hidden state hides the page when JS does not run (2026-08-23)

`[data-animate] { opacity: 0 }` with only an IntersectionObserver to clear it meant a
full-page screenshot, a print to PDF, and any non-JS renderer saw everything below the hero
as blank. Scope the *hidden* state to a `.js` class set by a blocking inline script, so the
no-JS path renders the finished page and simply never animates.

The same rule covers `prefers-reduced-motion`: it was handled for the hero keyframes but not
for the scroll reveal, so the 0.6s transition still ran for people who asked for less.

## Uppercase before escaping, never after (2026-08-23)

`esc(label).toUpperCase()` turns `&amp;` into `&AMP;`, which no client decodes. Any
transform that touches letters has to run on the raw string, with `esc()` last.
