"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NeonButton from "./NeonButton";

/* ── Floating particle canvas ─────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number; y: number;
      radius: number; speed: number;
      opacity: number; color: string;
    };

    const particles: Particle[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.4 + 0.15,
      opacity: Math.random() * 0.6 + 0.1,
      color: Math.random() > 0.55 ? "#00F0FF" : "#FFD600",
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color === "#00F0FF"
            ? `rgba(0,240,255,${p.opacity})`
            : `rgba(255,214,0,${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();

        p.y -= p.speed;
        if (p.y + p.radius < 0) {
          p.y = canvas.height + p.radius;
          p.x = Math.random() * canvas.width;
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 3 }}
    />
  );
}

/* ── Animated init text ───────────────────────────────────── */
function InitText() {
  return (
    <p
      className="cyber-heading"
      style={{
        fontSize: "0.75rem",
        color: "#00F0FF",
        opacity: 0.8,
        marginBottom: "1.5rem",
        textShadow: "0 0 8px rgba(0,240,255,0.6)",
      }}
    >
      {"// INIT SYSTEM..."}
    </p>
  );
}

/* ── System ready indicator ─────────────────────────────── */
function ScrollIndicator({ isMobile }: { isMobile?: boolean }) {
  const handleScrollDown = () => {
    const spaSection = document.getElementById("spa-home");
    if (spaSection) {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(spaSection.offsetTop, { duration: 1.5 });
      } else {
        const container = document.getElementById("spa-scroll");
        if (container) {
          container.scrollTo({ top: spaSection.offsetTop, behavior: "smooth" });
        } else {
          window.scrollTo({ top: spaSection.offsetTop, behavior: "smooth" });
        }
      }
    }
  };

  return (
    <button
      onClick={handleScrollDown}
      className={`absolute bottom-10 flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ${isMobile
        ? "left-1/2 -translate-x-1/2 mb-8"
        : "right-10"
        }`}
      style={{ zIndex: 10 }}
    >
      {/* Scanning line */}
      <div
        className="relative overflow-hidden"
        style={{
          width: "1px",
          height: "55px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,240,255,0.8) 50%, transparent 100%)",
          boxShadow: "0 0 10px rgba(0,240,255,0.7)",
        }}
      >
        <div
          className="absolute left-0 w-full h-5 animate-pulse"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(0,240,255,0.9), transparent)",
          }}
        />
      </div>

      {/* Core */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "26px",
          height: "26px",
          border: "1px solid rgba(0,240,255,0.6)",
          borderRadius: "50%",
          boxShadow:
            "0 0 15px rgba(0,240,255,0.5), inset 0 0 10px rgba(0,240,255,0.3)",
          background: "rgba(0,240,255,0.08)",
        }}
      >
        <div
          className="animate-ping absolute"
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#00F0FF",
          }}
        />

        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#00F0FF",
            boxShadow: "0 0 12px rgba(0,240,255,0.9)",
          }}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col items-center">
        <span
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "0.55rem",
            letterSpacing: "0.35em",
            color: "#00F0FF",
            textShadow: "0 0 8px rgba(0,240,255,0.8)",
          }}
        >
          SYSTEM
        </span>

        <span
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "0.5rem",
            letterSpacing: "0.3em",
            color: "#7AA2B8",
          }}
        >
          READY
        </span>
      </div>
    </button>
  );
}

/* ── Corner decorations ────────────────────────────────────── */
function CornerDecs() {
  return (
    <>
      {/* Top-left */}
      <div className="absolute top-6 left-6" style={{ zIndex: 10 }}>
        <div
          style={{
            width: 40, height: 40,
            borderTop: "2px solid rgba(0,240,255,0.6)",
            borderLeft: "2px solid rgba(0,240,255,0.6)",
            boxShadow: "-2px -2px 8px rgba(0,240,255,0.3)",
          }}
        />
      </div>
      {/* Bottom-left */}
      <div className="absolute bottom-6 left-6" style={{ zIndex: 10 }}>
        <div
          style={{
            width: 40, height: 40,
            borderBottom: "2px solid rgba(0,240,255,0.3)",
            borderLeft: "2px solid rgba(0,240,255,0.3)",
          }}
        />
      </div>
      {/* Top-right */}
      <div className="absolute top-6 right-6" style={{ zIndex: 10 }}>
        <div
          style={{
            width: 40, height: 40,
            borderTop: "2px solid rgba(255,214,0,0.3)",
            borderRight: "2px solid rgba(255,214,0,0.3)",
          }}
        />
      </div>
    </>
  );
}

