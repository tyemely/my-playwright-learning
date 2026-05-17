
//Import the `test` and `expect` functions from the Playwright library
import { test, expect } from '@playwright/test'; 
//Creating a test named 'has title', specifying  async
test('has title', async ({ page }) => {
  //Waiting for the browser tab with the specified address to open
  await page.goto('https://playwright.dev/');

  // pause the test until the specified expected page title is confirmed.
  await expect(page).toHaveTitle(/Playwright/);
});
  //Creating a test named 'get started link', specifying  async
  test('get started link', async ({ page }) => {
  //Waiting for the browser tab with the specified address to open
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();
  
  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
})
  // "devDependencies": { "@playwright/test": "^1.59.1","@types/node": "^25.6.0"
