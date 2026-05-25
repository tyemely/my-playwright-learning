import { test, expect } from "@playwright/test";
import { USERS, CHECKOUT_INFO } from "../test-data";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

const BASE_URL = "https://www.saucedemo.com";

test.describe( "Checkout flow", () => {
  let addedProductName: string;

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);

    const loginPage = new LoginPage(page);
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);

    const inventoryPage = new InventoryPage(page);
    addedProductName = await inventoryPage.getProductNameByIndex(0);
    await inventoryPage.addProductByIndex(0);
    await inventoryPage.openCart();
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);

    const cartPage = new CartPage(page);
    await cartPage.checkout();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
  });

    test("Three fields can be filled", async ({ page }) => {
      const checkoutPage = new CheckoutPage(page);

      await checkoutPage.fillInfo(
        CHECKOUT_INFO.firstName,
        CHECKOUT_INFO.lastName,
        CHECKOUT_INFO.zipCode
      );

      await expect(
        page,
        "User should be redirected to the overview step after filling all checkout fields and clicking Continue"
      ).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
    });

    test("Three fields must be filled", async ({ page }) => {
      const checkoutPage = new CheckoutPage(page);

      await checkoutPage.fillInfo(
        CHECKOUT_INFO.firstName,
        CHECKOUT_INFO.lastName,
        ""
      );

      await expect(
        checkoutPage.errorMessage,
        "Error message should be visible when one of the fields is empty"
      ).toBeVisible();

      await expect(
        checkoutPage.errorMessage,
        "Error message should indicate that Postal Code is required"
      ).toContainText("Error: Postal Code is required");

      await expect(
        page,
        "User should stay on the checkout-step-one page when a required field is missing"
      ).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
    });

    test.describe("After form is filled", () => {
      test.beforeEach(async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);
        await checkoutPage.fillInfo(
          CHECKOUT_INFO.firstName,
          CHECKOUT_INFO.lastName,
          CHECKOUT_INFO.zipCode
        );
        await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
      });

      test("Overview page shows the selected product", async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);

        await expect(
          checkoutPage.cartItems,
          "Overview page should display the product that was added to the cart"
        ).toContainText(addedProductName);
      });

      test("Order completion", async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);

        await checkoutPage.finish();

        await expect(
          page,
          "User should be redirected to the checkout complete page after finishing the order"
        ).toHaveURL(`${BASE_URL}/checkout-complete.html`);
      });

      test("Successful purchase message", async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);

        await checkoutPage.finish();

        await expect(
          page,
          "User should be on the checkout complete page before checking the success message"
        ).toHaveURL(`${BASE_URL}/checkout-complete.html`);

        await expect(
          checkoutPage.successMessage,
          "Success heading 'Thank you for your order!' should be visible after completing the order"
        ).toHaveText("Thank you for your order!");

        await expect(
          page.getByText(
            "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
          ),
          "Success description text should be visible after completing the order"
        ).toBeVisible();
      });

      test("Cancel order without losing product", async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);

        await checkoutPage.cancelButton.click();

        await expect(
          page,
          "User should be redirected to the inventory page after cancelling the order"
        ).toHaveURL(`${BASE_URL}/inventory.html`);

        await expect(
          page
            .locator(".inventory_item")
            .filter({ hasText: addedProductName })
            .getByRole("button"),
          "Product button should still be 'Remove' after cancelling the order — product must remain in the cart"
        ).toHaveText("Remove");

        await inventoryPage.openCart();
        await expect(page).toHaveURL(`${BASE_URL}/cart.html`);

        await expect(
          cartPage.cartItems,
          "The product should still be present in the cart after cancelling the order"
        ).toContainText(addedProductName);
      });
    });
});