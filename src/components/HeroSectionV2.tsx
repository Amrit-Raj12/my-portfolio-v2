"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  motion, useMotionValue, useScroll, useSpring, useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import "./landing.css";
import NeonParticles from "./Neonparticles";
import SceneLights from "./SceneLights";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function subscribeToDesktop(onChange: () => void) {
  const mediaQuery = window.matchMedia(DESKTOP_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function DesktopHeroVideo() {
  const [isReady, setIsReady] = useState(false);

  return (
    <video
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isReady ? "opacity-100" : "opacity-0"}`}
      src="https://res.cloudinary.com/dzur9wakk/video/upload/q_auto,f_auto/v1790948195/new-hero-bg-v2_pvcomj.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      onCanPlay={() => setIsReady(true)}
      onError={() => setIsReady(false)}
    />
  );
}

/** Types the text, holds, deletes it, and loops - with a blinking pipe caret. */
function Typewriter({ text, delay = 0.4 }: { text: string; delay?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    let i = 0;
    let dir = 1;
    const step = () => {
      if (dir === 1) {
        i++;
        setN(i);
        if (i >= text.length) { dir = -1; t = setTimeout(step, 2200); return; }
        t = setTimeout(step, 70 + Math.random() * 60);
      } else {
        i--;
        setN(i);
        if (i <= 0) { dir = 1; t = setTimeout(step, 500); return; }
        t = setTimeout(step, 28);
      }
    };
    t = setTimeout(step, delay * 1000);
    return () => clearTimeout(t);
  }, [text, delay]);
  return (
    <span>
      {text.slice(0, n)}
      <span className="caret ml-[3px] inline-block h-[1.15em] w-[2px] translate-y-[3px] bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
    </span>
  );
}

export default function HeroSectionV2({
  onLaunch,
  isReady,
}: {
  onLaunch: () => void;
  isReady: boolean;
}) {
  const calm = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    getDesktopSnapshot,
    getServerReducedMotionSnapshot,
  );

  // cursor parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const bgX = useTransform(sx, (v) => v * -26);
  const bgY = useTransform(sy, (v) => v * -14);

  useEffect(() => {
    if (calm) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, calm]);

  // scroll parallax
  const { scrollYProgress } = useScroll();
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const entrance = (delay: number) => ({
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: "easeOut" as const, delay },
    },
  });

  return (
    <section id="home" className="relative h-svh min-h-svh w-full overflow-hidden bg-[#02060a] md:min-h-[640px]">
      {/* ---------- Scene: image + lights share one aspect-locked box ---------- */}
      <motion.div className="absolute inset-0" style={{ y: sceneY }}>
        <motion.div
          className="hero-scene-frame absolute left-1/2 top-1/2 scale-[1.06]"
          style={{
            x: bgX,
            y: bgY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          <picture className="absolute inset-0">
            <source media="(max-width: 767px)" srcSet="/assets/images/hero-bg-mob.webp" />
            <Image src="/assets/images/hero-bg.webp" alt="" fill priority unoptimized sizes="100vw" className="object-cover" />
          </picture>
          {isDesktop && <DesktopHeroVideo />}
          <div className="hidden md:block">
            <SceneLights />
          </div>
        </motion.div>
      </motion.div>

      {isDesktop && <NeonParticles />}

      {/* ---------- Atmosphere ---------- */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#02060a]/90 via-[#02060a]/45 to-transparent md:via-[#02060a]/20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#02060a] to-transparent" />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="scan-band absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#00f0ff]/[0.07] to-transparent" />
      </div>

      {/* ---------- Copy ---------- */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 flex h-full items-center justify-center px-6 text-center sm:px-10 md:justify-start md:px-[6vw] md:text-left"
      >
        <motion.div
          className="flex h-full w-full max-w-[46rem] flex-col justify-start py-8 sm:py-12 md:h-auto md:justify-start md:py-0"
        >
          <motion.div className="flex flex-1 flex-col justify-center md:flex-none md:justify-start">
            <motion.p
              variants={entrance(0)}
              initial="hidden"
              animate={isReady ? "show" : "hidden"}
              className="mb-4 font-mono text-xs tracking-widest text-[#00f0ff] sm:text-sm"
            >
              <Typewriter text="// INIT SYSTEM..." delay={0.5} />
            </motion.p>

            <motion.h1
              variants={entrance(0.15)}
              initial="hidden"
              animate={isReady ? "show" : "hidden"}
              className="font-scary -skew-x-6 uppercase leading-[0.9]"
            >
              <span className="neon-lime-text block text-3xl sm:text-5xl">Welcome to my</span>
              <motion.span
                className="glitch neon-cyan-text mt-1 block text-[clamp(3rem,14vw,4.5rem)] font-normal leading-none tracking-tight sm:text-[8rem] lg:text-[10rem]"
                data-text="PORTFOLIO"
                animate={{ opacity: [1, 1, 0.55, 1, 0.8, 1] }}
                transition={{ duration: 5, repeat: Infinity, times: [0, 0.82, 0.84, 0.86, 0.88, 1] }}
              >
                PORTFOLIO
              </motion.span>
            </motion.h1>

            <motion.p
              variants={entrance(1)}
              initial="hidden"
              animate={isReady ? "show" : "hidden"}
              className="mx-auto mt-6 max-w-md border border-[#ccff00]/25 border-l-[#ccff00]/70 bg-gradient-to-r from-[#080e14]/90 via-[#080e14]/75 to-[#080e14]/55 py-3 pl-4 pr-3 font-mono text-base italic leading-relaxed tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] backdrop-blur-sm sm:text-lg md:mx-0 md:border-transparent md:bg-transparent md:px-0 md:py-0 md:text-white/75 md:shadow-none md:backdrop-blur-0"
              style={{ clipPath: "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)" }}
            >
              Crafting digital experiences at the intersection of{" "}
              <span className="text-[#00f0ff]">code</span> and{" "}
              <span className="text-[#d4ff00]">creativity</span>.
            </motion.p>
          </motion.div>

          <motion.div
            variants={entrance(1.8)}
            initial="hidden"
            animate={isReady ? "show" : "hidden"}
            className="mt-auto flex flex-wrap items-center justify-center gap-6 pb-8 md:mt-9 md:justify-start md:pb-0"
          >
            <motion.button
              onClick={onLaunch}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="cta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00f0ff]"
            >
              <span className="cta-in">
                Launch System
                <ArrowRight className="h-4 w-4" />
              </span>
            </motion.button>

            {/* <div className="flex items-center gap-4 text-white/60">
              {[
                { Icon: Github, href: "https://github.com/Elixir-Raj", label: "GitHub" },
                { Icon: Linkedin, href: "#", label: "LinkedIn" },
                { Icon: Mail, href: "mailto:you@example.com", label: "Email" },
              ].map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -3, color: "#00f0ff" }}
                  className="transition-colors focus-visible:outline-2 focus-visible:outline-[#00f0ff]"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div> */}
          </motion.div>
        </motion.div>
      </motion.div>

    </section>
  );
}