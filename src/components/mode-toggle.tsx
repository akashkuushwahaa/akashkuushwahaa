"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            type="button"
            size="icon"
            className="px-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            <SunIcon className="size-[1.1rem] dark:hidden" />
            <MoonIcon className="hidden size-[1.1rem] dark:block" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
