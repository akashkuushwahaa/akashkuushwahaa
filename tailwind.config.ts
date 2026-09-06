import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssTypography from "@tailwindcss/typography";

const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ["var(--font-geist-sans)", ...fontFamily.sans],
                mono: ["var(--font-geist-mono)", ...fontFamily.mono],
            },
            fontSize: {
                "display-sm": [
                    "clamp(28px, 1.326vw + 23.03px, 40px)",
                    { lineHeight: "1.1", letterSpacing: "-0.03em" },
                ],
                display: [
                    "clamp(40px, 2.21vw + 31.71px, 60px)",
                    { lineHeight: "1", letterSpacing: "-0.04em" },
                ],
                "display-lg": [
                    "clamp(56px, 4.2vw + 36px, 104px)",
                    { lineHeight: "0.92", letterSpacing: "-0.045em" },
                ],
            },
            letterSpacing: {
                display: "-2.4px",
                heading: "-0.96px",
                subheading: "-1.28px",
                "card-title": "-0.96px",
                ui: "-0.32px",
                label: "0.14em",
            },
            transitionTimingFunction: {
                "out-expo": "var(--ease-out-expo)",
                "in-out-strong": "var(--ease-in-out-strong)",
                spring: "var(--ease-spring)",
            },
            transitionDuration: {
                fast: "var(--duration-fast)",
                base: "var(--duration-base)",
                medium: "var(--duration-medium)",
                slow: "var(--duration-slow)",
            },
            spacing: {
                section: "105px",
            },
            maxWidth: {
                content: "1120px",
            },
            boxShadow: {
                card: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, rgba(0,0,0,0.04) 0px 8px 8px -8px, #fafafa 0px 0px 0px 1px inset",
                "card-hover":
                    "rgba(0,0,0,0.12) 0px 0px 0px 1px, rgba(0,0,0,0.06) 0px 4px 4px, rgba(0,0,0,0.06) 0px 12px 12px -8px, #fafafa 0px 0px 0px 1px inset",
                border: "rgba(0,0,0,0.08) 0px 0px 0px 1px",
                work: "rgba(0,0,0,0.18) 1px 5px 40px 0px",
            },
            colors: {
                badge: {
                    bg: "hsl(var(--brand-subtle))",
                    text: "hsl(var(--brand-foreground))",
                    hover: "hsl(var(--brand-subtle))",
                },
                brand: {
                    DEFAULT: "hsl(var(--brand))",
                    solid: "hsl(var(--brand-solid))",
                    foreground: "hsl(var(--brand-foreground))",
                    subtle: "hsl(var(--brand-subtle))",
                    pop: "hsl(var(--brand-pop))",
                    "pop-ink": "hsl(var(--brand-pop-ink))",
                },
                violet: {
                    DEFAULT: "hsl(var(--violet))",
                    solid: "hsl(var(--violet-solid))",
                    foreground: "hsl(var(--violet-foreground))",
                    subtle: "hsl(var(--violet-subtle))",
                    pop: "hsl(var(--violet-pop))",
                    "pop-ink": "hsl(var(--violet-pop-ink))",
                },
                green: "hsl(var(--green))",
                blue: "hsl(var(--blue))",
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                xl: "20px",
                "2xl": "28px",
                "3xl": "40px",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                ticker: {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-50%)" },
                },
                "label-in": {
                    from: { opacity: "0", transform: "translateX(-4px)" },
                    to: { opacity: "1", transform: "translateX(0)" },
                },
                "pill-drop": {
                    from: {
                        opacity: "0",
                        transform: "translateY(-140px) rotate(var(--pill-rot))",
                    },
                    to: {
                        opacity: "1",
                        transform: "translateY(0) rotate(var(--pill-rot))",
                    },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                ticker: "ticker var(--ticker-duration, 40s) linear infinite",
                "label-in":
                    "label-in var(--duration-medium) var(--ease-out-expo) both",
                "pill-drop": "pill-drop 0.7s var(--ease-spring) both",
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require("@tailwindcss/typography"),
    ],
} satisfies Config;

export default config;
