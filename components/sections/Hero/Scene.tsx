"use client";

import { useEffect, useRef } from "react";
import { Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, MathUtils } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatingCan from "@/components/FloatingCan";
import { useExperience } from "@/components/experience/ExperienceContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";

gsap.registerPlugin(useGSAP, ScrollTrigger);
export default function Scene() {
  const { reducedMotion, markReady, pointer } = useExperience();
  const desktop = useMediaQuery("(min-width: 768px)", false);
  const cans = useRef<(Group | null)[]>([]);
  const entrances = useRef<(Group | null)[]>([]);
  const scrollGroup = useRef<Group>(null);
  const parallax = useRef<Group>(null);
  useEffect(() => {
    markReady("hero");
    ScrollTrigger.refresh();
  }, [markReady]);
  useFrame((_, delta) => {
    if (!parallax.current || reducedMotion) return;
    parallax.current.rotation.y = MathUtils.damp(
      parallax.current.rotation.y,
      pointer.current.x * 0.13,
      4,
      delta,
    );
    parallax.current.rotation.x = MathUtils.damp(
      parallax.current.rotation.x,
      pointer.current.y * 0.07,
      4,
      delta,
    );
    parallax.current.position.x = MathUtils.damp(
      parallax.current.position.x,
      pointer.current.x * 0.07,
      4,
      delta,
    );
  });
  useGSAP(
    () => {
      const [cherry, lemon, grape, strawberry, watermelon] = cans.current;
      const [entryA, entryB] = entrances.current;
      const group = scrollGroup.current;
      if (
        !cherry ||
        !lemon ||
        !grape ||
        !strawberry ||
        !watermelon ||
        !entryA ||
        !entryB ||
        !group
      )
        return;
      gsap.set(cherry.position, { x: desktop ? -1.6 : -1.25, y: 0.1 });
      gsap.set(cherry.rotation, { z: -0.34 });
      gsap.set(lemon.position, { x: desktop ? 1.62 : 1.27, y: 0.15 });
      gsap.set(lemon.rotation, { z: 0.32 });
      gsap.set(grape.position, { x: -0.4, y: 5, z: -1 });
      gsap.set(strawberry.position, { x: 2, y: 5, z: -0.5 });
      gsap.set(watermelon.position, { x: 0.3, y: -5, z: -1 });
      if (reducedMotion) return;
      const intro = gsap.timeline({
        defaults: { duration: 1.9, ease: "power3.out" },
      });
      if (window.scrollY < window.innerHeight * 0.35) {
        intro
          .from(entryA.position, { y: -5, x: 1.2 }, 0)
          .from(entryA.rotation, { z: 2.4 }, 0)
          .from(entryB.position, { y: 5, x: -1.2 }, 0.12)
          .from(entryB.rotation, { z: -2.4 }, 0.12);
      }
      const timeline = gsap.timeline({
        defaults: { ease: "sine.inOut", duration: 1 },
        scrollTrigger: {
          id: "hero-can-parallax",
          trigger: ".narrative-hero",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });
      timeline
        .to(group.rotation, { y: Math.PI * 2 }, 0)
        .to(
          group.position,
          { x: desktop ? 1.05 : 0, y: desktop ? 0 : -0.65 },
          0,
        )
        .to(cherry.position, { x: -0.56, y: -0.48, z: -1.4 }, 0)
        .to(cherry.rotation, { z: 0.2 }, 0)
        .to(lemon.position, { x: 0.94, y: -0.5, z: -0.6 }, 0)
        .to(lemon.rotation, { z: -0.12 }, 0)
        .to(grape.position, { x: -0.55, y: 0.55, z: -0.85 }, 0)
        .to(grape.rotation, { z: -0.2 }, 0)
        .to(strawberry.position, { x: 0.1, y: -0.05, z: 0.7 }, 0)
        .to(strawberry.rotation, { z: 0.18 }, 0)
        .to(watermelon.position, { x: 0.6, y: 0.68, z: -0.3 }, 0)
        .to(watermelon.rotation, { z: -0.22 }, 0);
    },
    { dependencies: [desktop, reducedMotion], revertOnUpdate: true },
  );
  return (
    <group ref={parallax}>
      <group ref={scrollGroup} scale={desktop ? 1 : 0.64}>
        <group
          ref={(node) => {
            entrances.current[0] = node;
          }}
        >
          <FloatingCan
            ref={(node) => {
              cans.current[0] = node;
            }}
            flavor="blackCherry"
            scale={2.9}
            floatSpeed={reducedMotion ? 0 : 1.3}
            rotationIntensity={0.18}
            floatIntensity={0.35}
          />
        </group>
        <group
          ref={(node) => {
            entrances.current[1] = node;
          }}
        >
          <FloatingCan
            ref={(node) => {
              cans.current[1] = node;
            }}
            flavor="lemonLime"
            scale={2.9}
            floatSpeed={reducedMotion ? 0 : 1.3}
            rotationIntensity={0.18}
            floatIntensity={0.35}
          />
        </group>
        <FloatingCan
          ref={(node) => {
            cans.current[2] = node;
          }}
          flavor="grape"
          scale={2.8}
          floatSpeed={reducedMotion ? 0 : 1.3}
          rotationIntensity={0.15}
          floatIntensity={0.3}
        />
        <FloatingCan
          ref={(node) => {
            cans.current[3] = node;
          }}
          flavor="strawberryLemonade"
          scale={2.8}
          floatSpeed={reducedMotion ? 0 : 1.3}
          rotationIntensity={0.15}
          floatIntensity={0.3}
        />
        <FloatingCan
          ref={(node) => {
            cans.current[4] = node;
          }}
          flavor="watermelon"
          scale={2.8}
          floatSpeed={reducedMotion ? 0 : 1.3}
          rotationIntensity={0.15}
          floatIntensity={0.3}
        />
      </group>
      <ambientLight intensity={1.3} />
      <directionalLight position={[2, 4, 5]} intensity={2.5} />
      <Environment files="/hdr/lobby.hdr" environmentIntensity={0.9} />
    </group>
  );
}
