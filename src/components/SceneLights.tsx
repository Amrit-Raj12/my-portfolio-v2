"use client";

import { motion } from "framer-motion";
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

const LIME = "212,255,0";
const CYAN = "0,240,255";

const glows: Glow[] = [
  { x: 69.7, y: 29, size: 150, color: LIME, kind: "flicker", d: 7 },         // AR tower sign
  { x: 94, y: 27, size: 150, color: LIME, kind: "flicker", d: 9, delay: 1 },  // "Good code" wall sign
  { x: 77, y: 88, size: 130, color: LIME, kind: "pulse", d: 3.4 },            // AR on the chair
  { x: 91, y: 75, size: 90, color: LIME, kind: "pulse", d: 4, delay: 0.8 },   // AR on monitor
  { x: 56, y: 24, size: 120, color: CYAN, kind: "pulse", d: 4.5 },            // left billboard
  { x: 78, y: 46, size: 150, color: CYAN, kind: "pulse", d: 5, delay: 1.5 },  // robot billboard
  { x: 62, y: 38, size: 80, color: CYAN, kind: "pulse", d: 3.8, delay: 0.5 },
  { x: 49, y: 71, size: 170, color: CYAN, kind: "pulse", d: 6 },              // laptop
  { x: 90, y: 62, size: 200, color: CYAN, kind: "pulse", d: 7, delay: 2 },    // monitor
  { x: 40.5, y: 82, size: 50, color: LIME, kind: "blink", d: 5, delay: 1 },   // mugs
  { x: 91.5, y: 83, size: 50, color: LIME, kind: "blink", d: 6 },
];

type Strip = { x: number; y: number; w: number; h: number; color: string; rot?: number; d?: number; delay?: number; kind: "flicker" | "blink" | "pulse" };
const strips: Strip[] = [
  { x: 22.4, y: 49, w: 0.28, h: 5, color: LIME, kind: "flicker", d: 8 },
  { x: 31.6, y: 32, w: 0.28, h: 14, color: LIME, kind: "flicker", d: 11, delay: 2 },
  { x: 13, y: 44, w: 0.3, h: 12, color: LIME, kind: "blink", d: 7 },
  { x: 22.7, y: 6, w: 0.22, h: 18, color: CYAN, kind: "pulse", d: 5 },
  { x: 28, y: 78, w: 10, h: 0.5, color: LIME, kind: "pulse", d: 4 },
  { x: 52, y: 95.6, w: 7, h: 0.5, color: LIME, kind: "flicker", d: 9, delay: 3 },
  { x: 88, y: 7, w: 16, h: 0.6, color: LIME, rot: -4, kind: "pulse", d: 6 },
  { x: 86, y: 45, w: 8, h: 0.6, color: LIME, rot: 14, kind: "flicker", d: 12, delay: 4 },
  { x: 94, y: 91, w: 12, h: 0.6, color: LIME, kind: "pulse", d: 5, delay: 1 },
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
  color: ["255,255,255", LIME, CYAN][Math.floor(rand() * 3)],
  d: 1.6 + rand() * 4,
  delay: rand() * 5,
})).filter(({ x, y }) => ((x - 70) / 6) ** 2 + ((y - 58) / 10) ** 2 > 1);

const cls = { pulse: "light-pulse", flicker: "light-flicker", blink: "light-blink" } as const;
const vars = (d?: number, delay?: number): CSSProperties =>
  ({ "--d": `${d ?? 3}s`, "--delay": `${delay ?? 0}s` }) as CSSProperties;

/** Extra ships streaking across the sky on top of the ones painted in the artwork. */
function Streaks() {
  const lanes = [
    { y: 14, dur: 9, delay: 1, w: 120 },
    { y: 31, dur: 12, delay: 5, w: 90 },
    { y: 44, dur: 10, delay: 8, w: 140 },
  ];
  return (
    <div className="absolute overflow-hidden" style={{ left: "32%", top: "6%", width: "42%", height: "50%" }}>
      {lanes.map((l, i) => (
        <motion.div
          key={i}
          className="absolute h-[2px] rounded-full"
          style={{
            top: `${l.y}%`,
            width: l.w,
            background: "linear-gradient(to left, rgba(0,240,255,0.95), rgba(0,240,255,0))",
            boxShadow: "0 0 10px rgba(0,240,255,0.9)",
          }}
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 900, opacity: [0, 1, 1, 0] }}
          transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, repeatDelay: 6 + i * 3, ease: "linear" }}
        />
      ))}
    </div>
  );
}

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

      {strips.map((s, i) => (
        <span
          key={`s${i}`}
          className={`absolute rounded-full ${cls[s.kind]}`}
          style={{
            ...vars(s.d, s.delay),
            left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.w}%`, height: `${s.h}%`,
            transform: `translate(-50%, -50%) rotate(${s.rot ?? 0}deg)`,
            background: `rgb(${s.color})`,
            boxShadow: `0 0 12px 2px rgba(${s.color},0.8), 0 0 36px 8px rgba(${s.color},0.35)`,
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

      <Streaks />
    </div>
  );
}