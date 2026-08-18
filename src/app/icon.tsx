import { DATA } from "@/data/resume";
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#0a0a0a",
                    color: "#fafafa",
                    fontSize: 30,
                    fontWeight: 600,
                    letterSpacing: "-2px",
                }}
            >
                {DATA.initials}
            </div>
        ),
        { ...size }
    );
}
