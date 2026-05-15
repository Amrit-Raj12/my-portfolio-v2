'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import FuturisticHUD from '@/components/FuturisticHUD';

export default function GlobalHUD() {
  const [rotation, setRotation] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = (e: any) => {
      const target = e.target === document ? window.scrollY : e.target.scrollTop;
      setRotation(target * 0.4);
    };

    const check = () => {
      const hero = document.querySelector('[data-hero-section]');
      if (!hero) {
        setIsVisible(pathname !== '/');
        return;
      }
      
      const style = window.getComputedStyle(hero);
      const isHeroVisible = (hero as HTMLElement).offsetParent !== null && style.visibility !== 'hidden' && style.display !== 'none';
      
      if (pathname === '/') {
        setIsVisible(!isHeroVisible);
      } else {
        setIsVisible(true);
      }
    };

    const interval = setInterval(check, 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    
    const spaInterval = setInterval(() => {
      const spaScroll = document.getElementById('spa-scroll');
      if (spaScroll) {
        spaScroll.addEventListener('scroll', onScroll, { passive: true });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(spaInterval);
      window.removeEventListener('scroll', onScroll);
      const spaScroll = document.getElementById('spa-scroll');
      if (spaScroll) spaScroll.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  const handleHUDClick = () => {
    if (pathname === '/') {
      // Trigger event for SPAPage to handle
      window.dispatchEvent(new CustomEvent('reset-to-landing'));
    } else {
      router.push('/');
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      onClick={handleHUDClick}
      className="fixed bottom-0 right-0 md:bottom-2 md:right-2 z-[9999] scale-[0.25] md:scale-[0.35] origin-bottom-right opacity-80 hover:opacity-100 transition-opacity pointer-events-auto cursor-pointer group"
      title="Return to Landing"
    >
      <div className="absolute inset-0 bg-[#00F0FF10] rounded-full scale-0 group-hover:scale-110 transition-transform duration-500 blur-xl" />
      <FuturisticHUD rotation={rotation} />
    </div>
  );
}
