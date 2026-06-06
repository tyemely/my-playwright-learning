import { test, expect } from "@playwright/test";
import { USERS } from "../test-data";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";

const BASE_URL = "https://www.saucedemo.com";

test.describe("Product sorting", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);

    const loginPage = new LoginPage(page);
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test("Sort by Price (low to high", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await page.getByTestId('product-sort-container').selectOption('lohi');  //select "Price (low to high)" in the sort dropdown
    await expect(
      page.getByTestId('product-sort-container'),
      'The "low to high" sorting option has been selected',
    ).toHaveValue('lohi');

    const priceTexts = await page.getByTestId('inventory-item-price').allTextContents();
    const prices = priceTexts.map((t) => Number(t.replace('$', '').trim()));
    const sortedAscending = [...prices].sort((a, b) => a - b);

    expect(
      prices,
      'Product prices should be sorted in ascending order after selecting "Price (low to high)"',
    ).toEqual(sortedAscending);
  });

  test("Sort by Price (high to low", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await page.getByTestId('product-sort-container').selectOption('hilo');  //select "Price (high to low)" in the sort dropdown
    await expect(
      page.getByTestId('product-sort-container'),
      'The "high to low" sorting option has been selected',
    ).toHaveValue('hilo');

    const priceTexts = await page.getByTestId('inventory-item-price').allTextContents();
    const prices = priceTexts.map((t) => Number(t.replace('$', '').trim()));
    const sortedDescending = [...prices].sort((a, b) => b - a);

    expect(
      prices,
      'Product prices should be sorted in descending order after selecting "Price (high to low)"',
    ).toEqual(sortedDescending);
  });

  test("Sort by Name A to Z", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await page.getByTestId('product-sort-container').selectOption('az');  //select "Name (A to Z)" in the sort dropdown
    await expect(
      page.getByTestId('product-sort-container'),
      'The "A to Z" sorting option has been selected',
    ).toHaveValue('az');

    const names = await page.getByTestId('inventory-item-name').allTextContents();
    const sortedAscending = [...names].sort((a, b) => a.localeCompare(b));

    expect(
      names,
      'Product names should be sorted alphabetically ascending after selecting "Name (A to Z)"',
    ).toEqual(sortedAscending);
  });

  test("Sort by Name Z to A", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await page.getByTestId('product-sort-container').selectOption('za');  //select "Name (Z to A)" in the sort dropdown
    await expect(
      page.getByTestId('product-sort-container'),
      'The "Z to A" sorting option has been selected',
    ).toHaveValue('za');

    const names = await page.getByTestId('inventory-item-name').allTextContents();
    const sortedDescending = [...names].sort((a, b) => b.localeCompare(a));

    expect(
      names,
      'Product names should be sorted alphabetically descending after selecting "Name (Z to A)"',
    ).toEqual(sortedDescending);
  });

  test("Switching sort option updates product order", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    const initialFirstName = await page.getByTestId('inventory-item-name').first().textContent();

    await page.getByTestId('product-sort-container').selectOption('za');  //switch to "Name (Z to A)"
    await expect(
      page.getByTestId('product-sort-container'),
      'The "Z to A" sorting option has been selected',
    ).toHaveValue('za');

    await expect(
      page.getByTestId('inventory-item-name').first(),
      'The first product name should change after switching the sort option',
    ).not.toHaveText(initialFirstName ?? '');
  });

  test("Sort is preserved after adding a product to the cart", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await page.getByTestId('product-sort-container').selectOption('hilo');  //select "Price (high to low)" in the sort dropdown
    const namesBefore = await page.getByTestId('inventory-item-name').allTextContents();

    await inventoryPage.addProductByIndex(0);

    await expect(
      page.getByTestId('product-sort-container'),
      'Sort dropdown should still show "high to low" after adding a product to the cart',
    ).toHaveValue('hilo');

    const namesAfter = await page.getByTestId('inventory-item-name').allTextContents();
    expect(
      namesAfter,
      'Product order should remain unchanged after adding a product to the cart',
    ).toEqual(namesBefore);
  });

  test("Sort is preserved after removing a product from the cart", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await page.getByTestId('product-sort-container').selectOption('hilo');  //select "Price (high to low)" in the sort dropdown
    await inventoryPage.addProductByIndex(0);
    const namesBefore = await page.getByTestId('inventory-item-name').allTextContents();

    await inventoryPage.removeProductByIndex(0);

    await expect(
      page.getByTestId('product-sort-container'),
      'Sort dropdown should still show "high to low" after removing a product from the cart',
    ).toHaveValue('hilo');

    const namesAfter = await page.getByTestId('inventory-item-name').allTextContents();
    expect(
      namesAfter,
      'Product order should remain unchanged after removing a product from the cart',
    ).toEqual(namesBefore);
  });
});
