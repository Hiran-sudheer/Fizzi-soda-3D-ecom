"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import {
  MAX_QUANTITY,
  money,
  PACK_PRICE,
  products,
  type Product,
} from "@/lib/products";
import CanExperience from "./CanExperience";
import ProductCard from "./ProductCard";
import { Arrow } from "./Icons";
export default function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const add = useCart((state) => state.add);
  return (
    <>
      <div className="breadcrumb">
        <Link href="/shop">All flavors</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      <section className="product-detail">
        <div
          className="detail-visual"
          style={{ background: product.background }}
        >
          <span className="product-tag">{product.tag}</span>
          <div
            className="detail-orbit"
            style={{ borderColor: product.color }}
          />
          <CanExperience product={product} />
        </div>
        <div className="detail-copy">
          <p className="eyebrow">YOUR DAILY DOSE OF HAPPY</p>
          <h1>{product.name}</h1>
          <p className="detail-note">{product.note}</p>
          <p>{product.description}</p>
          <div className="detail-price">
            <strong>{money(PACK_PRICE)}</strong>
            <span>
              12 pack · 12 fl oz / can · {money(PACK_PRICE / 12)} per can
            </span>
          </div>
          <fieldset className="detail-flavors">
            <legend>Find your flavor</legend>
            {products.map((item) => (
              <Link
                key={item.id}
                aria-label={item.name}
                aria-current={item.id === product.id ? "page" : undefined}
                href={`/shop/${item.id}`}
                style={{ background: item.color }}
              />
            ))}
          </fieldset>
          <div className="detail-buy">
            <div className="quantity">
              <button
                disabled={quantity <= 1}
                onClick={() => setQuantity(quantity - 1)}
                aria-label="Decrease packs"
              >
                −
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                disabled={quantity >= MAX_QUANTITY}
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase packs"
              >
                +
              </button>
            </div>
            <button
              className="pill-button dark-button"
              onClick={() => add(product.id, quantity)}
            >
              Add to bag · {money(PACK_PRICE * quantity)} <Arrow />
            </button>
          </div>
          <p className="detail-shipping">
            ✳ Free shipping on orders $50+ · USD
          </p>
          <details className="detail-disclosure">
            <summary>
              The little details <span>+</span>
            </summary>
            <p>
              Each pack contains 12 cans of {product.name}, 12 fl oz each. Best
              enjoyed chilled. Store in a cool, dry place.
            </p>
          </details>
          <details className="detail-disclosure">
            <summary>
              About this concept <span>+</span>
            </summary>
            <p>
              Fizzi is an independent portfolio storefront. Product
              descriptions, pricing, and shipping are illustrative. Checkout is
              simulated and no payment is collected.
            </p>
          </details>
        </div>
      </section>
      <section className="section-space related-products">
        <div className="section-heading">
          <div>
            <p className="eyebrow">GOOD COMPANY</p>
            <h2>
              Keep the good
              <br />
              flavors coming.
            </h2>
          </div>
          <Link className="text-link" href="/shop">
            Explore them all <Arrow />
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((item) => item.id !== product.id)
            .slice(0, 3)
            .map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                index={products.indexOf(item)}
              />
            ))}
        </div>
      </section>
    </>
  );
}
