"use client";

import { useState } from "react";
import { Home, User, FolderKanban, Cpu, Trophy, Gamepad2, Mail } from "lucide-react";

type NavItem = { id: string; icon: React.ReactNode; label: string };

const navItems: NavItem[] = [
  { id: "home", icon: <Home size={20} />, label: "Home" },
  { id: "about", icon: <User size={20} />, label: "About" },
  { id: "projects", icon: <FolderKanban size={20} />, label: "Projects" },
  { id: "skills", icon: <Cpu size={20} />, label: "Skills" },
  { id: "achievements", icon: <Trophy size={20} />, label: "Achievements" },
  { id: "games", icon: <Gamepad2 size={20} />, label: "Games" },
  { id: "contact", icon: <Mail size={20} />, label: "Contact" },
];

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const socialLinks = [
  { icon: <GithubIcon />, href: "https://github.com/Amrit-Raj12", label: "GitHub" },
  { icon: <LinkedInIcon />, href: "https://www.linkedin.com/in/amrit-raj-sh/", label: "LinkedIn" },
  { icon: <InstagramIcon />, href: "https://www.instagram.com/___amrit___raj", label: "Instagram" },
];

interface SPASidebarProps {
  activeId: string;
  onNavigate: (id: string) => void;
}

export default function SPASidebar({ activeId, onNavigate }: SPASidebarProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav
      className="sidebar-border fixed left-0 top-0 h-full z-50 hidden md:flex flex-col items-center py-6 gap-2"
      style={{
        width: "var(--sidebar-width)",
        background: "linear-gradient(180deg, rgba(6,9,13,0.98) 0%, rgba(0,240,255,0.03) 100%)",
      }}
    >
      {/* Logo */}
      <div className="mb-8 flex items-center justify-center">
        <div
          className="relative flex items-center justify-center w-12 h-12 rounded-sm overflow-hidden"
          style={{
            background: "rgba(0,240,255,0.08)",
            border: "1px solid rgba(0,240,255,0.4)",
            boxShadow: "0 0 15px rgba(0,240,255,0.2)",
          }}
        >
          <img src="/assets/images/logo.png" alt="AR" className="w-full h-full object-contain p-1" />
        </div>
      </div>

      {/* Nav Icons */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          const isHovered = hovered === item.id;
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onNavigate(item.id)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                aria-label={item.label}
                className="relative flex items-center justify-center w-12 h-12 rounded-sm transition-all duration-300 cursor-pointer"
                style={{
                  color: isActive ? "#FFD600" : isHovered ? "#00F0FF" : "#7AA2B8",
                  background: isActive ? "rgba(255,214,0,0.08)" : isHovered ? "rgba(0,240,255,0.08)" : "transparent",
                  border: isActive
                    ? "1px solid rgba(255,214,0,0.4)"
                    : isHovered
                      ? "1px solid rgba(0,240,255,0.3)"
                      : "1px solid transparent",
                  boxShadow: isActive
                    ? "0 0 12px rgba(255,214,0,0.4), inset 0 0 8px rgba(255,214,0,0.05)"
                    : isHovered
                      ? "0 0 12px rgba(0,240,255,0.4)"
                      : "none",
                }}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                    style={{ background: "#FFD600", boxShadow: "0 0 8px #FFD600" }}
                  />
                )}
                {item.icon}
              </button>

              {/* Tooltip */}
              <div
                className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded text-xs whitespace-nowrap pointer-events-none transition-all duration-200 cyber-heading"
                style={{
                  fontSize: "0.65rem",
                  background: "rgba(6,9,13,0.95)",
                  border: "1px solid rgba(0,240,255,0.3)",
                  color: "#00F0FF",
                  opacity: isHovered ? 1 : 0,
                  transform: `translateY(-50%) translateX(${isHovered ? "0" : "-6px"})`,
                  zIndex: 100,
                  textShadow: "0 0 8px rgba(0,240,255,0.4)",
                }}
              >
                {item.label}
                <span
                  className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent"
                  style={{ borderRightColor: "rgba(0,240,255,0.3)" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div
        className="w-8 my-2"
        style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,240,255,0.4), transparent)" }}
      />

      {/* Social Icons */}
      <div className="flex flex-col items-center gap-2 pb-2">
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex items-center justify-center w-9 h-9 rounded-sm transition-all duration-300"
            style={{ color: "#7AA2B8", border: "1px solid transparent" }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#00F0FF";
              el.style.boxShadow = "0 0 10px rgba(0,240,255,0.5)";
              el.style.border = "1px solid rgba(0,240,255,0.3)";
              el.style.background = "rgba(0,240,255,0.05)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#7AA2B8";
              el.style.boxShadow = "none";
              el.style.border = "1px solid transparent";
              el.style.background = "transparent";
            }}
          >
            {social.icon}
          </a>
        ))}
      </div>
    </nav>
  );
}
