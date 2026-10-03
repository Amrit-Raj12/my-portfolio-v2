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
    const onWindowScroll = () => {
      setRotation(window.scrollY * 0.4);
    };

    const onSpaScroll = (event: Event) => {
      const container = event.currentTarget;
      if (container instanceof HTMLElement) {
        setRotation(container.scrollTop * 0.4);
      }
    };

    const check = () => {
      if (pathname !== '/') {
        setIsVisible(true);
        return;
      }

      const spaPanel = document.querySelector('.spa-panel');
      if (spaPanel) {
        setIsVisible(spaPanel.classList.contains('visible-phase'));
        return;
      }

      const hero = document.querySelector('[data-hero-section]');
      if (!hero) {
        setIsVisible(false);
        return;
      }
      
      const style = window.getComputedStyle(hero);
      const isHeroVisible = (hero as HTMLElement).offsetParent !== null && style.visibility !== 'hidden' && style.display !== 'none';
      setIsVisible(!isHeroVisible);
    };

    check();
    const interval = setInterval(check, 200);
    window.addEventListener('scroll', onWindowScroll, { passive: true });
    const spaScroll = document.getElementById('spa-scroll');
    spaScroll?.addEventListener('scroll', onSpaScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', onWindowScroll);
      spaScroll?.removeEventListener('scroll', onSpaScroll);
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
