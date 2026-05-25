import { type Locator, type Page } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly productList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId("title");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartIcon = page.locator(".shopping_cart_link");
    this.productList = page.locator(".inventory_list");
  }

  async addProductToCart(productName: string) {
    await this.page
      .locator(".inventory_item")
      .filter({ hasText: productName })
      .getByRole("button", { name: /add to cart/i })
      .click();
  }

  async removeProductFromCart(productName: string) {
    await this.page
      .locator(".inventory_item")
      .filter({ hasText: productName })
      .getByRole("button", { name: /remove/i })
      .click();
  }

  async addProductByIndex(index: number) {
    await this.page
      .locator(".inventory_item")
      .nth(index)
      .getByRole("button", { name: /add to cart/i })
      .click();
  }

  async removeProductByIndex(index: number) {
    await this.page
      .locator(".inventory_item")
      .nth(index)
      .getByRole("button", { name: /remove/i })
      .click();
  }

  async getProductNameByIndex(index: number): Promise<string> {
    const name = await this.page
      .locator(".inventory_item")
      .nth(index)
      .locator(".inventory_item_name")
      .textContent();
    return name?.trim() ?? "";
  }

  async openCart() {
    await this.cartIcon.click();
  }
}