"use client";

import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  color: string;
};

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    const particles: Particle[] = [];

    const resetParticle = (particle: Particle, fromBottom = false) => {
      particle.x = Math.random() * width;
      particle.y = fromBottom ? height + 10 : Math.random() * height;
      particle.size = Math.random() * 1.7 + 0.7;
      particle.speedX = (Math.random() - 0.5) * 0.35;
      particle.speedY = -Math.random() * 0.55 - 0.15;
      particle.alpha = Math.random() * 0.55 + 0.15;
      particle.color = Math.random() > 0.42 ? "204,255,0" : "0,240,255";
    };

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    resize();
    for (let index = 0; index < 42; index += 1) {
      const particle = {} as Particle;
      resetParticle(particle);
      particles.push(particle);
    }

    const animate = () => {
      context.clearRect(0, 0, width, height);
      for (const particle of particles) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        if (particle.y < -10 || particle.x < -10 || particle.x > width + 10) {
          resetParticle(particle, true);
        }
        context.beginPath();
        context.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    animate();
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-20 opacity-70" aria-hidden="true" />;
}

function HudBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative bg-[#080e14]/85 backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:border before:border-cyan-300/15 ${className}`}
      style={{ clipPath: "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)" }}
    >
      {children}
    </div>
  );
}

function RadarMark() {
  return (
    <div className="relative flex size-16 shrink-0 items-center justify-center rounded-full border border-[#ccff00]/45 bg-black/70 shadow-[0_0_15px_rgba(204,255,0,0.2)]">
      <div className="absolute inset-1.5 rounded-full border border-dashed border-[#ccff00]/30" />
      <div className="absolute inset-3 rounded-full border border-cyan-300/30" />
      <div className="absolute h-px w-full bg-[#ccff00]/30" />
      <div className="absolute h-full w-px bg-[#ccff00]/30" />
      <div className="absolute inset-0 animate-[spin_4s_linear_infinite] rounded-full bg-gradient-to-tr from-transparent via-[#ccff00]/30 to-transparent" />
      <div className="relative size-2 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00]" />
    </div>
  );
}

