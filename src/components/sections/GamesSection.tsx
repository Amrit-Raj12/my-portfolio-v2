"use client";

import React, { useState, useEffect } from "react";
import { Gamepad2 } from "lucide-react";
import games from "../../datas/Games.json";

interface Game { id: number; title: string; description: string; image: string; link: string; }

function GameCard({ game }: { game: Game }) {
  const isExternal = game.link.startsWith("http");
  return (
    <div className="group relative bg-[#1d2022]/40 backdrop-blur-md border border-yellow-400/20 hover:border-yellow-400/60 transition-all duration-300 p-4">
      <div className="hud-tl" style={{ position: "absolute", top: -2, left: -2, width: 12, height: 12, borderTop: "2px solid #fde400", borderLeft: "2px solid #fde400" }} />
      <div className="relative overflow-hidden aspect-video mb-4 border border-yellow-400/10">
        <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src={game.image} alt={game.title} />
        <div className="absolute inset-0 bg-yellow-400/5 group-hover:bg-transparent transition-all duration-300" />
      </div>
      <h3 className="text-lg font-bold text-yellow-400 mb-1">{game.title}</h3>
      <p className="text-[11px] text-zinc-400 mb-4 leading-relaxed">{game.description}</p>
      <a href={game.link} target={isExternal ? "_blank" : "_self"} rel={isExternal ? "noopener noreferrer" : ""}
        className="w-full flex items-center justify-center gap-2 py-2 border border-yellow-400/40 text-yellow-400 text-xs font-semibold tracking-wider hover:bg-yellow-400 hover:text-black transition-colors"
        style={{ clipPath: "polygon(0% 0%, 90% 0%, 100% 30%, 100% 100%, 10% 100%, 0% 70%)" }}>
        <Gamepad2 size={14} /> PLAY NOW
      </a>
      <div style={{ position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderBottom: "2px solid #fde400", borderRight: "2px solid #fde400" }} />
    </div>
  );
}

export default function GamesSection() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full h-full bg-[#0B0F11] text-slate-200 flex flex-col">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/5 bg-[#0B0F11]/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-xs md:text-lg font-black text-yellow-400 border-2 border-yellow-400 px-1.5 md:px-2 py-0.5 font-orbitron tracking-tighter">ARCHITECT_OS</div>
          <div className="h-4 w-px bg-yellow-400/30 hidden sm:block" />
          <span className="text-[8px] md:text-[10px] font-orbitron font-semibold text-slate-500 uppercase tracking-widest hidden sm:block">Sector: Games_Zone</span>
        </div>
        <span className="material-symbols-outlined text-slate-500 hover:text-yellow-400 cursor-pointer transition-colors text-sm">settings</span>
      </div>

      {/* Main */}
      <div className={`relative flex flex-col w-full flex-1 z-10 px-6 md:px-12 overflow-y-auto`}>
        <div className="pt-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
          <div className="flex gap-4">
            <div className="w-1.5 bg-yellow-400 shadow-[0_0_20px_rgba(253,228,0,0.4)] h-16 md:h-20" />
            <div className="space-y-1">
              <div className="flex items-center gap-3"><div className="w-2 h-2 bg-yellow-400/40" /><span className="font-orbitron text-[0.7rem] text-yellow-400/60 tracking-[0.4em] font-black uppercase">MODULE_05: ENTERTAINMENT_MODULE</span></div>
              <h1 className="font-scary text-[#FFD600] text-4xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-glow-yellow uppercase italic">GAMES<span className="text-white">.</span></h1>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 pb-24">
          {(games as Game[]).map((game) => <GameCard key={game.id} game={game} />)}
        </div>
      </div>
    </div>
  );
}
