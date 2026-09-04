import { test, expect, type Page } from "@playwright/test";

test.describe("Requirement Form E2E Tests (Request Talent / Get Started)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/get-started");
    await page.waitForLoadState("networkidle");
  });

  async function fillStep1(
    page: Page,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      companyName: string;
    },
  ) {
    await page.fill('input[name="firstName"]', data.firstName);
    await page.fill('input[name="lastName"]', data.lastName);
    await page.fill('input[name="email"]', data.email);
    if (data.phone) await page.fill('input[name="phone"]', data.phone);
    await page.fill('input[name="companyName"]', data.companyName);
  }

  async function fillStep2(
    page: Page,
    opts: { workArrangement?: string; skillIndex?: number } = {},
  ) {
    const skillCheckbox = page
      .locator('label:has-text("AI/ML Engineer") input[type="checkbox"]')
      .first();
    await skillCheckbox.check();

    await page.fill('input[name="numberOfHires"]', "1");
    await page.selectOption('select[name="engagement"]', { index: 1 });
    await page.selectOption('select[name="workArrangement"]', opts.workArrangement ?? "remote");

    if ((opts.workArrangement ?? "remote") !== "remote") {
      await page.fill('input[name="locationOrTimezone"]', "Atlanta, GA");
    }

    await page.selectOption('select[name="targetStart"]', { index: 1 });
  }

  function clickContinue(page: Page) {
    return page.locator('button:has-text("Continue")').click();
  }

  test("should load get-started page with step 1 of the requirement form", async ({ page }) => {
    await expect(page).toHaveTitle(/request talent|career source group/i);

    await expect(page.locator("text=/Step 1 of 3/i")).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="companyName"]')).toBeVisible();
    await expect(page.locator('button:has-text("Continue")')).toBeVisible();
  });

  test("should block Continue on step 1 until required fields are filled", async ({ page }) => {
    await clickContinue(page);
    await expect(page.locator('[role="alert"]')).toBeVisible();
    await expect(page.locator("text=/Step 1 of 3/i")).toBeVisible();
  });

  test("should show the Other (Not Listed Above) checkbox and reveal a text field when checked", async ({
    page,
  }) => {
    await fillStep1(page, {
      firstName: "Step2",
      lastName: "Tester",
      email: "step2@example.com",
      companyName: "Acme Inc.",
    });
    await clickContinue(page);

    await expect(page.locator("text=/Step 2 of 3/i")).toBeVisible();
    const otherCheckbox = page
      .locator('label:has-text("Other (Not Listed Above)") input[type="checkbox"]')
      .first();
    await expect(otherCheckbox).toBeVisible();
    await expect(page.locator('input[name="skillOther"]')).toHaveCount(0);

    await otherCheckbox.check();
    await expect(page.locator('input[name="skillOther"]')).toBeVisible();

    await otherCheckbox.uncheck();
    await expect(page.locator('input[name="skillOther"]')).toHaveCount(0);
  });

  test("should require a location/timezone for onsite or hybrid, but not remote", async ({
    page,
  }) => {
    await fillStep1(page, {
      firstName: "Onsite",
      lastName: "Tester",
      email: "onsite@example.com",
      companyName: "Acme Inc.",
    });
    await clickContinue(page);

    const skillCheckbox = page
      .locator('label:has-text("AI/ML Engineer") input[type="checkbox"]')
      .first();
    await skillCheckbox.check();
    await page.fill('input[name="numberOfHires"]', "1");
    await page.selectOption('select[name="engagement"]', { index: 1 });
    await page.selectOption('select[name="workArrangement"]', "onsite");
    await page.selectOption('select[name="targetStart"]', { index: 1 });

    await expect(page.locator('input[name="locationOrTimezone"]')).toBeVisible();

    // Onsite without a location/timezone should be blocked.
    await clickContinue(page);
    await expect(page.locator("text=/Step 2 of 3/i")).toBeVisible();

    await page.fill('input[name="locationOrTimezone"]', "Atlanta, GA");
    await clickContinue(page);
    await expect(page.locator("text=/Step 3 of 3/i")).toBeVisible();
  });

  test("should require at least three top skills on step 3, not just a non-empty value", async ({
    page,
  }) => {
    await fillStep1(page, {
      firstName: "Sarah",
      lastName: "Johnson",
      email: `sarah.${Date.now()}@company.com`,
      phone: "(415) 555-1234",
      companyName: "TechCorp Industries",
    });
    await clickContinue(page);
    await fillStep2(page);
    await clickContinue(page);

    await expect(page.locator("text=/Step 3 of 3/i")).toBeVisible();

    // A single skill should NOT be enough — this is the exact gap that was
    // previously unvalidated (validateStep had no case for step 3 at all).
    await page.fill('textarea[name="topSkills"]', "react");
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('[role="alert"]')).toContainText(/at least three/i);
    await expect(page.locator("text=/Requirement received|Thank you/i")).toHaveCount(0);

    // Fixing it with three comma-separated skills should let it through.
    await page.fill('textarea[name="topSkills"]', "React, Node.js, AWS");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=/Thank you/i")).toBeVisible({ timeout: 10000 });
  });

  test("should complete all 3 steps and submit successfully", async ({ page }) => {
    await fillStep1(page, {
      firstName: "Sarah",
      lastName: "Johnson",
      email: `sarah.full.${Date.now()}@company.com`,
      phone: "(415) 555-1234",
      companyName: "TechCorp Industries",
    });
    await clickContinue(page);

    await fillStep2(page, { workArrangement: "remote" });
    await clickContinue(page);

    await expect(page.locator("text=/Step 3 of 3/i")).toBeVisible();
    await page.fill(
      'textarea[name="topSkills"]',
      "PyTorch, production ML systems, distributed training",
    );
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.fill('input[name="budgetRate"]', "150000");
    await page.selectOption('select[name="regionPreference"]', { index: 1 });
    await page.fill(
      'textarea[name="message"]',
      "We need a Senior ML Engineer with 5+ years experience.",
    );

    await page.locator('button[type="submit"]').click();

    await expect(page.locator("text=/Thank you/i")).toBeVisible({ timeout: 10000 });
    const successBox = page
      .locator("div")
      .filter({ has: page.locator("text=/Thank you/i") })
      .last();
    await expect(successBox).toHaveClass(/border-green-500/);
  });

  test("region preference should only offer US, LATAM, and Pakistan", async ({ page }) => {
    await fillStep1(page, {
      firstName: "Region",
      lastName: "Tester",
      email: "region@example.com",
      companyName: "Acme Inc.",
    });
    await clickContinue(page);
    await fillStep2(page);
    await clickContinue(page);

    const options = await page.locator('select[name="regionPreference"] option').allTextContents();
    // First option is the disabled placeholder.
    expect(options.slice(1)).toEqual(["United States", "LATAM", "Pakistan"]);
  });

  test("should not show a budget-guidance checkbox on step 3", async ({ page }) => {
    await fillStep1(page, {
      firstName: "Budget",
      lastName: "Tester",
      email: "budget@example.com",
      companyName: "Acme Inc.",
    });
    await clickContinue(page);
    await fillStep2(page);
    await clickContinue(page);

    await expect(page.locator("text=/guidance on budget/i")).toHaveCount(0);
    await expect(page.locator('input[name="budgetRate"]')).toBeVisible();
  });

  test("should validate email format on step 1", async ({ page }) => {
    await page.fill('input[name="firstName"]', "Invalid");
    await page.fill('input[name="lastName"]', "Email");
    await page.fill('input[name="email"]', "not-an-email");
    await page.fill('input[name="companyName"]', "Acme Inc.");

    const emailInput = page.locator('input[name="email"]');
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test("should show error message on submission failure", async ({ page }) => {
    await fillStep1(page, {
      firstName: "Error",
      lastName: "Test",
      email: "error@invalid.test",
      phone: "(555) 666-7777",
      companyName: "Error Test Co",
    });
    await clickContinue(page);
    await fillStep2(page);
    await clickContinue(page);

    await page.fill('textarea[name="topSkills"]', "React, Node.js, AWS");
    await page.selectOption('select[name="seniority"]', { index: 1 });

    await page.route("**/*", (route) => {
      if (route.request().method() === "POST") {
        void route.abort("failed");
      } else {
        void route.continue();
      }
    });

    await page.locator('button[type="submit"]').click();

    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[role="alert"]')).toContainText(/error|wrong/i);
  });

  test("should prevent spam with honeypot field", async ({ page }) => {
    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveAttribute("tabindex", "-1");

    const wrapper = page.locator('[aria-hidden="true"]').filter({ has: honeypot });
    await expect(wrapper).toHaveClass(/left-\[-9999px\]/);
  });

  test("should work on mobile viewport across all 3 steps", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.locator('input[name="firstName"]')).toBeVisible();

    await fillStep1(page, {
      firstName: "Mobile",
      lastName: "Client",
      email: `mobile.${Date.now()}@company.com`,
      phone: "(555) 777-8888",
      companyName: "Mobile Client Inc",
    });
    await clickContinue(page);
    await fillStep2(page);
    await clickContinue(page);

    await page.fill('textarea[name="topSkills"]', "React, Node.js, AWS");
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.locator('button[type="submit"]').click();

    await expect(page.locator("text=/Thank you/i")).toBeVisible({ timeout: 10000 });
  });
});
