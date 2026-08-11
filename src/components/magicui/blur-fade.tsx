"use client";

import {
    motion,
    useInView,
    useReducedMotion,
    UseInViewOptions,
    Variants,
} from "motion/react";
import { useRef } from "react";

type MarginType = UseInViewOptions["margin"];

interface BlurFadeProps {
    children: React.ReactNode;
    className?: string;
    variant?: {
        hidden: { y: number };
        visible: { y: number };
    };
    duration?: number;
    delay?: number;
    offset?: number;
    direction?: "up" | "down" | "left" | "right";
    inView?: boolean;
    inViewMargin?: MarginType;
    blur?: string;
}

const BlurFade = ({
    children,
    className,
    variant,
    duration = 0.4,
    delay = 0,
    offset = 6,
    direction = "down",
    inView = false,
    inViewMargin = "-50px",
    blur = "6px",
}: BlurFadeProps) => {
    const ref = useRef(null);
    const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
    const isInView = !inView || inViewResult;
    const prefersReducedMotion = useReducedMotion();

    const defaultVariants: Variants = {
        hidden: {
            [direction === "left" || direction === "right" ? "x" : "y"]:
                direction === "right" || direction === "down"
                    ? -offset
                    : offset,
            opacity: 0,
            filter: `blur(${blur})`,
        },
        visible: {
            [direction === "left" || direction === "right" ? "x" : "y"]: 0,
            opacity: 1,
            filter: `blur(0px)`,
        },
    };

    const combinedVariants = variant || defaultVariants;

    return (
        <motion.div
            ref={ref}
            initial={prefersReducedMotion ? "visible" : "hidden"}
            animate={isInView || prefersReducedMotion ? "visible" : "hidden"}
            variants={combinedVariants}
            transition={
                prefersReducedMotion
                    ? { duration: 0 }
                    : { delay: 0.04 + delay, duration, ease: "easeOut" }
            }
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default BlurFade;
