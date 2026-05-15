"use client";

import { ArrowRight } from "lucide-react";

interface NeonButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export default function NeonButton({
  children,
  onClick,
  href,
  className = "",
}: NeonButtonProps) {
  const content = (
    <>
      <span>{children ?? "LAUNCH SYSTEM"}</span>
      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
    </>
  );

  const baseClass = `neon-btn group ${className}`;

  if (href) {
    return (
      <a href={href} className={baseClass}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClass}>
      {content}
    </button>
  );
}
