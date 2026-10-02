"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Floating neon motes (cyan + lime) rendered with three.js, reacting softly to the cursor. */
export default function NeonParticles({ count = 190 }: { count?: number }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.z = 6;

    // soft round sprite
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,255,255,0.7)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(c);

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    const phase = new Float32Array(count);
    const cyan = new THREE.Color("#00f0ff");
    const lime = new THREE.Color("#d4ff00");

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = Math.random() * 7 - 4;
      speed[i] = 0.05 + Math.random() * 0.22;
      phase[i] = Math.random() * Math.PI * 2;
      const col = Math.random() > 0.45 ? cyan : lime;
      colors.set([col.r, col.g, col.b], i * 3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.13,
      map: sprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(geometry, material));

    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    const ro = new ResizeObserver(() => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(host);

    let last = performance.now();
    let elapsed = 0;
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      elapsed += dt;
      const t = elapsed;
      const pos = geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        let y = pos.getY(i) + speed[i] * dt;
        if (y > 5) y = -5;
        pos.setY(i, y);
        pos.setX(i, pos.getX(i) + Math.sin(t * 0.6 + phase[i]) * 0.0025);
      }
      pos.needsUpdate = true;
      material.opacity = 0.7 + Math.sin(t * 1.8) * 0.15;
      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.3 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      sprite.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [count]);

  return <div ref={hostRef} className="pointer-events-none absolute inset-0 mix-blend-screen" aria-hidden />;
}