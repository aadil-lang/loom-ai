import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function registerBuyer(page: import('@playwright/test').Page, prefix: string) {
  await page.goto(`${BASE}/auth/register`);
  await page.getByRole('tab', { name: 'buyer' }).click().catch(() => {});
  const buyerPanel = page.getByRole('tabpanel', { name: /buyer/i });
  await buyerPanel.waitFor({ state: 'visible' });
  const email = `${prefix}+${Date.now()}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await buyerPanel.locator('input[name="name"]').fill('E2E Buyer');
  await buyerPanel.locator('input[name="company"]').fill('E2E Corp');
  await buyerPanel.locator('input[name="email"]').fill(email);
  await buyerPanel.locator('input[name="password"]').fill('StrongPass123!');
  await buyerPanel.locator('input[name="confirmPassword"]').fill('StrongPass123!');
  await buyerPanel.getByRole('button', { name: /Create Buyer Account/i }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
}

test.describe('LoomAI critical E2E flows', () => {
  test('Supplier registration flow', async ({ page }) => {
    await page.goto(`${BASE}/auth/register`);

    // Switch to Supplier tab
    await page.getByRole('tab', { name: 'supplier', exact: false }).click().catch(() => page.getByText('Supplier').click());
    const supplierPanel = page.getByRole('tabpanel', { name: /supplier/i });
    await supplierPanel.waitFor({ state: 'visible' });

    // Fill supplier form
    await supplierPanel.locator('input[name="businessName"]').fill('E2E Supplier Ltd');
    await supplierPanel.locator('input[name="contactPerson"]').fill('Raj Kumar');
    await supplierPanel.locator('input[name="location"]').fill('Surat, India');
    const email = `e2e.supplier+${Date.now()}@example.com`;
    await supplierPanel.locator('input[name="email"]').fill(email);
    await supplierPanel.locator('input[name="password"]').fill('StrongPass123!');
    await supplierPanel.locator('input[name="confirmPassword"]').fill('StrongPass123!');

    await Promise.all([
      page.waitForNavigation({ url: `${BASE}/supplier**`, waitUntil: 'networkidle' }).catch(() => {}),
      supplierPanel.getByRole('button', { name: /Create Supplier Account/i }).click()
    ]);

    // Expect to land on supplier area
    await expect(page).toHaveURL(new RegExp('/supplier'));
  });

  test('Buyer recommendations and product link mapping', async ({ page }) => {
    await registerBuyer(page, 'e2e.buyer');

    // On dashboard, ensure recommendation links are valid
    await page.waitForSelector('a[href^="/product/"]', { timeout: 5000 });
    const productLinks = await page.$$eval('a[href^="/product/"]', els => els.map(el => (el as HTMLAnchorElement).href));
    expect(productLinks.length).toBeGreaterThan(0);
    for (const href of productLinks.slice(0, 5)) {
      expect(href).not.toContain('undefined');
    }
  });

  test('Add to cart, checkout success and cart cleared on success', async ({ page }) => {
    await registerBuyer(page, 'e2e.checkout.ok');
    await page.goto(`${BASE}/marketplace`);
    // Click first product link
    const firstProduct = page.locator('a[href^="/product/"]').first();
    await firstProduct.waitFor({ state: 'visible', timeout: 5000 });
    await firstProduct.click();

    // Add to cart (product page)
    await page.waitForSelector('button:has-text("Add")', { timeout: 5000 });
    await page.getByRole('button', { name: /Add/i }).first().click();

    // Navigate to cart
    await page.goto(`${BASE}/cart`);
    await expect(page.getByRole('link', { name: /Proceed to Checkout/i })).toBeVisible({ timeout: 5000 });

    // Intercept checkout to simulate success
    await page.route('**/api/v1/buyer/checkout', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [{ orderNumber: 'E2E-ORDER-1' }] })
      });
    });

    // Proceed to checkout page and confirm
    await page.getByRole('link', { name: /Proceed to Checkout/i }).click();
    await page.getByRole('button', { name: /Continue to Review/i }).click();
    await page.waitForSelector('button:has-text("Confirm Purchase Order")', { timeout: 10000 });
    await page.getByRole('button', { name: /Confirm Purchase Order/i }).click();

    await expect(page.getByRole('heading', { name: /Order Confirmed!/i })).toBeVisible({ timeout: 10000 });

    // Cart should be cleared: visiting cart should not show items
    await page.goto(`${BASE}/cart`);
    await expect(page.getByText(/Your cart is empty/i)).toBeVisible({ timeout: 5000 });
  });

  test('Checkout failure preserves cart and shows error', async ({ page }) => {
    await registerBuyer(page, 'e2e.checkout.fail');
    await page.goto(`${BASE}/marketplace`);
    const firstProduct = page.locator('a[href^="/product/"]').first();
    await firstProduct.waitFor({ state: 'visible', timeout: 10000 });
    await firstProduct.click();

    const addBtn = page.getByRole('button', { name: /Add/i }).first();
    await addBtn.waitFor({ state: 'visible', timeout: 10000 });
    await addBtn.click();
    await page.goto(`${BASE}/cart`);
    await page.getByRole('link', { name: /Proceed to Checkout/i }).click();
    await page.getByRole('button', { name: /Continue to Review/i }).click();
    await page.waitForSelector('button:has-text("Confirm Purchase Order")', { timeout: 10000 });

    // Intercept checkout to simulate failure
    await page.route('**/api/v1/buyer/checkout', route => {
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ success: false, error: 'Server error' }) });
    });

    // Try to confirm
    await page.getByRole('button', { name: /Confirm Purchase Order/i }).click();

    // Should display an alert and NOT redirect to confirmation
    await expect(page.getByText(/Failed to place order|Request failed with status code 500/i).first()).toBeVisible({ timeout: 5000 });

    // Cart should still have items
    await page.goto(`${BASE}/cart`);
    await expect(page.getByRole('link', { name: /Proceed to Checkout/i })).toBeVisible({ timeout: 5000 });
  });

  test('AI Assistant responds (mocked)', async ({ page }) => {
    // Authenticate as a buyer since /assistant is behind the (buyer) auth guard
    await registerBuyer(page, 'e2e.assistant');

    await page.goto(`${BASE}/assistant`);

    // Mock AI endpoint
    await page.route('**/api/v1/ai/procurement/simple-chat', route => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { reply: 'Hello from mocked AI' } }) });
    });

    const input = page.locator('input[placeholder*="Ask me anything"]');
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await input.fill('Hello');
    await page.locator('form button[type="submit"]').click();

    await expect(page.getByText('Hello from mocked AI')).toBeVisible({ timeout: 5000 });
  });
});
