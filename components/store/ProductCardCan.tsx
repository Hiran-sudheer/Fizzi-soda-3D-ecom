"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { View } from "@react-three/drei";
import { useExperience } from "@/components/experience/ExperienceContext";
import type { Product } from "@/lib/products";
import CanArtwork from "./CanArtwork";

const Scene = dynamic(() => import("./ProductCardCanScene"), { ssr: false });

export default function ProductCardCan({ product }: { product: Product }) {
  const { enabled, reducedMotion } = useExperience();
  const [ready, setReady] = useState(false);
  const pointer = useRef({ x: 0, y: 0 });
  const onReady = useCallback(() => setReady(true), []);
  const sceneReady = enabled && ready;

  return (
    <span
      className="product-card-can"
      data-scene-ready={sceneReady}
      aria-hidden="true"
      onPointerMove={(event) => {
        if (reducedMotion || event.pointerType === "touch") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointer.current = {
          x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
          y: ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
        };
      }}
      onPointerLeave={() => {
        pointer.current = { x: 0, y: 0 };
      }}
    >
      {!sceneReady && <CanArtwork product={product} />}
      {enabled && (
        <View className="product-card-view narrative-view">
          <Suspense fallback={null}>
            <Scene product={product} pointer={pointer} onReady={onReady} />
          </Suspense>
        </View>
      )}
    </span>
  );
}
