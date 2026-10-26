import { test, expect, type Page } from "@playwright/test";

async function addCherry(page: Page, packs = 1) {
  await page.goto("/shop/black-cherry");
  for (let i = 1; i < packs; i++)
    await page.getByRole("button", { name: "Increase packs" }).click();
  await page.getByRole("button", { name: /^Add to bag ·/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

test("cart quantities, free shipping, persistence, removal, and focus restoration", async ({
  page,
}) => {
  await addCherry(page, 2);
  const bag = page.getByRole("dialog");
  await expect(bag.getByText("Good news. Shipping is on us!")).toBeVisible();
  await expect(bag.getByText("$59.98", { exact: true }).first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(bag).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: /^Add to bag ·/ }),
  ).toBeFocused();
  await page.reload();
  await page.getByRole("button", { name: "Open bag, 2 packs" }).click();
  await bag
    .getByRole("button", { name: "Decrease Black Cherry quantity" })
    .click();
  await expect(bag.getByText("$20.01 away from free shipping.")).toBeVisible();
  await expect(bag.getByText("$4.99", { exact: true })).toBeVisible();
  await bag.getByRole("button", { name: "Remove Black Cherry" }).click();
  await expect(
    bag.getByText("Your next favorite flavor is waiting."),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Open bag, 0 packs" }),
  ).toBeVisible();
});

test("checkout validates input, completes a demo, and clears the saved bag", async ({
  page,
}) => {
  await addCherry(page);
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Continue to checkout" })
    .click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByText("$34.98", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Complete demo order" }).click();
  await expect(page.locator("input:invalid").first()).toBeFocused();
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("demo@example.com");
  await page.getByRole("textbox", { name: "First name" }).fill("Alex");
  await page.getByRole("textbox", { name: "Last name" }).fill("Fizz");
  await page
    .getByRole("textbox", { name: "Street address" })
    .fill("123 Sample Street");
  await page
    .getByRole("textbox", { name: "City", exact: true })
    .fill("Los Angeles");
  await page.getByRole("textbox", { name: "ZIP code" }).fill("90001");
  await page.getByRole("button", { name: "Complete demo order" }).click();
  await expect(page.getByRole("heading", { name: /You’ve got/ })).toBeVisible();
  await expect(page.getByText(/No payment was collected/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: /Your bag’s/ })).toBeVisible();
});

test("catalog filtering, alphabetical sorting, and product navigation", async ({
  page,
}) => {
  await page.goto("/shop");
  await expect(page.locator(".product-card")).toHaveCount(5);
  await page.getByRole("button", { name: "Citrus & bright" }).click();
  await expect(page.locator(".product-card")).toHaveCount(2);
  await expect(page.getByRole("status")).toContainText("2 flavors");
  await page.getByRole("button", { name: "All flavors" }).click();
  await page.getByLabel("Sort by").selectOption("name");
  await expect(page.locator(".product-title h3")).toHaveText([
    "Black Cherry",
    "Grape Goodness",
    "Lemon Lime",
    "Strawberry Lemonade",
    "Watermelon Crush",
  ]);
  await page
    .getByRole("link", { name: "Explore Lemon Lime", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Lemon Lime" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Watermelon Crush", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Watermelon Crush" }),
  ).toBeVisible();
});

test("all mobile pages fit the viewport and cart remains usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of [
    "/",
    "/shop",
    "/shop/strawberry-lemonade",
    "/checkout",
  ]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    if (route === "/") {
      await expect(page.locator(".hero-intro h1")).toHaveCSS("opacity", "1");
      expect(
        await page
          .locator(".hero-intro h1")
          .evaluate(
            (element) => element.scrollWidth <= element.clientWidth + 1,
          ),
      ).toBe(true);
      await page.screenshot({
        path: test.info().outputPath("mobile-home.png"),
        fullPage: false,
      });
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow, `horizontal overflow on ${route}`).toBe(false);
  }
  await addCherry(page);
  await expect(
    page
      .getByRole("dialog")
      .getByRole("link", { name: "Continue to checkout" }),
  ).toBeVisible();
});

test("shopping remains functional with WebGL disabled and reduced motion enabled", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type === "webgl2" || type === "webgl") return null;
      return original.apply(this, [type, ...args] as Parameters<
        typeof original
      >);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".hero-static-cans")).toBeVisible();
  await expect(page.locator(".narrative-canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Lemon Lime", exact: true }).click();
  await expect(page.locator(".showcase-product-copy h3")).toHaveText(
    "Lemon Lime",
  );
  await page
    .locator("#flavors")
    .getByRole("button", { name: "Add Lemon Lime 12 pack to bag" })
    .click();
  await expect(
    page.getByRole("dialog").getByText("Lemon Lime", { exact: true }),
  ).toBeVisible();
});

