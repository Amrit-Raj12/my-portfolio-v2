"use client";

import React, { useEffect, useRef, useState, type MutableRefObject } from "react";
import Image from "next/image";
import { useMouse } from "@/hooks/use-mouse";
import { cn } from "../../lib/utils";

function useTypingEffect(text: string, speed = 55, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    const timer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [text, speed, startDelay]);
  return displayed;
}

function StatOverlayCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div
      className="backdrop-blur-md w-full md:w-auto"
      style={{
        background: "rgba(6,9,13,0.88)",
        border: "1.5px solid rgba(255,214,0,0.6)",
        borderRadius: "4px",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        minWidth: "200px",
        boxShadow: "0 0 20px rgba(255,214,0,0.15), inset 0 0 10px rgba(255,214,0,0.05)",
      }}
    >
      <div>
        <p style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.55rem", color: "#7AA2B8", letterSpacing: "0.2em", marginBottom: "4px", textTransform: "uppercase" }}>
          {label}
        </p>
        <p style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#FFD600", letterSpacing: "0.08em", textShadow: "0 0 12px rgba(255,214,0,0.5)" }}>
          {value}
        </p>
      </div>
      <div style={{ width: 40, height: 40, border: "1px solid rgba(255,214,0,0.3)", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFD600", flexShrink: 0, background: "rgba(255,214,0,0.05)" }}>
        {icon}
      </div>
    </div>
  );
}

