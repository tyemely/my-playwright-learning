import { test, expect } from "@playwright/test";
import { USERS } from "../test-data";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";

const BASE_URL = "https://www.saucedemo.com";

test.describe( "Cart behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);

    const loginPage = new LoginPage(page);
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });
  
    test("Add one item to the cart", async ({ page }) => {
      const inventoryPage = new InventoryPage(page);

      await inventoryPage.addProductByIndex(0);

      await expect(
        inventoryPage.cartBadge,
        "Cart badge should show 1 after adding one item"
      ).toHaveText("1");
    });

    test("Add mltpl items to the cart", async ({ page }) => {
      const inventoryPage = new InventoryPage(page);

      await inventoryPage.addProductByIndex(0);
      await inventoryPage.addProductByIndex(1);
      await inventoryPage.addProductByIndex(2);

      await expect(
        inventoryPage.cartBadge,
        "Cart badge should show 3 after adding three items"
      ).toHaveText("3");
    });

    test("Remove single item", async ({ page }) => {
      const inventoryPage = new InventoryPage(page);

      await inventoryPage.addProductByIndex(0);

      await expect(
        inventoryPage.cartBadge,
        "Cart badge should show 1 after adding one item"
      ).toHaveText("1");

      await inventoryPage.removeProductByIndex(0);

      await expect(
        inventoryPage.cartBadge,
        "Cart badge should disappear after removing the only item from the cart"
      ).not.toBeVisible();
    });

    test("Remove one of many", async ({ page }) => {
      const inventoryPage = new InventoryPage(page);

      await inventoryPage.addProductByIndex(0);
      await inventoryPage.addProductByIndex(1);
      await inventoryPage.addProductByIndex(2);

      await expect(
        inventoryPage.cartBadge,
        "Cart badge should show 3 after adding three items"
      ).toHaveText("3");

      await inventoryPage.removeProductByIndex(1);

      await expect(
        inventoryPage.cartBadge,
        "Cart badge should show 2 after removing one of three items"
      ).toHaveText("2");
    });

    test("Remove from cart", async ({ page }) => {
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);

      const productName = await inventoryPage.getProductNameByIndex(0);
      await inventoryPage.addProductByIndex(0);
      await inventoryPage.openCart();

      await cartPage.removeProductByIndex(0);

      await expect(
        page.getByText(productName),
        "Product name should not be visible on the cart page after removal"
      ).not.toBeVisible();

      await expect(
        inventoryPage.cartBadge,
        "Cart badge should disappear after removing the only item from the cart"
      ).not.toBeVisible();
    });

    test("Names on the cart page", async ({ page }) => {
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);

      const productName = await inventoryPage.getProductNameByIndex(0);
      await inventoryPage.addProductByIndex(0);
      await inventoryPage.openCart();

      await expect(
        cartPage.cartItems,
        "The added product should be present in the cart"
      ).toContainText(productName);
    });



});