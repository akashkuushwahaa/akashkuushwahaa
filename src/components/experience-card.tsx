"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

// src/components/experience-card.tsx
interface ExperienceCardProps {
    logoUrl: string;
    altText: string;
    title: string;
    subtitle?: string;
    href?: string | null;
    badges?: readonly string[];
    period: string;
    description?: string;
    bullets?: readonly string[];
    defaultExpanded?: boolean;
}
export const ExperienceCard = ({
    logoUrl,
    altText,
    title,
    subtitle,
    href,
    badges,
    period,
    description,
    bullets,
    defaultExpanded = false,
}: ExperienceCardProps) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

    const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        if (description || bullets) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
        }
    };

    const mainCard = (
        <Card className="flex shadow-card">
            <div className="flex-none">
                <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
                    <AvatarImage
                        src={logoUrl}
                        alt={altText}
                        className="object-contain"
                    />
                    <AvatarFallback>{altText[0]}</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-grow ml-4 items-center flex-col group">
                <CardHeader>
                    <div className="flex items-center justify-between gap-x-2 text-base">
                        <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
                            {title}
                            {badges && (
                                <span className="inline-flex gap-x-1">
                                    {badges.map((badge, index) => (
                                        <Badge
                                            variant="secondary"
                                            className="align-middle text-xs"
                                            key={index}
                                        >
                                            {badge}
                                        </Badge>
                                    ))}
                                </span>
                            )}
                            {href && (
                                <ChevronRightIcon
                                    className={cn(
                                        "size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100",
                                        isExpanded ? "rotate-90" : "rotate-0"
                                    )}
                                />
                            )}
                        </h3>
                        <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
                            {period}
                        </div>
                    </div>
                    {subtitle && (
                        <div className="font-sans text-xs">{subtitle}</div>
                    )}
                </CardHeader>
                {(description || bullets) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: isExpanded ? 1 : 0,

                            height: isExpanded ? "auto" : 0,
                        }}
                        transition={{
                            duration: 0.7,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="mt-2 text-xs sm:text-sm"
                    >
                        {description && (
                            <div className="mb-2 text-muted-foreground">
                                {description}
                            </div>
                        )}
                        {bullets && bullets.length > 0 && (
                            <ul className="list-disc space-y-2 ml-4 pb-2">
                                {bullets.map((bullet, index) => (
                                    <li
                                        key={index}
                                        className="text-muted-foreground pl-1"
                                    >
                                        {bullet}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                )}
            </div>
        </Card>
    );

    if (!href) {
        return <div className="block">{mainCard}</div>;
    }

    return (
        <Link
            href={href}
            className="block cursor-pointer"
            onClick={handleClick}
        >
            {mainCard}
        </Link>
    );
};
