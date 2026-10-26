"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "@/hooks/useCart";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);
  const open = useCart((state) => state.open);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    // Keep Lenis and scroll animations on the same clock after a slow frame.
    gsap.ticker.lagSmoothing(0);
    const lenis = lenisRef.current?.lenis;
    lenis?.on("scroll", ScrollTrigger.update);
    return () => {
      gsap.ticker.remove(update);
      lenis?.off("scroll", ScrollTrigger.update);
    };
  }, []);
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open]);
  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: !reducedMotion,
        syncTouch: false,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
