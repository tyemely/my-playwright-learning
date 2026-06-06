import { test, expect } from "@playwright/test";
import { USERS } from "../test-data";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";

const BASE_URL = "https://www.saucedemo.com";
const PRODUCTS_COUNT = 6;

function getRandomIndex(): number {
  return Math.floor(Math.random() * PRODUCTS_COUNT);
}

function getRandomIndices(count: number): number[] {
  const indices = Array.from({ length: PRODUCTS_COUNT }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, count);
}

test.describe( "Cart behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);

    const loginPage = new LoginPage(page);
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });
  
    test("Add one item to the cart", async ({ page }) => {
      const inventoryPage = new InventoryPage(page);
      const randomIndex = getRandomIndex();

      await inventoryPage.addProductByIndex(randomIndex);

      await expect(
        inventoryPage.cartBadge,
        "Cart badge should show 1 after adding one item"
      ).toHaveText("1");
    });

    test("Add mltpl items to the cart", async ({ page }) => {
      const inventoryPage = new InventoryPage(page);
      const randomIndices = getRandomIndices(3);

      for (const index of randomIndices) {
        await inventoryPage.addProductByIndex(index);
      }

      await expect(
        inventoryPage.cartBadge,
        "Cart badge should show 3 after adding three items"
      ).toHaveText("3");
    });

    test("Remove single item", async ({ page }) => {
      const inventoryPage = new InventoryPage(page);
      const randomIndex = getRandomIndex();

      await inventoryPage.addProductByIndex(randomIndex);

      await expect(
        inventoryPage.cartBadge,
        "Cart badge should show 1 after adding one item"
      ).toHaveText("1");

      await inventoryPage.removeProductByIndex(randomIndex);

      await expect(
        inventoryPage.cartBadge,
        "Cart badge should disappear after removing the only item from the cart"
      ).not.toBeVisible();
    });

    test("Remove one of many", async ({ page }) => {
      const inventoryPage = new InventoryPage(page);
      const randomIndices = getRandomIndices(3);

      for (const index of randomIndices) {
        await inventoryPage.addProductByIndex(index);
      }

      await expect(
        inventoryPage.cartBadge,
        "Cart badge should show 3 after adding three items"
      ).toHaveText("3");

      await inventoryPage.removeProductByIndex(randomIndices[1]);

      await expect(
        inventoryPage.cartBadge,
        "Cart badge should show 2 after removing one of three items"
      ).toHaveText("2");
    });

    test("Remove from cart", async ({ page }) => {
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);
      const randomIndex = getRandomIndex();

      const productName = await inventoryPage.getProductNameByIndex(randomIndex);
      await inventoryPage.addProductByIndex(randomIndex);
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
      const randomIndex = getRandomIndex();

      const productName = await inventoryPage.getProductNameByIndex(randomIndex);
      await inventoryPage.addProductByIndex(randomIndex);
      await inventoryPage.openCart();

      await expect(
        cartPage.cartItems,
        "The added product should be present in the cart"
      ).toContainText(productName);
    });



});