"use client";

import Link from "next/link";
import { useContext } from "react";
import { ExperienceContext } from "@/components/experience/ExperienceContext";
import ProductCardCan from "./ProductCardCan";
import { useCart } from "@/hooks/useCart";
import { money, PACK_PRICE, type Product } from "@/lib/products";
import CanArtwork from "./CanArtwork";
import { Arrow } from "./Icons";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const experience = useContext(ExperienceContext);
  const add = useCart((state) => state.add);
  return (
    <article className="product-card">
      <Link
        className="product-art"
        href={`/shop/${product.id}`}
        style={{ background: product.background }}
        aria-label={`Explore ${product.name}`}
      >
        <span className="product-tag">{product.tag}</span>
        <span className="product-number">0{index + 1}</span>
        <span
          className="product-orbit"
          style={{ borderColor: product.color }}
        />
        {experience ? (
          <ProductCardCan product={product} />
        ) : (
          <CanArtwork product={product} />
        )}
        <span className="product-explore">
          MEET YOUR NEW FAVORITE <Arrow />
        </span>
      </Link>
      <div className="product-title">
        <Link href={`/shop/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <span>{money(PACK_PRICE)}</span>
      </div>
      <p className="product-note">{product.note}</p>
      <button
        className="add-button"
        aria-label={`Add ${product.name} 12 pack to bag`}
        onClick={() => add(product.id)}
      >
        Add to bag{" "}
        <span>
          12 pack <span aria-hidden="true">+</span>
        </span>
      </button>
    </article>
  );
}
