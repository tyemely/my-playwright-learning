import { test, expect } from "@playwright/test";
import { USERS } from "../test-data";
import { LoginPage } from "../pages/LoginPage";

const BASE_URL = "https://www.saucedemo.com";

test.describe( "Login regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test("successful login with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(USERS.standard.username, USERS.standard.password);

    await expect(
      page,
      "User should be redirected to inventory page after successful login"
    ).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test("login fails with locked out user", async ({page}) => {
    const loginPage = new LoginPage (page);

    await loginPage.login(USERS.locked.username, USERS.locked.password);

    await expect(
    loginPage.errorMessage,
    "Locked out user should see an error message"
  ).toContainText("Epic sadface: Sorry, this user has been locked out.");
  });

  test("Wrong password log in ", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(USERS.standard.username, "wrong_password");

    await expect(
      loginPage.errorMessage,
      "User should see an error message when password is incorrect"
    ).toContainText(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });

  test("Empty useraname log in ", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login("", USERS.standard.password);

    await expect(
      loginPage.errorMessage,
      "User should see an error message when username is empty"
    ).toContainText("Epic sadface: Username is required");
  });

  test(" No date log in ", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login("", "");

    await expect(
      loginPage.errorMessage,
      "User should see an error message when both fields are empty"
    ).toContainText("Epic sadface: Username is required");
  });
});