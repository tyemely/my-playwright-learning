import { test, expect } from '@playwright/test';

test('list_handling', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    //await page.locator('[data-test="login-button"]').click();
});