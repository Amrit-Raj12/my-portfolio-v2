"use client";

import { useState, useEffect } from "react";
import contactData from "../../datas/contact.json";
import { GithubIcon, LinkedinIcon, InstagramIcon, EmailIcon, PhoneIcon } from "../SocialIcons";
import { Folder } from "lucide-react";
import GlobalUplink from "../GlobalUplink";

const iconMap: any = { email: EmailIcon, phone: PhoneIcon, github: GithubIcon, linkedin: LinkedinIcon, instagram: InstagramIcon, projects: Folder };
const colorMap: any = {
  yellow: { border: "border-yellow-400/30", text: "text-yellow-400", bg: "bg-yellow-400/10", hover: "hover:bg-yellow-400 hover:text-black" },
  cyan: { border: "border-cyan-400/30", text: "text-cyan-400", bg: "bg-cyan-400/10", hover: "hover:bg-cyan-400 hover:text-black" },
  white: { border: "border-white/30", text: "text-white", bg: "bg-white/10", hover: "hover:bg-white hover:text-black" },
  blue: { border: "border-blue-400/30", text: "text-blue-400", bg: "bg-blue-400/10", hover: "hover:bg-blue-400 hover:text-black" },
  pink: { border: "border-pink-400/30", text: "text-pink-400", bg: "bg-pink-400/10", hover: "hover:bg-pink-400 hover:text-black" },
};

export default function ContactSection() {
  const data = contactData;
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    if (typeof window !== "undefined") { handleResize(); window.addEventListener("resize", handleResize); }
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full h-full bg-[#0B0F11] text-white flex flex-col">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/5 bg-[#0B0F11]/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-xs md:text-lg font-black text-yellow-400 border-2 border-yellow-400 px-1.5 md:px-2 py-0.5 font-orbitron tracking-tighter">ARCHITECT_OS</div>
          <div className="h-4 w-px bg-yellow-400/30 hidden sm:block" />
          <span className="text-[8px] md:text-[10px] font-orbitron font-semibold text-slate-500 uppercase tracking-widest hidden sm:block">Sector: Comms_Link</span>
        </div>
        <span className="material-symbols-outlined text-slate-500 hover:text-yellow-400 cursor-pointer transition-colors text-sm">settings</span>
      </div>

      {/* Main */}
      <div className="relative flex-1 overflow-y-auto px-6 md:px-12 lg:px-20 pb-24 pt-6 z-10">
        {/* Title */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex gap-4">
            <div className="w-1.5 bg-yellow-400 shadow-[0_0_20px_rgba(253,228,0,0.4)] h-16 md:h-20" />
            <div className="space-y-1">
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-yellow-400/40" /><span className="font-orbitron text-[0.7rem] text-yellow-400/60 tracking-[0.4em] font-black uppercase">MODULE_06: ESTABLISH CONNECTION</span></div>
              <h2 className="font-scary text-[#FFD600] text-4xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-glow-yellow uppercase italic">CONTACT</h2>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-3 font-orbitron text-[9px] text-slate-600 uppercase tracking-[0.2em] text-right">
            <div className="flex items-center justify-end gap-6 border-b border-white/5 pb-2">
              <span>COMMS_LINK</span>
              <div className="flex gap-0.5">{[...Array(12)].map((_, i) => <div key={i} className={`w-1 h-2 ${i < 10 ? "bg-yellow-400/30" : "bg-white/5"}`} />)}</div>
            </div>
            <div className="flex items-center justify-end gap-6"><span>SECURE_CHANNEL</span><span className="text-yellow-400/40 font-black">ACTIVE_0x99</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="border border-yellow-400/30 p-6 bg-[#0D1113]/80 backdrop-blur-xl hover:border-[#FACC15] transition-all duration-500" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
              <h2 className="font-orbitron text-xl font-bold text-yellow-400 mb-4 uppercase tracking-wide">Let's Connect</h2>
              <p className="font-inter text-[#7AA2B8] text-sm mb-6 leading-relaxed opacity-90 border-l-2 border-yellow-400/30 pl-4 italic">
                I'm open to collaborations, freelance work, or just tech discussions.
              </p>
              <div className="space-y-5 text-sm">
                <div><p className="font-orbitron text-[#7AA2B8]/70 text-[10px] tracking-widest uppercase mb-1">STATUS</p><p className="font-inter font-medium text-yellow-400">{data.status}</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="font-orbitron text-[#7AA2B8]/70 text-[10px] tracking-widest uppercase mb-1">LOCATION</p><p className="font-inter font-medium text-slate-300">{data.location}</p></div>
                  <div><p className="font-orbitron text-[#7AA2B8]/70 text-[10px] tracking-widest uppercase mb-1">TIMEZONE</p><p className="font-inter font-medium text-slate-300">{data.timezone}</p></div>
                </div>
                <div><p className="font-orbitron text-[#7AA2B8]/70 text-[10px] tracking-widest uppercase mb-1">AVAILABILITY</p><p className="font-inter font-medium text-slate-300">{data.availability}</p></div>
              </div>
            </div>
            <div className="bg-[#000] p-6 border border-yellow-400/20" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
              <GlobalUplink defaultLocation={data.location} defaultCoordinates={data.coordinates} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.contacts.map((item: any, index: number) => {
              const color = colorMap[item.color] || colorMap.yellow;
              const Icon = iconMap[item.type] || EmailIcon;
              return (
                <a href={item.link} target={item.link?.startsWith("http") ? "_blank" : undefined} rel={item.link?.startsWith("http") ? "noopener noreferrer" : undefined}
                  key={index}
                  className={`relative block group border ${color.border} bg-[#0D1113]/80 backdrop-blur-xl p-6 flex flex-col justify-between transition-all duration-500 hover:border-current overflow-hidden cursor-pointer`}
                  style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
                  <div className={`absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-[0.03] transition duration-500 ${color.bg}`} />
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,100,0.06))] bg-[size:100%_2px,3px_100%]" />
                  <div className="flex justify-between mb-10 z-10 relative">
                    <div className={`p-3 ${color.bg} border ${color.border} ${color.text} group-hover:scale-110 transition-transform`}><Icon className="w-6 h-6" /></div>
                    <span className="font-orbitron text-[10px] text-[#7AA2B8]/50 tracking-widest">0x00{index + 1}</span>
                  </div>
                  <div className="z-10 relative">
                    <h3 className="font-orbitron text-[10px] text-[#7AA2B8]/70 tracking-widest uppercase mb-1">{item.label}</h3>
                    <p className="font-inter text-base md:text-lg mb-6 break-all font-medium text-slate-200">{item.value}</p>
                    <div className={`font-orbitron w-full py-3 border-2 ${color.border} ${color.text} text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${color.hover}`} style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 95% 100%, 0 100%)" }}>
                      {item.button}<span className="text-sm font-inter">→</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
