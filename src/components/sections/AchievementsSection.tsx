"use client";

import { useEffect, useRef, useState } from "react";
import achievementsData from "../../datas/Achievements.json";
// import FuturisticHUD from "../FuturisticHUD";
import { Rocket, Shield, Brain, Cpu, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

const iconMap: Record<string, any> = { rocket: Rocket, shield: Shield, brain: Brain, cpu: Cpu };

function AchievementCard({ data }: any) {
  const Icon = iconMap[data.icon] || Rocket;
  return (
    <div className="relative group p-6 md:p-8 bg-[#0D1113]/80 backdrop-blur-xl border border-[#00F0FF30] hover:border-[#00F0FF] transition-all duration-500 overflow-hidden flex flex-col gap-4" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-500" style={{ boxShadow: "0 0 20px #00F0FF55, inset 0 0 20px #00F0FF22" }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,100,0.06))] bg-[size:100%_2px,3px_100%]" />
      <div className="absolute top-0 right-0 p-2 text-[10px] text-[#00F0FF70] font-mono">{data.id}</div>
      <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
        <div className="w-16 h-20 md:w-20 md:h-24 bg-zinc-900 border-2 border-[#00F0FF80] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform z-10 relative">
          <Icon size={32} className="text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] group-hover:rotate-6 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#00F0FF]" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#00F0FF]" />
        </div>
        <div className="flex flex-col justify-between w-full z-10">
          <div>
            <h3 className="font-orbitron text-base md:text-sm font-bold text-[#FFD600] tracking-wide uppercase mb-1 md:mb-2">{data.title.replace(/ /g, "_")}</h3>
            <p className="font-inter text-[#7AA2B8] mb-4 text-xs md:text-[0.7rem] leading-relaxed opacity-90">{data.description}</p>
            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
              {data.tags.map((tag: string, i: number) => (
                <span key={i} className="px-1.5 py-0.5 bg-[#00F0FF10] text-[#00F0FF] text-[7px] md:text-[8px] font-orbitron font-bold border border-[#00F0FF30] tracking-widest uppercase">{tag.replace(/ /g, "_")}</span>
              ))}
            </div>
          </div>
          {data.certificateUrl && (
            <a href={data.certificateUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-orbitron text-[10px] font-black tracking-[0.2em] uppercase border-2 border-[#00F0FF80] px-4 py-2.5 text-[#00F0FF] hover:bg-[#00F0FF] hover:text-black transition-all w-fit cursor-pointer mt-2"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)", boxShadow: "0 0 10px rgba(0,240,255,0.3)" }}>
              VIEW_CERTIFICATE<ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
      <div className="absolute bottom-2 right-2 flex gap-1 z-10">
        <div className="w-1.5 h-1.5 bg-[#00F0FF]" /><div className="w-1.5 h-1.5 bg-[#00F0FF70]" /><div className="w-1.5 h-1.5 bg-[#00F0FF40]" />
      </div>
    </div>
  );
}

export default function AchievementsSection() {
  const { subtitle, description, achievements } = achievementsData;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rotation, setRotation] = useState(0);

  const desktopAchievements = Array(10).fill(achievements).flat();
  const effectiveIsMobile = mounted ? isMobile : false;
  const displayAchievements = effectiveIsMobile ? achievements : desktopAchievements;

  const scrollTo = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = 380 + 32;
    const targetScrollLeft = direction === 'left'
      ? container.scrollLeft - cardWidth
      : container.scrollLeft + cardWidth;

    let currentScrollLeft = container.scrollLeft;
    const animate = () => {
      const diff = targetScrollLeft - currentScrollLeft;
      if (Math.abs(diff) > 1) {
        currentScrollLeft += diff * 0.12;
        container.scrollLeft = currentScrollLeft;
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (effectiveIsMobile) return;
    let autoScrollDir = 1;
    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 10) autoScrollDir = -1;
      if (container.scrollLeft <= 0) autoScrollDir = 1;
      container.scrollLeft += autoScrollDir * 1;
    }, 30);
    return () => clearInterval(interval);
  }, [effectiveIsMobile]);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || effectiveIsMobile) return;
    const timer = setTimeout(() => {
      const item0 = container.children[0] as HTMLElement;
      const itemM = container.children[achievements.length] as HTMLElement;
      if (!item0 || !itemM) return;
      const singleSetWidth = itemM.offsetLeft - item0.offsetLeft;
      if (singleSetWidth > 0) container.scrollLeft = singleSetWidth * 5;
    }, 100);
    return () => clearTimeout(timer);
  }, [effectiveIsMobile, achievements.length]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || effectiveIsMobile) return;

    let targetScrollLeft = container.scrollLeft;
    let currentScrollLeft = container.scrollLeft;
    let rafId: number | null = null;

    const smoothScroll = () => {
      const diff = targetScrollLeft - currentScrollLeft;
      if (Math.abs(diff) > 0.5) {
        currentScrollLeft += diff * 0.1;
        container.scrollLeft = currentScrollLeft;
        rafId = requestAnimationFrame(smoothScroll);
      } else {
        rafId = null;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!container.contains(e.target as Node)) return;

      targetScrollLeft += e.deltaY * 1.5;
      targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, container.scrollWidth - container.clientWidth));

      if (!rafId) {
        rafId = requestAnimationFrame(smoothScroll);
      }

      if (e.deltaY !== 0) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [effectiveIsMobile]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    setRotation(container.scrollLeft * 0.4);
    if (effectiveIsMobile) return;
    const item0 = container.children[0] as HTMLElement;
    const itemM = container.children[achievements.length] as HTMLElement;
    if (!item0 || !itemM) return;
    const singleSetWidth = itemM.offsetLeft - item0.offsetLeft;
    if (singleSetWidth <= 0) return;
    if (container.scrollLeft > singleSetWidth * 6) container.scrollLeft -= singleSetWidth;
    else if (container.scrollLeft < singleSetWidth * 4) container.scrollLeft += singleSetWidth;
  };

  return (
    <div className="relative w-full h-full bg-[#0B0F11] text-slate-200 flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: `.achievements-scroll::-webkit-scrollbar{display:none}.achievements-scroll{-ms-overflow-style:none;scrollbar-width:none}` }} />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />


      {/* Header */}

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/5 bg-[#0B0F11]/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-xs md:text-lg font-black text-yellow-400 border-2 border-yellow-400 px-1.5 md:px-2 py-0.5 font-orbitron tracking-tighter">ARCHITECT_OS</div>
          <div className="h-4 w-px bg-yellow-400/30 hidden sm:block" />
          <span className="text-[8px] md:text-[10px] font-orbitron font-semibold text-slate-500 uppercase tracking-widest hidden sm:block">Sector: Achievements_Log</span>
        </div>
        <span className="material-symbols-outlined text-slate-500 hover:text-yellow-400 cursor-pointer transition-colors text-sm">settings</span>
      </div>

      {/* Content */}
      <div className={`relative flex flex-col px-6 md:px-12 z-10 flex-1 ${effectiveIsMobile ? "pt-6 pb-24 overflow-y-auto" : "pt-6 overflow-hidden"}`}>
        <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
          <div className="flex gap-4">
            <div className="w-1.5 bg-yellow-400 shadow-[0_0_20px_rgba(253,228,0,0.4)] h-16 md:h-20" />
            <div className="space-y-1">
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-yellow-400/40" /><span className="font-orbitron text-[0.7rem] text-yellow-400/60 tracking-[0.4em] font-black uppercase">{subtitle}</span></div>
              <h2 className="font-scary text-[#FFD600] text-4xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-glow-yellow uppercase italic">ACHIEVEMENTS</h2>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-3 font-orbitron text-[9px] text-slate-600 uppercase tracking-[0.2em] text-right">
            <div className="flex items-center justify-end gap-6 border-b border-white/5 pb-2">
              <span>SYS_INTEGRITY</span>
              <div className="flex gap-0.5">{[...Array(12)].map((_, i) => <div key={i} className={`w-1 h-2 ${i < 10 ? "bg-yellow-400/30" : "bg-white/5"}`} />)}</div>
            </div>
            <div className="flex items-center justify-end gap-6"><span>DATA_SYNC</span><span className="text-yellow-400/40 font-black">VERIFIED_0xAA</span></div>
          </div>
        </div>

        <p className="font-inter text-[#7AA2B8] max-w-2xl text-[0.85rem] leading-relaxed tracking-wide opacity-90 mb-6 border-l-2 border-yellow-400/30 pl-6 italic shrink-0">"{description}"</p>

        <div className={`${effectiveIsMobile ? "flex flex-col gap-8 pb-8" : "flex-1 overflow-hidden relative"}`}>
          {!effectiveIsMobile && (
            <>
              <button onClick={() => scrollTo('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#0D1113]/80 border border-[#00F0FF]/30 hover:border-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all group">
                <ChevronLeft className="text-[#00F0FF] group-hover:scale-110 transition-transform" size={24} />
              </button>
              <button onClick={() => scrollTo('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#0D1113]/80 border border-[#00F0FF]/30 hover:border-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all group">
                <ChevronRight className="text-[#00F0FF] group-hover:scale-110 transition-transform" size={24} />
              </button>
            </>
          )}
          <div ref={scrollRef} onScroll={handleScroll} tabIndex={0}
            className={`${effectiveIsMobile ? "flex flex-col gap-8" : "flex gap-8 overflow-x-auto h-full pb-10 pt-2 achievements-scroll outline-none"}`}>
            {displayAchievements.map((item: any, index: number) => (
              <div key={index} className={`${effectiveIsMobile ? "w-full" : "flex-shrink-0 w-[400px]"}`}>
                <AchievementCard data={item} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Quote + Resume CTA */}
      <div className="relative mt-6 md:mt-8 border border-yellow-400/20 bg-[#0B0F11]/80 backdrop-blur-md overflow-hidden">

        {/* Cyberpunk Border Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            boxShadow:
              "inset 0 0 30px rgba(255,214,0,0.08), 0 0 20px rgba(255,214,0,0.05)",
          }}
        />

        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-yellow-400/50" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-yellow-400/50" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-5 md:px-8 py-6">

          {/* Quote Section */}
          <div className="flex items-start gap-4">
            <div className="mt-1 text-yellow-400 shrink-0">
              ✦
            </div>

            <div className="space-y-2">
              <p className="font-inter italic text-[#C9D1D9] text-sm md:text-base leading-relaxed">
                "Learning never exhausts the mind. It only ignites the potential within."
              </p>

              <div className="flex items-center gap-2">
                <div className="w-10 h-px bg-yellow-400/40" />
                <span className="font-orbitron text-[10px] tracking-[0.3em] uppercase text-yellow-400/60">
                  SYSTEM_GROWTH
                </span>
              </div>
            </div>
          </div>

          {/* Resume Button */}
          <a
            href="/resume.pdf"
            download
            className="group relative inline-flex items-center justify-center gap-3 px-6 md:px-8 py-4 font-orbitron text-xs md:text-sm font-black uppercase tracking-[0.25em] text-black bg-[#FFD600] overflow-hidden transition-all duration-300 hover:scale-[1.03]"
            style={{
              clipPath:
                "polygon(0 0, 92% 0, 100% 30%, 100% 100%, 8% 100%, 0 70%)",
              boxShadow:
                "0 0 20px rgba(255,214,0,0.45), inset 0 0 10px rgba(255,255,255,0.25)",
            }}
          >
            {/* Glow Layer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35),transparent_70%)]" />

            <span className="relative z-10">
              DOWNLOAD RESUME
            </span>

            <span className="relative z-10 text-lg leading-none">
              ↓
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
