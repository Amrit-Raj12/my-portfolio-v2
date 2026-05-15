"use client";

import React from 'react';

interface FuturisticHUDProps {
    rotation: number;
    className?: string;
}

const FuturisticHUD: React.FC<FuturisticHUDProps> = ({ rotation, className = "" }) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.8)) drop-shadow(0 0 16px rgba(0, 255, 255, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 16px rgba(0, 255, 255, 1)) drop-shadow(0 0 32px rgba(0, 255, 255, 0.6));
          }
        }

        @keyframes pulseGlowYellow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 16px rgba(255, 215, 0, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 16px rgba(255, 215, 0, 1)) drop-shadow(0 0 32px rgba(255, 215, 0, 0.6));
          }
        }

        @keyframes orbit {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }

        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .animate-pulse-glow-yellow {
          animation: pulseGlowYellow 2s ease-in-out infinite;
        }

        .animate-orbit {
          animation: orbit 3s ease-in-out infinite;
        }
      `}</style>

            <svg
                width="400"
                height="400"
                viewBox="0 0 400 400"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-75"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <defs>
                    {/* Cyan glow with animation */}
                    <filter id="cyanGlow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Enhanced cyan glow */}
                    <filter id="cyanGlowEnhanced">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Yellow glow */}
                    <filter id="yellowGlow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Enhanced yellow glow */}
                    <filter id="yellowGlowEnhanced">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Intense glow for central elements */}
                    <filter id="intenseGlow">
                        <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Gradient for central chip */}
                    <linearGradient id="chipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FFA500" />
                    </linearGradient>

                    {/* Animated gradients */}
                    <radialGradient id="glowGradientCyan">
                        <stop offset="0%" stopColor="#00FFFF" stopOpacity="1">
                            <animate attributeName="stopOpacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor="#00FFFF" stopOpacity="0" />
                    </radialGradient>

                    <radialGradient id="glowGradientYellow">
                        <stop offset="0%" stopColor="#FFD700" stopOpacity="1">
                            <animate attributeName="stopOpacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Background glow circles */}
                <circle cx="200" cy="200" r="180" fill="url(#glowGradientCyan)" opacity="0.1" />
                <circle cx="200" cy="200" r="150" fill="url(#glowGradientYellow)" opacity="0.1" />

                {/* Outer cyan ring - dashed */}
                <circle
                    cx="200"
                    cy="200"
                    r="170"
                    fill="none"
                    stroke="#00FFFF"
                    strokeWidth="3"
                    strokeDasharray="10 5"
                    filter="url(#cyanGlowEnhanced)"
                    opacity="0.8"
                >
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-dashoffset" values="0;100" dur="8s" repeatCount="indefinite" />
                </circle>

                {/* Outer cyan ring - solid sections */}
                <circle
                    cx="200"
                    cy="200"
                    r="165"
                    fill="none"
                    stroke="#00FFFF"
                    strokeWidth="2"
                    strokeDasharray="30 340"
                    filter="url(#cyanGlow)"
                    opacity="0.9"
                >
                    <animate attributeName="stroke-dashoffset" values="0;-370" dur="10s" repeatCount="indefinite" />
                </circle>

                {/* Yellow/gold middle ring - dashed */}
                <circle
                    cx="200"
                    cy="200"
                    r="140"
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="3"
                    strokeDasharray="8 4"
                    filter="url(#yellowGlowEnhanced)"
                    opacity="0.8"
                >
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-dashoffset" values="0;-100" dur="6s" repeatCount="indefinite" />
                </circle>

                {/* Yellow solid sections */}
                <circle
                    cx="200"
                    cy="200"
                    r="135"
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="2"
                    strokeDasharray="25 320"
                    filter="url(#yellowGlow)"
                    opacity="0.9"
                >
                    <animate attributeName="stroke-dashoffset" values="0;345" dur="12s" repeatCount="indefinite" />
                </circle>

                {/* Cyan chevrons - left side */}
                <g filter="url(#cyanGlow)">
                    <path d="M 100 200 L 115 190 L 115 210 Z" fill="none" stroke="#00FFFF" strokeWidth="2">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
                    </path>
                    <path d="M 85 200 L 100 190 L 100 210 Z" fill="none" stroke="#00FFFF" strokeWidth="2">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" begin="0.2s" repeatCount="indefinite" />
                    </path>
                    <path d="M 70 200 L 85 190 L 85 210 Z" fill="none" stroke="#00FFFF" strokeWidth="2">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
                    </path>
                </g>

                {/* Cyan chevrons - right side */}
                <g filter="url(#cyanGlow)">
                    <path d="M 300 200 L 285 190 L 285 210 Z" fill="none" stroke="#00FFFF" strokeWidth="2">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
                    </path>
                    <path d="M 315 200 L 300 190 L 300 210 Z" fill="none" stroke="#00FFFF" strokeWidth="2">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" begin="0.2s" repeatCount="indefinite" />
                    </path>
                    <path d="M 330 200 L 315 190 L 315 210 Z" fill="none" stroke="#00FFFF" strokeWidth="2">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
                    </path>
                </g>

                {/* Central hexagon */}
                <polygon
                    points="200,160 230,177.5 230,212.5 200,230 170,212.5 170,177.5"
                    fill="none"
                    stroke="#00FFFF"
                    strokeWidth="2.5"
                    filter="url(#intenseGlow)"
                >
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                </polygon>

                {/* Inner hexagon details */}
                <polygon
                    points="200,165 225,180 225,210 200,225 175,210 175,180"
                    fill="none"
                    stroke="#00FFFF"
                    strokeWidth="1"
                    opacity="0.5"
                >
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
                </polygon>

                {/* Central microchip */}
                <g filter="url(#intenseGlow)">
                    {/* Chip body */}
                    <rect
                        x="190"
                        y="190"
                        width="20"
                        height="20"
                        fill="url(#chipGradient)"
                        stroke="#FFD700"
                        strokeWidth="1"
                    >
                        <animate attributeName="opacity" values="1;0.8;1" dur="1.5s" repeatCount="indefinite" />
                    </rect>

                    {/* Chip pins - top */}
                    <line x1="195" y1="190" x2="195" y2="180" stroke="#FFD700" strokeWidth="1.5">
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                    </line>
                    <line x1="200" y1="190" x2="200" y2="180" stroke="#FFD700" strokeWidth="1.5">
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin="0.3s" repeatCount="indefinite" />
                    </line>
                    <line x1="205" y1="190" x2="205" y2="180" stroke="#FFD700" strokeWidth="1.5">
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin="0.6s" repeatCount="indefinite" />
                    </line>

                    {/* Chip pins - bottom */}
                    <line x1="195" y1="210" x2="195" y2="220" stroke="#FFD700" strokeWidth="1.5">
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin="0.9s" repeatCount="indefinite" />
                    </line>
                    <line x1="200" y1="210" x2="200" y2="220" stroke="#FFD700" strokeWidth="1.5">
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin="1.2s" repeatCount="indefinite" />
                    </line>
                    <line x1="205" y1="210" x2="205" y2="220" stroke="#FFD700" strokeWidth="1.5">
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin="1.5s" repeatCount="indefinite" />
                    </line>

                    {/* Chip pins - left */}
                    <line x1="190" y1="195" x2="180" y2="195" stroke="#FFD700" strokeWidth="1.5">
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                    </line>
                    <line x1="190" y1="200" x2="180" y2="200" stroke="#FFD700" strokeWidth="1.5">
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin="0.3s" repeatCount="indefinite" />
                    </line>
                    <line x1="190" y1="205" x2="180" y2="205" stroke="#FFD700" strokeWidth="1.5">
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin="0.6s" repeatCount="indefinite" />
                    </line>

                    {/* Chip pins - right */}
                    <line x1="210" y1="195" x2="220" y2="195" stroke="#FFD700" strokeWidth="1.5">
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin="0.9s" repeatCount="indefinite" />
                    </line>
                    <line x1="210" y1="200" x2="220" y2="200" stroke="#FFD700" strokeWidth="1.5">
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin="1.2s" repeatCount="indefinite" />
                    </line>
                    <line x1="210" y1="205" x2="220" y2="205" stroke="#FFD700" strokeWidth="1.5">
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin="1.5s" repeatCount="indefinite" />
                    </line>

                    {/* Circuit traces */}
                    <line x1="200" y1="180" x2="200" y2="165" stroke="#00FFFF" strokeWidth="1" opacity="0.7">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                    </line>
                    <line x1="200" y1="220" x2="200" y2="235" stroke="#00FFFF" strokeWidth="1" opacity="0.7">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0.5s" repeatCount="indefinite" />
                    </line>
                    <line x1="180" y1="200" x2="175" y2="200" stroke="#00FFFF" strokeWidth="1" opacity="0.7">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="1s" repeatCount="indefinite" />
                    </line>
                    <line x1="220" y1="200" x2="225" y2="200" stroke="#00FFFF" strokeWidth="1" opacity="0.7">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="1.5s" repeatCount="indefinite" />
                    </line>
                </g>

                {/* Orbital dots on yellow ring */}
                <circle cx="200" cy="65" r="5" fill="#FFD700" filter="url(#yellowGlow)">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="330" cy="200" r="4" fill="#FFD700" filter="url(#yellowGlow)" opacity="0.8">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
                </circle>
                <circle cx="200" cy="335" r="4" fill="#FFD700" filter="url(#yellowGlow)" opacity="0.8">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1.2s" repeatCount="indefinite" />
                </circle>

                {/* Small decorative dots on outer ring */}
                <g filter="url(#cyanGlow)">
                    <circle cx="200" cy="30" r="2" fill="#00FFFF" opacity="0.6">
                        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="270" cy="60" r="2" fill="#00FFFF" opacity="0.6">
                        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" begin="0.25s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="320" cy="130" r="2" fill="#00FFFF" opacity="0.6">
                        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" begin="0.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="340" cy="200" r="2" fill="#00FFFF" opacity="0.6">
                        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" begin="0.75s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="320" cy="270" r="2" fill="#00FFFF" opacity="0.6">
                        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" begin="1s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="270" cy="340" r="2" fill="#00FFFF" opacity="0.6">
                        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" begin="1.25s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="200" cy="370" r="2" fill="#00FFFF" opacity="0.6">
                        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" begin="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="130" cy="340" r="2" fill="#00FFFF" opacity="0.6">
                        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" begin="1.75s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="80" cy="270" r="2" fill="#00FFFF" opacity="0.6">
                        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" begin="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="60" cy="200" r="2" fill="#00FFFF" opacity="0.6">
                        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" begin="2.25s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="80" cy="130" r="2" fill="#00FFFF" opacity="0.6">
                        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" begin="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="130" cy="60" r="2" fill="#00FFFF" opacity="0.6">
                        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" begin="2.75s" repeatCount="indefinite" />
                    </circle>
                </g>

                {/* Corner accents */}
                <g filter="url(#cyanGlow)" opacity="0.5">
                    <line x1="185" y1="170" x2="175" y2="175" stroke="#00FFFF" strokeWidth="1">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
                    </line>
                    <line x1="215" y1="170" x2="225" y2="175" stroke="#00FFFF" strokeWidth="1">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin="0.5s" repeatCount="indefinite" />
                    </line>
                    <line x1="185" y1="230" x2="175" y2="225" stroke="#00FFFF" strokeWidth="1">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin="1s" repeatCount="indefinite" />
                    </line>
                    <line x1="215" y1="230" x2="225" y2="225" stroke="#00FFFF" strokeWidth="1">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin="1.5s" repeatCount="indefinite" />
                    </line>
                </g>
            </svg>
        </div>
    );
};

export default FuturisticHUD;