"use client";

import type { CSSProperties } from "react";

/**
 * Everything here is positioned in % of the background image, so it stays glued to the
 * artwork at any screen size (the parent keeps the image's aspect ratio).
 * Tweak x / y to nudge a light onto a different spot in your art.
 */

type Glow = {
  x: number; y: number; size: number; color: string;
  kind: "pulse" | "flicker" | "blink";
  d?: number; delay?: number;
};

const CYAN = "0,240,255";

const glows: Glow[] = [
  { x: 56, y: 24, size: 120, color: CYAN, kind: "pulse", d: 4.5 },            // left billboard
  { x: 78, y: 46, size: 150, color: CYAN, kind: "pulse", d: 5, delay: 1.5 },  // robot billboard
  { x: 62, y: 38, size: 80, color: CYAN, kind: "pulse", d: 3.8, delay: 0.5 },
  { x: 49, y: 71, size: 170, color: CYAN, kind: "pulse", d: 6 },              // laptop
  { x: 90, y: 62, size: 200, color: CYAN, kind: "pulse", d: 7, delay: 2 },    // monitor
];

// deterministic pseudo-random so server and client render the same thing
function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}
const rand = seeded(42);
// tiny blinking city windows inside the skyline area
const windows = Array.from({ length: 70 }, () => ({
  x: 33 + rand() * 40,
  y: 20 + rand() * 42,
  size: 2 + rand() * 2.5,
  color: ["255,255,255", CYAN][Math.floor(rand() * 2)],
  d: 1.6 + rand() * 4,
  delay: rand() * 5,
})).filter(({ x, y }) => ((x - 70) / 6) ** 2 + ((y - 58) / 10) ** 2 > 1);

const cls = { pulse: "light-pulse", flicker: "light-flicker", blink: "light-blink" } as const;
const vars = (d?: number, delay?: number): CSSProperties =>
  ({ "--d": `${d ?? 3}s`, "--delay": `${delay ?? 0}s` }) as CSSProperties;

export default function SceneLights() {
  return (
    <div className="pointer-events-none absolute inset-0 mix-blend-screen" aria-hidden>
      {glows.map((g, i) => (
        <span
          key={`g${i}`}
          className={`absolute rounded-full ${cls[g.kind]}`}
          style={{
            ...vars(g.d, g.delay),
            left: `${g.x}%`, top: `${g.y}%`,
            width: g.size, height: g.size,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, rgba(${g.color},0.8) 0%, rgba(${g.color},0.25) 40%, rgba(${g.color},0) 70%)`,
          }}
        />
      ))}

      {windows.map((w, i) => (
        <span
          key={`w${i}`}
          className="light-blink absolute rounded-[1px]"
          style={{
            ...vars(w.d, w.delay),
            left: `${w.x}%`, top: `${w.y}%`,
            width: w.size, height: w.size,
            background: `rgb(${w.color})`,
            boxShadow: `0 0 8px 2px rgba(${w.color},0.7)`,
          }}
        />
      ))}

    </div>
  );
}