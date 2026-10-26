"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useCart } from "@/hooks/useCart";
import {
  FREE_SHIPPING,
  getProduct,
  money,
  PACK_PRICE,
  SHIPPING,
} from "@/lib/products";
import { Arrow, Spark } from "./Icons";
import CanArtwork from "./CanArtwork";

export default function Checkout() {
  const { items, clear } = useCart();
  const [hydrated, setHydrated] = useState(false);
  const [receipt, setReceipt] = useState<{
    count: number;
    total: number;
  } | null>(null);
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * PACK_PRICE,
    0,
  );
  const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING;
  const total = subtotal + shipping;
  useEffect(() => {
    if (useCart.persist.hasHydrated()) setHydrated(true);
    return useCart.persist.onFinishHydration(() => setHydrated(true));
  }, []);
  function complete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return;
    setReceipt({
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total,
    });
    clear();
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  if (!hydrated)
    return (
      <div className="checkout-empty" role="status">
        Getting your bag ready…
      </div>
    );
  if (receipt)
    return (
      <section className="checkout-empty success-state" aria-live="polite">
        <Spark />
        <p className="eyebrow">THAT’S THE SPIRIT.</p>
        <h1>
          You’ve got
          <br />
          <em>good taste.</em>
        </h1>
        <p>
          Your demo checkout for {receipt.count}{" "}
          {receipt.count === 1 ? "pack" : "packs"} is complete.
          <br />
          Demo total: {money(receipt.total)}. No payment was collected.
        </p>
        <p>
          This is a portfolio experience. No real order was placed,
          <br />
          and your form details were not saved or sent.
        </p>
        <Link href="/shop" className="pill-button dark-button">
          Keep the good vibes going <Arrow />
        </Link>
      </section>
    );
  if (!items.length)
    return (
      <section className="checkout-empty">
        <p className="eyebrow">LET’S START WITH THE GOOD STUFF.</p>
        <h1>
          Your bag’s
          <br />a blank canvas.
        </h1>
        <p>Choose a flavor and make it your own.</p>
        <Link href="/shop" className="pill-button dark-button">
          Find your fizz <Arrow />
        </Link>
      </section>
    );
  return (
    <section className="checkout-section section-space">
      <Link className="text-link" href="/shop">
        ← Back to the good stuff
      </Link>
      <div className="checkout-title">
        <p className="eyebrow">ONE STEP CLOSER TO HAPPY</p>
        <h1>
          Make it <em>yours.</em>
        </h1>
      </div>
      <div className="demo-notice">
        <strong>You’re trying a portfolio demo.</strong> Use sample details. No
        payment, account, or real address is needed. Nothing entered here is
        sent or saved.
      </div>
      <div className="checkout-grid">
        <form onSubmit={complete}>
          <h2>Your demo details</h2>
          <label>
            Email
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="hello@example.com"
              required
              maxLength={254}
            />
          </label>
          <div className="form-row">
            <label>
              First name
              <input
                name="firstName"
                placeholder="Alex"
                autoComplete="off"
                required
                maxLength={80}
                pattern=".*\S.*"
              />
            </label>
            <label>
              Last name
              <input
                name="lastName"
                placeholder="Fizz"
                autoComplete="off"
                required
                maxLength={80}
                pattern=".*\S.*"
              />
            </label>
          </div>
          <h2>Demo delivery</h2>
          <label>
            Street address
            <input
              name="address"
              autoComplete="off"
              placeholder="123 Sunshine Lane"
              required
              maxLength={200}
              pattern=".*\S.*"
            />
          </label>
          <div className="form-row">
            <label>
              City
              <input
                name="city"
                autoComplete="off"
                placeholder="Los Angeles"
                required
                maxLength={100}
                pattern=".*\S.*"
              />
            </label>
            <label>
              State
              <select name="state" defaultValue="CA" required>
                {[
                  "AL",
                  "AK",
                  "AZ",
                  "AR",
                  "CA",
                  "CO",
                  "CT",
                  "DE",
                  "FL",
                  "GA",
                  "HI",
                  "ID",
                  "IL",
                  "IN",
                  "IA",
                  "KS",
                  "KY",
                  "LA",
                  "ME",
                  "MD",
                  "MA",
                  "MI",
                  "MN",
                  "MS",
                  "MO",
                  "MT",
                  "NE",
                  "NV",
                  "NH",
                  "NJ",
                  "NM",
                  "NY",
                  "NC",
                  "ND",
                  "OH",
                  "OK",
                  "OR",
                  "PA",
                  "RI",
                  "SC",
                  "SD",
                  "TN",
                  "TX",
                  "UT",
                  "VT",
                  "VA",
                  "WA",
                  "WV",
                  "WI",
                  "WY",
                  "DC",
                ].map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </select>
            </label>
            <label>
              ZIP code
              <input
                name="zip"
                autoComplete="off"
                inputMode="numeric"
                pattern="[0-9]{5}(-[0-9]{4})?"
                title="Enter a 5-digit US ZIP code"
                placeholder="90001"
                required
              />
            </label>
          </div>
          <div className="demo-payment">
            <span aria-hidden="true">✳</span>
            <div>
              <strong>Good news. This one’s imaginary.</strong>
              <p>
                No card details. No charges. Just a little feel-good checkout.
              </p>
            </div>
          </div>
          <button className="pill-button dark-button" type="submit">
            Complete demo order <Arrow />
          </button>
          <p className="checkout-disclaimer">
            Simulated checkout · No purchase is made
          </p>
        </form>
        <aside className="order-summary">
          <p className="eyebrow">YOUR VERY GOOD CHOICES</p>
          <h2>In your bag</h2>
          {items.map((item) => {
            const product = getProduct(item.id)!;
            return (
              <div className="summary-item" key={item.id}>
                <div
                  className="summary-can"
                  style={{ background: product.background }}
                >
                  <CanArtwork product={product} />
                </div>
                <div>
                  <strong>{product.name}</strong>
                  <p>{item.quantity} × 12 pack</p>
                </div>
                <strong>{money(item.quantity * PACK_PRICE)}</strong>
              </div>
            );
          })}
          <div className="summary-totals">
            <div>
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div>
              <span>Shipping</span>
              <span>{shipping ? money(shipping) : "On us"}</span>
            </div>
            <div>
              <strong>
                Demo total <small>USD</small>
              </strong>
              <strong>{money(total)}</strong>
            </div>
          </div>
          <button
            className="text-button"
            onClick={() => useCart.getState().setOpen(true)}
          >
            Edit your bag
          </button>
        </aside>
      </div>
    </section>
  );
}
