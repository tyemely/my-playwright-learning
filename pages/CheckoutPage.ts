import { type Locator, type Page } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;

  // Step 1 — Your Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;

  // Step 2 — Overview
  readonly cartItems: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;

  // Step 3 — Complete
  readonly successMessage: Locator;
  readonly successTitle: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step 1
    this.firstNameInput = page.getByPlaceholder("First Name");
    this.lastNameInput = page.getByPlaceholder("Last Name");
    this.zipCodeInput = page.getByPlaceholder("Zip/Postal Code");
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });

    // Step 2
    this.cartItems = page.locator(".cart_item");
    this.itemTotal = page.locator(".summary_subtotal_label");
    this.tax = page.locator(".summary_tax_label");
    this.total = page.locator(".summary_total_label");
    this.finishButton = page.getByRole("button", { name: "Finish" });

    // Step 3
    this.successTitle = page.locator(".title");
    this.successMessage = page.locator(".complete-header");
    this.backHomeButton = page.getByRole("button", { name: "Back Home" });
  }

  async fillInfo(firstName: string, lastName: string, zipCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zipCode);
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async backHome() {
    await this.backHomeButton.click();
  }
}