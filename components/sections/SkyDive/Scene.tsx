"use client";

import { Cloud, Clouds, Environment, Text } from "@react-three/drei";
import { useEffect, useRef, type RefObject } from "react";
import { Group } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatingCan from "@/components/FloatingCan";
import { useExperience } from "@/components/experience/ExperienceContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const WORDS = ["TAKE", "FLIGHT", "WITH", "FLAVOR."];
export default function Scene({
  root,
  stage,
}: {
  root: RefObject<HTMLElement | null>;
  stage: RefObject<HTMLDivElement | null>;
}) {
  const { reducedMotion, markReady } = useExperience();
  const desktop = useMediaQuery("(min-width: 768px)", false);
  const can = useRef<Group>(null);
  const clouds = useRef<Group>(null);
  const words = useRef<Group>(null);
  const cloudA = useRef<Group>(null);
  const cloudB = useRef<Group>(null);
  useEffect(() => {
    markReady("sky");
    ScrollTrigger.refresh();
  }, [markReady]);
  useGSAP(
    () => {
      if (
        !can.current ||
        !clouds.current ||
        !words.current ||
        !cloudA.current ||
        !cloudB.current ||
        !root.current ||
        !stage.current
      )
        return;
      const wordGroups = words.current.children;
      if (reducedMotion) {
        gsap.set(can.current.position, { x: 0, y: -0.25 });
        wordGroups.forEach((word, index) =>
          gsap.set(word.position, { x: 0, y: 1.5 - index * 0.48, z: -2 }),
        );
        return;
      }
      gsap.set(can.current.position, { x: 1.9, y: 4.5, z: -0.8 });
      gsap.set(can.current.rotation, { z: -0.45, y: -Math.PI });
      gsap.set(clouds.current.position, { z: 6 });
      wordGroups.forEach((word) =>
        gsap.set(word.position, { x: 5, y: 5, z: -2 }),
      );
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "sky-drop",
          trigger: root.current,
          pin: stage.current,
          start: "top top",
          end: () =>
            `+=${Math.round(window.innerHeight * (desktop ? 2.6 : 1.8))}`,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to(clouds.current.position, { z: 0, duration: 1 }, 0)
        .to(
          can.current.position,
          { x: 0, y: 0, z: 0.35, duration: 1.1, ease: "power2.out" },
          0,
        )
        .to(can.current.rotation, { y: Math.PI * 3, z: 0.38, duration: 4.7 }, 0)
        .to(cloudA.current.position, { x: -2.5, y: 3.5, duration: 4.8 }, 0)
        .to(cloudB.current.position, { x: 1.9, y: 4.8, duration: 4.8 }, 0.2);
      wordGroups.forEach((word, index) => {
        const start = 0.55 + index * 0.72;
        tl.to(
          word.position,
          { x: 0, y: 0.1, z: -1.3, duration: 0.65, ease: "power2.out" },
          start,
        ).to(
          word.position,
          { x: -5, y: -4, z: 0.2, duration: 0.65, ease: "power2.in" },
          start + 0.72,
        );
      });
      tl.to(
        can.current.position,
        { x: -1.3, y: -4.5, z: 1.4, duration: 1, ease: "power2.in" },
        4.15,
      )
        .to(clouds.current.position, { z: 6, duration: 0.9 }, 4.25)
        .fromTo(
          root.current.querySelector(".sky-progress span"),
          { scaleX: 0 },
          { scaleX: 1, duration: 5.15 },
          0,
        );
    },
    { dependencies: [desktop, reducedMotion], revertOnUpdate: true },
  );
  return (
    <>
      <group ref={can}>
        <FloatingCan
          flavor="watermelon"
          scale={desktop ? 3.15 : 2.3}
          floatSpeed={reducedMotion ? 0 : 1.4}
          rotationIntensity={0.08}
          floatIntensity={0.2}
        />
      </group>
      <Clouds ref={clouds} texture="/textures/cloud.png" limit={90}>
        <Cloud
          ref={cloudA}
          seed={3}
          bounds={[5.5, 3.5, 2]}
          segments={24}
          volume={1.1}
          growth={0.4}
          opacity={0.3}
          speed={reducedMotion ? 0 : 0.12}
          position={[2.5, -2, -2.5]}
        />
        <Cloud
          ref={cloudB}
          seed={9}
          bounds={[5, 4, 2]}
          segments={24}
          volume={1.1}
          growth={0.4}
          opacity={0.32}
          speed={reducedMotion ? 0 : 0.1}
          position={[-2.8, -3.8, -2]}
        />
      </Clouds>
      <group ref={words}>
        {WORDS.map((word) => (
          <group key={word}>
            <Text
              font="/fonts/Alpino-Variable.woff"
              fontSize={desktop ? 0.95 : 0.53}
              fontWeight={900}
              letterSpacing={-0.055}
              color="#f26734"
              anchorX="center"
              anchorY="middle"
              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ."
            >
              {word}
            </Text>
          </group>
        ))}
      </group>
      <ambientLight intensity={1.7} color="#d9f5ff" />
      <directionalLight position={[2, 3, 5]} intensity={2.8} />
      <Environment files="/hdr/field.hdr" environmentIntensity={1} />
    </>
  );
}
