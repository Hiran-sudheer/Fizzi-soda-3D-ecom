"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, MathUtils } from "three";
import FloatingCan from "@/components/FloatingCan";
import { useExperience } from "@/components/experience/ExperienceContext";
import type { Product } from "@/lib/products";

export default function ProductCardCanScene({
  product,
  pointer,
  onReady,
}: {
  product: Product;
  pointer: MutableRefObject<{ x: number; y: number }>;
  onReady: () => void;
}) {
  const { reducedMotion } = useExperience();
  const can = useRef<Group>(null);
  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(onReady);
    });
    return () => cancelAnimationFrame(frame);
  }, [onReady]);
  useFrame((_, delta) => {
    if (!can.current || reducedMotion) return;
    can.current.rotation.y = MathUtils.damp(
      can.current.rotation.y,
      pointer.current.x * 0.45,
      5,
      delta,
    );
    can.current.rotation.x = MathUtils.damp(
      can.current.rotation.x,
      pointer.current.y * 0.12,
      5,
      delta,
    );
  });
  return (
    <>
      <group ref={can}>
        <FloatingCan
          flavor={product.flavor}
          scale={4.2}
          rotation={[0.08, 0, -0.14]}
          floatSpeed={reducedMotion ? 0 : 1.2}
          rotationIntensity={reducedMotion ? 0 : 0.08}
          floatIntensity={reducedMotion ? 0 : 0.18}
        />
      </group>
      <ambientLight intensity={1.4} />
      <directionalLight position={[2, 4, 5]} intensity={2.6} />
      <Environment files="/hdr/lobby.hdr" environmentIntensity={0.85} />
    </>
  );
}
