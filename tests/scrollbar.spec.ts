import { test, expect } from "@playwright/test";

for (const width of [1440, 375]) {
  test(`custom scrollbar supports dragging, keyboard navigation, and bag locking at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (
        this: HTMLCanvasElement,
        type: string,
        ...args: unknown[]
      ) {
        if (type === "webgl" || type === "webgl2") return null;
        return original.apply(this, [type, ...args] as Parameters<
          typeof original
        >);
      } as typeof original;
    });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    const rail = page.getByRole("scrollbar", { name: "Page scroll" });
    await expect(rail).toBeVisible();
    await expect(page.locator("html")).toHaveCSS("scrollbar-width", "none");
    await rail.focus();
    await page.keyboard.press("End");
    await expect(rail).toHaveAttribute("aria-valuenow", "100");
    await page.keyboard.press("Home");
    await expect(rail).toHaveAttribute("aria-valuenow", "0");
    await page.keyboard.press("PageDown");
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
    await page.keyboard.press("Home");
    await expect(rail).toHaveAttribute("aria-valuenow", "0");
    const thumb = await page.locator(".fizzi-scrollbar-thumb").boundingBox();
    const track = await rail.boundingBox();
    expect(thumb).not.toBeNull();
    expect(track).not.toBeNull();
    await page.mouse.move(
      thumb!.x + thumb!.width / 2,
      thumb!.y + thumb!.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      track!.x + track!.width / 2,
      track!.y + track!.height / 2,
      { steps: 8 },
    );
    await page.mouse.up();
    await expect
      .poll(async () => Number(await rail.getAttribute("aria-valuenow")))
      .toBeGreaterThan(40);
    await expect
      .poll(async () => Number(await rail.getAttribute("aria-valuenow")))
      .toBeLessThan(60);
    await page.screenshot({
      path: test.info().outputPath("custom-scrollbar.png"),
    });
    await rail.focus();
    await page.keyboard.press("Home");
    await expect(rail).toHaveAttribute("aria-valuenow", "0");
    await page.getByRole("button", { name: /Open bag/ }).click();
    await expect(rail).toBeHidden();
    await page.getByRole("button", { name: "Close bag" }).click();
    await expect(rail).toBeVisible();
    await page.goto("/shop");
    await expect(rail).toBeVisible();
    await rail.focus();
    await page.keyboard.press("End");
    await expect(rail).toHaveAttribute("aria-valuenow", "100");
  });
}
