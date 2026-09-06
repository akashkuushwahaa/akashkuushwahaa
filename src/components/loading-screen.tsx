import type { RefObject } from "react";

export function LoadingScreen({
    curtainRef,
}: {
    curtainRef: RefObject<HTMLDivElement | null>;
}) {
    return <div ref={curtainRef} aria-hidden="true" className="page-curtain" />;
}
