"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Code, Lightbulb, MessageSquare, Users, Brush, Clock, RefreshCw, FileCode, Send, Palette, Cat, Cloud, Check, Layers, Network, Database } from "lucide-react";
import skillsData from "@/datas/Skills.json";

const iconMap: Record<string, React.ReactNode> = {
  JS: <span className="font-orbitron font-bold text-[8px] tracking-widest">JS</span>,
  LAYERS: <Layers size={14} />,
  CODE: <Code size={14} />,
  CSS: <span className="font-orbitron font-bold text-[8px] tracking-widest">CSS</span>,
  DATABASE: <Database size={14} />,
  NETWORK: <Network size={14} />,
  LIGHTBULB: <Lightbulb size={20} />,
  MESSAGE_SQUARE: <MessageSquare size={20} />,
  USERS: <Users size={20} />,
  BRUSH: <Brush size={20} />,
  CLOCK: <Clock size={20} />,
  REFRESH_CW: <RefreshCw size={20} />,
  FILE_CODE: <FileCode size={16} />,
  SEND: <Send size={16} />,
  PALETTE: <Palette size={16} />,
  CAT: <Cat size={16} />,
  CLOUD: <Cloud size={16} />,
  CHECK: <Check size={16} />,
};

function SkillItem({ name, icon, percentage }: { name: string; icon: React.ReactNode; percentage: number }) {
  const totalSegments = 15;
  const targetSegments = Math.round((percentage / 100) * totalSegments);
  const [activeSegments, setActiveSegments] = React.useState(0);
  React.useEffect(() => {
    let current = 0;
    const interval = setInterval(() => { current++; setActiveSegments(current); if (current >= targetSegments) clearInterval(interval); }, 40);
    return () => clearInterval(interval);
  }, [targetSegments]);
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">{icon}<span className="text-sm text-zinc-100 uppercase font-semibold">{name}</span></div>
        <span className="text-xs text-[#00F0FF]">{percentage}%</span>
      </div>
      <div className="flex gap-[3px] h-[8px]">
        {Array.from({ length: totalSegments }).map((_, i) => {
          const isActive = i < activeSegments; const isLast = i === activeSegments - 1;
          return <div key={i} className={`flex-1 -skew-x-[20deg] transition-all duration-300 ${isActive ? isLast ? "bg-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.8)]" : "bg-yellow-400 shadow-[0_0_8px_rgba(253,228,0,0.5)]" : "bg-zinc-800/80 border border-white/5"}`} />;
        })}
      </div>
    </div>
  );
}

function HUDCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="h-24 bg-zinc-900/50 border border-yellow-400/10 flex flex-col justify-center items-center relative overflow-hidden group font-orbitron">
      <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400/5 rotate-45 group-hover:bg-yellow-400/10 transition-all" />
      <span className="font-orbitron text-[10px] text-zinc-600 mb-1">{label}</span>
      <span className="text-xl text-zinc-400 font-bold">{value}</span>
    </div>
  );
}

function SoftSkillCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="p-4 border border-yellow-400/10 bg-yellow-400/5 flex flex-col items-center text-center gap-3 hover:bg-yellow-400/10 transition-all cursor-pointer">
      <div className="text-yellow-400/80">{icon}</div>
      <span className="font-orbitron text-[9px] text-zinc-100 uppercase tracking-tight leading-tight">{label}</span>
    </div>
  );
}

function ToolBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 bg-zinc-900 border border-yellow-400/20 px-3 py-2 rounded">
      <div className="text-yellow-400/80">{icon}</div>
      <span className="font-orbitron text-[11px] text-zinc-300">{label}</span>
    </div>
  );
}

