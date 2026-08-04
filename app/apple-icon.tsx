import { ImageResponse } from "next/og";
import { LOGO_DATA_URI } from "@/lib/logo-svg";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS masks touch icons to its own rounded square, so this renders the mark
 * on an opaque, slightly inset canvas rather than reusing the SVG directly.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2563eb",
        }}
      >
        <img src={LOGO_DATA_URI} width={180} height={180} alt="" />
      </div>
    ),
    size,
  );
}
