"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/hooks/useCart";
import {
  FREE_SHIPPING,
  getProduct,
  MAX_QUANTITY,
  money,
  PACK_PRICE,
  SHIPPING,
} from "@/lib/products";
import CanArtwork from "./CanArtwork";
import { Arrow, Close } from "./Icons";

export default function Cart() {
  const { items, open, setOpen, update } = useCart();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!open) {
      element.close();
      return;
    }
    const previous = document.activeElement as HTMLElement | null;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [open]);
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * PACK_PRICE,
    0,
  );
  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  return (
    <dialog
      ref={dialog}
      className="cart-dialog"
      aria-labelledby="bag-heading"
      onCancel={() => setOpen(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div className="cart-panel" data-lenis-prevent>
        <div className="cart-heading">
          <h2 id="bag-heading">Your happy place.</h2>
          <button
            className="icon-button"
            onClick={() => setOpen(false)}
            aria-label="Close bag"
          >
            <Close />
          </button>
        </div>
        {items.length ? (
          <>
            <div className="shipping-progress">
              <p>
                {remaining
                  ? `${money(remaining)} away from free shipping.`
                  : "Good news. Shipping is on us!"}
              </p>
              <progress
                value={Math.min(subtotal, FREE_SHIPPING)}
                max={FREE_SHIPPING}
                aria-label="Progress toward free shipping"
              />
            </div>
            <div className="cart-items">
              {items.map((item) => {
                const product = getProduct(item.id)!;
                return (
                  <article className="cart-item" key={item.id}>
                    <div
                      className="cart-can"
                      style={{ background: product.background }}
                    >
                      <CanArtwork product={product} />
                    </div>
                    <div className="cart-item-info">
                      <Link
                        href={`/shop/${product.id}`}
                        onClick={() => setOpen(false)}
                      >
                        {product.name}
                      </Link>
                      <p>12 pack · 12 fl oz cans</p>
                      <div className="quantity">
                        <button
                          aria-label={`Decrease ${product.name} quantity`}
                          onClick={() => update(item.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span aria-live="polite">{item.quantity}</span>
                        <button
                          disabled={item.quantity >= MAX_QUANTITY}
                          aria-label={`Increase ${product.name} quantity`}
                          onClick={() => update(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-button remove-button"
                        onClick={() => update(item.id, 0)}
                        aria-label={`Remove ${product.name}`}
                      >
                        Remove
                      </button>
                    </div>
                    <strong>{money(PACK_PRICE * item.quantity)}</strong>
                  </article>
                );
              })}
            </div>
            <div className="cart-total">
              <div>
                <span>Subtotal</span>
                <strong>{money(subtotal)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <span>{remaining ? money(SHIPPING) : "On us"}</span>
              </div>
              <p>USD · Portfolio demo. No payment will be collected.</p>
              <Link
                className="pill-button dark-button"
                href="/checkout"
                onClick={() => setOpen(false)}
              >
                Continue to checkout <Arrow />
              </Link>
              <button className="text-button" onClick={() => setOpen(false)}>
                Keep exploring
              </button>
            </div>
          </>
        ) : (
          <div className="empty-bag">
            <span aria-hidden="true">✳</span>
            <h3>
              A little empty.
              <br />A lot of potential.
            </h3>
            <p>Your next favorite flavor is waiting.</p>
            <Link
              className="pill-button dark-button"
              href="/shop"
              onClick={() => setOpen(false)}
            >
              Find your fizz <Arrow />
            </Link>
          </div>
        )}
      </div>
    </dialog>
  );
}
