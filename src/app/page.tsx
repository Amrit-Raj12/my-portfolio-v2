"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import Booting from "@/components/Booting";
import SPASidebar from "@/components/SPASidebar";
import SPAMobileNav from "@/components/SPAMobileNav";
import Footer from "@/components/Footer";

import HomeSection from "@/components/sections/HomeSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import GamesSection from "@/components/sections/GamesSection";
import ContactSection from "@/components/sections/ContactSection";

/* ── Section definitions ──────────────────────────────── */
const SECTIONS = [
  { id: "home", Component: HomeSection },
  { id: "about", Component: AboutSection },
  { id: "projects", Component: ProjectsSection },
  { id: "skills", Component: SkillsSection },
  { id: "achievements", Component: AchievementsSection },
  { id: "games", Component: GamesSection },
  { id: "contact", Component: ContactSection },
] as const;

type SectionId = typeof SECTIONS[number]["id"];
type Phase = "landing" | "transitioning-to-spa" | "transitioning-to-landing" | "spa";

export default function SPAPage() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [bootComplete, setBootComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const observersRef = useRef<IntersectionObserver[]>([]);

  /* ── Launch handler ── */
  const handleLaunch = useCallback(() => {
    setPhase("transitioning-to-spa");
    setTimeout(() => setPhase("spa"), 750);
  }, []);

  /* ── Reset handler (GlobalHUD click) ── */
  useEffect(() => {
    const handleReset = () => {
      setPhase("transitioning-to-landing");
      // Reset scroll container before showing landing again
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setActiveSection("home");

      setTimeout(() => {
        setPhase("landing");
      }, 750);
    };

    window.addEventListener('reset-to-landing', handleReset);
    return () => window.removeEventListener('reset-to-landing', handleReset);
  }, []);

  /* ── Scroll to section via the SPA scroll container ── */
  const scrollToSection = useCallback((id: SectionId) => {
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

  /* ── IntersectionObserver — root = SPA scroll container ── */
  useEffect(() => {
    if (phase !== "spa") return;

    // Allow a tick for DOM to settle before observing
    const timeout = setTimeout(() => {
      observersRef.current.forEach((obs) => obs.disconnect());
      observersRef.current = [];

      const root = scrollRef.current;
      if (!root) return;

      SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(`spa-${id}`);
        if (!el) return;
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActiveSection(id);
          },
          { root, threshold: 0.5 }
        );
        obs.observe(el);
        observersRef.current.push(obs);
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      observersRef.current.forEach((obs) => obs.disconnect());
    };
  }, [phase]);

  return (
    <>
      {!bootComplete && <Booting onComplete={() => setBootComplete(true)} duration={4000} />}
      <style dangerouslySetInnerHTML={{ __html: `
        /* SPA scroll container */
        #spa-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        #spa-scroll::-webkit-scrollbar { display: none; }

        /* Every section is exactly 100vh and clips overflow.
           Tall sections manage their own internal scroll. */
        .spa-section {
          scroll-snap-align: start;
          height: fit-screen;
          overflow: hidden;
          position: relative;
        }

        /* Landing slide-out animation */
        .landing-slide {
          transition: transform 0.75s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.6s ease;
        }
        .landing-slide.out {
          transform: translateY(-100%);
          opacity: 0;
        }

        /* SPA panel transition */
        .spa-panel {
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .spa-panel.hidden-phase {
          opacity: 0;
          transform: translateY(20px);
          pointer-events: none;
        }
        .spa-panel.visible-phase {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }
      ` }} />

      {/* Outer shell — fixed, fills viewport */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#06090D" }}>

        {/* ══════════ LANDING ══════════ */}
        <div
          className={`landing-slide absolute inset-0 z-30 ${phase === "transitioning-to-spa" || phase === "spa" ? "out" : ""
            }`}
          style={{
            display: "block",
            pointerEvents: (phase === "spa" || phase === "transitioning-to-spa") ? "none" : "all",
            visibility: (phase === "spa" || phase === "transitioning-to-spa") ? "hidden" : "visible",
            transition: "transform 0.8s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.6s ease"
          }}
        >
          <HeroSection onLaunch={handleLaunch} />
        </div>

        {/* ══════════ SPA ══════════ */}
        <div
          className={`spa-panel absolute inset-0 z-20 flex ${phase === "spa" ? "visible-phase" : "hidden-phase"
            }`}
        >
          {/* Desktop sidebar (fixed, 80px wide) */}
          <SPASidebar
            activeId={activeSection}
            onNavigate={(id) => scrollToSection(id as SectionId)}
          />

          {/* Scroll container — full height, offset on desktop for sidebar */}
          <div
            id="spa-scroll"
            ref={scrollRef}
            className=" overflow-y-scroll"
          >
            {SECTIONS.map(({ id, Component }) => (
              <section
                key={id}
                id={`spa-${id}`}
                className="spa-section md:ml-20"

              >
                <Component />
              </section>
            ))}
            <Footer activeId={activeSection} onNavigate={(id) => scrollToSection(id as SectionId)} />
          </div>


          {/* Mobile nav */}
          <SPAMobileNav
            activeId={activeSection}
            onNavigate={(id) => scrollToSection(id as SectionId)}
          />
        </div>
      </div>
    </>
  );
}
