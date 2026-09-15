"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motionAllowed } from "@/lib/motion";

// Single smooth-scroll engine (Lenis) driven by GSAP's ticker so ScrollTrigger stays in sync.
export function SmoothScroll() {
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    if (!motionAllowed()) return;

    const lenis = new Lenis({ autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Same-page hash links: scroll with Lenis instead of jumping, then move focus to the section.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || (link.target && link.target !== "_self")) return;

      const url = new URL(link.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;

      const section = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!section) return;

      event.preventDefault();
      window.history.pushState(null, "", url.hash);
      const headerHeight = document.querySelector("header")?.offsetHeight ?? 0;
      lenis.scrollTo(section, {
        offset: -headerHeight,
        onComplete: () => section.focus({ preventScroll: true }),
      });
    };
    window.addEventListener("click", onClick, true);

    let active = true;
    document.fonts.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });

    return () => {
      active = false;
      window.removeEventListener("click", onClick, true);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