export default function HeroV2Page() {
  const modelRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (window.innerWidth < 1024) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      const modelScale = 1.02;
      const modelOffsetY = window.innerWidth >= 2560 ? -32 : 16;
      if (modelRef.current) modelRef.current.style.transform = `translate(${x * -18}px, ${y * -12 + modelOffsetY}px) scale(${modelScale})`;
      if (backgroundRef.current) backgroundRef.current.style.transform = `scale(1.05) translate(${x * 10}px, ${y * 8}px)`;
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04070a] text-slate-100 selection:bg-[#ccff00] selection:text-black">
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#04070a]">
        <div ref={backgroundRef} className="absolute -inset-[2%] transition-transform duration-300 ease-out">
          <Image src="/assets/images/background.png" alt="Cyberpunk city skyline" fill priority className="object-cover object-center" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-[#04070a]/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04070a] via-[#04070a]/45 to-[#04070a]/70" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.05)_1px,transparent_1px)] [background-size:55px_55px]" />
      </div>
      <ParticleField />

      <section className="relative z-30 mx-auto flex min-h-screen w-full max-w-[1600px] translate-y-8 flex-col justify-between px-4 pb-8 pt-4 transition-transform duration-300 sm:px-6 md:px-10 lg:px-14 min-[2560px]:-translate-y-16">
        <div className="pointer-events-none absolute inset-x-0 top-[clamp(2rem,4vh,5rem)] z-10 hidden translate-y-4 justify-center overflow-visible px-3 lg:flex lg:top-[clamp(2rem,4vh,6rem)] xl:top-[clamp(4rem,8vh,8rem)] 2xl:top-[clamp(5rem,10vh,10rem)] min-[2560px]:top-[clamp(7rem,14vh,12rem)] min-[2560px]:translate-y-4">
          <div className="glitch-wrapper">
            <h1
              className="glitch whitespace-nowrap font-scary text-[clamp(3.5rem,16vw,8rem)] font-normal uppercase leading-none tracking-[0.08em] text-center opacity-90 drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] sm:text-[clamp(5rem,12vw,10rem)] md:text-[clamp(6rem,11vw,11rem)] lg:text-[clamp(6rem,14vw,14rem)] xl:text-[clamp(6rem,12vw,15rem)]"
              data-text="CODEVERSE"
              style={{
                background: "#b7ff00",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CODEVERSE
            </h1>
            <span className="glitch-underline" aria-hidden="true" />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-40 hidden items-center justify-center lg:flex min-[2560px]:-translate-y-8">
          <div ref={modelRef} className="relative z-40 h-full w-full max-w-6xl -translate-y-8 transition-transform duration-300 ease-out lg:-translate-y-12 xl:-translate-y-16 2xl:-translate-y-20 min-[2560px]:max-w-[1400px] min-[2560px]:-translate-y-32">
            <Image src="/assets/images/main_model.png" alt="Cyberpunk character" fill priority className="pointer-events-none object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)] lg:translate-x-10" sizes="(max-width: 1024px) 100vw, 900px" />
          </div>
        </div>

        <div className="relative z-20 mx-auto mt-2 flex w-full max-w-[320px] justify-center lg:hidden">
          <div className="relative h-[300px] w-full overflow-visible bg-transparent">
            <div className="absolute inset-x-5 top-3 flex items-center justify-between font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-[#d7f8ff]">
              <span className="flex items-center gap-1.5"><span className="inline-flex size-1.5 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00]" />LIVE</span>
              <span className="rounded border border-[#ccff00]/40 px-1.5 py-0.5 text-[#ccff00]">ACTIVE</span>
            </div>
            <div className="absolute inset-x-0 bottom-[-20px] top-20 md:bottom-[-24px] md:top-24">
              <Image src="/assets/images/main_model.png" alt="Cyberpunk character" fill priority className="pointer-events-none object-contain object-bottom drop-shadow-[0_18px_40px_rgba(0,0,0,0.9)]" sizes="320px" />
            </div>
          </div>
        </div>

        <div className="relative z-30 mt-3 grid flex-1 grid-cols-1 items-end gap-6 text-center sm:mt-6 lg:mt-44 lg:grid-cols-12 lg:gap-6 lg:text-left xl:mt-64 xl:gap-8 min-[2560px]:z-[60]">
          <div className="pointer-events-auto space-y-4 sm:space-y-5 lg:col-span-6">
            <div className="flex items-center justify-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[#8094a5] sm:text-xs lg:justify-start"><span>Frontend Developer</span><span className="h-px w-8 bg-[#ccff00] shadow-[0_0_8px_#ccff00] sm:w-10" /></div>
            <div className="space-y-1">
              <h2 className="font-scary text-4xl font-normal leading-none tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] sm:text-6xl md:text-5xl lg:text-7xl">AMRIT <span className="text-[#ccff00] drop-shadow-[0_0_25px_rgba(204,255,0,0.7)]">RAJ</span></h2>
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-300 sm:text-sm md:text-lg">Frontend Developer</div>
            </div>
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-300 drop-shadow-md sm:text-base lg:mx-0">Turning ideas into immersive, high-performance web experiences with modern tech and a creative mindset.</p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 sm:gap-4 sm:pt-2 lg:justify-start">
              <a href="#projects" className="inline-flex items-center gap-2.5 rounded-full bg-[#ccff00] px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(204,255,0,0.55),0_0_45px_rgba(204,255,0,0.25)] transition-transform hover:scale-105 sm:px-7 sm:text-sm">View My Work <ArrowRight className="size-4" /></a>
              <a href="#about" className="rounded-full border border-[#ccff00]/40 bg-black/70 px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-widest text-slate-200 backdrop-blur-md transition hover:border-[#ccff00] hover:text-white hover:shadow-[0_0_15px_rgba(204,255,0,0.35)] sm:px-8 sm:text-sm">About Me</a>
            </div>
          </div>

          <div className="pointer-events-auto flex flex-col items-center space-y-4 sm:space-y-5 lg:col-span-4 lg:col-start-9 lg:items-end lg:text-right">
            <div className="max-w-sm space-y-2"><h3 className="font-scary text-2xl uppercase tracking-wider text-[#ccff00] drop-shadow-[0_0_15px_rgba(204,255,0,0.5)] sm:text-3xl">The Future We Build</h3><p className="text-xs leading-relaxed text-slate-300 sm:text-sm">Clean code. Creative UI. Real impact. Exploring the intersection of design, technology and imagination.</p></div>
            <button type="button" aria-label="Watch showreel" className="group flex items-center gap-4 pt-2"><span className="relative flex size-12 items-center justify-center rounded-full border border-[#ccff00] bg-black/50 text-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.5)] transition group-hover:scale-110 group-hover:bg-[#ccff00]/10"><Play className="size-5 fill-current" /><span className="absolute inset-0 animate-ping rounded-full border border-[#ccff00]/30" /></span><span className="border-b border-slate-700 pb-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-200 transition group-hover:text-[#ccff00] sm:text-xs">Watch Showreel</span></button>
          </div>
        </div>

        <HudBox className="z-50 mt-8 border border-[#ccff00]/25 p-4 shadow-[inset_0_0_15px_rgba(204,255,0,0.12),0_0_20px_rgba(0,0,0,0.85)] sm:mt-10 sm:p-5 lg:mt-12 lg:p-7">
          <div className="grid grid-cols-2 gap-3 lg:hidden">
            <div className="flex min-h-[120px] flex-col justify-center rounded border border-[#ccff00]/10 bg-[#07131b]/60 p-3">
              <div className="flex items-center gap-2 pb-2 text-[#ccff00]"><RadarMark /><span className="font-scary text-[2rem] leading-none">2+</span></div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">Years Experience</div>
              <div className="mt-1 text-[11px] leading-tight text-slate-400">Learning. Building. Growing.</div>
            </div>
            <div className="flex min-h-[120px] flex-col justify-center rounded border border-[#ccff00]/10 bg-[#07131b]/60 p-3">
              <div className="font-scary text-[2rem] leading-none text-[#ccff00]">10+</div>
              <div className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">Projects Built</div>
              <div className="mt-1 text-[11px] leading-tight text-slate-400">Turning ideas into real products.</div>
            </div>
            <div className="flex min-h-[120px] flex-col justify-center rounded border border-[#ccff00]/10 bg-[#07131b]/60 p-3">
              <div className="font-scary text-[2rem] leading-none text-[#ccff00]">5+</div>
              <div className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">Tech Stack</div>
              <div className="mt-1 text-[11px] leading-tight text-slate-400">Always exploring what&apos;s next.</div>
            </div>
            <div className="flex min-h-[120px] flex-col justify-center rounded border border-[#ccff00]/10 bg-[#07131b]/60 p-3">
              <div className="mb-2 flex items-center justify-start gap-2">
                <div className="grid size-10 shrink-0 grid-cols-2 gap-0.5 rounded-full border border-cyan-400/40 bg-black/60 p-1 shadow-[0_0_15px_rgba(0,240,255,0.25)]"><span className="flex items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-600/40 text-[7px] font-bold">AR</span><span className="flex items-center justify-center rounded-full border border-[#ccff00]/40 bg-[#ccff00]/40 text-[7px] font-bold text-black">AI</span><span className="flex items-center justify-center rounded-full border border-indigo-400/40 bg-indigo-600/40 text-[7px] font-bold">FL</span><span className="flex items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-600/40 text-[7px] font-bold">DEV</span></div>
              </div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white">Global Community</div>
              <div className="mt-1 text-[11px] leading-tight text-slate-400">Connecting. Sharing. Building together.</div>
            </div>
          </div>

          <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">
            <div className="col-span-2 flex items-center gap-4 border-b border-slate-800/80 pb-4 pr-4 sm:col-span-1 sm:border-b-0 sm:border-r sm:pb-0"><RadarMark /><div><div className="font-scary text-2xl leading-tight text-[#ccff00]">2+</div><div className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-300">Years Experience</div><div className="text-[11px] leading-tight text-slate-400">Learning. Building. Growing.</div></div></div>
            <Metric value="10+" label="Projects Completed" detail="Turning ideas into real products." />
            <Metric value="5+" label="Technologies" detail="Always exploring what&apos;s next." />
            <div className="col-span-2 flex items-center gap-3.5 border-r border-slate-800/80 pr-4 lg:col-span-1"><div className="grid size-14 shrink-0 grid-cols-2 gap-0.5 rounded-full border border-cyan-400/40 bg-black/60 p-1 shadow-[0_0_15px_rgba(0,240,255,0.25)]"><span className="flex items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-600/40 text-[9px] font-bold">AR</span><span className="flex items-center justify-center rounded-full border border-[#ccff00]/40 bg-[#ccff00]/40 text-[9px] font-bold text-black">AI</span><span className="flex items-center justify-center rounded-full border border-indigo-400/40 bg-indigo-600/40 text-[9px] font-bold">FL</span><span className="flex items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-600/40 text-[9px] font-bold">DEV</span></div><div><div className="font-mono text-xs font-bold uppercase tracking-widest text-white">Global Community</div><div className="text-[11px] leading-tight text-slate-400">Connecting. Sharing. Building together.</div></div></div>
            <div className="col-span-2 flex items-center justify-end sm:col-span-1"><a href="#projects" aria-label="Explore projects" className="group relative flex size-14 items-center justify-center rounded-full border border-[#ccff00]/50 text-white shadow-[0_0_15px_rgba(204,255,0,0.3)] transition hover:border-[#ccff00] hover:bg-[#ccff00]/10 hover:text-[#ccff00]"><ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" /><span className="absolute inset-1 rounded-full border border-dashed border-[#ccff00]/30 transition-transform duration-500 group-hover:rotate-45" /></a></div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60 pt-3 font-mono text-[9px] tracking-[0.25em] text-slate-400"><div className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#ccff00] shadow-[0_0_6px_#ccff00]" />STATUS: OPERATIONAL // V.2.6.4</div><div className="flex items-center gap-3">{"// CODE"} <span>EXPLORE</span><span>CREATE</span><span className="text-[#ccff00]">EVOLVE</span><span className="h-0.5 w-6 bg-[#ccff00] shadow-[0_0_6px_#ccff00]" /></div></div>
        </HudBox>
      </section>
    </main>
  );
}

function Metric({ value, label, detail }: { value: string; label: string; detail: string }) {
  return <div className="space-y-0.5 border-r border-slate-800/80 pr-4"><div className="font-scary text-2xl leading-tight text-[#ccff00]">{value}</div><div className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-300">{label}</div><div className="text-[11px] leading-tight text-slate-400">{detail}</div></div>;
}