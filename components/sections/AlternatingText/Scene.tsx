"use client";

import { useEffect, useRef, type RefObject } from "react";
import { Environment } from "@react-three/drei";
import { Group } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatingCan from "@/components/FloatingCan";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useExperience } from "@/components/experience/ExperienceContext";

gsap.registerPlugin(useGSAP, ScrollTrigger);
export default function Scene({
  root,
}: {
  root: RefObject<HTMLElement | null>;
}) {
  const can = useRef<Group>(null);
  const desktop = useMediaQuery("(min-width: 768px)", false);
  const { reducedMotion, markReady } = useExperience();
  useEffect(() => {
    markReady("story");
    ScrollTrigger.refresh();
  }, [markReady]);
  useGSAP(
    () => {
      if (!can.current || !root.current || reducedMotion) return;
      const tl = gsap.timeline({
        defaults: { duration: 1, ease: "sine.inOut" },
        scrollTrigger: {
          id: "alternating-can-story",
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
      ["#f7d5dd", "#e9dcf4", "#dbecc2"].forEach((color, index) => {
        const left = index % 2 === 0;
        tl.to(
          can.current!.position,
          { x: desktop ? (left ? -1.1 : 1.1) : 0 },
          index,
        )
          .to(
            can.current!.rotation,
            { y: left ? 0.45 : -0.35, z: left ? 0.13 : -0.1 },
            index,
          )
          .to(root.current, { backgroundColor: color }, index);
      });
    },
    { dependencies: [desktop, reducedMotion], revertOnUpdate: true },
  );
  return (
    <>
      <group
        ref={can}
        position={[desktop ? 1.1 : 0, desktop ? 0 : -0.95, 0]}
        rotation={[0.05, -0.35, -0.1]}
      >
        <FloatingCan
          flavor="strawberryLemonade"
          scale={desktop ? 3.5 : 2.2}
          floatSpeed={reducedMotion ? 0 : 1.3}
          rotationIntensity={0.1}
          floatIntensity={0.25}
        />
      </group>
      <ambientLight intensity={1.4} />
      <directionalLight position={[2, 3, 4]} intensity={2.6} />
      <Environment files="/hdr/lobby.hdr" environmentIntensity={0.9} />
    </>
  );
}
