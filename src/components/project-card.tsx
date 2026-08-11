import { Metric } from "@/components/metric";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface Props {
    title: string;
    href: string;
    description: string;
    dates: string;
    tags: readonly string[];
    metric?: { label: string; from: string; to: string } | null;
    links?: readonly {
        icon: React.ReactNode;
        type: string;
        href: string;
    }[];
}

export function ProjectCard({
    title,
    href,
    description,
    dates,
    tags,
    metric,
    links,
}: Props) {
    return (
        <Card className="relative flex h-full flex-col overflow-hidden p-2 shadow-card transition-shadow duration-300 ease-out hover:shadow-card-hover">
            <CardHeader className="px-2 pt-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium tracking-ui">
                        <Link
                            href={href}
                            className="after:absolute after:inset-0 after:content-['']"
                        >
                            {title}
                        </Link>
                    </CardTitle>
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                        {dates}
                    </span>
                    <p className="text-pretty text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="mt-auto flex flex-col gap-y-3 px-2 pt-3">
                {metric && (
                    <Metric
                        label={metric.label}
                        from={metric.from}
                        to={metric.to}
                    />
                )}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                            <Badge
                                className="px-1 py-0 text-[10px]"
                                variant="secondary"
                                key={tag}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="px-2 pb-2 pt-3">
                {links && links.length > 0 && (
                    <div className="relative z-10 flex flex-row flex-wrap items-start gap-1">
                        {links.map((link) => (
                            <Link
                                href={link.href}
                                key={link.type}
                                target={
                                    link.href.startsWith("http")
                                        ? "_blank"
                                        : undefined
                                }
                            >
                                <Badge className="flex gap-2 px-2 py-1 text-[10px]">
                                    {link.icon}
                                    {link.type}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
