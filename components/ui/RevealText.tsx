"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { motion, motionAllowed } from "@/lib/motion";

type RevealTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  // "scroll" reveals with GSAP when in view; "load" plays the CSS intro on first paint (above the fold).
  trigger?: "scroll" | "load";
  delayMs?: number;
};

export function RevealText({ text, as: Tag = "h2", id, className, trigger = "scroll", delayMs = 0 }: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || trigger !== "scroll" || !motionAllowed()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-word]"),
        { opacity: 0, y: "0.35em" },
        {
          opacity: 1,
          y: 0,
          duration: motion.duration.word,
          ease: motion.ease.expo,
          stagger: motion.stagger.word,
          scrollTrigger: { trigger: el, start: motion.scrollStart, once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [trigger]);

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      id={id}
      className={className}
      data-intro={trigger === "load" ? "" : undefined}
      style={trigger === "load" ? ({ "--delay": `${delayMs}ms` } as CSSProperties) : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span data-word className="inline-block" style={{ "--i": i } as CSSProperties}>
              {word}
            </span>
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
