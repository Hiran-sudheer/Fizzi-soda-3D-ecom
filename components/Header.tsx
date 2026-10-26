"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { FizziLogo } from "./FizziLogo";
import { Bag } from "./store/Icons";

export default function Header() {
  const items = useCart((state) => state.items);
  const setOpen = useCart((state) => state.setOpen);
  const pathname = usePathname();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="announcement">
        GOOD THINGS COME IN BUBBLES <span>✳</span> FREE SHIPPING ON ORDERS $50+
      </div>
      <header className="site-header">
        <Link href="/" aria-label="Fizzi home" className="brand">
          <FizziLogo />
        </Link>
        <nav aria-label="Main navigation">
          <Link
            href="/shop"
            aria-current={pathname.startsWith("/shop") ? "page" : undefined}
          >
            Shop the fizz
          </Link>
          <Link href="/#our-story">Our story</Link>
          <Link href="/#faq" className="nav-faq">
            Good questions
          </Link>
        </nav>
        <button
          className="bag-button"
          onClick={() => setOpen(true)}
          aria-label={`Open bag, ${count} packs`}
        >
          <Bag />
          <span className="bag-word">Your bag</span>
          <span className="bag-count">{count}</span>
        </button>
      </header>
    </>
  );
}
