import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const CREDENTIALS = {
  validUser: 'standard_user',
  validPass: 'secret_sauce',
  problemUser: 'problem_user',
};

test.describe('SauceDemo', () => {

// Group 1: Log in Form Validation
test.describe('Login Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('EmptyBoth', async ({ page }) => {
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByTestId("error"),'Error message should be visible when both fields are empty').toBeVisible();
  });

  test('EmptyName', async ({ page }) => {
    await page.getByPlaceholder("password").fill(CREDENTIALS.validPass);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByTestId("error"), 'Error message should be visible when username is empty').toBeVisible();
  });

  test('EmptyPassWord', async ({ page }) => {
    await page.getByPlaceholder("username").fill(CREDENTIALS.validUser);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByTestId("error"), 'Error message should be visible when password is empty').toBeVisible();
  });

  test('NegativeLogin', async ({ page }) => {
    await page.getByPlaceholder("username").fill("standard");
    await page.getByPlaceholder("password").fill("secret_sau");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByTestId("error"), 'Error message should be visible when credentials are incorrect').toBeVisible();
  });
});

// Group 2: Log in
test.describe('Login Happy Path', () => {
  test('LoginHappyPath', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder('username').fill(CREDENTIALS.validUser);
    await page.getByPlaceholder('password').fill(CREDENTIALS.validPass);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page, 'User should be redirected to inventory page after successful login').toHaveURL(`${BASE_URL}/inventory.html`);
  });
});

// Group 3: Cart
test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder('username').fill(CREDENTIALS.validUser);
    await page.getByPlaceholder('password').fill(CREDENTIALS.validPass);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page, 'Should be on inventory page before cart tests').toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('Add', async ({ page }) => {
    await page.getByTestId('add-to-cart-test.allthethings()-t-shirt-(red)').click();
    await expect(page.locator(".shopping_cart_badge"), 'Cart badge should show "1" after adding one item').toHaveText("1");
  });

  test('Remove', async ({ page }) => {
    await page.getByTestId('add-to-cart-test.allthethings()-t-shirt-(red)').click();
    await page.getByTestId('remove-test.allthethings()-t-shirt-(red)').click();
    await expect(page.locator(".shopping_cart_badge"), 'Cart badge should not be visible after removing the item').not.toBeVisible();
  });
  test('BonusMultipleProducts', async ({ page }) => {
    await page.getByTestId('add-to-cart-test.allthethings()-t-shirt-(red)').click();
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.locator(".shopping_cart_badge"), 'Cart badge should show "3" after adding one item').toHaveText("3");
    await page.getByTestId('remove-test.allthethings()-t-shirt-(red)').click();
    await expect(page.locator(".shopping_cart_badge"), 'Cart badge should show "2" after adding one item').toHaveText("2");
  });
  test('Refresh', async ({ page }) => {
    await page.getByTestId('add-to-cart-test.allthethings()-t-shirt-(red)').click();
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.locator(".shopping_cart_badge"), 'Cart badge should show "3" after adding one item').toHaveText("3");
    await page.reload();
    await expect(page.locator(".shopping_cart_badge"), 'Cart badge should show "3" after adding one item').toHaveText("3");
  });
});

// Group 4: Cart (problem_user) (bug)
test.describe('Shopping Cart (problem_user)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder('username').fill(CREDENTIALS.problemUser);
    await page.getByPlaceholder('password').fill(CREDENTIALS.validPass);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page, 'Should be on inventory page before cart tests').toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('Remove', async ({ page }) => {
    await page.getByTestId('add-to-cart-test.allthethings()-t-shirt-(red)').click();
    await page.getByTestId('remove-test.allthethings()-t-shirt-(red)').click();
    await expect(page.locator(".shopping_cart_badge"), 'Cart badge should not be visible after removing the item').not.toBeVisible();
  });
});

// Group 5: Sorting
test.describe('Sorting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder('username').fill(CREDENTIALS.validUser);
    await page.getByPlaceholder('password').fill(CREDENTIALS.validPass);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page, 'Should be on inventory page before cart tests').toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('SortingLowtoHigh', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('lohi');
    await expect(
      page.getByTestId('product-sort-container'),
      'The "low to high" sorting option has been selected',
    ).toHaveValue('lohi');

    const prices = (await page.locator('.inventory_item_price').allTextContents())
      .map(p => parseFloat(p.replace('$', '')));
    expect(prices, 'Prices should be sorted ascending').toEqual(
      [...prices].sort((a, b) => a - b),
    );
  });
});
});