function MobileSkillMatrix({ mobileData }: { mobileData: typeof skillsData.mobile }) {
  return (
    <div className="border border-yellow-400/20 bg-[#0D1114] p-5 font-orbitron">
      <div className="text-yellow-400 text-xs tracking-widest mb-4">SYSTEM_CAPABILITIES</div>
      <div className="flex justify-between text-[10px] text-zinc-500 mb-6">
        <span>SKILL SET MATRIX</span><span className="text-yellow-400/70">LEVEL: SENIOR ARCHITECT</span>
      </div>
      <div className="space-y-5">
        {mobileData.skills.map((s, i) => {
          const [w, setW] = React.useState(0);
          React.useEffect(() => { const t = setTimeout(() => setW(s.value), i * 200); return () => clearTimeout(t); }, []);
          return (
            <div key={i}>
              <div className="flex justify-between text-[10px] mb-1"><span className="text-zinc-300">{s.name}</span><span className="text-yellow-400">{s.value}%</span></div>
              <div className="relative w-full h-[8px] bg-zinc-800 overflow-hidden">
                <div className="h-full bg-yellow-400 transition-all duration-1000 ease-out" style={{ width: `${w}%` }} />
                <div className="absolute top-0 h-full w-[8px] bg-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.9)] transition-all duration-1000 ease-out" style={{ left: `calc(${w}% - 4px)` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 border border-yellow-400/20 p-3">
        <div className="text-yellow-400 text-[10px] mb-2">SYNERGY_MODULES</div>
        <p className="text-[10px] text-zinc-400">{mobileData.synergyModules}</p>
      </div>
      <div className="mt-6">
        <div className="text-yellow-400 text-[10px] mb-3">TOOL_BELT</div>
        <div className="flex flex-wrap gap-3">
          {mobileData.tools.map((t, i) => (
            <span key={i} className="text-[10px] border border-yellow-400/30 px-2 py-1 text-yellow-400">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const effectiveIsMobile = mounted ? isMobile : false;

  return (
    <div className="relative w-full h-full bg-[#0B0F11] text-slate-200 flex flex-col">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/5 bg-[#0B0F11]/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-xs md:text-lg font-black text-yellow-400 border-2 border-yellow-400 px-1.5 md:px-2 py-0.5 font-orbitron tracking-tighter">ARCHITECT_OS</div>
          <div className="h-4 w-px bg-yellow-400/30 hidden sm:block" />
          <span className="text-[8px] md:text-[10px] font-orbitron font-semibold text-slate-500 uppercase tracking-widest hidden sm:block">Sector: Skills_Matrix</span>
        </div>
        <span className="material-symbols-outlined text-slate-500 hover:text-yellow-400 cursor-pointer transition-colors text-sm">settings</span>
      </div>

      {/* Main */}
      <div className={`relative flex flex-col w-full flex-1 z-10 ${effectiveIsMobile ? "pt-6 px-4 pb-24 overflow-y-auto" : "pt-8 px-12 overflow-y-auto"}`}>
        {/* Page header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
          <div className="flex gap-4">
            <div className="w-1.5 bg-yellow-400 shadow-[0_0_20px_rgba(253,228,0,0.4)] h-16 md:h-20" />
            <div className="space-y-1">
              <div className="flex items-center gap-3"><div className="w-2 h-2 bg-yellow-400/40" /><span className="font-orbitron text-[0.7rem] text-yellow-400/60 tracking-[0.4em] font-black uppercase">Module_03: EXPERTISE</span></div>
              <h1 className="font-scary text-[#FFD600] text-4xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-glow-yellow uppercase italic">MY SKILLS<span className="text-white">.</span></h1>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-3 font-orbitron text-[9px] text-slate-600 uppercase tracking-[0.2em] text-right">
            <div className="flex items-center justify-end gap-6 border-b border-white/5 pb-2">
              <span>COGNITIVE_LOAD</span>
              <div className="flex gap-0.5">{[...Array(12)].map((_, i) => <div key={i} className={`w-1 h-2 ${i < 10 ? "bg-yellow-400/30" : "bg-white/5"}`} />)}</div>
            </div>
            <div className="flex items-center justify-end gap-6">
              <span>NEURAL_SYNC</span><span className="text-yellow-400/40 font-black">OPTIMIZED_v4.2</span>
            </div>
          </div>
        </div>

        {/* Skills grid */}
        {effectiveIsMobile ? <MobileSkillMatrix mobileData={skillsData.mobile} /> : (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
              <div className="glass-panel border border-yellow-400/30 p-8 glow-border-yellow relative">
                <div className="absolute top-0 right-0 p-2 text-xs font-mono text-yellow-400/30">TECH_STACK_ANALYSIS_v2.0</div>
                <div className="flex items-center gap-3 mb-10"><Terminal className="text-yellow-400" size={32} /><h2 className="text-2xl text-yellow-400 uppercase tracking-widest font-orbitron font-bold">TECH SKILLS</h2></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {skillsData.techSkills.map((skill, i) => (
                    <SkillItem key={i} name={skill.name} icon={iconMap[skill.icon]} percentage={skill.percentage} />
                  ))}
                </div>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4"><HUDCard label="SYSTEM_LOAD" value="42%" /><HUDCard label="DATA_STREAM" value="LIVE" /><HUDCard label="NODES_SYNC" value="100%" /></div>
            </div>
            <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="glass-panel border border-yellow-400/30 p-8 glow-border-yellow relative">
                <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-yellow-400/30">PSYCH_DRIVE_01</div>
                <div className="flex items-center gap-3 mb-8"><Lightbulb className="text-yellow-400" size={28} /><h2 className="text-sm text-yellow-400 uppercase tracking-widest font-orbitron font-semibold">SOFT SKILLS</h2></div>
                <div className="grid grid-cols-2 gap-4">
                  {skillsData.softSkills.map((skill, i) => (
                    <SoftSkillCard key={i} icon={iconMap[skill.icon]} label={skill.label} />
                  ))}
                </div>
              </div>
              <div className="glass-panel border border-yellow-400/30 p-8 glow-border-yellow relative">
                <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-yellow-400/30">TOOLKIT_V1.1</div>
                <div className="flex items-center gap-3 mb-8"><FileCode className="text-yellow-400" size={28} /><h2 className="text-sm text-yellow-400 uppercase tracking-widest font-orbitron font-semibold">TOOLS &amp; TECH</h2></div>
                <div className="flex flex-wrap gap-3">
                  {skillsData.tools.map((tool, i) => (
                    <ToolBadge key={i} icon={iconMap[tool.icon]} label={tool.label} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
