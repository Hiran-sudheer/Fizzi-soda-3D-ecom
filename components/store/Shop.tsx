"use client";
import { useState } from "react";
import { products } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function Shop() {
  const [filter, setFilter] = useState("All flavors");
  const [sort, setSort] = useState("featured");
  const filtered = products.filter(
    (product) =>
      filter === "All flavors" ||
      (filter === "Citrus & bright"
        ? ["lemon-lime", "strawberry-lemonade"].includes(product.id)
        : ["black-cherry", "grape", "watermelon"].includes(product.id)),
  );
  if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <section className="shop-section section-space">
      <div className="shop-intro">
        <p className="eyebrow">MEET YOUR FRIDGE’S NEW FAVORITES</p>
        <h1>
          Pick your
          <br />
          <em>happy.</em>
        </h1>
        <p>
          Five big personalities. One very good decision.
          <br />
          12 cans per pack. Free shipping on orders $50+.
        </p>
      </div>
      <div className="shop-toolbar">
        <div
          className="filter-buttons"
          role="group"
          aria-label="Filter flavors"
        >
          {["All flavors", "Citrus & bright", "Fruit favorites"].map((item) => (
            <button
              key={item}
              aria-pressed={item === filter}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <label>
          Sort by{" "}
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="name">Name: A–Z</option>
          </select>
        </label>
      </div>
      <p className="results-count" role="status">
        {filtered.length} flavors, endless good moments
      </p>
      <div className="product-grid shop-products">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            index={products.indexOf(product)}
          />
        ))}
      </div>
    </section>
  );
}
