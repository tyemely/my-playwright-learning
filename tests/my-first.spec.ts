import {test, expect} from '@playwright/test';

// Positive test - checks tht somth IS as expected
test('page has correct title', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
});

// neg test - hecks that smth is not present.
test('page does not contain error test', async({ page}) => {
    await page.goto('https://playwright.dev/');
    await expect(page.getByText('404 Page Not Found')).not.toBeVisible();
});