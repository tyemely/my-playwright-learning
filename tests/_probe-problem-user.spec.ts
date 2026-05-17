import { test } from '@playwright/test';

test('probe problem_user add-to-cart behavior', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('username').fill('problem_user');
  await page.getByPlaceholder('password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  const card = page.locator('.inventory_item', { hasText: 'T-Shirt (Red)' });
  const btnBefore = await card.locator('button').getAttribute('data-test');
  const labelBefore = await card.locator('button').innerText();
  console.log('BEFORE click — data-test:', btnBefore, '| label:', labelBefore);

  await card.locator('button').click();

  const btnAfter = await card.locator('button').getAttribute('data-test');
  const labelAfter = await card.locator('button').innerText();
  console.log('AFTER  click — data-test:', btnAfter, '| label:', labelAfter);
});
