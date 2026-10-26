# Fizzi-soda-3D-ecom

An interactive soda storefront built with Next.js, React Three Fiber, Three.js, GSAP, and Zustand. The original animated can story, five flavors, and a complete demo shopping journey.

## Run locally

Use Node.js 20.9+ and npm.

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

## What's included

- Responsive art direction using the original Fizzi typography, labels, and can model.
- Original opposing can entrances, pointer parallax, and a scroll-driven five-can formation.
- Pinned sky-drop scene with local cloud textures, rotating cans, and flying 3D words.
- Spinning flavor showcase with coordinated color and copy changes, keyboard and swipe controls, quantities, and direct add-to-bag.
- Alternating story panels with a can that travels from side to side, followed by the original oversized closing typography.
- Shared scissored homepage canvas, synchronized Lenis/GSAP scrolling, local HDR lighting, and local Draco decoding.
- Draggable 3D product-page previews.
- Artwork fallback while assets load and when WebGL is unavailable.
- Motion preferences, bounded pixel density, and paused continuous rendering outside the viewport.
- Five statically generated product pages, catalog filters, and alphabetical sorting.
- Persistent shopping bag with quantity controls, removal, shipping calculations, and defensive storage restoration.
- Native modal bag drawer with focus management, Escape dismissal, and scroll containment.
- Validated demo checkout, order summary, and confirmation. Form data stays in the browser and is not persisted or transmitted.
- Per-page metadata, a custom missing-page experience, and a local variable font.

## Routes

| Route          | Purpose                                             |
| -------------- | --------------------------------------------------- |
| `/`            | Brand experience and interactive flavor explorer    |
| `/shop`        | All flavors, filters, and sorting                   |
| `/shop/[slug]` | Flavor details, interactive can, and pack selection |
| `/checkout`    | Simulated checkout and confirmation                 |

## Validation

```bash
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser tests use a separate production server on port 3100, so build first. Stop the development server during a build because both modes write to `.next`. You can point `CHROMIUM_EXECUTABLE_PATH` at an existing Chromium executable instead of downloading one.

The tests cover bag persistence and removal, shipping thresholds, checkout validation and completion, catalog navigation, mobile overflow, reduced motion, unavailable WebGL, local 3D assets, spinning flavor purchases, the sticky and pinned scroll stages, and malformed saved carts.

## Structure

- `lib/products.ts`: shared flavor catalog, prices in integer cents, pack size, quantity limits, and shipping rules.
- `hooks/useCart.ts`: persisted shopping state. Checkout details are never stored.
- `components/store/`: storefront, catalog, product detail, 3D experience, bag, and checkout.
- `components/SodaCan.tsx`: original model geometry with per-flavor sRGB label textures.
- `public/draco/`: local decoder files copied from the installed Three.js distribution. Regenerate these from `node_modules/three/examples/jsm/libs/draco/gltf/` when upgrading Three.js.
- `components/sections/`: the active hero, sky drop, rotating showcase, alternating story, and oversized closing.
- `components/experience/`: homepage composition, scene readiness, pointer state, reduced-motion preferences, and graceful graphics fallback.
- `docs/project-review.md`: initial findings, delivered improvements, and the path to a real store.

## Dependency maintenance

Next.js and its lint configuration use the patched 15.5 release line. A PostCSS 8.x override removes the vulnerable version previously pinned by the framework. Recheck this override when upgrading Next.js. Compatible transitive dependency patches are recorded in `package-lock.json`.

## Portfolio concept

This is an independent portfolio project using the existing Fizzi artwork and assets. Pricing, shipping, product copy, and checkout are illustrative. No payment is collected, no order is sent, and no product is shipped. Confirm permission and attribution for the supplied brand assets before publishing the portfolio.

A real store needs a server-side catalog and order service, trusted price calculation, payment-provider checkout with verified webhooks, tax and delivery integrations, inventory, and fulfillment. The demo checkout intentionally does not pretend to provide those systems.