test("3D assets load locally and flavor changes do not raise browser errors", async ({
  page,
}) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (
      !request.url().startsWith("http://127.0.0.1:3100") &&
      !request.url().startsWith("blob:") &&
      !request.url().startsWith("data:")
    )
      external.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator(".narrative-hero")).toHaveAttribute(
    "data-scene-ready",
    "true",
    { timeout: 30000 },
  );
  await expect(page.locator(".narrative-skydive")).toHaveAttribute(
    "data-scene-ready",
    "true",
    { timeout: 30000 },
  );
  await expect(page.locator(".narrative-showcase")).toHaveAttribute(
    "data-scene-ready",
    "true",
    { timeout: 30000 },
  );
  await expect(page.locator(".narrative-values")).toHaveAttribute(
    "data-scene-ready",
    "true",
    { timeout: 30000 },
  );
  await expect(page.locator(".narrative-canvas canvas")).toBeVisible();
  await page.locator("#flavors").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Next flavor", exact: true }).click();
  await expect(page.locator(".showcase-product-copy h3")).toHaveText(
    "Grape Goodness",
  );
  await expect(page.locator("#flavors")).toHaveAttribute("aria-busy", "false");
  await page
    .getByRole("button", { name: "Watermelon Crush", exact: true })
    .click();
  await expect(page.locator(".showcase-product-copy h3")).toHaveText(
    "Watermelon Crush",
  );
  await expect(page.locator("#flavors")).toHaveAttribute("aria-busy", "false");
  await page.screenshot({
    path: test.info().outputPath("desktop-showcase.png"),
    fullPage: false,
  });
  await page
    .locator("#flavors")
    .getByRole("button", { name: "Add Watermelon Crush 12 pack to bag" })
    .click();
  await expect(
    page.getByRole("dialog").getByText("Watermelon Crush", { exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("saved cart rejects unknown products and clamps excessive quantities", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "fizzi-cart-v1",
      JSON.stringify({
        state: {
          items: [
            { id: "unknown", quantity: 1 },
            { id: "black-cherry", quantity: -3 },
            { id: "lemon-lime", quantity: 1000 },
          ],
        },
        version: 0,
      }),
    ),
  );
  await page.goto("/shop");
  await page.getByRole("button", { name: "Open bag, 12 packs" }).click();
  await expect(
    page.getByRole("dialog").getByText("Lemon Lime", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Increase Lemon Lime quantity" }),
  ).toBeDisabled();
});

test("malformed saved JSON does not prevent checkout from loading", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("fizzi-cart-v1", "{invalid json"),
  );
  await page.goto("/checkout");
  await expect(page.getByRole("heading", { name: /Your bag’s/ })).toBeVisible();
});

test("the original scroll story keeps the can stage sticky, pins the sky drop, and reaches shopping", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".narrative-skydive")).toHaveAttribute(
    "data-scene-ready",
    "true",
    { timeout: 30000 },
  );
  const positions = await page.evaluate(() => ({
    hero:
      document.querySelector(".narrative-hero")!.getBoundingClientRect().top +
      scrollY,
    sky:
      document.querySelector(".narrative-skydive")!.getBoundingClientRect()
        .top + scrollY,
    height: innerHeight,
  }));
  await page.evaluate(
    ({ hero, height }) =>
      window.scrollTo({ top: hero + height * 0.7, behavior: "instant" }),
    positions,
  );
  await expect
    .poll(() =>
      page
        .locator(".hero-scene-track")
        .evaluate((element) => Math.abs(element.getBoundingClientRect().top)),
    )
    .toBeLessThan(2);
  await page.screenshot({ path: test.info().outputPath("parallax.png") });
  await page.evaluate(
    ({ sky, height }) =>
      window.scrollTo({ top: sky + height * 1.3, behavior: "instant" }),
    positions,
  );
  await expect
    .poll(() =>
      page
        .locator(".sky-stage")
        .evaluate((element) => Math.abs(element.getBoundingClientRect().top)),
    )
    .toBeLessThan(2);
  await expect
    .poll(() =>
      page
        .locator(".sky-progress span")
        .evaluate((element) =>
          Number(
            getComputedStyle(element)
              .transform.split(",")[0]
              .replace("matrix(", ""),
          ),
        ),
    )
    .toBeGreaterThan(0.2);
  await page.screenshot({ path: test.info().outputPath("sky-drop.png") });
  await page.locator("#flavors").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("button", { name: "Next flavor", exact: true }),
  ).toBeInViewport();
  await page.locator(".showcase-stage").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".showcase-product-copy h3")).toHaveText(
    "Grape Goodness",
  );
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 375, height: 812 },
]) {
  test(`hero copy stays readable on first scroll and returns at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator(".narrative-hero-actions")).toHaveCSS(
      "opacity",
      "1",
    );
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    const introTop = await page
      .locator(".hero-intro")
      .evaluate((element) => element.getBoundingClientRect().top + scrollY);
    await page.evaluate(
      (top) => scrollTo({ top, behavior: "instant" }),
      introTop + viewport.height * 0.18,
    );
    for (const selector of [
      ".hero-description-scroll",
      ".hero-actions-scroll",
      ".narrative-hero-description",
    ]) {
      await expect(page.locator(selector)).toHaveCSS("opacity", "1");
    }
    await expect(page.locator(".narrative-hero-word").first()).toHaveCSS(
      "opacity",
      "1",
    );
    await page.screenshot({
      path: test.info().outputPath("hero-first-scroll.png"),
    });
    await page.evaluate(
      (top) => scrollTo({ top, behavior: "instant" }),
      introTop + viewport.height * 0.65,
    );
    await expect
      .poll(() =>
        page
          .locator(".hero-story-copy h2")
          .evaluate((element) => Number(getComputedStyle(element).opacity)),
      )
      .toBeGreaterThan(0.6);
    await expect
      .poll(() =>
        page
          .locator(".hero-description-scroll")
          .evaluate((element) => Number(getComputedStyle(element).opacity)),
      )
      .toBeGreaterThan(0.2);
    await page.evaluate(
      (top) => scrollTo({ top, behavior: "instant" }),
      introTop + viewport.height * 0.9,
    );
    await expect(page.locator(".hero-actions-scroll")).toHaveCSS(
      "opacity",
      "0",
    );
    await expect(page.locator(".hero-story-copy h2")).toHaveCSS("opacity", "1");
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    for (const selector of [
      ".hero-title-scroll",
      ".hero-description-scroll",
      ".hero-actions-scroll",
      ".narrative-hero-actions",
    ]) {
      await expect(page.locator(selector)).toHaveCSS("opacity", "1");
    }
    await expect(page.locator(".narrative-hero-word").first()).toHaveCSS(
      "opacity",
      "1",
    );
  });
}
