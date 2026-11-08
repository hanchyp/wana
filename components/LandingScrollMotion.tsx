"use client";

import { useEffect } from "react";
import { animate, inView } from "motion";
import { useMediaQuery } from "@/lib/useMediaQuery";

export function LandingScrollMotion() {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  useEffect(() => {
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-landing-reveal]"));
    const animations: ReturnType<typeof animate>[] = [];
    const stops: (() => void)[] = [];

    for (const element of elements) {
      const effect = element.dataset.landingReveal;
      const originalStyle = element.getAttribute("style");
      const curtain = effect === "curtain";
      const text = effect === "text";
      const start = curtain
        ? { opacity: 1, clipPath: "inset(0 50% 0 50%)", scale: 1.08, y: 0 }
        : { opacity: 0, clipPath: text ? "inset(0 0 100% 0)" : "inset(0)", scale: effect === "stamp" ? 0.8 : 0.97, y: 36 };

      let revealed = false;
      const reveal = () => {
        if (revealed) return;
        revealed = true;
        if (element.contains(document.activeElement)) return;

        animations.push(animate(element,
          {
            opacity: [start.opacity, 1],
            clipPath: [start.clipPath, "inset(0% 0% 0% 0%)"],
            scale: [start.scale, 1],
            y: [start.y, 0],
          },
          {
            duration: curtain ? 0.85 : 0.65,
            delay: Number(element.dataset.motionOrder ?? 0) * 0.1,
            ease: [0.22, 1, 0.36, 1],
            onComplete: () => {
              if (originalStyle === null) element.removeAttribute("style");
              else element.setAttribute("style", originalStyle);
            },
          },
        ));
      };
      stops.push(inView(element, reveal));
      stops.push(() => {
        if (originalStyle === null) element.removeAttribute("style");
        else element.setAttribute("style", originalStyle);
      });
    }

    return () => {
      animations.forEach((animation) => animation.stop());
      stops.forEach((stop) => stop());
    };
  }, [reduceMotion]);

  return null;
}
