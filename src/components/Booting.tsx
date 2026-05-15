"use client";

import { useEffect, useState, useRef } from "react";

const LOG_ENTRIES = [
    "> Initializing portfolio interface...",
    "> Loading full stack modules...",
    "> Syncing AI development systems...",
    "> Deploying interactive experiences...",
    "> Connecting gaming universe...",
    "> Portfolio authentication successful...",
];

const PROGRESS_STEPS = [
    { pct: 8, label: "SYSTEM_BOOT" },
    { pct: 18, label: "LOADING_UI_CORE" },
    { pct: 32, label: "INITIALIZING_FULLSTACK" },
    { pct: 47, label: "SYNCING_AI_MODULES" },
    { pct: 61, label: "LOADING_PROJECTS" },
    { pct: 74, label: "CONNECTING_GAME_ZONE" },
    { pct: 88, label: "VERIFYING_NETWORK" },
    { pct: 100, label: "PORTFOLIO_READY" },
];

const TOTAL_SEGMENTS = 28;

interface BootingProps {
    onComplete?: () => void;
    /** Total duration of the boot sequence in ms (default 4000) */
    duration?: number;
}

export default function Booting({ onComplete, duration = 4000 }: BootingProps) {
    const [progress, setProgress] = useState(0);
    const [logLines, setLogLines] = useState<string[]>([]);
    const [stepLabel, setStepLabel] = useState(PROGRESS_STEPS[0].label);
    const [done, setDone] = useState(false);
    const [visible, setVisible] = useState(true);
    const rafRef = useRef<number | null>(null);
    const startRef = useRef<number | null>(null);
    const logTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
const audioRef = useRef<HTMLAudioElement | null>(null);
    const playedRef = useRef(false);

    useEffect(() => {
        if (playedRef.current) return;
        
        const audio = new Audio("/assets/audios/booting.opus");
        audio.volume = 0.5;
        
        const tryPlay = async () => {
            if (playedRef.current) return;
            try {
                await audio.play();
                playedRef.current = true;
            } catch {
                document.addEventListener("click", () => {
                    if (!playedRef.current) {
                        audio.play().then(() => { playedRef.current = true; });
                    }
                }, { once: true });
            }
        };
        
        setTimeout(tryPlay, 100);
        audioRef.current = audio;
        
        return () => {
            audio.pause();
            audio.src = "";
            document.removeEventListener("click", () => {});
        };
    }, []);

    /* ── Animate progress bar ── */
    useEffect(() => {
        const animate = (ts: number) => {
            if (!startRef.current) startRef.current = ts;
            const elapsed = ts - startRef.current;
            const raw = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - raw, 3);
            const pct = Math.round(eased * 100);

            setProgress(pct);

            // Update step label
            const step = [...PROGRESS_STEPS].reverse().find((s) => pct >= s.pct);
            if (step) setStepLabel(step.label);

            if (raw < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setProgress(100);
                setDone(true);
                audioRef.current?.pause();
                setTimeout(() => {
                    setVisible(false);
                    onComplete?.();
                }, 800);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        // return () => {
        //     if (rafRef.current) cancelAnimationFrame(rafRef.current);
        // };
    }, [duration, onComplete]);

    /* ── Stagger log lines ── */
    useEffect(() => {
        LOG_ENTRIES.forEach((entry, i) => {
            const t = setTimeout(
                () => setLogLines((prev) => [...prev, entry]),
                (duration / (LOG_ENTRIES.length + 1)) * (i + 1)
            );
            logTimersRef.current.push(t);
        });
        return () => logTimersRef.current.forEach(clearTimeout);
    }, [duration]);

    const filledSegments = Math.round((progress / 100) * TOTAL_SEGMENTS);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-700 ${done ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
            style={{
                backgroundColor: "#0b0f11",
                backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(0,238,252,0.05) 0%, transparent 70%),
          linear-gradient(rgba(17,20,22,0.97) 2px, transparent 2px),
          linear-gradient(90deg, rgba(17,20,22,0.97) 2px, transparent 2px)
        `,
                backgroundSize: "100% 100%, 40px 40px, 40px 40px",
                overflow: "hidden",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <style>{`
        @keyframes hud-ping {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1);   opacity: 0; }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 0.6; }
        }
        @keyframes scanline-scroll {
          0%   { background-position: 0 0; }
          100% { background-position: 0 100vh; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .glow-cyan  { text-shadow: 0 0 10px rgba(0,238,252,0.8), 0 0 20px rgba(0,238,252,0.4); }
        .glow-yellow{ text-shadow: 0 0 15px rgba(253,228,0,0.6), 0 0 30px rgba(253,228,0,0.3); }

        .border-glow-cyan {
          box-shadow: 0 0 10px rgba(0,238,252,0.2), inset 0 0 10px rgba(0,238,252,0.1);
        }

        .clip-hud {
          clip-path: polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%);
        }

        .ping-ring {
          animation: hud-ping 2s cubic-bezier(0,0,0.2,1) infinite;
        }
        .pulse-ring {
          animation: pulse-ring 2s ease-in-out infinite;
        }
        .log-line {
          animation: fade-in-up 0.3s ease forwards;
        }
        .cursor-blink {
          animation: blink 1s step-end infinite;
        }

        .scanline-overlay {
          background:
            linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.10) 50%),
            linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.01), rgba(0,0,255,0.03));
          background-size: 100% 4px, 3px 100%;
        }
      `}</style>

            {/* ══ SCANLINE OVERLAY ══ */}
            <div className="scanline-overlay pointer-events-none fixed inset-0 z-50" />

            {/* ══ DECORATIVE RINGS ══ */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <div
                    className="pulse-ring absolute rounded-full border"
                    style={{
                        width: 600,
                        height: 600,
                        borderColor: "rgba(0,238,252,0.20)",
                    }}
                />
                <div
                    className="absolute rounded-full border"
                    style={{
                        width: 800,
                        height: 800,
                        borderColor: "rgba(0,238,252,0.08)",
                    }}
                />
                {/* Corner coords */}
                <div
                    className="absolute top-10 right-10 text-right leading-tight"
                    style={{
                        fontSize: 10,
                        fontFamily: "monospace",
                        color: "rgba(0,238,252,0.30)",
                    }}
                >


                    ROLE: FULL STACK + AI DEVELOPER<br />
                    STACK: NEXTJS / REACT / AI SYSTEMS<br />
                    STATUS: ONLINE
                </div>
            </div>

            {/* ══ CORNER ACCENTS ══ */}
            {[
                "top-6 left-6 border-t-2 border-l-2",
                "top-6 right-6 border-t-2 border-r-2",
                "bottom-6 left-6 border-b-2 border-l-2",
                "bottom-6 right-6 border-b-2 border-r-2",
            ].map((cls, i) => (
                <div
                    key={i}
                    className={`absolute w-5 h-5 ${cls}`}
                    style={{ borderColor: "rgba(0,238,252,0.30)" }}
                />
            ))}

            {/* ══ SYSTEM LOG (left) ══ */}
            <div
                className="absolute left-8 bottom-32 w-80 p-5 border hidden lg:block"
                style={{
                    borderColor: "rgba(0,238,252,0.20)",
                    backgroundColor: "rgba(11,15,17,0.70)",
                    backdropFilter: "blur(4px)",
                }}
            >
                <h4
                    className="pb-2 mb-4 text-xs tracking-widest uppercase border-b"
                    style={{
                        color: "rgba(0,238,252,0.80)",
                        borderColor: "rgba(0,238,252,0.20)",
                        letterSpacing: "0.15em",
                        fontWeight: 600,
                    }}
                >
                    SYSTEM LOG
                </h4>
                <ul className="space-y-2" style={{ fontFamily: "monospace", fontSize: 11 }}>
                    {logLines.map((line, i) => (
                        <li
                            key={i}
                            className="log-line flex justify-between gap-2"
                            style={{ color: "rgba(0,238,252,0.80)" }}
                        >
                            <span>{line}</span>
                            <span style={{ color: "#00eefc" }}>[ OK ]</span>
                        </li>
                    ))}
                    {logLines.length < LOG_ENTRIES.length && (
                        <li style={{ color: "rgba(0,238,252,0.50)", fontSize: 10 }}>
                            <span className="cursor-blink">▋</span>
                        </li>
                    )}
                    {logLines.length === LOG_ENTRIES.length && (
                        <li
                            className="log-line mt-1"
                            style={{ color: "#fde400", fontWeight: 600 }}
                        >
                            &gt; Welcome back, User.
                        </li>
                    )}
                </ul>
            </div>

            {/* ══ SYSTEM STATUS (right) ══ */}
            <div
                className="absolute right-8 top-28 w-72 p-5 border hidden lg:block"
                style={{
                    borderColor: "rgba(0,238,252,0.20)",
                    backgroundColor: "rgba(11,15,17,0.70)",
                    backdropFilter: "blur(4px)",
                }}
            >
                <h4
                    className="pb-2 mb-4 text-xs tracking-widest uppercase border-b"
                    style={{
                        color: "rgba(0,238,252,0.80)",
                        borderColor: "rgba(0,238,252,0.20)",
                        letterSpacing: "0.15em",
                        fontWeight: 600,
                    }}
                >
                    SYSTEM STATUS
                </h4>
                <div className="space-y-3">
                    {[
                        { label: "FRONTEND", value: "ACTIVE", color: "#fde400" },
                        { label: "BACKEND", value: "ONLINE", color: "#00eefc" },
                        { label: "AI_SYSTEMS", value: "READY", color: "#fde400" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="flex items-center gap-3">
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                            />
                            <span style={{ fontSize: 11, color: "rgba(0,238,252,0.50)", letterSpacing: "0.08em" }}>
                                {label}
                            </span>
                            <span
                                className="ml-auto"
                                style={{ fontFamily: "monospace", fontSize: 11, color }}
                            >
                                {value}
                            </span>
                        </div>
                    ))}

                    <div
                        className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t"
                        style={{ borderColor: "rgba(0,238,252,0.10)" }}
                    >
                        {[
                            { key: "MEMORY", val: `${Math.min(progress, 64)}%` },
                            { key: "CPU", val: `${Math.min(Math.round(progress * 0.28), 28)}%` },
                        ].map(({ key, val }) => (
                            <div key={key}>
                                <p style={{ fontSize: 9, color: "rgba(0,238,252,0.35)" }}>{key}</p>
                                <p style={{ fontFamily: "monospace", fontSize: 12, color: "#fde400" }}>{val}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ CENTRAL UNIT ══ */}
            <div className="z-10 text-center w-full max-w-2xl px-6">
                {/* Sub-label */}
                <p
                    className="mb-4 glow-cyan"
                    style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 12,
                        letterSpacing: "0.4em",
                        fontWeight: 600,
                        color: "#00eefc",
                    }}
                >
          // INITIALIZING PORTFOLIO //
                </p>

                {/* Big title with HUD brackets */}
                <div className="relative inline-block mb-2">
                    <h1
                        className="glow-yellow select-none glitch-heading"
                        style={{
                            fontSize: "clamp(52px, 10vw, 80px)",
                            fontWeight: 900,
                            color: "#fde400",
                            lineHeight: 1.05,
                            letterSpacing: "-0.04em",
                        }}
                    >
                        AR_NEURAL_CORE
                    </h1>
                    <p
                        className="font-orbitron"
                        style={{
                            // fontFamily: "font-orbitron",
                            fontSize: 12,
                            letterSpacing: "0.6em",
                            fontWeight: 600,
                            color: "#00eefc",
                            marginTop: 8,
                        }}
                    >
                        FULL STACK // AI ENGINEER
                    </p>

                    {/* HUD corner brackets */}
                    {[
                        "-top-4 -left-8 border-t-2 border-l-2",
                        "-top-4 -right-8 border-t-2 border-r-2",
                        "-bottom-4 -left-8 border-b-2 border-l-2",
                        "-bottom-4 -right-8 border-b-2 border-r-2",
                    ].map((cls, i) => (
                        <div
                            key={i}
                            className={`absolute w-8 h-8 ${cls}`}
                            style={{ borderColor: "#fde400" }}
                        />
                    ))}
                </div>

                {/* Progress block */}
                <div
                    className="border-glow-cyan mx-auto mt-12 p-6 border overflow-hidden"
                    style={{
                        maxWidth: 480,
                        borderColor: "rgba(0,238,252,0.30)",
                        backgroundColor: "rgba(25,28,30,0.50)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <div className="flex justify-between items-end mb-4">
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                letterSpacing: "0.12em",
                                color: "#fde400",
                                textTransform: "uppercase",
                            }}
                        >
                            {stepLabel}
                        </span>
                        <span
                            className="glow-cyan"
                            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, fontWeight: 700, color: "#00eefc" }}
                        >
                            {progress}%
                        </span>
                    </div>

                    {/* Segmented bar — skewed parallelogram segments */}
                    <div style={{ overflow: "hidden", borderRadius: 2 }}>
                        <div className="flex items-center" style={{ height: 28, gap: 3, paddingLeft: 10, paddingRight: 10 }}>
                            {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => {
                                const isLeading = i === filledSegments - 1 && progress < 100;
                                const isFilled = i < filledSegments;
                                return (
                                    <div
                                        key={i}
                                        className="transition-all duration-100"
                                        style={{
                                            flex: "1 1 0",
                                            minWidth: 0,
                                            height: 28,
                                            transform: "skewX(-18deg)",
                                            ...(isLeading
                                                ? {
                                                    backgroundColor: "#00eefc",
                                                    boxShadow: "0 0 10px rgba(0,238,252,1), 0 0 4px rgba(0,238,252,1)",
                                                }
                                                : isFilled
                                                    ? {
                                                        backgroundColor: "#fde400",
                                                        boxShadow: "0 0 4px rgba(253,228,0,0.4)",
                                                    }
                                                    : {
                                                        backgroundColor: "rgba(253,228,0,0.07)",
                                                        border: "1px solid rgba(253,228,0,0.18)",
                                                    }),
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <p
                        style={{
                            marginTop: 12,
                            fontSize: 11,
                            fontFamily: "monospace",
                            letterSpacing: "0.15em",
                            color: "rgba(0,238,252,0.50)",
                            textAlign: "left",
                        }}
                    >
                        {progress < 100 ? "INITIALIZING EXPERIENCE..." : "PORTFOLIO READY ✓"}
                    </p>
                </div>
            </div>

            {/* ══ BOTTOM BAR ══ */}
            <div className="absolute bottom-8 left-0 w-full px-8 flex justify-between items-end">
                {/* Globe uplink */}
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                        <div
                            className="ping-ring absolute inset-0 rounded-full border"
                            style={{ borderColor: "rgba(0,238,252,0.40)" }}
                        />
                        {/* SVG globe stand-in */}
                        <svg viewBox="0 0 64 64" className="w-full h-full opacity-60">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="#00eefc" strokeWidth="1" />
                            <ellipse cx="32" cy="32" rx="14" ry="28" fill="none" stroke="#00eefc" strokeWidth="0.8" />
                            <ellipse cx="32" cy="32" rx="28" ry="10" fill="none" stroke="#00eefc" strokeWidth="0.8" />
                            <line x1="4" y1="32" x2="60" y2="32" stroke="#00eefc" strokeWidth="0.5" />
                            <line x1="32" y1="4" x2="32" y2="60" stroke="#00eefc" strokeWidth="0.5" />
                        </svg>
                    </div>
                    <div>
                        <h5 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#fde400" }}>
                            CONNECTED TO DEV_NETWORK
                        </h5>
                        <div className="flex gap-1 mt-1">
                            <div style={{ width: 16, height: 4, backgroundColor: "#fde400" }} />
                            <div style={{ width: 16, height: 4, backgroundColor: "rgba(253,228,0,0.4)" }} />
                            <div style={{ width: 16, height: 4, backgroundColor: "rgba(253,228,0,0.2)" }} />
                        </div>
                    </div>
                </div>

                {/* Quote */}
                <div className="text-center pb-1 hidden sm:block">
                    <p
                        style={{
                            fontFamily: "'Orbitron', sans-serif",
                            fontWeight: 800,
                            fontSize: 10,
                            letterSpacing: "0.5em",
                            color: "rgba(253,228,0,0.50)",
                        }}
                    >
            // "CODE. CREATE. EVOLVE." //
                    </p>
                </div>

                {/* Data stream bars */}
                <div
                    className="p-3 border hidden xl:block"
                    style={{
                        width: 240,
                        borderColor: "rgba(0,238,252,0.20)",
                        backgroundColor: "rgba(11,15,17,0.50)",
                    }}
                >
                    <p
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.12em",
                            fontWeight: 600,
                            color: "rgba(0,238,252,0.70)",
                            marginBottom: 6,
                        }}
                    >
                        DATA STREAM
                    </p>
                    <div className="flex items-end gap-0.5 h-10">
                        {[20, 45, 70, 15, 90, 55, 35, 65, 10, 85, 40, 75].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 transition-all duration-300"
                                style={{
                                    height: `${h}%`,
                                    backgroundColor:
                                        i === 4 || i === 9 ? "#fde400" : `rgba(0,238,252,${0.3 + (h / 100) * 0.7})`,
                                }}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <span
                            className="rounded-full"
                            style={{ width: 6, height: 6, backgroundColor: "#fde400", boxShadow: "0 0 6px #fde400" }}
                        />
                        <span style={{ fontSize: 9, fontFamily: "monospace", color: "rgba(0,238,252,0.50)" }}>
                            UPLINK STABLE
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}