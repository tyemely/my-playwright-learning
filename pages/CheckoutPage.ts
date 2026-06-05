import { type Locator, type Page } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;

  // Step 1 — Checkout: Your Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step 2 — Overview
  readonly cartItems: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;

  // Step 3 — Complete
  readonly successMessage: Locator;
  readonly successTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    
    this.firstNameInput = page.getByPlaceholder("First Name");
    this.lastNameInput = page.getByPlaceholder("Last Name");
    this.zipCodeInput = page.getByPlaceholder("Zip/Postal Code");
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.errorMessage = page.getByTestId("error");

    
    this.cartItems = page.locator(".cart_item");
    this.finishButton = page.getByRole("button", { name: "Finish" });

    
    this.successTitle = page.locator(".title");
    this.successMessage = page.locator(".complete-header");
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

}