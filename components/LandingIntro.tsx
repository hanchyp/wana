"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Logo } from "@/components/Brand";
import { useMediaQuery } from "@/lib/useMediaQuery";

const videoSelector = "[data-landing-video]";

export function LandingIntro({ children }: { children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const router = useRouter();

  useEffect(() => {
    const page = content.current;
    if (!page) return;

    const listeners = new AbortController();
    const { signal } = listeners;
    let minTime: number;
    const finish = () => {
      window.clearTimeout(deadline);
      window.clearTimeout(minTime);
      listeners.abort();
      setLoading(false);
    };

    const deadline = window.setTimeout(finish, 4500);
    const minimum = new Promise<void>((resolve) => {
      minTime = window.setTimeout(resolve, 700);
    });
    const images = Array.from(page.querySelectorAll("img"), (image) => image.decode());
    const video = new Promise<void>((resolve) => {
      const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
      const check = () => {
        const element = page.querySelector<HTMLVideoElement>(videoSelector);
        if (preference.matches || (element && (element.readyState >= 2 || element.error))) resolve();
      };
      page.addEventListener("loadeddata", check, { capture: true, signal });
      page.addEventListener("error", check, { capture: true, signal });
      preference.addEventListener("change", check, { signal });
      check();
    });

    void Promise.allSettled([minimum, document.fonts.ready, video, ...images]).then(() => {
      if (!signal.aborted) finish();
    });

    return () => {
      listeners.abort();
      window.clearTimeout(deadline);
      window.clearTimeout(minTime);
    };
  }, []);

  useEffect(() => {
    router.prefetch("/pantau");
    router.prefetch("/lapor");
  }, [router]);

  return (
    <>
      <div ref={content} inert={loading} className="contents">{children}</div>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-forest"
            role="status"
            aria-label="Memuat beranda WANA"
            exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : {
              y: "-100%",
              transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
            }}
          >
            <motion.div
              animate={reduceMotion ? { scale: 1.65 } : {
                scale: [0.2, 1.85, 1.65],
                rotate: [-8, 2, 0],
                transition: { duration: 0.56, times: [0, 0.72, 1] },
              }}
            >
              <Logo tone="light" decorative />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
