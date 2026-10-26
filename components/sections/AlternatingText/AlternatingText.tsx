"use client";

import { Suspense, useRef } from "react";
import { View } from "@react-three/drei";
import { useExperience } from "@/components/experience/ExperienceContext";
import CanArtwork from "@/components/store/CanArtwork";
import { products } from "@/lib/products";
import { alternatingTextContent } from "@/data/alternatingTextContent";
import dynamic from "next/dynamic";
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function AlternatingText() {
  const root = useRef<HTMLElement>(null);
  const { enabled, ready } = useExperience();
  return (
    <section
      ref={root}
      id="our-story"
      className="alternating-text-container narrative-values"
      aria-label="The little things that make Fizzi"
      data-scene-ready={Boolean(enabled && ready.story)}
    >
      <div className="values-scene-track">
        {(!enabled || !ready.story) && (
          <div className="values-fallback">
            <CanArtwork product={products[3]} />
          </div>
        )}
        {enabled && (
          <View className="alternating-text-view narrative-view">
            <Suspense fallback={null}>
              <Scene root={root} />
            </Suspense>
          </View>
        )}
      </div>
      {alternatingTextContent.textGroup.map((item, index) => (
        <div
          className={`alternating-section ${index % 2 ? "copy-right" : "copy-left"}`}
          key={item.heading}
        >
          <div className="values-copy">
            <p className="eyebrow">
              A LITTLE MORE {item.heading.toUpperCase()} IN YOUR DAY
            </p>
            <h2>{item.heading}.</h2>
            <p>{item.body}</p>
            <span>0{index + 1} / THE FEEL-GOOD INGREDIENTS</span>
          </div>
        </div>
      ))}
    </section>
  );
}
