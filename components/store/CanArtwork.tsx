import type { CSSProperties } from "react";
import type { Product } from "@/lib/products";

export default function CanArtwork({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${product.name} Fizzi soda can`}
      className={`can-art ${className}`}
      style={
        {
          "--can-color": product.color,
          "--can-label": `url(${product.label})`,
        } as CSSProperties
      }
    >
      <div className="can-top">
        <i />
      </div>
      <div className="can-label" />
      <div className="can-bottom" />
    </div>
  );
}
