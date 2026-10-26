import Link from "next/link";
import { FizziLogo } from "./FizziLogo";
import { Arrow } from "./store/Icons";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <p className="eyebrow">STAY A LITTLE FIZZI.</p>
          <h2>
            Good taste.
            <br />
            Great company.
          </h2>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/shop">
            Shop the fizz <Arrow />
          </Link>
          <Link href="/#our-story">
            Our story <Arrow />
          </Link>
          <Link href="/#faq">
            Good questions <Arrow />
          </Link>
        </nav>
      </div>
      <Link href="/" aria-label="Fizzi home" className="footer-logo">
        <FizziLogo />
      </Link>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Fizzi · An independent portfolio concept
        </span>
        <span>MADE WITH A LITTLE EXTRA FIZZ. ✳</span>
        <span>Demo store · No real purchases</span>
      </div>
    </footer>
  );
}
