# Fizzi project review

## Creative direction

The original can entrance, scroll parallax, sky drop, spinning flavor carousel, alternating can story, and oversized closing typography form the homepage. Commerce is integrated into this sequence: visitors can select a flavor, choose pack quantities, and add it to the bag from the rotating showcase. The catalog and individual product pages provide additional routes into shopping.

## Animation improvements

The two hero cans enter from opposing directions with coordinated rotation and easing. A separate transform layer follows the pointer through frame-rate-independent damping. Scrolling rotates the full group into the original five-can formation while the headline yields to the story. Entrance transforms, pointer movement, floating motion, and scroll transforms use separate groups so the animations do not fight over the same properties.

The sky chapter pins for a viewport-relative distance, brings the can down through local textured clouds, rotates it with scroll, and sends individual 3D words through the scene. The chapter labels and progress indicator use a separate overlay so cloud rendering cannot obscure them. The can exits before the shopping showcase enters.

The showcase makes one eased turn per flavor change, updates the label near the midpoint, and coordinates the copy and background color. All flavor models stay mounted with one visible, avoiding a texture-loading suspension during a turn. Transitions are bounded to prevent overlapping spin timelines. Previous/next buttons, swatches, keyboard arrows, and horizontal swipes select flavors. Purchase controls use the exact selected product and shared prices.

The original alternating story returns after the showcase. The strawberry can travels between left and right as the panels and backgrounds change. The original large “Soda that makes you smile” closing remains part of the page.

## Rendering and scrolling

The homepage uses one canvas with separate tracked views for each scene. Lenis runs from the GSAP ticker and forwards scroll updates to ScrollTrigger. Modal opening stops smooth scrolling, and closing the bag restores it. Render loops run on demand when the animated views leave the viewport. Pixel density is bounded; bubble motion uses elapsed frame time and managed geometry. Cloud textures, fonts, models, decoders, and HDR environments are served locally.

Reduced-motion preferences disable the automatic entrances, pinning, pointer movement, spinning transitions, and continuous floating. Product selection and purchasing remain available. Static artwork is visible while scenes load and when graphics are unavailable; textual content never waits for WebGL to become readable.

## Commerce

Five statically generated product pages, catalog filters, a persisted bag, shipping calculations, and validated demo checkout form the shopping flow. Prices use integer cents. Saved bag data is validated, quantities are bounded, and unavailable browser storage falls back to shopping in memory. The native modal restores keyboard focus and supports Escape dismissal.

Checkout remains explicitly simulated. No payment details are collected, no order is sent, and form details are not saved or transmitted. Production commerce needs a trusted server-side catalog and price calculation, inventory, hosted payment checkout, verified webhooks, taxes, delivery integrations, and fulfillment.

## Validation

Browser checks cover the shopping journey, saved-state recovery, mobile layout, graphics fallback, local assets, flavor switching and purchasing, sticky hero tracking, and the pinned sky stage. Visual review includes the hero, parallax formation, sky drop, and flavor showcase. All nine Chromium tests pass, along with TypeScript, lint, formatting, and production build checks.

Physical-device performance and Safari/Firefox coverage remain separate deployment checks. Asset ownership and attribution should be confirmed for the supplied brand materials before publication.
