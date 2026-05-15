"use client";

import { useCallback, useRef } from "react";

interface FooterProps {
    activeId: string;
    onNavigate: (id: string) => void;
}

export default function Footer({ activeId, onNavigate }: FooterProps) {

    const scrollRef = useRef<HTMLDivElement>(null);

    /* ── Scroll to section via the SPA scroll container ── */
    const scrollToSection = useCallback((id: string) => {
        const el = document.getElementById(`spa-${id}`);
        if (!el) return;

        const lenis = (window as any).__lenis;
        if (lenis) {
            lenis.scrollTo(el.offsetTop, { duration: 1.5 });
        } else {
            const container = scrollRef.current;
            if (container) container.scrollTo({ top: el.offsetTop, behavior: "smooth" });
        }
    }, []);

    return (
        <footer
            className="relative w-full overflow-hidden md:ml-20 bg-[#0B0F11] md:px-15"
            style={{
                boxShadow: "0 -2px 20px rgba(255,214,0,0.08)",
                scrollSnapAlign: "start",
            }}
        >
            {/* Top neon line */}
            <div
                className="absolute top-0 left-0 w-full h-[1px]"
                style={{
                    background:
                        "linear-gradient(90deg, transparent, rgba(255,214,0,0.7), transparent)",
                }}
            />

            {/* Scanline overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
                }}
            />

            <div className="relative z-10 px-6 md:px-10 py-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    {/* Left */}
                    <div className="flex flex-col gap-2 md:w-auto w-full">
                        {/* Logo */}
                        <div className="mb-8 flex items-center justify-center md:justify-start">
                            <div
                                className="relative flex items-center justify-center w-12 h-12 rounded-sm overflow-hidden"
                                style={{
                                    background: "rgba(0,240,255,0.08)",
                                    border: "1px solid rgba(0,240,255,0.4)",
                                    boxShadow: "0 0 15px rgba(0,240,255,0.2)",
                                }}
                            >
                                <img src="/assets/images/logo.png" alt="AR" className="w-full h-full object-contain p-1" />
                            </div>
                        </div>

                        <p
                            className="font-orbitron text-[#58657A] md:text-left text-center w-full"
                            style={{
                                fontSize: "0.55rem",
                                letterSpacing: "0.18em",
                            }}
                        >
                            © 2026 AR_SYSTEM // NEURAL_V.01
                        </p>
                    </div>

                    {/* Center */}
                    <div className="flex flex-col items-center text-center">
                        <h3
                            className="font-orbitron text-[#FFD600] uppercase"
                            style={{
                                fontSize: "1rem",
                                letterSpacing: "0.45em",
                                textShadow: "0 0 10px rgba(255,214,0,0.45)",
                            }}
                        >
                            // CODE. CREATE. EVOLVE. //
                        </h3>

                        <div className="flex flex-wrap justify-center gap-6 mt-5">
                            {[
                                { id: "about", label: "KNOW_ME" },
                                { id: "projects", label: "SHOWCASE" },
                                { id: "achievements", label: "EXPERIENCE" },
                                { id: "games", label: "GAME_ZONE" },
                                { id: "contact", label: "CONNECTION" },
                            ].map((item) => (
                                <span
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="font-orbitron text-[#58657A] transition-all duration-300 hover:text-[#00F0FF] cursor-pointer"
                                    style={{
                                        fontSize: "0.58rem",
                                        letterSpacing: "0.18em",
                                    }}
                                >
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col md:items-end items-center gap-2 md:w-auto w-full">
                        {/* Bars */}
                        <div className="flex items-end gap-[4px]">
                            {[18, 24, 14, 28].map((h, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: "4px",
                                        height: `${h}px`,
                                        background: "#FFD600",
                                        boxShadow: "0 0 8px rgba(255,214,0,0.7)",
                                    }}
                                />
                            ))}
                        </div>

                        <span
                            className="font-orbitron text-[#7A6E1B] "
                            style={{
                                fontSize: "0.45rem",
                                letterSpacing: "0.15em",
                            }}
                        >
                            QUANTUM_ENCRYPTION : ACTIVE
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom corner line */}
            <div
                className="absolute bottom-0 left-0 w-full h-[1px]"
                style={{
                    background:
                        "linear-gradient(90deg, rgba(0,240,255,0.4), transparent)",
                }}
            />
        </footer>
    );
}