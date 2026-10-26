"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { products } from "@/lib/products";
import { useCart } from "@/hooks/useCart";
import ProductCard from "./ProductCard";
import { Arrow, Spark } from "./Icons";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const faqs = [
  [
    "What's inside a can of Fizzi?",
    "Our concept pairs sparkling water, fruit-inspired flavors, and prebiotic fiber in a 12 fl oz can. See the can artwork for the original label details. Fizzi is a portfolio concept, so ingredient and nutrition information is illustrative.",
  ],
  [
    "How many cans come in a pack?",
    "Every pack includes 12 cans of your chosen flavor. Pick a favorite, or add a few different packs to your bag. Two packs qualify for free demo shipping.",
  ],
  [
    "Where do you ship?",
    "This storefront demonstrates a US shopping experience with USD prices and a flat $4.99 shipping rate, waived on orders of $50 or more. No physical orders are shipped.",
  ],
  [
    "Can I actually place an order?",
    "You can explore every flavor, fill your bag, and complete a simulated checkout. This is an independent portfolio project. No payment is collected and no real order is placed.",
  ],
];
export default function Storefront() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils
          .toArray<HTMLElement>(
            ".section-heading, .story-copy, .ritual-grid > div",
          )
          .forEach((element) => {
            gsap.from(element, {
              y: 32,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: { trigger: element, start: "top 92%", once: true },
            });
          });
      });
      return () => media.revert();
    },
    { scope: root },
  );
  const product = products[0];
  const add = useCart((state) => state.add);
  return (
    <div ref={root}>
      <div className="good-strip" aria-label="Made for good moments">
        <span>BIG FLAVOR</span>
        <Spark />
        <span>FEEL-GOOD FIZZ</span>
        <Spark />
        <span>ENDLESS POSSIBILITIES</span>
        <Spark />
        <span>LIVE GUTSY</span>
        <Spark />
      </div>
      <section id="all-flavors" className="section-space flavor-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE GANG’S ALL HERE</p>
            <h2>
              A flavor for
              <br />
              every kind of you.
            </h2>
          </div>
          <div>
            <p>
              Find your ride-or-die.
              <br />
              Or make room for a few new favorites.
            </p>
            <Link href="/shop" className="text-link">
              Shop all flavors <Arrow />
            </Link>
          </div>
        </div>
        <div className="product-grid home-products">
          {products.slice(0, 3).map((item, index) => (
            <ProductCard key={item.id} product={item} index={index} />
          ))}
        </div>
      </section>
      <section className="ritual-section section-space">
        <p className="eyebrow">NO OCCASION NECESSARY</p>
        <h2>
          Your day.
          <br />A little <em>brighter.</em>
        </h2>
        <div className="ritual-grid">
          <div>
            <span>01 / THE FIRST SIP</span>
            <h3>A little pick-me-up.</h3>
            <p>
              Step away from the screen. Crack something good. Make a moment of
              it.
            </p>
          </div>
          <div>
            <span>02 / THE PLUS ONE</span>
            <h3>Better together.</h3>
            <p>
              Bring a pack. Pass one around. Good taste is a great conversation
              starter.
            </p>
          </div>
          <div>
            <span>03 / THE EVERYDAY</span>
            <h3>Make room for joy.</h3>
            <p>
              Lunch in the park or a night on the couch. Your favorite flavor
              fits right in.
            </p>
          </div>
        </div>
      </section>
      <section id="faq" className="faq-section section-space">
        <div>
          <p className="eyebrow">CURIOUS? GOOD.</p>
          <h2>
            A few good
            <br />
            questions.
          </h2>
          <p>
            Everything you want to know
            <br />
            before your first sip.
          </p>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="last-call">
        <Spark />
        <p className="eyebrow">YOUR FRIDGE CALLED.</p>
        <h2>
          Send the
          <br />
          <em>good stuff.</em>
        </h2>
        <button
          className="pill-button dark-button"
          onClick={() => add(product.id)}
        >
          Add {product.name} to bag <Arrow />
        </button>
        <p>12 cans. A whole lot of happy.</p>
      </section>
    </div>
  );
}
