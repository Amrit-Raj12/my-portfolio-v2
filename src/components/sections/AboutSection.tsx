"use client";

import { motion } from "framer-motion";
import { Calendar, FolderOpen, Code2, Star, Globe, PenTool, Server, Brain, Gamepad2, Music, Plane, SquarePlay, BookOpen, Download, Sparkle } from "lucide-react";
import aboutData from "../../datas/AboutMe.json";

const iconMap: Record<string, any> = {
  Calendar, FolderOpen, Code2, Star, Globe, PenTool, Server, Brain, Gamepad2, Music, Plane, SquarePlay, BookOpen, Sparkle,
};

function HUDHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="font-orbitron text-[0.65rem] text-neon-cyan/40 tracking-[0.2em]">{"// "}</span>
      <span className="font-orbitron text-[0.7rem] text-neon-cyan tracking-[0.2em] font-bold uppercase">{label}</span>
      <div className="flex-1 h-[1px] bg-gradient-to-r from-neon-cyan/20 to-transparent ml-2" />
    </div>
  );
}

function HUDFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative border border-neon-cyan/20 bg-cyber-bg/40 backdrop-blur-sm p-4 lg:p-8 rounded-md ${className}`}>
      <div className="absolute w-4 h-4 border-t-2 border-l-2 border-neon-cyan opacity-40 top-0 left-0" />
      <div className="absolute w-4 h-4 border-t-2 border-r-2 border-neon-cyan opacity-40 top-0 right-0" />
      <div className="absolute w-4 h-4 border-b-2 border-l-2 border-neon-cyan opacity-40 bottom-0 left-0" />
      <div className="absolute w-4 h-4 border-b-2 border-r-2 border-neon-cyan opacity-40 bottom-0 right-0" />
      {children}
    </div>
  );
}

function QuickFact({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-neon-cyan/10 hover:border-neon-cyan/40 transition-colors group text-center">
      <div className="mb-2 text-neon-cyan/60 group-hover:text-neon-cyan transition-colors"><Icon size={24} /></div>
      <div className="font-orbitron text-xl font-bold text-neon-yellow text-glow-yellow">{value}</div>
      <div className="font-orbitron text-[0.55rem] text-text-muted tracking-widest text-center mt-1 uppercase">{label}</div>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="flex gap-4 p-4 border border-neon-cyan/10 hover:bg-neon-cyan/5 transition-all group">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-neon-cyan/20 group-hover:border-neon-cyan transition-all">
        <Icon size={24} className="text-neon-cyan" />
      </div>
      <div>
        <h4 className="font-orbitron text-sm font-bold text-neon-yellow mb-1 tracking-wide">{title}</h4>
        <p className="text-[0.7rem] text-text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function InterestIcon({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-default">
      <div className="w-12 h-12 rounded-full border border-neon-cyan/20 flex items-center justify-center text-neon-cyan/60 group-hover:text-neon-cyan group-hover:border-neon-cyan transition-all">
        <Icon size={20} />
      </div>
      <span className="font-orbitron text-[0.6rem] text-text-muted tracking-wider group-hover:text-neon-yellow transition-colors">{label}</span>
    </div>
  );
}

export default function AboutSection() {
  return (
    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden selection:bg-neon-cyan/30 selection:text-white" style={{ background: "#06090D" }}>
      {/* Background image — absolute (not fixed) so it stays within this section */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: "#06090D" }}>
        <div className="absolute inset-0 opacity-60 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/assets/images/about-me-bg.webp')" }} />
      </div>

      <main className="min-h-full p-4 md:p-8 lg:p-10 pt-8 flex items-start justify-center">
        <div className="relative w-full max-w-[1620px] border border-neon-cyan/30 p-2 md:p-4 bg-black/40 backdrop-blur-md">
          <div className="absolute -top-[2px] -left-[2px] w-12 h-12 border-t-2 border-l-2 border-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
          <div className="absolute -top-[2px] -right-[2px] w-12 h-12 border-t-2 border-r-2 border-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
          <div className="absolute -bottom-[2px] -left-[2px] w-12 h-12 border-b-2 border-l-2 border-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
          <div className="absolute -bottom-[2px] -right-[2px] w-12 h-12 border-b-2 border-r-2 border-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.5)]" />

          <div className="p-4 lg:p-10 flex flex-col gap-8">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-neon-cyan/10">
              <span className="font-orbitron text-[0.6rem] text-neon-cyan/60 tracking-[0.3em]">{"// ABOUT_ME"}</span>
              <div className="hidden md:flex items-center gap-2">
                <span className="font-orbitron text-[0.55rem] text-text-muted tracking-widest uppercase">STATUS</span>
                <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_10px_#00F0FF]" />
                <span className="font-orbitron text-[0.55rem] text-neon-cyan font-bold tracking-widest">ONLINE</span>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">
              {/* LEFT */}
              <div className="xl:col-span-5 flex flex-col gap-10">
                <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                  <div className="flex items-center gap-3"><div className="w-2 h-2 bg-yellow-400/40" /><span className="font-orbitron text-[0.7rem] text-yellow-400/60 tracking-[0.4em] font-black uppercase">Module_01: KNOW_ME</span></div>
                  {/* <span className="font-orbitron text-[0.7rem] text-text-muted tracking-[0.25em] mb-2 block">{"// GET TO KNOW ME"}</span> */}
                  <h2 className="font-scary text-[#FFD600] text-4xl md:text-7xl tracking-tight leading-[0.9] mb-4 text-glow-yellow">{aboutData.bio.title}</h2>
                  <p className="font-inter text-[#7AA2B8] text-[0.95rem] leading-relaxed tracking-wide max-w-[500px] mb-8">{aboutData.bio.description}</p>
                  <a href={aboutData.bio.resumeUrl} className="group relative inline-flex items-center gap-4 px-6 py-3 border border-neon-yellow/60 bg-neon-yellow/5 font-orbitron text-[0.75rem] font-bold tracking-[0.2em] text-neon-yellow transition-all hover:bg-neon-yellow hover:text-black">
                    <Download size={16} /> DOWNLOAD RESUME
                  </a>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                  <HUDHeader label="MY JOURNEY" />
                  <HUDFrame className="flex flex-col gap-6 py-8">
                    <div className="relative pl-8 space-y-8">
                      <div className="absolute left-3 top-[10px] bottom-0 w-[1px] bg-gradient-to-b from-neon-yellow via-neon-yellow/40 to-transparent" />
                      {aboutData.timeline.map((item, idx) => (
                        <div key={idx} className="relative">
                          <div className={`absolute rounded-full border border-neon-yellow flex items-center justify-center bg-[#06090D] ${idx === 0 ? "w-4 h-4 -left-[28px] top-0.5" : "w-3 h-3 -left-[26px] top-1"}`}>
                            <div className={`rounded-full bg-neon-cyan shadow-[0_0_8px_#00F0FF] ${idx === 0 ? "w-2 h-2" : "w-1.5 h-1.5"}`} />
                          </div>
                          <div className="font-orbitron text-[0.7rem] text-neon-yellow font-bold tracking-wider mb-1">{item.year}</div>
                          <div className="font-orbitron text-sm text-text-primary font-bold mb-2 tracking-wide uppercase">{item.role}</div>
                          <p className="text-[0.7rem] text-text-muted leading-relaxed max-w-[400px]">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </HUDFrame>
                </motion.section>
              </div>

              {/* RIGHT */}
              <div className="xl:col-span-7 flex flex-col gap-8 lg:gap-10">
                <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                  <HUDHeader label="QUICK FACTS" />
                  <HUDFrame className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {aboutData.quickFacts.map((fact, idx) => {
                      const Icon = iconMap[fact.icon];
                      return <QuickFact key={idx} icon={Icon} value={fact.value} label={fact.label} />;
                    })}
                  </HUDFrame>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                  <HUDHeader label="WHAT I DO" />
                  <HUDFrame className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aboutData.services.map((service, idx) => {
                      const Icon = iconMap[service.icon];
                      return <ServiceCard key={idx} icon={Icon} title={service.title} description={service.description} />;
                    })}
                  </HUDFrame>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                  <HUDHeader label="BEYOND CODE" />
                  <HUDFrame className="flex flex-wrap justify-between gap-6 py-8 px-10">
                    {aboutData.interests.map((item, idx) => {
                      const Icon = iconMap[item.icon];
                      return <InterestIcon key={idx} icon={Icon} label={item.label} />;
                    })}
                  </HUDFrame>
                </motion.section>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-4 pt-4 border-t border-neon-cyan/10 flex items-center justify-between overflow-hidden">
              <div className="flex gap-2">{[...Array(12)].map((_, i) => <div key={i} className="w-6 h-[2px] bg-neon-yellow/20 -skew-x-[45deg]" />)}</div>
              <span className="font-orbitron text-[0.6rem] text-neon-cyan/40 tracking-[0.4em] whitespace-nowrap px-4">{"// BUILDING DIGITAL FUTURES //"}</span>
              <div className="flex gap-2">{[...Array(12)].map((_, i) => <div key={i} className="w-6 h-[2px] bg-neon-yellow/20 -skew-x-[45deg]" />)}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
