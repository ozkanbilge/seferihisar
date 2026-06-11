import { ImageResponse } from "next/og";

// İkon boyutu
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "#0e0f12",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#c0a062",
          borderRadius: "8px",
          border: "1.5px solid #c0a062",
          fontWeight: 800,
          fontFamily: "serif",
        }}
      >
        Ö
      </div>
    ),
    {
      ...size,
    }
  );
}
