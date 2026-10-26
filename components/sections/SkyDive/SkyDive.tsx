"use client";

import { Suspense, useRef } from "react";
import { View } from "@react-three/drei";
import Link from "next/link";
import { useExperience } from "@/components/experience/ExperienceContext";
import { products } from "@/lib/products";
import CanArtwork from "@/components/store/CanArtwork";
import dynamic from "next/dynamic";
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function SkyDive() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const { enabled, ready, reducedMotion } = useExperience();
  return (
    <section
      ref={root}
      className="skydive narrative-skydive"
      aria-labelledby="sky-heading"
      data-scene-ready={Boolean(enabled && ready.sky)}
    >
      <div className="sky-overlay">
        <p className="narrative-chapter-label">02 / A WHOLE NEW KIND OF LIFT</p>
        <div className="sky-bottom">
          <span>
            {reducedMotion
              ? "A LITTLE LIGHTER. A LITTLE BRIGHTER."
              : "LET THE SCROLL TAKE YOU SOMEWHERE GOOD."}
          </span>
          <Link href="#flavors">
            NEXT UP: YOUR NEW FAVORITE <span aria-hidden="true">↓</span>
          </Link>
        </div>
        <div className="sky-progress" aria-hidden="true">
          <span />
        </div>
      </div>
      <div ref={stage} className="sky-stage">
        <h2
          id="sky-heading"
          className={enabled && ready.sky ? "sr-only" : "sky-fallback-heading"}
        >
          Take flight
          <br />
          with flavor.
        </h2>
        {(!enabled || !ready.sky) && (
          <div className="sky-static-art">
            <span className="css-cloud cloud-one" />
            <span className="css-cloud cloud-two" />
            <CanArtwork product={products[4]} />
          </div>
        )}
        {enabled && (
          <View className="sky-view narrative-view">
            <Suspense fallback={null}>
              <Scene root={root} stage={stage} />
            </Suspense>
          </View>
        )}
      </div>
    </section>
  );
}
