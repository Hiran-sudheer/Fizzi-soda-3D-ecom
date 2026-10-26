import Link from "next/link";
export default function NotFound() {
  return (
    <section className="checkout-empty">
      <p className="eyebrow">404 · A LITTLE LOST IN THE FIZZ</p>
      <h1>
        This one
        <br />
        went flat.
      </h1>
      <p>Let’s get you back to something good.</p>
      <Link className="pill-button dark-button" href="/shop">
        Explore the flavors →
      </Link>
    </section>
  );
}
