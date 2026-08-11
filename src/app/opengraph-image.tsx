import { ImageResponse } from "next/og";

export const alt =
    "Akash Kushwaha — Full-stack engineer, LLM tooling in TypeScript and Python";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#0a0a0a",
                    padding: "80px",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            display: "flex",
                            fontSize: "22px",
                            color: "#8f8f8f",
                            letterSpacing: "2px",
                            marginBottom: "28px",
                        }}
                    >
                        AHMEDABAD, INDIA · OPEN TO WORK
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: "84px",
                            fontWeight: 600,
                            color: "#fafafa",
                            letterSpacing: "-4px",
                        }}
                    >
                        Akash Kushwaha
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: "32px",
                            color: "#a3a3a3",
                            marginTop: "20px",
                            letterSpacing: "-1px",
                        }}
                    >
                        Full-stack engineer · LLM tooling in TypeScript and
                        Python
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        borderTop: "1px solid #262626",
                        paddingTop: "28px",
                        fontSize: "24px",
                        color: "#8f8f8f",
                    }}
                >
                    <span style={{ color: "#8f8f8f" }}>F1 0.82</span>
                    <span style={{ color: "#525252" }}>→</span>
                    <span style={{ color: "#fafafa" }}>0.914</span>
                    <span style={{ color: "#525252" }}>·</span>
                    <span>retrieval, not prompting</span>
                </div>
            </div>
        ),
        { ...size }
    );
}
