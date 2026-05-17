import { test, expect } from "@playwright/test";

test("login should redirect to inventory", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");   // ← is this the real placeholder?
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/inventory/);
});

/*
Root cause: Placeholder text was "User Name" but the actual placeholder is "Username"
Fix: Verified the placeholder name using Pick Locator and corrected it -> getByPlaceholder("Username")
How I verified: npx playwright test tests/broken-tests.spec.ts --project=chromium and confirmed the test passes.*/


test("error message on wrong password", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("wrong_password");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByTestId("error")).toHaveText(
    "Epic sadface: Username and password do not match any user in this service");
});
/*
Root cause: The error message in the test was specified incorrectly.
Fix: Verified the text   and corrected it -> "Epic sadface: Username and password do not match any user in this service"
How I verified: npx playwright test tests/broken-tests.spec.ts --project=chromium and confirmed the test passes. */

test("cart badge appears after adding product", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await page.locator("[data-test=\"add-to-cart-sauce-labs-backpack\"]").click();   // ← something missing here

  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});
/*
Root cause: "await" was missing
Fix: Added  "await"
How I verified: npx playwright test tests/broken-tests.spec.ts --project=chromium and confirmed the test passes. */
test.afterEach(async ({ context }) => {
  await context.tracing.stop({
    path: 'trace.zip',
  });
});