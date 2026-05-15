import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import SoundBar from "@/components/SoundBar";
import GlobalHUD from "@/components/GlobalHUD";
import NeonCursor from "@/components/NeonCursor";

export const metadata: Metadata = {
  title: "AR Portfolio | FullStack Developer",
  description:
    "Explore the futuristic portfolio of Amrit Raj Sharma — Full Stack & AI Developer crafting immersive digital experiences, intelligent systems, Next.js, React, AI, and modern web technologies.",

  keywords: [
    "Amrit Raj Sharma",
    "Full Stack Developer",
    "AI Developer",
    "Frontend Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
    "Web Developer",
    "MERN Stack",
    "Portfolio Website",
    "JavaScript",
    "AI Engineer",
    "Creative Developer",
    "Gaming Portfolio",
    "Modern UI",
    "Interactive Portfolio",
    "Neural Interface",
    "Software Engineer"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="antialiased" suppressHydrationWarning>
        <NeonCursor />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <SoundBar />
        <GlobalHUD />
      </body>
    </html>
  );
}
