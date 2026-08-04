/**
 * The `< S >` mark as a raw SVG string.
 *
 * `ImageResponse` (satori) cannot reach into a React component tree for vector
 * art, but it will happily render an <img> pointing at a data URI — so the
 * generated OG image and the Apple touch icon reuse the exact same mark that
 * components/logo.tsx renders in the navbar. Keep the two in sync.
 */
export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2563eb"/><stop offset="1" stop-color="#60a5fa"/></linearGradient></defs><rect width="64" height="64" rx="15" fill="url(#g)"/><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 22 L10.5 32 L17.5 42" stroke-width="4.5" opacity=".62"/><path d="M46.5 22 L53.5 32 L46.5 42" stroke-width="4.5" opacity=".62"/><path d="M40 24 C40 19 36.5 16 32 16 C27.5 16 24 19 24 23 C24 31 41 29 41 39 C41 44.5 37 48 32 48 C27 48 24 45 24 41" stroke-width="5.5"/></g></svg>`;

export const LOGO_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG).toString("base64")}`;
