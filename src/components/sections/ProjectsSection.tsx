"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import projectsData from "../../datas/Projects.json";
import { Cat, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

type Project = {
  id: string; title: string; description: string; image: string; imageAlt: string;
  tags: string[]; category: string; status: string; projectUrl: string; githubUrl: string;
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <div className="group relative bg-[#0D1113]/80 backdrop-blur-xl border border-white/5 p-4 md:p-6 transition-all duration-500 hover:border-yellow-400/40 flex flex-col gap-4" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,100,0.06))] bg-[size:100%_2px,3px_100%]" />
      <div className="relative aspect-video overflow-hidden border border-white/5 group-hover:border-yellow-400/20 transition-colors duration-500">
        <img alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100 grayscale-[0.5] group-hover:grayscale-0" src={project.image} />
        <div className="absolute top-4 right-4">
          <div className="bg-black/90 border border-white/10 px-3 py-1 flex items-center gap-2 backdrop-blur-md">
            <div className={`w-1.5 h-1.5 rounded-full ${project.status === "live" ? "bg-[#00F0FF]" : "bg-yellow-400"} shadow-[0_0_12px_#00eefc] animate-pulse`} />
            <span className={`hidden md:block font-orbitron text-[9px] font-black tracking-[0.2em] ${project.status === "live" ? "text-[#00F0FF]" : "text-yellow-400"} uppercase`}>
              {project.status === "live" ? "LIVE" : "IN DEV."}
            </span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {project.tags.slice(0, 2).map((tag) => (
            <div key={tag} className="bg-white/10 border border-white/20 px-2 py-0.5 backdrop-blur-xl">
              <span className="font-orbitron text-[8px] font-bold text-[#00F0FF] tracking-widest uppercase">{tag.replace(" ", "_")}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-end gap-4 overflow-hidden">
          <h3 className="font-orbitron text-sm md:text-base font-bold text-[#FFD600] tracking-wide uppercase truncate flex-1">{project.title.replace(" ", "_")}</h3>
          <span className="font-orbitron text-[9px] text-[#7AA2B8] tracking-[0.2em] font-black whitespace-nowrap">2024_Q1</span>
        </div>
        <p className="font-inter text-[#7AA2B8] text-[0.85rem] leading-relaxed tracking-wide line-clamp-2 opacity-90">{project.description}</p>
        <div className="flex gap-4 pt-2">
          <button onClick={() => window.open(project.githubUrl, "_blank")} className="group/btn relative flex-1 border-2 border-white/10 p-3 transition-all duration-300 hover:border-yellow-400/50 hover:bg-yellow-400/10 flex items-center justify-center cursor-pointer" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)" }} title="VIEW_REPOSITORY">
            <Cat size={18} className="text-slate-400 group-hover/btn:text-yellow-400 transition-colors" />
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-yellow-400 text-black font-orbitron text-[8px] font-black tracking-widest opacity-0 group-hover/btn:opacity-100 group-hover/btn:-top-14 transition-all duration-300 pointer-events-none whitespace-nowrap z-[100] shadow-[0_0_20px_rgba(253,228,0,0.6)]">
              VIEW_REPOSITORY<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rotate-45" />
            </div>
          </button>
          <button onClick={() => window.open(project.projectUrl, "_blank")} className="group/btn relative flex-1 border-2 border-yellow-400/40 p-3 transition-all duration-300 hover:bg-yellow-400/10 flex items-center justify-center cursor-pointer" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)" }} title="VIEW_PROJECT">
            <ExternalLink size={18} className="text-yellow-400 group-hover/btn:scale-110 transition-transform" />
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-yellow-400 text-black font-orbitron text-[8px] font-black tracking-widest opacity-0 group-hover/btn:opacity-100 group-hover/btn:-top-14 transition-all duration-300 pointer-events-none whitespace-nowrap z-[100] shadow-[0_0_20px_rgba(253,228,0,0.6)]">
              VIEW_PROJECT<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rotate-45" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const effectiveIsMobile = mounted ? isMobile : false;

  const categories = ["ALL", "WEB APPS", "AI APPS", "MOBILE APPS", "TOOLS"];
  const filteredProjects = useMemo(() => {
    return projectsData.projects.filter((p: Project) => {
      const matchesFilter = activeFilter === "ALL" || p.category === activeFilter;
      const matchesSearch = searchQuery === "" || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const scrollTo = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = 400 + 32;
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
    if (filteredProjects.length <= 4) return;
    
    let autoScrollDir = 1;
    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 10) autoScrollDir = -1;
      if (container.scrollLeft <= 0) autoScrollDir = 1;
      container.scrollLeft += autoScrollDir * 1;
    }, 30);
    return () => clearInterval(interval);
  }, [effectiveIsMobile, filteredProjects.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || effectiveIsMobile || filteredProjects.length <= 4) return;

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

      targetScrollLeft += e.deltaY;
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
  }, [effectiveIsMobile, filteredProjects.length]);

  return (
    <div className="relative w-full h-full bg-[#0B0F11] text-slate-200 flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}` }} />

      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-fixed opacity-40 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(to bottom, rgba(11,15,17,0.9), rgba(11,15,17,1))" }} />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/5 bg-[#0B0F11]/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-xs md:text-lg font-black text-yellow-400 border-2 border-yellow-400 px-1.5 md:px-2 py-0.5 font-orbitron tracking-tighter">ARCHITECT_OS</div>
          <div className="h-4 w-px bg-yellow-400/30 hidden sm:block" />
          <span className="text-[8px] md:text-[10px] font-orbitron font-semibold text-slate-500 uppercase tracking-widest hidden sm:block">Sector: Projects_Core</span>
        </div>
        <div className="relative flex items-center">
          <input className="bg-black/40 border border-white/10 py-1 pl-3 pr-3 text-[10px] md:text-xs font-orbitron focus:border-yellow-400/50 outline-none w-32 md:w-48 text-yellow-400 placeholder:text-slate-700" placeholder="QUERY_DATA..." type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Main content */}
      <div className={`relative flex flex-col px-6 md:px-12 z-10 flex-1 ${effectiveIsMobile ? "overflow-y-auto pb-24" : "overflow-hidden"}`}>
        {/* Title */}
        <div className="pt-6 mb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
          <div className="flex gap-4">
            <div className="w-1.5 bg-yellow-400 shadow-[0_0_20px_rgba(253,228,0,0.4)] h-16 md:h-20" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400/40" />
                <span className="font-orbitron text-[0.6rem] md:text-[0.7rem] text-yellow-400/60 tracking-[0.4em] font-black">MODULE_02: SHOWCASE</span>
              </div>
              <h2 className="font-scary text-[#FFD600] text-4xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-glow-yellow uppercase italic">PROJECTS</h2>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-3 font-orbitron text-[9px] text-slate-600 uppercase tracking-[0.2em] text-right">
            <div className="flex items-center justify-end gap-6 border-b border-white/5 pb-2">
              <span>CPU_LOAD</span>
              <div className="flex gap-0.5">{[...Array(12)].map((_, i) => <div key={i} className={`w-1 h-2 ${i < 8 ? "bg-yellow-400/30" : "bg-white/5"}`} />)}</div>
            </div>
            <div className="flex items-center justify-end gap-6">
              <span>MEM_SYNC</span><span className="text-yellow-400/40 font-black">STABLE_0x82_Q3</span>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-4 mb-4 border-b border-white/5 pb-4 shrink-0">
          <span className="font-orbitron text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">DATA_FILTER:</span>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 font-orbitron text-[9px] font-black uppercase tracking-[0.25em] transition-all duration-300 border ${activeFilter === cat ? "bg-yellow-400 text-black border-yellow-400 shadow-[0_0_20px_rgba(253,228,0,0.3)]" : "border-white/10 text-[#7AA2B8] hover:border-yellow-400/40 hover:text-yellow-400"} cursor-pointer`}>
                {cat.replace(" ", "_")}
              </button>
            ))}
          </div>
        </div>

        {/* Projects grid / scroll */}
        <div className={`${effectiveIsMobile ? "flex flex-col gap-8 pb-8" : "flex-1 overflow-hidden relative"}`}>
          {!effectiveIsMobile && (
            <>
              <button onClick={() => scrollTo('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#0D1113]/80 border border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all group">
                <ChevronLeft className="text-yellow-400 group-hover:scale-110 transition-transform" size={24} />
              </button>
              <button onClick={() => scrollTo('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#0D1113]/80 border border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all group">
                <ChevronRight className="text-yellow-400 group-hover:scale-110 transition-transform" size={24} />
              </button>
            </>
          )}
          <div ref={scrollContainerRef} tabIndex={0} className={`${effectiveIsMobile ? "flex flex-col gap-8" : "flex gap-8 overflow-x-auto h-full pb-10 pt-2 snap-x snap-mandatory no-scrollbar outline-none"}`}>
            {filteredProjects.map((project: Project, index: number) => (
              <div key={project.id} className={`${effectiveIsMobile ? "w-full" : "flex-shrink-0 w-[400px] snap-center"}`}>
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