// ── Interactive Dots canvas ───────────────────────────────────────────────────
// mousePosRef carries { x, y } relative to the panel — fed by useMouse so we
// don't duplicate event listeners. The canvas only owns click-ripple events.
function RightPanelDots({
  mousePosRef,
  addRippleRef,
}: {
  mousePosRef: MutableRefObject<{ x: number; y: number }>;
  addRippleRef: MutableRefObject<(x: number, y: number) => void>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const GRID = 32;
    const R = 255, G = 214, B = 0; // neon yellow #FFD600

    let time = 0;
    let rafId: number = 0;
    const ripples: Array<{ x: number; y: number; time: number; intensity: number }> = [];
    let dots: Array<{ originalX: number; originalY: number; phase: number }> = [];

    function initDots() {
      const W = canvas!.clientWidth;
      const H = canvas!.clientHeight;
      dots = [];
      for (let x = GRID / 2; x < W; x += GRID)
        for (let y = GRID / 2; y < H; y += GRID)
          dots.push({ originalX: x, originalY: y, phase: Math.random() * Math.PI * 2 });
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = canvas!.clientWidth * dpr;
      canvas!.height = canvas!.clientHeight * dpr;
      const ctx = canvas!.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      initDots();
    }

    function getMouseInfluence(x: number, y: number) {
      // read fresh coords from the ref every frame — no stale closure
      const mx = mousePosRef.current?.x ?? -9999;
      const my = mousePosRef.current?.y ?? -9999;
      const dx = x - mx, dy = y - my;
      return Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 160);
    }

    function getRippleInfluence(x: number, y: number, now: number) {
      let total = 0;
      for (const r of ripples) {
        const age = now - r.time;
        if (age >= 2800) continue;
        const dx = x - r.x, dy = y - r.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = (age / 2800) * 320;
        const width = 55;
        if (Math.abs(dist - radius) < width)
          total += (1 - age / 2800) * r.intensity * (1 - Math.abs(dist - radius) / width);
      }
      return Math.min(total, 2);
    }

    function animate() {
      const ctx = canvas!.getContext("2d");
      if (!ctx) return;

      time += 0.004;
      const now = Date.now();
      const W = canvas!.clientWidth;
      const H = canvas!.clientHeight;

      ctx.clearRect(0, 0, W, H);

      for (const dot of dots) {
        const mi = getMouseInfluence(dot.originalX, dot.originalY);
        const ri = getRippleInfluence(dot.originalX, dot.originalY, now);
        const influence = mi + ri;

        const size = 1.5 + influence * 5 + Math.sin(time + dot.phase) * 0.4;
        const opacity = Math.max(0.12, 0.22 + influence * 0.65 + Math.abs(Math.sin(time * 0.5 + dot.phase)) * 0.08);

        ctx.beginPath();
        ctx.arc(dot.originalX, dot.originalY, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${R},${G},${B},${opacity})`;
        ctx.fill();

        if (influence > 0.3) {
          ctx.beginPath();
          ctx.arc(dot.originalX, dot.originalY, size + 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${R},${G},${B},${influence * 0.12})`;
          ctx.fill();
        }
      }

      // prune expired ripples
      const cutoff = now - 2800;
      while (ripples.length && ripples[0].time < cutoff) ripples.shift();

      rafId = requestAnimationFrame(animate);
    }

    // Expose addRipple so the panel wrapper (which sits above all z-layers) can call it
    addRippleRef.current = (x: number, y: number) => {
      ripples.push({ x, y, time: Date.now(), intensity: 2 });
    };

    const onResize = () => resize();

    resize();
    animate();

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [mousePosRef, addRippleRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
      style={{ zIndex: 1 }}
    />
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function HomeSection() {
  const typedBio = useTypingEffect("I design and code simple yet beautiful websites.", 55, 900);

  // useMouse tracks position relative to the element its ref is attached to.
  // We bridge the state into a plain ref so the canvas loop reads it each frame
  // without triggering any re-renders.
  const [mouseState, mouseTargetRef] = useMouse();
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  mousePosRef.current = {
    x: mouseState.elementX ?? -9999,
    y: mouseState.elementY ?? -9999,
  };
  const addRippleRef = useRef<(x: number, y: number) => void>(() => { });

  return (
    <div className="w-full h-screen relative overflow-hidden" style={{ background: "#06090D" }}>
      <style>{`
        @keyframes neonPulse {
          0%,100% { box-shadow: 0 0 10px rgba(0,240,255,0.2), 0 0 25px rgba(0,240,255,0.05); }
          50%      { box-shadow: 0 0 20px rgba(0,240,255,0.5), 0 0 45px rgba(0,240,255,0.15); }
        }
        @keyframes cursorBlink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        .home-cursor {
          display: inline-block; width: 10px; height: 18px;
          background: #00F0FF; margin-left: 4px;
          vertical-align: middle;
          animation: cursorBlink 1s step-end infinite;
          box-shadow: 0 0 8px #00F0FF;
        }
        .id-tag-v { writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); }
      `}</style>

      {/* Scanlines */}
      <div className="pointer-events-none absolute inset-0 z-[1]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)" }} />

      <div className="flex flex-col md:flex-row w-full h-full">
        {/* LEFT — Text Content (unchanged) */}
        <div className="w-full md:w-[45%] h-auto md:h-full flex flex-col justify-center gap-[10px] relative z-10 px-6 md:px-14 pt-20 md:pt-0">
          <div className="absolute top-8 left-4 md:left-0">
            <span className="font-orbitron text-[0.55rem] text-neon-cyan/40 tracking-[0.25em]">
              {"// USER_PROFILE ····"}
            </span>
          </div>

          <p className="font-orbitron text-[0.7rem] text-text-muted tracking-[0.25em]">{"// ABOUT ME"}</p>

          <div className="space-y-[10px] mb-4">
            <h1 className="font-scary text-[#FFD600] text-4xl md:text-6xl tracking-tight leading-none" style={{ textShadow: "0 0 20px rgba(255,214,0,0.5)" }}>
              HI, I AM
            </h1>
            <h1 className="font-scary text-neon-cyan text-7xl md:text-8xl tracking-wider leading-none glitch-wrapper" data-text="AMRIT RAJ" style={{ textShadow: "0 0 30px rgba(0,240,255,0.6)" }}>
              AMRIT RAJ
            </h1>
          </div>

          <div className="inline-flex items-center border border-neon-cyan bg-neon-cyan/5 px-6 py-2.5 self-start animate-[neonPulse_3s_ease-in-out_infinite] mb-4">
            <span className="font-orbitron text-text-primary text-[0.85rem] font-bold tracking-[0.2em] text-glow-cyan">
              MERN STACK DEVELOPER
            </span>
          </div>

          <div className="max-w-[600px] mb-4">
            <p className="font-inter text-[#7AA2B8] text-[1.1rem] leading-relaxed tracking-wide">
              {typedBio}<span className="home-cursor" />
            </p>
          </div>

          <a
            href="https://drive.google.com/file/d/10N-LgO23dwTQHsaJjA_Gd9pOkGa3r5Gk/view"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex w-fit items-center justify-center bg-[#06090D] font-orbitron text-[0.75rem] tracking-[0.2em] font-bold text-neon-yellow overflow-hidden"
            style={{ padding: "16px 20px" }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 70" preserveAspectRatio="none">
              <rect x="2" y="2" width="296" height="66" rx="6" fill="none" stroke="#00F0FF" strokeWidth="2" strokeDasharray="10 6" className="opacity-70" />
            </svg>
            <span className="relative z-10 flex items-center gap-3">
              DOWNLOAD RESUME
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-neon-yellow transition-transform duration-300 group-hover:translate-y-1">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </span>
          </a>
        </div>

        {/* RIGHT — Profile Panel */}
        <div
          ref={mouseTargetRef}
          className={cn(
            "flex-1 w-full min-h-[500px] md:h-full relative overflow-hidden",
            "border-t md:border-t-0 md:border-l border-neon-yellow/10",
            "shadow-[-8px_0_25px_rgba(255,214,0,0.25)] mt-6 md:mt-0 hidden md:block"
          )}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            addRippleRef.current(e.clientX - rect.left, e.clientY - rect.top);
          }}
        >

          {/* ── Layer 0: solid base background ── */}
          <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, #1a1400 0%, #0d0a00 35%, #06090D 100%)" }} />

          {/* ── Layer 1: Interactive Dots canvas ── */}
          <RightPanelDots mousePosRef={mousePosRef} addRippleRef={addRippleRef} />

          {/* ── Layer 2: original decorative overlays (z-index raised by 1) ── */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ zIndex: 2, backgroundImage: "linear-gradient(var(--neon-yellow) 1px, transparent 1px), linear-gradient(90deg, var(--neon-yellow) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ zIndex: 2, background: "radial-gradient(circle at 50% 50%, rgba(255,214,0,0.25) 0%, transparent 70%)" }} />

          {/* Status bar */}
          <div className="absolute top-8 right-18 flex items-center gap-4" style={{ zIndex: 10 }}>
            <span className="font-orbitron text-[0.55rem] text-text-muted tracking-widest uppercase">STATUS</span>
            <div className="w-16 h-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_#00F0FF]" />
              <span className="font-orbitron text-[0.6rem] text-neon-cyan tracking-widest font-bold">ONLINE</span>
            </div>
          </div>

          {/* Vertical ID Tag */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-10" style={{ zIndex: 10 }}>
            <div className="bg-[#06090D]/80 border border-neon-yellow/40 p-3 rounded-sm backdrop-blur-md">
              <span className="id-tag-v font-orbitron text-[0.65rem] text-neon-yellow tracking-[0.2em] font-bold">AR_12_24_1997</span>
            </div>
            <div className="w-10 h-10 border border-neon-yellow/30 bg-[repeating-linear-gradient(45deg,rgba(255,214,0,0.1),rgba(255,214,0,0.1)_2px,transparent_2px,transparent_8px)]" />
          </div>

          {/* Profile image in triangle */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 5 }}>
            <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 opacity-40 md:opacity-100"
                style={{ clipPath: "polygon(50% 10%, 0% 90%, 100% 90%)", border: "2px solid rgba(255,214,0,0.8)", background: "linear-gradient(180deg, rgba(255,214,0,0.15) 0%, transparent 100%)", filter: "drop-shadow(0 0 15px rgba(255,214,0,0.5))" }} />
              <div className="relative w-[250px] h-[250px] md:w-[500px] md:h-[500px] mt-[-20px] md:mt-[40px]">
                <Image src="/assets/images/my-dp.webp" alt="Amrit Raj" fill sizes="400px" className="object-contain object-bottom" style={{ filter: "drop-shadow(0 0 40px rgba(255,214,0,0.3))" }} priority />
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="absolute bottom-10 md:bottom-20 left-6 right-6 md:left-auto md:right-16 flex flex-col gap-3" style={{ zIndex: 10 }}>
            <StatOverlayCard label="LOCATION" value="INDIA" icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
            } />
            <StatOverlayCard label="EXPERIENCE" value="4+ YEARS" icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            } />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => {
          const nextSection = document.getElementById("spa-about");
          if (nextSection) {
            const lenis = (window as any).__lenis;
            if (lenis) {
              lenis.scrollTo(nextSection.offsetTop, { duration: 1.5 });
            } else {
              const container = document.getElementById("spa-scroll");
              if (container) {
                container.scrollTo({ top: nextSection.offsetTop, behavior: "smooth" });
              } else {
                window.scrollTo({ top: nextSection.offsetTop, behavior: "smooth" });
              }
            }
          }
        }}
        className="absolute right-[10px] bottom-35 md:bottom-0 md:right-auto md:left-[44.9%] md:-translate-x-[44.9%] z-20 flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="flex flex-col items-center gap-2">
          <span
            className="font-orbitron text-[0.6rem] tracking-[0.45em] text-[#FFD600]"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              textShadow: "0 0 10px rgba(255,214,0,0.7)",
            }}
          >
            SCROLL
          </span>

          <div className="w-[1px] h-10 bg-gradient-to-b from-[#FFD600] to-transparent" />

          <div
            className="w-5 h-9 rounded-full border border-[#FFD600]/70 flex justify-center pt-1 relative overflow-hidden"
            style={{
              boxShadow: "0 0 12px rgba(255,214,0,0.35)",
            }}
          >
            <div className="w-1 h-2 rounded-full bg-[#FFD600] animate-bounce mt-1" />
          </div>
        </div>
      </button>
    </div>
  );
}