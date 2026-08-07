const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'demo-output');
const VIDEO_DIR = path.join(OUT_DIR, 'videos');
const FINAL_VIDEO = path.join(OUT_DIR, 'loomai-demo-full.webm');
const APP_BASE = 'http://localhost:3000';
const API_BASE = 'http://localhost:5000/api/v1';

async function pause(page, ms) {
  await page.waitForTimeout(ms);
}

async function visit(page, url, settleMs = 1200) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await pause(page, settleMs);
}

async function scroll(page, amount, settleMs = 800) {
  await page.mouse.wheel(0, amount);
  await pause(page, settleMs);
}

async function getFirstProductId() {
  const response = await fetch(`${API_BASE}/products`);
  const json = await response.json();
  const list = json?.data?.data || json?.data || [];
  const first = list.find((item) => item?.id || item?._id) || list[0];
  return first?.id || first?._id;
}

async function main() {
  await fs.promises.mkdir(VIDEO_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1440, height: 900 },
    },
  });

  await context.addInitScript(({ user, token, refreshToken }) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }, {
    user: {
      id: 'demo-buyer',
      name: 'Jane Doe',
      email: 'buyer@example.com',
      role: 'Buyer',
    },
    token: 'demo-token',
    refreshToken: 'demo-refresh-token',
  });

  const page = await context.newPage();
  page.setDefaultTimeout(20000);

  // Public discovery flow
  await visit(page, `${APP_BASE}/`);
  await scroll(page, 700);

  await visit(page, `${APP_BASE}/marketplace`);
  await scroll(page, 700);

  await visit(page, `${APP_BASE}/categories`);
  await scroll(page, 600);

  const productId = await getFirstProductId();
  if (!productId) {
    throw new Error('Could not determine a product ID for the demo.');
  }

  await visit(page, `${APP_BASE}/product/${productId}`);
  await page.getByRole('tab', { name: 'Buyer Reviews' }).click().catch(() => {});
  await pause(page, 700);
  await page.getByRole('tab', { name: 'Shipping & Packaging' }).click().catch(() => {});
  await pause(page, 700);
  await page.getByRole('tab', { name: 'Product Specifications' }).click().catch(() => {});
  await pause(page, 600);
  await page.getByRole('button', { name: /Add to Cart/i }).click();
  await pause(page, 900);

  await visit(page, `${APP_BASE}/cart`);
  await scroll(page, 350);

  await visit(page, `${APP_BASE}/checkout`);
  await page.getByRole('button', { name: /Continue to Review/i }).click().catch(() => {});
  await pause(page, 900);
  await page.getByRole('button', { name: /Confirm Purchase Order/i }).click().catch(() => {});
  await pause(page, 1200);

  // Knowledge and AI
  await visit(page, `${APP_BASE}/knowledge`);
  const knowledgeSearch = page.getByPlaceholder('Search articles, guides, and tutorials...');
  await knowledgeSearch.fill('MOQ');
  await pause(page, 1000);
  await scroll(page, 500);

  await visit(page, `${APP_BASE}/assistant`);
  const assistantInput = page.getByPlaceholder('Ask me anything about textiles, pricing, or suppliers...');
  await assistantInput.fill('Recommend sustainable cotton fabrics for a 500 meter order.');
  await page.locator('button[type="submit"]').click();
  await page.waitForSelector('text=Would you like me to add them to your cart?', { timeout: 10000 }).catch(() => {});
  await pause(page, 900);

  // Buyer experience
  await visit(page, `${APP_BASE}/dashboard`);
  await scroll(page, 700);

  await visit(page, `${APP_BASE}/orders`);
  await scroll(page, 500);

  await visit(page, `${APP_BASE}/suppliers`);
  await scroll(page, 500);

  await visit(page, `${APP_BASE}/profile`);
  await scroll(page, 450);

  // Auth surfaces
  await visit(page, `${APP_BASE}/auth/login`);
  await pause(page, 700);
  await visit(page, `${APP_BASE}/auth/register`);
  await pause(page, 700);

  // Supplier operations
  await visit(page, `${APP_BASE}/supplier`);
  await scroll(page, 700);

  await visit(page, `${APP_BASE}/supplier/inventory`);
  await scroll(page, 500);

  await visit(page, `${APP_BASE}/supplier/analytics`);
  await scroll(page, 500);

  await context.close();
  await browser.close();

  const clips = fs.existsSync(VIDEO_DIR)
    ? fs.readdirSync(VIDEO_DIR).filter((file) => file.endsWith('.webm'))
    : [];

  if (!clips.length) {
    throw new Error('No video clip was generated.');
  }

  const sourceVideo = path.join(VIDEO_DIR, clips[0]);
  await fs.promises.copyFile(sourceVideo, FINAL_VIDEO);

  console.log(FINAL_VIDEO);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
