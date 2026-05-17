import { test, expect } from '@playwright/test';

test('list_handling', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder("username").fill("standard_user");
    await page.getByPlaceholder("password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    const products = page.locator('.inventory_item');
    const count = await products.count();
    await products.filter({ hasText: "Sauce Labs Bike Light" }).click();
});