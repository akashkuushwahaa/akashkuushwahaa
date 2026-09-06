export function GrainCanvas() {
    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
            <div className="grain absolute inset-0" />
        </div>
    );
}
