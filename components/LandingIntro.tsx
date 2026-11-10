"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/Brand";
import { useMediaQuery } from "@/lib/useMediaQuery";



export function LandingIntro({ children }: { children: ReactNode }) {

  const [loading, setLoading] = useState(true);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    router.prefetch("/pantau");
    router.prefetch("/lapor");
  }, [router]);

  return (
    <>
      <div inert={loading} className="contents">{children}</div>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-[100] isolate overflow-hidden bg-[#e8efdc]"
            role="status"
            aria-label="Memuat beranda WANA"
            exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : {
              y: "-100%",
              transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] },
            }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]" style={{ backgroundImage: "linear-gradient(#44613a 1px, transparent 1px), linear-gradient(90deg, #44613a 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
            <motion.div
              className="absolute inset-x-0 top-[28%] z-10 flex justify-center sm:top-[35%]"
              animate={reduceMotion ? { scale: 1 } : {
                scale: [0.85, 1.04, 1],
                rotate: [-8, 2, 0],
                transition: { duration: 0.56, times: [0, 0.72, 1] },
              }}
            >
              <Logo size="intro" decorative />
            </motion.div>
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[-12vw] left-[-18vw] w-[85vw] origin-bottom sm:bottom-[-22vh] sm:left-[-12vw] sm:w-[min(62vw,90vh)]"
              key={`mascot-left-${reduceMotion}`}
              initial={reduceMotion ? false : { x: "-35%", y: "100%", rotate: -12, opacity: 0 }}
              animate={{ x: 0, y: 0, rotate: 15, opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src="/mascot/welcome.png" alt="" width={1254} height={1254} sizes="(min-width: 640px) 62vw, 85vw" loading="eager" className="h-auto w-full" />
            </motion.div>
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[-12vw] right-[-18vw] w-[85vw] origin-bottom sm:bottom-[-22vh] sm:right-[-12vw] sm:w-[min(62vw,90vh)]"
              key={`mascot-right-${reduceMotion}`}
              initial={reduceMotion ? false : { x: "35%", y: "100%", rotate: 12, opacity: 0 }}
              animate={{ x: 0, y: 0, rotate: -15, opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src="/mascot/observe.png" alt="" width={1254} height={1254} sizes="(min-width: 640px) 62vw, 85vw" loading="eager" className="h-auto w-full -scale-x-100" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
