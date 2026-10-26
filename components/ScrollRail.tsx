"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { useCart } from "@/hooks/useCart";

export default function ScrollRail() {
  const pathname = usePathname();
  const lenis = useLenis();
  const open = useCart((state) => state.open);
  const rail = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const geometry = useRef({ max: 0, travel: 0, thumbHeight: 44 });
  const grabOffset = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!rail.current || !thumb.current) return;
      const height = rail.current.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const max = Math.max(0, pageHeight - window.innerHeight);
      const thumbHeight = Math.min(
        height,
        Math.max(44, (height * window.innerHeight) / pageHeight),
      );
      const travel = Math.max(0, height - thumbHeight);
      const fraction = max ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      geometry.current = { max, travel, thumbHeight };
      thumb.current.style.height = `${thumbHeight}px`;
      thumb.current.style.transform = `translateY(${fraction * travel}px)`;
      setProgress(Math.round(fraction * 100));
      setScrollable(max > 1);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    observer.observe(document.documentElement);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  const scrollTo = (position: number) => {
    if (open) return;
    const top = Math.max(0, Math.min(geometry.current.max, position));
    // Cancel any in-flight smooth scroll so dragging follows the pointer exactly.
    if (lenis) lenis.scrollTo(top, { immediate: true });
    else window.scrollTo({ top, behavior: "instant" });
  };
  const dragTo = (clientY: number) => {
    if (!rail.current || grabOffset.current === null) return;
    const { travel, max } = geometry.current;
    if (travel <= 0) return;
    scrollTo(
      ((clientY -
        rail.current.getBoundingClientRect().top -
        grabOffset.current) /
        travel) *
        max,
    );
  };
  const finish = (event: PointerEvent<HTMLDivElement>) => {
    grabOffset.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={rail}
      className="fizzi-scrollbar"
      role="scrollbar"
      aria-label="Page scroll"
      aria-controls="main"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      tabIndex={scrollable && !open ? 0 : -1}
      data-visible={scrollable && !open}
      data-dragging={dragging}
      onPointerDown={(event) => {
        if (event.button !== 0 || open || !scrollable) return;
        event.preventDefault();
        event.currentTarget.focus({ preventScroll: true });
        grabOffset.current =
          event.target === thumb.current
            ? event.clientY - thumb.current.getBoundingClientRect().top
            : geometry.current.thumbHeight / 2;
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
        dragTo(event.clientY);
      }}
      onPointerMove={(event) => dragTo(event.clientY)}
      onPointerUp={finish}
      onPointerCancel={finish}
      onLostPointerCapture={() => {
        grabOffset.current = null;
        setDragging(false);
      }}
      onKeyDown={(event) => {
        const targets: Record<string, number> = {
          ArrowDown: window.scrollY + 80,
          ArrowUp: window.scrollY - 80,
          PageDown: window.scrollY + window.innerHeight * 0.85,
          PageUp: window.scrollY - window.innerHeight * 0.85,
          Home: 0,
          End: geometry.current.max,
        };
        if (event.key in targets) {
          event.preventDefault();
          scrollTo(targets[event.key]);
        }
      }}
    >
      <span className="fizzi-scrollbar-track" aria-hidden="true" />
      <span ref={thumb} className="fizzi-scrollbar-thumb" aria-hidden="true" />
    </div>
  );
}
