// Motion tokens shared by every animated component.
export const motion = {
  duration: {
    reveal: 0.7,
    word: 0.8,
  },
  ease: {
    out: "power3.out",
    expo: "expo.out",
  },
  offset: {
    rise: 16,
  },
  stagger: {
    word: 0.06,
  },
  // Start when the element is ~20% into the viewport; play once.
  scrollStart: "top 80%",
} as const;

export function motionAllowed() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("motion-ok");
}
