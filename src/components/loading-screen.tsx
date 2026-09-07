import { HELLO_SIGNATURE } from "@/data/hello-signature";
import type { CSSProperties } from "react";

export const CURTAIN_ID = "page-curtain";

const { height, space, strokeWidth, words } = HELLO_SIGNATURE;
const TOTAL_WIDTH =
    words.reduce((sum, word) => sum + word.width, 0) +
    space * (words.length - 1);
const WIDEST_WORD = Math.max(...words.map((word) => word.width));

export function LoadingScreen() {
    return (
        <div
            id={CURTAIN_ID}
            aria-hidden="true"
            className="page-curtain"
            data-initial=""
        >
            <div
                className="hello"
                style={
                    {
                        "--hello-total": TOTAL_WIDTH,
                        "--hello-widest": WIDEST_WORD,
                        "--hello-space": space,
                    } as CSSProperties
                }
            >
                {words.map((word, index) => (
                    <svg
                        key={index}
                        viewBox={`0 0 ${word.width} ${height}`}
                        style={{
                            width: `calc(var(--hello-scale) * ${word.width})`,
                            height: `calc(var(--hello-scale) * ${height})`,
                        }}
                    >
                        {word.strokes.map((stroke, strokeIndex) => (
                            <path
                                key={strokeIndex}
                                d={stroke.d}
                                pathLength={1}
                                strokeWidth={strokeWidth}
                                data-hello-stroke={stroke.length}
                            />
                        ))}
                    </svg>
                ))}
            </div>
        </div>
    );
}
