"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { useExperience } from "./experience/ExperienceContext";

function RenderOnScroll() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const update = () => invalidate();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [invalidate]);
  // Clear the entire surface before the scissored views render, including gaps.
  useFrame(({ gl }) => {
    gl.setScissorTest(false);
    gl.clear();
  }, 0);
  return null;
}
export default function ViewCanvas({ onError }: { onError: () => void }) {
  const { reducedMotion } = useExperience();
  const [active, setActive] = useState(true);
  useEffect(() => {
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        setActive(visible.size > 0);
      },
      { rootMargin: "150px" },
    );
    document
      .querySelectorAll(".narrative-view")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return (
    <Canvas
      className="narrative-canvas"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 20,
      }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={reducedMotion || !active ? "demand" : "always"}
      onCreated={({ gl }) => {
        gl.domElement.setAttribute("aria-hidden", "true");
        gl.domElement.addEventListener("webglcontextlost", onError, {
          once: true,
        });
      }}
      fallback={null}
    >
      <RenderOnScroll />
      <Suspense fallback={null}>
        <View.Port />
      </Suspense>
    </Canvas>
  );
}
