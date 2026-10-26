"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Hero from "@/components/sections/Hero/Hero";
import SkyDive from "@/components/sections/SkyDive/SkyDive";
import Carousel from "@/components/sections/Carousel/Carousel";
import AlternatingText from "@/components/sections/AlternatingText/AlternatingText";
import BigText from "@/components/sections/BigText/BigText";
import Storefront from "@/components/store/Storefront";
import SmoothScroll from "@/components/SmoothScroll";
import { ExperienceContext, type Chapter } from "./ExperienceContext";
const ViewCanvas = dynamic(() => import("@/components/ViewCanvas"), {
  ssr: false,
});

class CanvasBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function ImmersiveStorefront() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState<Partial<Record<Chapter, boolean>>>({});
  const pointer = useRef({ x: 0, y: 0 });
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const markReady = useCallback(
    (chapter: Chapter) =>
      setReady((previous) =>
        previous[chapter] ? previous : { ...previous, [chapter]: true },
      ),
    [],
  );
  const onError = useCallback(() => setEnabled(false), []);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2");
      setEnabled(Boolean(context));
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setEnabled(false);
    }
  }, []);
  const value = useMemo(
    () => ({ enabled, reducedMotion, ready, markReady, pointer }),
    [enabled, reducedMotion, ready, markReady],
  );
  return (
    <ExperienceContext.Provider value={value}>
      <SmoothScroll>
        <div
          className="immersive-storefront"
          onPointerMove={(event) => {
            if (event.pointerType === "touch" || reducedMotion) return;
            pointer.current = {
              x: (event.clientX / window.innerWidth) * 2 - 1,
              y: (event.clientY / window.innerHeight) * 2 - 1,
            };
          }}
          onPointerLeave={() => {
            pointer.current = { x: 0, y: 0 };
          }}
        >
          <Hero />
          <SkyDive />
          <Carousel />
          <AlternatingText />
          <Storefront />
          <BigText />
          {enabled && (
            <CanvasBoundary onError={onError}>
              <ViewCanvas onError={onError} />
            </CanvasBoundary>
          )}
        </div>
      </SmoothScroll>
    </ExperienceContext.Provider>
  );
}
