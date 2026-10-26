import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cart from "@/components/store/Cart";
import ScrollRail from "@/components/ScrollRail";

const alpino = localFont({
  src: "../public/fonts/Alpino-Variable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-alpino",
});
export const metadata: Metadata = {
  title: { default: "Fizzi — Good vibes. Great fizz.", template: "%s | Fizzi" },
  description:
    "Meet your next favorite soda. Explore five bold flavors in 3D, find your happy, and bring home a little extra fizz. An interactive portfolio storefront.",
  openGraph: {
    title: "Fizzi — Good vibes. Great fizz.",
    description:
      "Five bold flavors. Zero boring sips. Explore the Fizzi portfolio storefront.",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={alpino.variable}>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Cart />
        <ScrollRail />
      </body>
    </html>
  );
}
