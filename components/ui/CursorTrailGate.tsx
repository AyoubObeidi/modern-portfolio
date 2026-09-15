"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";

const CursorTrailShader = lazy(() => import("./CursorTrailShader"));

// Lightweight gate: the shader module is only requested once every capability check passes.
export function CursorTrailGate() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const region = layerRef.current?.parentElement;
    if (!region || unavailable) return;
    if (!(navigator as Navigator & { gpu?: unknown }).gpu) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedTransparency = window.matchMedia("(prefers-reduced-transparency: reduce)");

    let inView = false;

    const update = () => {
      setActive(
        inView &&
          finePointer.matches &&
          !reducedMotion.matches &&
          !reducedTransparency.matches &&
          document.visibilityState === "visible" &&
          document.hasFocus(),
      );
    };

    const visibilityObserver: IntersectionObserver | undefined =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              inView = entry?.isIntersecting ?? false;
              update();
            },
            { rootMargin: "200px 0px" },
          )
        : undefined;
    visibilityObserver?.observe(region);

    const queries = [finePointer, reducedMotion, reducedTransparency];
    queries.forEach((query) => query.addEventListener("change", update));
    document.addEventListener("visibilitychange", update);
    window.addEventListener("blur", update);
    window.addEventListener("focus", update);

    return () => {
      visibilityObserver?.disconnect();
      queries.forEach((query) => query.removeEventListener("change", update));
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("blur", update);
      window.removeEventListener("focus", update);
      setActive(false);
    };
  }, [unavailable]);

  return (
    <div ref={layerRef} className="cursor-trail-layer" aria-hidden="true">
      {active && !unavailable && (
        <Suspense fallback={null}>
          <CursorTrailShader onUnavailable={() => setUnavailable(true)} />
        </Suspense>
      )}
    </div>
  );
}