/* ── HeroSection ──────────────────────────────────────────── */
export default function HeroSection({ launchHref, onLaunch }: { launchHref?: string; onLaunch?: () => void }) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [videoBlocked, setVideoBlocked] = useState(false);
  const [isBrave, setIsBrave] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const brave = / Brave\//.test(navigator.userAgent);
    setIsBrave(brave);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!mounted || !video) return;

    video.muted = true;

    const tryPlay = () => {
      video.play().catch((err) => {
        console.warn("Autoplay blocked by browser policy:", err);
        setVideoBlocked(true);
      });
    };

    video.load();

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    const handleCanPlayThrough = () => {
      video.play().catch(() => setVideoBlocked(true));
    };
    video.addEventListener("canplaythrough", handleCanPlayThrough, { once: true });

    return () => {
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [isMobile, mounted]);

  const handleVideoError = () => {
    setVideoBlocked(true);
  };

  const handleVideoLoaded = () => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => setVideoBlocked(true));
    }
  };

  // Ensure initial render matches server (isMobile = false)
  const effectiveIsMobile = mounted ? isMobile : false;

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.style.opacity = "1";
      videoRef.current.style.zIndex = "1";
      videoRef.current.play().catch(() => { });
    }
    setVideoBlocked(false);
    setIsBrave(false);
  };

  const showVideoFallback = mounted && (videoBlocked || isBrave);
  const videoOpacity = mounted ? (showVideoFallback ? 0 : 1) : 1;

  return (
    <section
      id="home" data-hero-section="true"
      className="relative w-full h-screen scanlines overflow-hidden"
      style={{ width: "100%", height: "100vh" }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: showVideoFallback ? 0 : 1, opacity: videoOpacity }}
        suppressHydrationWarning
        onLoadedData={handleVideoLoaded}
        onError={handleVideoError}
      >
        <source
          src={effectiveIsMobile ? "/assets/videos/bg_vr.webm" : "/assets/videos/bg-hr.webm"}
          type="video/webm"
        />
      </video>
      {showVideoFallback && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          style={{ zIndex: 5 }}
          onClick={handleManualPlay}
        >
          <div
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              color: "#00F0FF",
              textShadow: "0 0 10px rgba(0,240,255,0.8)",
              border: "1px solid rgba(0,240,255,0.4)",
              padding: "0.6rem 1.4rem",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              cursor: "pointer",
            }}
          >
            ▶ CLICK TO ENABLE VIDEO
          </div>
        </div>
      )}

      {/* Fallback background for Brave/blocked video */}
      {showVideoFallback && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background: "linear-gradient(135deg, #06090D 0%, #0B0F11 50%, #0D1113 100%)",
            zIndex: 0,
          }}
        />
      )}

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: showVideoFallback ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.62)",
          zIndex: 2,
        }}
      />

      {/* Neon gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 25% 50%, rgba(0,240,255,0.07) 0%, transparent 70%), " +
            "radial-gradient(ellipse 40% 50% at 10% 80%, rgba(255,214,0,0.05) 0%, transparent 60%)",
          zIndex: 2,
        }}
      />

      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Corner decorations */}
      <CornerDecs />

      {/* ── Main content ──────────────────────── */}
      <div
        className="absolute inset-0 flex flex-col justify-center items-center md:items-start text-center md:text-left"
        style={{
          zIndex: 10,
          paddingLeft: effectiveIsMobile ? "1.5rem" : "clamp(3rem, 8vw, 7rem)",
          paddingRight: effectiveIsMobile ? "1.5rem" : "1.5rem",
          paddingBottom: "2rem",
          maxWidth: effectiveIsMobile ? "100%" : "62%",
        }}
      >
        <InitText />

        {/* Heading */}
        <div className="mb-8">
          {/* Line 1 */}
          <div className="overflow-hidden mb-1">
            <h1
              className="glitch-wrapper cyber-skew glitch-heading"
              data-text="WELCOME TO MY"
              style={{
                fontSize: effectiveIsMobile ? "2.2rem" : "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 900,
                color: "#FFD600",
                lineHeight: 1.1,
                display: "block",
              }}
            >
              WELCOME TO MY
            </h1>
          </div>

          {/* Line 2 */}
          <div className="overflow-hidden">
            <h1
              className="glitch-wrapper cyber-skew glitch-heading "
              data-text="PORTFOLIO"
              style={{
                fontSize: effectiveIsMobile ? "3rem" : "clamp(5rem, 12vw, 10rem)",
                fontWeight: 900,
                color: "#00F0FF",
                lineHeight: 1.05,
                display: "block",
              }}
            >
              PORTFOLIO
            </h1>
          </div>
        </div>

        {/* Subtitle */}
        <p
          className="mb-10 mx-auto md:mx-0"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.95rem",
            color: "#7AA2B8",
            letterSpacing: "0.08em",
            maxWidth: effectiveIsMobile ? "300px" : "380px",
            lineHeight: 1.7,
          }}
        >
          Crafting digital experiences at the intersection of{" "}
          <span style={{ color: "#00F0FF" }}>code</span>{" "}and{" "}
          <span style={{ color: "#FFD600" }}>creativity</span>.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center md:justify-start">
          {onLaunch ? (
            <NeonButton onClick={onLaunch}>LAUNCH SYSTEM</NeonButton>
          ) : launchHref ? (
            <NeonButton onClick={() => router.push(launchHref)}>LAUNCH SYSTEM</NeonButton>
          ) : (
            <NeonButton href="#projects">LAUNCH SYSTEM</NeonButton>
          )}
        </div>

        {/* Status readouts */}
        <div className={`flex gap-6 mt-10 ${effectiveIsMobile ? 'hidden' : ''}`}>
          {[
            { label: "STATUS", value: "ONLINE" },
            { label: "VERSION", value: "2.0.1" },
            { label: "MODE", value: "PORTFOLIO" },
          ].map((s) => (
            <div key={s.label}>
              <p
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: "0.55rem",
                  color: "#7AA2B8",
                  letterSpacing: "0.2em",
                  marginBottom: "2px",
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: "0.7rem",
                  color: "#00F0FF",
                  letterSpacing: "0.15em",
                  textShadow: "0 0 8px rgba(0,240,255,0.6)",
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator isMobile={effectiveIsMobile} />

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "120px",
          background:
            "linear-gradient(0deg, rgba(6,9,13,0.9) 0%, transparent 100%)",
          zIndex: 9,
        }}
      />
    </section>
  );
}