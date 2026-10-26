import type { Metadata } from "next";
import Shop from "@/components/store/Shop";
export const metadata: Metadata = {
  title: "Shop all flavors",
  description:
    "Discover five bright, bold Fizzi soda flavors. Build your bag with 12-can packs of your favorites.",
};
export default function ShopPage() {
  return <Shop />;
}
