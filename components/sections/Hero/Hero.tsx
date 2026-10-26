"use client";

import { Suspense, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { View } from "@react-three/drei";
import { useExperience } from "@/components/experience/ExperienceContext";
import { products } from "@/lib/products";
import CanArtwork from "@/components/store/CanArtwork";
import { Arrow } from "@/components/store/Icons";
import { heroContent } from "@/data/HeroContent";
const Scene = dynamic(() => import("./Scene"), { ssr: false });
const Bubbles = dynamic(
  () => import("./Bubbles").then((module) => module.Bubbles),
  { ssr: false },
);

gsap.registerPlugin(useGSAP, ScrollTrigger);
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { enabled, reducedMotion, ready } = useExperience();
  const sceneReady = enabled && ready.hero;
  useGSAP(
    () => {
      if (reducedMotion) return;
      const nearTop =
        window.scrollY <
        (root.current?.offsetTop ?? 0) + window.innerHeight * 0.3;
      if (nearTop) {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".narrative-hero-word", {
            yPercent: 45,
            scale: 1.18,
            opacity: 0,
            stagger: 0.12,
            duration: 1.1,
          })
          .from(
            ".narrative-hero-description, .narrative-hero-actions",
            { y: 18, opacity: 0, stagger: 0.1, duration: 0.7 },
            0.5,
          );
      }
      gsap.fromTo(
        ".hero-title-scroll, .hero-description-scroll, .hero-actions-scroll",
        { yPercent: 0, opacity: 1 },
        {
          yPercent: -8,
          opacity: 0,
          ease: "sine.inOut",
          immediateRender: false,
          scrollTrigger: {
            id: "hero-copy-exit",
            trigger: ".hero-intro",
            start: "top -35%",
            end: "bottom 10%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
      gsap.fromTo(
        ".hero-story-copy > *",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".hero-story",
            start: "top 78%",
            end: "top 22%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
      gsap.to(root.current, {
        backgroundColor: "#d9efb1",
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
        },
      });
    },
    { scope: root, dependencies: [reducedMotion], revertOnUpdate: true },
  );
  return (
    <section
      ref={root}
      className="hero narrative-hero"
      aria-labelledby="narrative-hero-heading"
      data-scene-ready={Boolean(sceneReady)}
    >
      <div className="hero-scene-track">
        {!sceneReady && (
          <div
            className="hero-static-cans"
            aria-label="Fizzi soda in five bold flavors"
          >
            <CanArtwork product={products[0]} />
            <CanArtwork product={products[1]} />
          </div>
        )}
        {enabled && (
          <View className="hero-scene narrative-view">
            <Suspense fallback={null}>
              <Scene />
              <Bubbles count={90} speed={1.5} opacity={0.28} />
            </Suspense>
          </View>
        )}
      </div>
      <div className="hero-intro">
        <p className="narrative-chapter-label">01 / OPEN UP SOMETHING GOOD</p>
        <div className="hero-intro-copy">
          <div className="hero-title-scroll">
            <h1 id="narrative-hero-heading" aria-label={heroContent.heading}>
              <span className="narrative-hero-word">Fizzi</span>
              <span className="narrative-hero-word">Soda.</span>
            </h1>
          </div>
          <div className="hero-description-scroll">
            <p className="narrative-hero-description">
              {"Big flavor. Feel-good bubbles. "}
              <br />A little more joy in every sip.
            </p>
          </div>
          <div className="hero-actions-scroll">
            <div className="narrative-hero-actions">
              <Link href="#flavors" className="pill-button dark-button">
                Find your flavor <Arrow />
              </Link>
              <Link href="/shop" className="narrative-skip">
                Shop all flavors ↗
              </Link>
            </div>
          </div>
        </div>
        <div className="narrative-scroll-cue">
          <span>SCROLL INTO THE FIZZ</span>
          <span aria-hidden="true">↓</span>
        </div>
      </div>
      <div className="hero-story" id="the-fizz">
        <div className="hero-story-copy">
          <p className="eyebrow">A LITTLE CAN. A WHOLE NEW PERSPECTIVE.</p>
          <h2>
            Unleash
            <br />
            the flavor.
          </h2>
          <p>
            Five bold personalities. One feel-good ritual. We took your favorite
            soda moment and gave it a little extra lift.
          </p>
          <span className="story-next">
            KEEP GOING. IT ONLY GETS LIGHTER. ↓
          </span>
        </div>
      </div>
    </section>
  );
}
