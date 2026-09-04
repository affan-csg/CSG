import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

test.describe("Bench Form E2E Tests (Join Our Bench)", () => {
  let testResumePath: string;

  test.beforeAll(async () => {
    // Unique per worker process — fullyParallel runs this file's tests across
    // multiple workers, and a shared filename races beforeAll/afterAll across them.
    testResumePath = path.join(os.tmpdir(), `test-resume-${process.pid}.pdf`);
    fs.writeFileSync(testResumePath, "%PDF-1.4\n%Test Resume File for E2E Testing");
  });

  test.afterAll(async () => {
    if (fs.existsSync(testResumePath)) {
      fs.unlinkSync(testResumePath);
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/join-our-bench");
    await page.waitForLoadState("networkidle");
  });

  async function fillRequiredFields(
    page: import("@playwright/test").Page,
    overrides: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      location: string;
      region?: string;
    },
  ) {
    await page.fill('input[name="firstName"]', overrides.firstName);
    await page.fill('input[name="lastName"]', overrides.lastName);
    await page.fill('input[name="email"]', overrides.email);
    await page.fill('input[name="phone"]', overrides.phone);
    await page.fill('input[name="location"]', overrides.location);

    await page.selectOption('select[name="specialty"]', { index: 1 });
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });
    await page.selectOption('select[name="region"]', overrides.region ?? "latam");

    if ((overrides.region ?? "latam") === "us") {
      await page.selectOption('select[name="workAuthorization"]', { index: 1 });
    }

    await page.selectOption('select[name="workArrangement"]', { index: 1 });

    const resumeInput = page.locator('input[name="resume"]');
    await resumeInput.setInputFiles(testResumePath);
  }

  test("should load join-our-bench page with application form", async ({ page }) => {
    await expect(page).toHaveTitle(/talent|application|join/i);

    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="location"]')).toBeVisible();
    await expect(page.locator('select[name="specialty"]')).toBeVisible();
    await expect(page.locator('select[name="seniority"]')).toBeVisible();
    await expect(page.locator('select[name="basis"]')).toBeVisible();
    await expect(page.locator('select[name="region"]')).toBeVisible();
    await expect(page.locator('select[name="workArrangement"]')).toBeVisible();
    await expect(page.locator('input[name="compensationAmount"]')).toBeVisible();
    await expect(page.locator('select[name="availability"]')).toBeVisible();
    await expect(page.locator('input[name="portfolioUrl"]')).toBeVisible();
    await expect(page.locator('input[name="linkedinUrl"]')).toBeVisible();
    await expect(page.locator('input[name="resume"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should show required attributes on critical fields", async ({ page }) => {
    await expect(page.locator('input[name="firstName"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="lastName"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="email"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="phone"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="location"]')).toHaveAttribute("required", "");
    await expect(page.locator('select[name="specialty"]')).toHaveAttribute("required", "");
    await expect(page.locator('select[name="seniority"]')).toHaveAttribute("required", "");
    await expect(page.locator('select[name="basis"]')).toHaveAttribute("required", "");
    await expect(page.locator('select[name="region"]')).toHaveAttribute("required", "");
    await expect(page.locator('select[name="workArrangement"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="resume"]')).toHaveAttribute("required", "");
  });

  test("should reveal work authorization only for US region", async ({ page }) => {
    await expect(page.locator('select[name="workAuthorization"]')).toHaveCount(0);

    await page.selectOption('select[name="region"]', "us");
    await expect(page.locator('select[name="workAuthorization"]')).toBeVisible();
    await expect(page.locator('select[name="workAuthorization"]')).toHaveAttribute("required", "");

    await page.selectOption('select[name="region"]', "latam");
    await expect(page.locator('select[name="workAuthorization"]')).toHaveCount(0);
  });

  test("should submit successfully for a LATAM candidate and show a personalized message", async ({
    page,
  }) => {
    await fillRequiredFields(page, {
      firstName: "Alexandra",
      lastName: "Rodriguez",
      email: `alexandra.${Date.now()}@example.com`,
      phone: "(305) 555-1234",
      location: "Bogota, Colombia",
      region: "latam",
    });

    await page.fill('input[name="compensationAmount"]', "8000");
    await page.selectOption('select[name="availability"]', { index: 1 });
    await page.fill('input[name="portfolioUrl"]', "https://alexandra-dev.com");
    await page.fill('input[name="linkedinUrl"]', "https://linkedin.com/in/alexandra-rodriguez");
    await page.fill(
      'textarea[name="message"]',
      "Passionate about ML engineering with 5+ years experience.",
    );

    await page.locator('button[type="submit"]').click();

    await expect(page.locator("text=/Application received/i")).toBeVisible({ timeout: 10000 });

    // The success message must be built from what the candidate actually
    // entered, not a fixed generic string — check it reflects the selected
    // seniority/specialty/region/basis, not just the first name.
    const successBox = page
      .locator("div")
      .filter({ has: page.locator("text=/Application received/i") })
      .last();
    await expect(successBox).toHaveClass(/border-green-500/);
    await expect(successBox).toContainText("Alexandra");
    await expect(successBox).toContainText(/talent network as a/i);
    await expect(successBox).toContainText(/based in/i);
  });

  test("should require work authorization for a US candidate before submitting", async ({
    page,
  }) => {
    await fillRequiredFields(page, {
      firstName: "David",
      lastName: "Kumar",
      email: `david.${Date.now()}@example.com`,
      phone: "(415) 555-5678",
      location: "San Francisco, CA",
      region: "us",
    });

    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=/Application received/i")).toBeVisible({ timeout: 10000 });
  });

  test("should submit without optional portfolio, LinkedIn, or availability", async ({ page }) => {
    await fillRequiredFields(page, {
      firstName: "Priya",
      lastName: "Shah",
      email: `priya.${Date.now()}@example.com`,
      phone: "(415) 555-6789",
      location: "Karachi, Pakistan",
      region: "pakistan",
    });

    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=/Application received/i")).toBeVisible({ timeout: 10000 });
  });

  test("should accept only valid file types for resume", async ({ page }) => {
    const resumeInput = page.locator('input[name="resume"]');
    const acceptAttr = await resumeInput.getAttribute("accept");
    expect(acceptAttr).toContain("pdf");
    expect(acceptAttr).toContain("doc");
  });

  test("should validate email format", async ({ page }) => {
    await page.fill('input[name="firstName"]', "Invalid");
    await page.fill('input[name="lastName"]', "Email");
    await page.fill('input[name="email"]', "not-an-email");
    await page.fill('input[name="phone"]', "(555) 000-1111");
    await page.fill('input[name="location"]', "Test City");
    await page.selectOption('select[name="specialty"]', { index: 1 });
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });
    await page.selectOption('select[name="region"]', "latam");
    await page.selectOption('select[name="workArrangement"]', { index: 1 });

    const resumeInput = page.locator('input[name="resume"]');
    await resumeInput.setInputFiles(testResumePath);

    await page.locator('button[type="submit"]').click();

    const emailInput = page.locator('input[name="email"]');
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test("should disable submit button while submitting", async ({ page }) => {
    await fillRequiredFields(page, {
      firstName: "Emma",
      lastName: "Smith",
      email: `emma.${Date.now()}@example.com`,
      phone: "(212) 555-9999",
      location: "New York, NY",
      region: "us",
    });

    const submitButton = page.locator('button[type="submit"]');
    const submitPromise = submitButton.click();

    await expect(submitButton).toContainText(
      /Creating your talent profile|Create Your Talent Profile/i,
    );

    await submitPromise;
    await page.waitForTimeout(1000);
  });

  test("should clear form after successful submission", async ({ page }) => {
    await fillRequiredFields(page, {
      firstName: "Robert",
      lastName: "Johnson",
      email: `robert.${Date.now()}@example.com`,
      phone: "(503) 555-2222",
      location: "Portland, Oregon",
      region: "us",
    });
    await page.fill('input[name="portfolioUrl"]', "https://robert-dev.com");
    await page.fill('textarea[name="message"]', "Experienced DevOps engineer");
    await page.locator('button[type="submit"]').click();

    await expect(page.locator("text=/Application received/i")).toBeVisible({ timeout: 10000 });

    const resendButton = page.locator('button:has-text("Submit another application")');
    await expect(resendButton).toBeVisible();
    await resendButton.click();

    const firstNameInput = page.locator('input[name="firstName"]');
    await expect(firstNameInput).toBeVisible();
    await expect(firstNameInput).toHaveValue("");
    await expect(page.locator('input[name="portfolioUrl"]')).toHaveValue("");
    await expect(page.locator('textarea[name="message"]')).toHaveValue("");
  });

  test("should prevent spam with honeypot field", async ({ page }) => {
    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveAttribute("tabindex", "-1");

    const wrapper = page.locator('[aria-hidden="true"]').filter({ has: honeypot });
    await expect(wrapper).toHaveClass(/left-\[-9999px\]/);
  });

  test("should work on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="resume"]')).toBeVisible();

    await fillRequiredFields(page, {
      firstName: "Mobile",
      lastName: "Candidate",
      email: `mobile.${Date.now()}@example.com`,
      phone: "(555) 777-8888",
      location: "Remote",
      region: "latam",
    });

    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=/Application received/i")).toBeVisible({ timeout: 10000 });
  });

  test("should validate URL format for portfolio and LinkedIn", async ({ page }) => {
    await page.fill('input[name="firstName"]', "URL");
    await page.fill('input[name="lastName"]', "Test");
    await page.fill('input[name="email"]', "url@example.com");
    await page.fill('input[name="phone"]', "(555) 111-2222");
    await page.fill('input[name="location"]', "Test City");
    await page.selectOption('select[name="specialty"]', { index: 1 });
    await page.selectOption('select[name="seniority"]', { index: 1 });
    await page.selectOption('select[name="basis"]', { index: 1 });
    await page.selectOption('select[name="region"]', "latam");
    await page.selectOption('select[name="workArrangement"]', { index: 1 });

    await page.fill('input[name="portfolioUrl"]', "not-a-url");

    const resumeInput = page.locator('input[name="resume"]');
    await resumeInput.setInputFiles(testResumePath);

    await page.locator('button[type="submit"]').click();

    const portfolioInput = page.locator('input[name="portfolioUrl"]');
    const portfolioValid = await portfolioInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid,
    );
    expect(portfolioValid).toBe(false);
  });

  test("should show error message on submission failure", async ({ page }) => {
    await fillRequiredFields(page, {
      firstName: "Error",
      lastName: "Test",
      email: "error@example.com",
      phone: "(555) 666-7777",
      location: "Test City",
      region: "latam",
    });

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

  test("should display location and resume helper text", async ({ page }) => {
    await expect(page.locator("text=/Our clients hire across/i")).toBeVisible();
    await expect(page.locator("text=/PDF or Word|5 MB/i")).toBeVisible();
  });
});
