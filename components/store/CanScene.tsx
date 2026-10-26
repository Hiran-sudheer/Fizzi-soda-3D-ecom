"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { SodaCan } from "@/components/SodaCan";
import type { Product } from "@/lib/products";

function SceneContent({
  product,
  reducedMotion,
  onReady,
  trio,
}: {
  product: Product;
  reducedMotion: boolean;
  onReady: () => void;
  trio: boolean;
}) {
  useEffect(() => {
    // Keep the artwork visible until the selected flavor has reached the screen.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(onReady);
    });
    return () => cancelAnimationFrame(frame);
  }, [onReady]);
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 4, 5]} intensity={3} />
      <Environment files="/hdr/lobby.hdr" environmentIntensity={0.7} />
      <Float
        speed={reducedMotion ? 0 : 1.8}
        rotationIntensity={reducedMotion ? 0 : 0.16}
        floatIntensity={reducedMotion ? 0 : 0.5}
      >
        {trio && (
          <group position={[-1.05, -0.12, -0.6]} rotation={[0, 0.25, 0.3]}>
            <SodaCan flavor="lemonLime" scale={3.1} />
          </group>
        )}
        {trio && (
          <group position={[1.03, 0.06, -0.7]} rotation={[0, -0.3, -0.26]}>
            <SodaCan flavor="grape" scale={3.1} />
          </group>
        )}
        <group position={[0, 0, 0.3]} rotation={[0.1, 0.18, -0.12]}>
          <SodaCan flavor={product.flavor} scale={3.7} />
        </group>
      </Float>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(Math.PI * 2) / 3}
      />
    </>
  );
}

export default function CanScene(props: {
  active: boolean;
  product: Product;
  reducedMotion: boolean;
  onReady: () => void;
  trio: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 36 }}
      gl={{ alpha: true, antialias: true }}
      frameloop={props.reducedMotion || !props.active ? "demand" : "always"}
      onCreated={({ gl }) => {
        gl.domElement.setAttribute(
          "aria-label",
          "Interactive 3D soda cans. Drag to rotate.",
        );
      }}
    >
      <Suspense fallback={null}>
        <SceneContent {...props} />
      </Suspense>
    </Canvas>
  );
}
