"use client";

import { Menu, Gamepad2 } from "lucide-react";

interface MobileNavbarProps {
  onMenuOpen: () => void;
}

export default function MobileNavbar({ onMenuOpen }: MobileNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 w-full h-[70px] z-[60] flex items-center justify-between px-5 mobile-glass nav-bottom-border shadow-[0_4px_30px_rgba(0,240,255,0.1)]">
      {/* Left: Menu Toggle */}
      <button 
        onClick={onMenuOpen}
        className="text-neon-cyan hover:text-neon-yellow transition-colors duration-300"
        aria-label="Open Menu"
      >
        <Menu size={28} />
      </button>

      {/* Center: Branding */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-sm border border-neon-cyan/40 p-0.5 overflow-hidden">
             <img src="/assets/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-orbitron text-sm font-bold tracking-[0.15em] text-neon-cyan text-glow-cyan">
            AMRIT RAJ
          </span>
        </div>
        <span className="font-orbitron text-[0.55rem] tracking-[0.2em] text-text-muted mt-0.5">
          MERN STACK DEVELOPER
        </span>
      </div>

      {/* Right: Controller Icon */}
      <div className="text-neon-yellow drop-shadow-[0_0_8px_rgba(255,214,0,0.6)]">
        <Gamepad2 size={24} />
      </div>
    </nav>
  );
}
