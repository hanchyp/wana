"use client";

import { useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

export function HeroVideo() {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  return reduceMotion ? null : <BackgroundVideo />;
}

function BackgroundVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <video
      src="/videos/hero-hutan-satwa.mp4"
      data-landing-video
      preload="auto"
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
      onPlaying={() => setPlaying(true)}
      onError={() => setPlaying(false)}
      className={`pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover ${playing ? "opacity-100" : "opacity-0"}`}
    />
  );
}
