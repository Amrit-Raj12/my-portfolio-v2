"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   MODULE-LEVEL SINGLETON
   Audio lives outside React so page navigations never recreate/destroy it.
   The component just reads & controls the single shared instance.
───────────────────────────────────────────────────────────────────────── */
let _audio: HTMLAudioElement | null = null;
let _playing = false;
let _volume = 0.4;

function getAudio(): HTMLAudioElement {
  if (!_audio) {
    _audio = new Audio("/assets/audios/Cyberpunk_2077.opus");
    _audio.loop = true;
    _audio.volume = _volume;
  }
  return _audio;
}

/* ── Animated equalizer bars ─────────────────────────────────────────── */
function EqualizerBars({ playing }: { playing: boolean }) {
  const bars = [
    { delay: "0s", minH: "30%", maxH: "90%" },
    { delay: "0.18s", minH: "55%", maxH: "100%" },
    { delay: "0.08s", minH: "25%", maxH: "70%" },
    { delay: "0.24s", minH: "45%", maxH: "85%" },
    { delay: "0.12s", minH: "35%", maxH: "75%" },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "2.5px",
        height: "18px",
        width: "24px",
      }}
    >
      {bars.map((b, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: playing ? b.maxH : "20%",
            background: "linear-gradient(180deg, #00F0FF 0%, #FFD600 100%)",
            borderRadius: "2px 2px 0 0",
            boxShadow: playing ? "0 0 6px rgba(0,240,255,0.9)" : "none",
            transition: playing ? "none" : "height 0.3s ease, box-shadow 0.3s ease",
            animation: playing
              ? `sbAnim 0.75s ease-in-out infinite alternate`
              : "none",
            animationDelay: b.delay,
            transformOrigin: "bottom",
          }}
        />
      ))}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */
export default function SoundBar() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [mounted, setMounted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Sync module state → React state on mount (e.g. after soft navigation) */
  useEffect(() => {
    setMounted(true);
    setPlaying(_playing);
    setVolume(_volume);
  }, []);

  /* Volume change propagates to singleton */
  const handleVolume = (val: number) => {
    _volume = val;
    getAudio().volume = val;
    setVolume(val);
  };

  const togglePlay = () => {
    const audio = getAudio();
    if (_playing) {
      audio.pause();
      _playing = false;
      setPlaying(false);
    } else {
      audio.play().catch(() => { });
      _playing = true;
      setPlaying(true);
    }
  };

  const showPanel = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setShowVolume(true);
  };
  const startHide = () => {
    hideTimer.current = setTimeout(() => setShowVolume(false), 700);
  };

  if (!mounted) return null;

  const volPct = Math.round(volume * 100);

  return (
    <>
      {/* ── Injected keyframes (no Tailwind plugin needed) ────────── */}
      <style>{`
        @keyframes sbAnim {
          0%   { transform: scaleY(0.4); }
          100% { transform: scaleY(1); }
        }
        .sb-btn:hover {
          background: rgba(0,240,255,0.12) !important;
          box-shadow:  0 0 22px rgba(0,240,255,0.55),
                       0 0 44px rgba(0,240,255,0.2) !important;
          border-color: rgba(0,240,255,0.85) !important;
        }
        .sb-vol::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px; height: 12px;
          border-radius: 50%;
          background: #00F0FF;
          cursor: pointer;
          box-shadow: 0 0 7px #00F0FF;
        }
        .sb-vol::-moz-range-thumb {
          width: 12px; height: 12px;
          border-radius: 50%;
          background: #00F0FF;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 7px #00F0FF;
        }
        .sb-vol {
          -webkit-appearance: none;
          width: 100%;
          height: 3px;
          background: linear-gradient(
            90deg,
            #00F0FF calc(var(--vp, 40) * 1%),
            rgba(0,240,255,0.15) calc(var(--vp, 40) * 1%)
          );
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }
      `}</style>

      {/* ── Floating container (top-right) ───────────────────────── */}
      <div
        onMouseEnter={showPanel}
        onMouseLeave={startHide}
        className="md:top-[20px] md:right-[22px] top-[10px] right-[10px]"
        style={{
          position: "fixed",
          // top: "44px",
          // right: "22px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",   /* button first, panel below */
          alignItems: "flex-end",
          gap: "8px",
          pointerEvents: "auto",
        }}
      >
        {/* ── Play / Pause button ─────────────────────────────────── */}
        <button
          id="global-soundbar-btn"
          onClick={togglePlay}
          aria-label={playing ? "Pause music" : "Play music"}
          className="sb-btn"
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "6px",
            background: playing
              ? "rgba(0,240,255,0.09)"
              : "rgba(6,9,13,0.88)",
            border: playing
              ? "1px solid rgba(0,240,255,0.65)"
              : "1px solid rgba(0,240,255,0.28)",
            boxShadow: playing
              ? "0 0 18px rgba(0,240,255,0.45), 0 0 36px rgba(0,240,255,0.15)"
              : "0 0 8px rgba(0,240,255,0.08)",
            cursor: "pointer",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Gold corner accents */}
          <span style={{
            position: "absolute", top: 2, left: 2, width: 8, height: 8,
            borderTop: "1.5px solid rgba(255,214,0,0.65)",
            borderLeft: "1.5px solid rgba(255,214,0,0.65)"
          }} />
          <span style={{
            position: "absolute", bottom: 2, right: 2, width: 8, height: 8,
            borderBottom: "1.5px solid rgba(255,214,0,0.65)",
            borderRight: "1.5px solid rgba(255,214,0,0.65)"
          }} />

          {playing
            ? <EqualizerBars playing />
            : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#00F0FF"
                style={{ filter: "drop-shadow(0 0 5px rgba(0,240,255,0.9))", marginLeft: 2 }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )
          }
        </button>

        {/* Track label (visible while playing) */}
        <div style={{
          opacity: playing ? 0.75 : 0,
          transition: "opacity 0.4s ease",
          fontFamily: "Orbitron, sans-serif",
          fontSize: "0.42rem",
          color: "#00F0FF",
          letterSpacing: "0.15em",
          textAlign: "right",
          textShadow: "0 0 6px rgba(0,240,255,0.7)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          lineHeight: 1,
        }}>
          ♪ CYBERPUNK 2077 OST
        </div>

        {/* ── Volume panel (drops down on hover) ─────────────────── */}
        <div style={{
          opacity: showVolume ? 1 : 0,
          transform: showVolume ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.95)",
          transition: "opacity 0.22s ease, transform 0.22s ease",
          pointerEvents: showVolume ? "auto" : "none",
          background: "rgba(6,9,13,0.95)",
          border: "1px solid rgba(0,240,255,0.28)",
          backdropFilter: "blur(14px)",
          borderRadius: "6px",
          padding: "12px 14px",
          minWidth: "146px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.5), 0 0 18px rgba(0,240,255,0.1)",
        }}>
          <div style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "0.5rem",
            color: "#7AA2B8",
            letterSpacing: "0.22em",
            marginBottom: "8px",
            textTransform: "uppercase",
          }}>
            VOLUME
          </div>
          <input
            type="range"
            min={0} max={100}
            value={volPct}
            onChange={e => handleVolume(Number(e.target.value) / 100)}
            className="sb-vol"
            style={{ "--vp": volPct } as React.CSSProperties}
          />
          <div style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "0.58rem",
            color: "#00F0FF",
            textAlign: "right",
            marginTop: "6px",
            letterSpacing: "0.1em",
          }}>
            {volPct}%
          </div>
        </div>
      </div>
    </>
  );
}