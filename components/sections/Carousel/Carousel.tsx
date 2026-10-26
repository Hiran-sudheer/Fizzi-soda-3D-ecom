"use client";

import { View } from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { Group } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useExperience } from "@/components/experience/ExperienceContext";
import { useCart } from "@/hooks/useCart";
import { MAX_QUANTITY, money, PACK_PRICE, products } from "@/lib/products";
import CanArtwork from "@/components/store/CanArtwork";
import { Arrow } from "@/components/store/Icons";
import { ArrowIcon } from "./ArrowIcon";
import { WavyCircles } from "./WavyCircles";
import dynamic from "next/dynamic";
const Scene = dynamic(() => import("./Scene"), { ssr: false });

const FLAVORS = [
  products[0],
  products[2],
  products[1],
  products[3],
  products[4],
];
export default function Carousel() {
  const root = useRef<HTMLElement>(null);
  const spin = useRef<Group>(null);
  const tween = useRef<gsap.core.Timeline | null>(null);
  const changing = useRef(false);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { enabled, reducedMotion, ready } = useExperience();
  const add = useCart((state) => state.add);
  const product = FLAVORS[index];
  const sceneReady = enabled && ready.showcase;
  const { contextSafe } = useGSAP({ scope: root });
  useEffect(
    () => () => {
      tween.current?.kill();
    },
    [],
  );
  const changeFlavor = contextSafe((next: number) => {
    const nextIndex = (next + FLAVORS.length) % FLAVORS.length;
    if (changing.current || nextIndex === index) return;
    if (!spin.current || !sceneReady || reducedMotion) {
      setIndex(nextIndex);
      return;
    }
    changing.current = true;
    setBusy(true);
    const direction = next > index ? 1 : -1;
    const copy = root.current?.querySelector(".showcase-product-copy");
    tween.current = gsap
      .timeline({
        onComplete: () => {
          changing.current = false;
          setBusy(false);
          if (spin.current) gsap.set(spin.current.rotation, { y: 0 });
        },
      })
      .to(
        spin.current.rotation,
        { y: direction * Math.PI * 2, duration: 1.05, ease: "power2.inOut" },
        0,
      )
      .to(copy ?? [], { y: -8, opacity: 0, duration: 0.2 }, 0.1)
      .call(() => setIndex(nextIndex), [], 0.5)
      .to(
        copy ?? [],
        { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
        0.65,
      );
  });
  return (
    <section
      ref={root}
      id="flavors"
      className="carousel narrative-showcase"
      aria-labelledby="showcase-heading"
      data-scene-ready={Boolean(sceneReady)}
      aria-busy={busy}
      style={
        {
          "--flavor-bg": product.background,
          "--flavor-ink": product.color,
        } as CSSProperties
      }
    >
      <div className="showcase-heading">
        <p className="eyebrow">03 / FIND YOUR FEEL-GOOD FLAVOR</p>
        <h2 id="showcase-heading">Choose your flavor.</h2>
        <p>Five bold flavors. One perfect fizz.</p>
      </div>
      <div
        className="showcase-stage"
        role="region"
        aria-label="Interactive flavor showcase. Use left and right arrow keys to change flavors."
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowRight") {
            event.preventDefault();
            changeFlavor(index + 1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            changeFlavor(index - 1);
          }
        }}
      >
        <WavyCircles className="showcase-waves" aria-hidden="true" />
        <button
          className="showcase-arrow previous"
          disabled={busy}
          aria-label="Previous flavor"
          onClick={() => changeFlavor(index - 1)}
        >
          <ArrowIcon />
        </button>
        <div
          className="showcase-can-area"
          onPointerDown={(event) => {
            gesture.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={(event) => {
            const start = gesture.current;
            gesture.current = null;
            if (!start) return;
            const dx = event.clientX - start.x;
            const dy = event.clientY - start.y;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3)
              changeFlavor(index + (dx < 0 ? 1 : -1));
          }}
          onPointerCancel={() => {
            gesture.current = null;
          }}
        >
          {!sceneReady && (
            <div className="showcase-fallback">
              <CanArtwork key={product.id} product={product} />
            </div>
          )}
          {enabled && (
            <View className="showcase-view narrative-view">
              <Suspense fallback={null}>
                <Scene product={product} spin={spin} />
              </Suspense>
            </View>
          )}
        </div>
        <button
          className="showcase-arrow next"
          disabled={busy}
          aria-label="Next flavor"
          onClick={() => changeFlavor(index + 1)}
        >
          <ArrowIcon />
        </button>
        <span className="showcase-interaction-hint">
          {reducedMotion
            ? "FIND YOUR FAVORITE"
            : "A LITTLE SPIN. A WHOLE NEW FLAVOR."}
        </span>
      </div>
      <div className="showcase-controls">
        <div
          className="showcase-product-copy"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="eyebrow">0{index + 1} / 05</p>
          <h3>{product.name}</h3>
          <p>{product.note}</p>
        </div>
        <div
          className="showcase-swatches"
          role="group"
          aria-label="Choose a flavor"
        >
          {FLAVORS.map((item, itemIndex) => (
            <button
              key={item.id}
              aria-label={item.name}
              aria-pressed={itemIndex === index}
              disabled={busy}
              onClick={() => changeFlavor(itemIndex)}
              style={{ backgroundColor: item.color }}
            />
          ))}
        </div>
        <div className="showcase-purchase">
          <div className="quantity">
            <button
              disabled={quantity <= 1 || busy}
              aria-label="Decrease showcase packs"
              onClick={() => setQuantity(quantity - 1)}
            >
              −
            </button>
            <span aria-live="polite">{quantity}</span>
            <button
              disabled={quantity >= MAX_QUANTITY || busy}
              aria-label="Increase showcase packs"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
          <button
            className="pill-button dark-button"
            disabled={busy}
            aria-label={`Add ${product.name} 12 pack to bag`}
            onClick={() => add(product.id, quantity)}
          >
            Add to bag · {money(PACK_PRICE * quantity)} <Arrow />
          </button>
        </div>
        <p className="showcase-pack-note">
          12 pack · 12 fl oz cans · Free shipping on orders $50+
        </p>
        <Link href={`/shop/${product.id}`} className="showcase-details">
          Meet {product.name} ↗
        </Link>
        <Link href="/shop" className="showcase-all">
          Shop all flavors →
        </Link>
      </div>
    </section>
  );
}
