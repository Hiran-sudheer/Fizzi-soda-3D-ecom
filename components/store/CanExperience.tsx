"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { products, type Product } from "@/lib/products";
import CanArtwork from "./CanArtwork";
const CanScene = dynamic(() => import("./CanScene"), { ssr: false });

class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function CanExperience({
  product,
  trio = false,
}: {
  product: Product;
  trio?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [supported, setSupported] = useState(false);
  const [readyFlavor, setReadyFlavor] = useState<string | null>(null);
  const ready = readyFlavor === product.id;
  const [failed, setFailed] = useState(false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const onReady = useCallback(() => setReadyFlavor(product.id), [product.id]);
  const onError = useCallback(() => setFailed(true), []);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "150px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    setSupported(Boolean(context));
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  }, []);
  return (
    <div className="can-experience" ref={container}>
      <div
        className={`can-fallback ${ready && !failed ? "is-ready" : ""}`}
        aria-hidden={ready && !failed}
      >
        {trio && (
          <CanArtwork product={products[1]} className="side-can left-can" />
        )}
        <CanArtwork product={product} className="main-can" />
        {trio && (
          <CanArtwork product={products[2]} className="side-can right-can" />
        )}
      </div>
      {supported && !failed && (
        <div className="scene-layer">
          <SceneBoundary onError={onError}>
            <CanScene
              product={product}
              active={visible}
              reducedMotion={reducedMotion}
              onReady={onReady}
              trio={trio}
            />
          </SceneBoundary>
        </div>
      )}
      <span className="scene-hint">
        {ready && !failed
          ? "↔ DRAG TO EXPLORE IN 3D"
          : "A LITTLE CAN. A LOT OF PERSONALITY."}
      </span>
    </div>
  );
}
