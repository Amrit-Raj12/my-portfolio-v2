"use client";

import { useState } from "react";
import { Home, User, FolderKanban, Cpu, Trophy, Gamepad2, Mail, X, Menu } from "lucide-react";

const navItems = [
  { id: "home",         icon: Home,         label: "Home" },
  { id: "about",        icon: User,         label: "About" },
  { id: "projects",     icon: FolderKanban, label: "Projects" },
  { id: "skills",       icon: Cpu,          label: "Skills" },
  { id: "achievements", icon: Trophy,       label: "Achievements" },
  { id: "games",        icon: Gamepad2,     label: "Games" },
  { id: "contact",      icon: Mail,         label: "Contact" },
];

interface Props {
  activeId: string;
  onNavigate: (id: string) => void;
}

export default function SPAMobileNav({ activeId, onNavigate }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id: string) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  // Bottom 5 icons for quick access
  const bottomItems = navItems.slice(0, 5);

  return (
    <>
      {/* Top bar */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 flex items-center justify-between px-5 py-4 bg-[#06090D]/90 backdrop-blur-md border-b border-neon-cyan/20">
        <button onClick={() => setMenuOpen(true)} className="text-neon-yellow p-1">
          <Menu size={24} />
        </button>
        <span className="font-orbitron text-neon-yellow text-xl font-black tracking-tighter">AR</span>
        <div className="w-8 h-8 flex items-center justify-center border border-neon-cyan/30 rounded-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_#00F0FF]" />
        </div>
      </div>

      {/* Bottom tab bar */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] z-50 flex items-center justify-around py-3 px-2 bg-[#06090D]/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        {bottomItems.map(({ id, icon: Icon, label }) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              aria-label={label}
              className="relative p-2 rounded-xl transition-all duration-200"
              style={{
                background: isActive ? "rgba(255,214,0,0.10)" : "transparent",
                border: isActive ? "1px solid rgba(255,214,0,0.30)" : "1px solid transparent",
                boxShadow: isActive ? "0 0 15px rgba(255,214,0,0.2)" : "none",
              }}
            >
              <Icon
                size={22}
                style={{ color: isActive ? "#FFD600" : "#7AA2B8" }}
              />
            </button>
          );
        })}
      </div>

      {/* Full-screen slide-in menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-[#06090D]/97 backdrop-blur-xl flex flex-col p-8">
          <button
            onClick={() => setMenuOpen(false)}
            className="self-end text-neon-cyan p-2 mb-8 hover:text-neon-yellow transition-colors"
          >
            <X size={32} />
          </button>

          <nav className="flex flex-col gap-6 flex-1 justify-center">
            {navItems.map(({ id, icon: Icon, label }) => {
              const isActive = activeId === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNav(id)}
                  className="flex items-center gap-4 text-left transition-all duration-200"
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-sm border transition-all"
                    style={{
                      color: isActive ? "#FFD600" : "#7AA2B8",
                      borderColor: isActive ? "rgba(255,214,0,0.4)" : "rgba(255,255,255,0.08)",
                      background: isActive ? "rgba(255,214,0,0.08)" : "transparent",
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    className="font-orbitron text-xl tracking-[0.2em]"
                    style={{
                      color: isActive ? "#FFD600" : "#7AA2B8",
                      textShadow: isActive ? "0 0 20px rgba(255,214,0,0.5)" : "none",
                    }}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <span className="ml-auto font-orbitron text-[0.55rem] text-neon-cyan tracking-widest">
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-neon-cyan/20">
            <span className="font-orbitron text-[0.6rem] text-text-muted tracking-widest uppercase">
              ARCHITECT_OS // V2.0.1
            </span>
          </div>
        </div>
      )}
    </>
  );
}
