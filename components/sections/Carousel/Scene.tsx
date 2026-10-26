"use client";

import { useEffect, type RefObject } from "react";
import { Environment } from "@react-three/drei";
import { Group } from "three";
import FloatingCan from "@/components/FloatingCan";
import { products, type Product } from "@/lib/products";
import { useExperience } from "@/components/experience/ExperienceContext";

export default function Scene({
  product,
  spin,
}: {
  product: Product;
  spin: RefObject<Group | null>;
}) {
  const { reducedMotion, markReady } = useExperience();
  useEffect(() => {
    markReady("showcase");
  }, [markReady]);
  // Keep every label mounted so a flavor change never suspends the spinning can.
  return (
    <>
      <group ref={spin}>
        {products.map((item) => (
          <group
            key={item.id}
            visible={item.id === product.id}
            rotation={[0.08, 0.05, -0.12]}
          >
            <FloatingCan
              flavor={item.flavor}
              scale={5.1}
              floatSpeed={reducedMotion ? 0 : 1.2}
              floatIntensity={0.22}
              rotationIntensity={0.13}
            />
          </group>
        ))}
      </group>
      <ambientLight intensity={1.5} />
      <directionalLight intensity={2.6} position={[2, 4, 5]} />
      <Environment files="/hdr/lobby.hdr" environmentIntensity={0.85} />
    </>
  );
}
