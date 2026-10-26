import type { Metadata } from "next";
import Checkout from "@/components/store/Checkout";
export const metadata: Metadata = {
  title: "Demo checkout",
  robots: { index: false, follow: false },
};
export default function CheckoutPage() {
  return <Checkout />;
}
