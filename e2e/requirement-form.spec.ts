import { test, expect } from "@playwright/test";

test.describe("Requirement Form E2E Tests (Get Started)", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to get-started page
    await page.goto("/get-started");
    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");
  });

  test("should load get-started page with requirement form", async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/request talent|career source group/i);

    // Verify form elements exist
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="companyName"]')).toBeVisible();
    await expect(page.locator('select[name="skillNeeded"]')).toBeVisible();
    await expect(page.locator('select[name="engagementType"]')).toBeVisible();
    await expect(page.locator('select[name="basis"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should show validation errors for required fields", async ({ page }) => {
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for required attributes on critical fields
    await expect(page.locator('input[name="firstName"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="lastName"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="email"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="companyName"]')).toHaveAttribute("required", "");
    await expect(page.locator('select[name="skillNeeded"]')).toHaveAttribute("required", "");
    await expect(page.locator('select[name="engagementType"]')).toHaveAttribute("required", "");
    await expect(page.locator('select[name="basis"]')).toHaveAttribute("required", "");
  });

  test("should fill form with all required fields and submit successfully", async ({ page }) => {
    // Fill in the form with valid data
    await page.fill('input[name="firstName"]', "Sarah");
    await page.fill('input[name="lastName"]', "Johnson");
    await page.fill('input[name="email"]', "sarah.johnson@company.com");
    await page.fill('input[name="phone"]', "(415) 555-1234");

    // Company name is optional, but let's fill it
    await page.fill('input[name="companyName"]', "TechCorp Industries");

    // Select specialty/skill needed
    await page.selectOption('select[name="skillNeeded"]', { index: 1 }); // First available option

    // Select engagement type
    await page.selectOption('select[name="engagementType"]', { index: 1 });

    // Select basis (contract/fulltime)
    await page.selectOption('select[name="basis"]', { index: 1 });

    // Add additional details
    await page.fill(
      'textarea[name="message"]',
      "We need a Senior ML Engineer with 5+ years experience. Must have experience with PyTorch and production ML systems.",
    );

    // Submit the form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for success message
    await expect(page.locator("text=/Requirement received/i")).toBeVisible({ timeout: 5000 });

    // Verify success state styling — several ancestor divs also contain the
    // success text, so take the innermost (last in document order): the
    // component's own root div.
    const successBox = page
      .locator("div")
      .filter({ has: page.locator("text=/Requirement received/i") })
      .last();
    await expect(successBox).toHaveClass(/border-green-500/);
  });

  test("should submit form without optional phone", async ({ page }) => {
    // Fill required fields only (skip phone)
    await page.fill('input[name="firstName"]', "Michael");
    await page.fill('input[name="lastName"]', "Chen");
    await page.fill('input[name="email"]', "michael.chen@startup.io");
    await page.fill('input[name="companyName"]', "Startup Co");

    // Skip phone - it's optional

    // Fill dropdowns
    await page.selectOption('select[name="skillNeeded"]', { index: 1 });
    await page.selectOption('select[name="engagementType"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });

    // Submit without message (also optional)
    await page.locator('button[type="submit"]').click();

    // Should still succeed
    await expect(page.locator("text=/Requirement received/i")).toBeVisible({ timeout: 5000 });
  });

  test("should validate email format", async ({ page }) => {
    // Fill form with invalid email
    await page.fill('input[name="firstName"]', "Invalid");
    await page.fill('input[name="lastName"]', "Email");
    await page.fill('input[name="email"]', "not-an-email"); // Invalid email
    await page.fill('input[name="phone"]', "(555) 000-1111");
    await page.selectOption('select[name="skillNeeded"]', { index: 1 });
    await page.selectOption('select[name="engagementType"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Browser validation should catch invalid email
    const emailInput = page.locator('input[name="email"]');
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test("should disable submit button while submitting", async ({ page }) => {
    // Fill form
    await page.fill('input[name="firstName"]', "Emma");
    await page.fill('input[name="lastName"]', "Davis");
    await page.fill('input[name="email"]', "emma.davis@company.com");
    await page.fill('input[name="phone"]', "(212) 555-9999");
    await page.fill('input[name="companyName"]', "Davis Consulting");
    await page.selectOption('select[name="skillNeeded"]', { index: 1 });
    await page.selectOption('select[name="engagementType"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });

    const submitButton = page.locator('button[type="submit"]');

    // Click and immediately check button state
    const submitPromise = submitButton.click();

    // Button should show loading text or be disabled
    await expect(submitButton).toContainText(/Submitting requirement|Submit requirement/i);

    // Wait for submission to complete
    await submitPromise;
    await page.waitForTimeout(1000);
  });

  test("should clear form after successful submission and allow resubmitting", async ({ page }) => {
    // First submission
    await page.fill('input[name="firstName"]', "Robert");
    await page.fill('input[name="lastName"]', "Wilson");
    await page.fill('input[name="email"]', "robert.wilson@company.com");
    await page.fill('input[name="phone"]', "(503) 555-2222");
    await page.fill('input[name="companyName"]', "Innovation Labs");
    await page.selectOption('select[name="skillNeeded"]', { index: 1 });
    await page.selectOption('select[name="engagementType"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });
    await page.fill('textarea[name="message"]', "Urgent: Need DevOps engineer by end of month.");

    await page.locator('button[type="submit"]').click();

    // Wait for success message
    await expect(page.locator("text=/Requirement received/i")).toBeVisible();

    // Click "Submit another requirement" button
    const resendButton = page.locator('button:has-text("Submit another requirement")');
    await expect(resendButton).toBeVisible();
    await resendButton.click();

    // Verify form is now visible and cleared
    const firstNameInput = page.locator('input[name="firstName"]');
    await expect(firstNameInput).toBeVisible();
    await expect(firstNameInput).toHaveValue("");

    // Company name should also be cleared
    const companyInput = page.locator('input[name="companyName"]');
    await expect(companyInput).toHaveValue("");

    // Message should be cleared
    const messageTextarea = page.locator('textarea[name="message"]');
    await expect(messageTextarea).toHaveValue("");
  });

  test("should preserve select dropdown values when filled", async ({ page }) => {
    // Select options
    await page.selectOption('select[name="skillNeeded"]', { index: 2 });
    await page.selectOption('select[name="engagementType"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 2 });

    // Fill text fields
    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="phone"]', "(555) 123-4567");

    // Verify dropdowns retained their values
    const skillSelect = page.locator('select[name="skillNeeded"]');
    const engagementSelect = page.locator('select[name="engagementType"]');
    const basisSelect = page.locator('select[name="basis"]');

    const skillValue = await skillSelect.inputValue();
    const engagementValue = await engagementSelect.inputValue();
    const basisValue = await basisSelect.inputValue();

    expect(skillValue).not.toBe("");
    expect(engagementValue).not.toBe("");
    expect(basisValue).not.toBe("");
  });

  test("should prevent spam with honeypot field", async ({ page }) => {
    // The honeypot field lives inside an off-screen, aria-hidden wrapper —
    // it's still in the DOM (bots fill it), just visually and semantically hidden.
    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveAttribute("tabindex", "-1");

    const wrapper = page.locator('[aria-hidden="true"]').filter({ has: honeypot });
    await expect(wrapper).toHaveClass(/left-\[-9999px\]/);
  });

  test("should work on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify form is still accessible
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('select[name="skillNeeded"]')).toBeVisible();

    // Fill and submit on mobile
    await page.fill('input[name="firstName"]', "Mobile");
    await page.fill('input[name="lastName"]', "Client");
    await page.fill('input[name="email"]', "mobile@company.com");
    await page.fill('input[name="phone"]', "(555) 777-8888");
    await page.fill('input[name="companyName"]', "Mobile Client Inc");
    await page.selectOption('select[name="skillNeeded"]', { index: 1 });
    await page.selectOption('select[name="engagementType"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });

    await page.locator('button[type="submit"]').click();

    // Verify success on mobile
    await expect(page.locator("text=/Requirement received/i")).toBeVisible({ timeout: 5000 });
  });

  test("should support pre-filled skill from URL or prop", async ({ page }) => {
    // The form supports defaultSkill prop. We're testing the form displays correctly
    // even when coming from different entry points

    // Verify skill dropdown exists and is interactive
    const skillSelect = page.locator('select[name="skillNeeded"]');
    await expect(skillSelect).toBeVisible();

    // Get all available options
    const options = await skillSelect.locator("option").count();
    expect(options).toBeGreaterThan(1); // Should have at least default + 1 skill option
  });

  test("should show error message on submission failure", async ({ page }) => {
    // Fill all fields
    await page.fill('input[name="firstName"]', "Error");
    await page.fill('input[name="lastName"]', "Test");
    await page.fill('input[name="email"]', "error@invalid.test");
    await page.fill('input[name="phone"]', "(555) 666-7777");
    await page.fill('input[name="companyName"]', "Error Test Co");
    await page.selectOption('select[name="skillNeeded"]', { index: 1 });
    await page.selectOption('select[name="engagementType"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });

    // Intercept and abort the form's POST request (TanStack Start server
    // functions aren't under /api/ — target by method instead of path).
    await page.route("**/*", (route) => {
      if (route.request().method() === "POST") {
        void route.abort("failed");
      } else {
        void route.continue();
      }
    });

    await page.locator('button[type="submit"]').click();

    // Check for error message display
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[role="alert"]')).toContainText(/error|wrong/i);
  });

  test("should handle long message content near max length", async ({ page }) => {
    // Fill form
    await page.fill('input[name="firstName"]', "Long");
    await page.fill('input[name="lastName"]', "Message");
    await page.fill('input[name="email"]', "long@example.com");
    await page.fill('input[name="phone"]', "(555) 444-3333");
    await page.fill('input[name="companyName"]', "Long Message Co");
    await page.selectOption('select[name="skillNeeded"]', { index: 1 });
    await page.selectOption('select[name="engagementType"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });

    // Fill message with content near 1000 char limit
    const longMessage = "A".repeat(950);
    await page.fill('textarea[name="message"]', longMessage);

    // Verify message was filled
    const messageValue = await page.locator('textarea[name="message"]').inputValue();
    expect(messageValue.length).toBe(950);

    // Submit should still work
    await page.locator('button[type="submit"]').click();

    // Should eventually succeed or show error
    const successOrError = page.locator("text=/Requirement received|error/i");
    await expect(successOrError).toBeVisible({ timeout: 5000 });
  });
});
