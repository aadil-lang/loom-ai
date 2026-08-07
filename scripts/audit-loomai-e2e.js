const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'demo-output');
const API_BASE = 'http://localhost:5000/api/v1';
const APP_BASE = 'http://localhost:3000';

function nowId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function base64url(input) {
  return Buffer.from(JSON.stringify(input))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function signJwt(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64url(header);
  const encodedPayload = base64url(payload);
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.createHmac('sha256', secret).update(data).digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${data}.${signature}`;
}

async function apiJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json };
}

async function getFirstProduct() {
  let list = [];
  try {
    const { ok, json } = await apiJson(`${API_BASE}/products`);
    if (ok) {
      list = json?.data?.data || json?.data || [];
    }
  } catch {
    list = [];
  }
  if (!list.length) {
    const datasetPath = path.join(ROOT, 'backend', 'data', 'loomai_dataset', 'collections', 'products.json');
    const raw = await fs.promises.readFile(datasetPath, 'utf8');
    list = JSON.parse(raw);
  }
  const first = list.find((item) => item?.id || item?._id) || list[0];
  if (!first) throw new Error('No products returned');
  return first;
}

function buildSeedBuyerSession() {
  const buyerId = '60d21b4667d0d8992e610c85';
  const user = {
    id: buyerId,
    name: 'Acme Fashion',
    email: 'buyer@example.com',
    role: 'Buyer',
  };
  const secret = process.env.JWT_SECRET || readJwtSecret();
  const accessToken = signJwt({ id: buyerId, role: 'Buyer', iat: Math.floor(Date.now() / 1000) }, secret);
  const refreshToken = `refresh-${nowId('buyer')}`;
  return { user, accessToken, refreshToken };
}

function buildSeedSupplierSession() {
  const supplierPath = path.join(ROOT, 'backend', 'data', 'loomai_dataset', 'collections', 'suppliers.json');
  const suppliers = JSON.parse(fs.readFileSync(supplierPath, 'utf8'));
  const firstSupplier = suppliers.find((item) => item?.name) || suppliers[0];
  const supplierId = 's1';
  const email = firstSupplier.email || `${String(firstSupplier.name || 'supplier').replace(/\s+/g, '').toLowerCase()}@example.com`;
  const user = {
    id: supplierId,
    name: firstSupplier.name || 'Supplier',
    email,
    role: 'Supplier',
  };
  const secret = process.env.JWT_SECRET || readJwtSecret();
  const accessToken = signJwt({ id: supplierId, role: 'Supplier', iat: Math.floor(Date.now() / 1000) }, secret);
  const refreshToken = `refresh-${nowId('supplier')}`;
  return { user, accessToken, refreshToken, email };
}

function readJwtSecret() {
  const envPath = path.join(ROOT, 'backend', '.env');
  const text = fs.readFileSync(envPath, 'utf8');
  const match = text.match(/^JWT_SECRET=(.+)$/m);
  if (!match) throw new Error('JWT_SECRET not found in backend/.env');
  return match[1].trim();
}

function createCollector(label) {
  const events = [];
  return {
    events,
    attach(page) {
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          events.push({ label, type: 'console-error', text: msg.text() });
        }
      });
      page.on('pageerror', (err) => {
        events.push({ label, type: 'pageerror', text: String(err) });
      });
      page.on('response', (res) => {
        if (res.status() === 404) {
          events.push({ label, type: '404', url: res.url() });
        }
      });
    },
  };
}

async function waitVisible(page, selector, timeout = 15000) {
  await page.locator(selector).waitFor({ state: 'visible', timeout });
}

async function runBuyerFlow(browser, product) {
  const session = buildSeedBuyerSession();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const collector = createCollector('buyer');
  const page = await context.newPage();
  collector.attach(page);
  await context.addInitScript(({ user, token, refreshToken }) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }, {
    user: session.user,
    token: session.accessToken,
    refreshToken: session.refreshToken,
  });

  await page.goto(`${APP_BASE}/auth/register`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('tab', { name: 'Buyer' }).waitFor({ state: 'visible', timeout: 15000 });

  await page.goto(`${APP_BASE}/dashboard?onboarding=true`, { waitUntil: 'domcontentloaded' });
  await waitVisible(page, 'text=AI Assistant');
  const onboardingBanner = await page.locator('text=Welcome to LoomAI').count();

  const voiceSupport = await page.evaluate(() => !!(window.SpeechRecognition || window.webkitSpeechRecognition));
  const micButtonCount = await page.locator('button[title="Voice Search"]').count();

  await page.goto(`${APP_BASE}/marketplace`, { waitUntil: 'domcontentloaded' });
  await page.locator('h1').first().waitFor({ state: 'visible', timeout: 15000 });

  await page.goto(`${APP_BASE}/product/${product.id || product._id}`, { waitUntil: 'domcontentloaded' });
  await waitVisible(page, 'text=Product Specifications');
  await page.getByRole('button', { name: /Add to Cart/i }).click();
  await page.goto(`${APP_BASE}/cart`, { waitUntil: 'domcontentloaded' });
  await waitVisible(page, 'text=Shopping Cart');
  const cartItems = await page.locator('text=Qty (m):').count();

  await page.locator('a[href="/checkout"]').click({ force: true });
  await page.waitForURL('**/checkout', { timeout: 15000 });
  await waitVisible(page, 'text=Checkout');
  await page.getByRole('button', { name: /Continue to Review/i }).click({ force: true });
  await waitVisible(page, 'text=Order Review');
  await page.getByRole('button', { name: /Confirm Purchase Order/i }).click({ force: true });
  await waitVisible(page, 'text=Order Confirmed!');

  await page.goto(`${APP_BASE}/assistant`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'AI Assistant' }).waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('input[placeholder="Ask me anything about textiles, pricing, or suppliers..."]').fill('Recommend sustainable cotton fabrics for 500 meters.');
  await page.locator('button[type="submit"]').click();
  await page.waitForSelector('text=Would you like me to add them to your cart?', { timeout: 20000 });

  await page.goto(`${APP_BASE}/knowledge`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Everything you need to know about textiles.' }).waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('input[placeholder="Search articles, guides, and tutorials..."]').fill('MOQ');
  await page.waitForTimeout(1200);
  const knowledgeArticles = await page.locator('article, [data-testid="article-card"]').count().catch(() => 0);

  await page.goto(`${APP_BASE}/dashboard`, { waitUntil: 'domcontentloaded' });
  await waitVisible(page, 'text=Welcome,');
  await page.goto(`${APP_BASE}/orders`, { waitUntil: 'domcontentloaded' });
  await waitVisible(page, 'text=Orders');
  await page.goto(`${APP_BASE}/suppliers`, { waitUntil: 'domcontentloaded' });
  await waitVisible(page, 'text=Saved Suppliers');
  const supplierCards = await page.locator('a[href^="/marketplace?supplier="]').count();
  await page.goto(`${APP_BASE}/profile`, { waitUntil: 'domcontentloaded' });
  await waitVisible(page, 'text=Company Profile');

  await context.close();

  return {
    buyerEmail: session.user.email,
    onboardingBanner,
    voiceSupport,
    micButtonCount,
    cartItems,
    knowledgeArticles,
    supplierCards,
    collectorEvents: collector.events,
  };
}

async function runSupplierFlow(browser) {
  const session = buildSeedSupplierSession();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const collector = createCollector('supplier');
  const page = await context.newPage();
  collector.attach(page);
  await context.addInitScript(({ user, token, refreshToken }) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }, {
    user: session.user,
    token: session.accessToken,
    refreshToken: session.refreshToken,
  });

  await page.goto(`${APP_BASE}/auth/register`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('tab', { name: 'Supplier' }).waitFor({ state: 'visible', timeout: 15000 });

  await page.goto(`${APP_BASE}/supplier?onboarding=true`, { waitUntil: 'domcontentloaded' });

  const onboardingBanner = await page.locator('text=Welcome to LoomAI').count();
  await waitVisible(page, 'text=Dashboard');

  const routeChecks = [];
  const routes = [
    { name: 'supplier dashboard', url: `${APP_BASE}/supplier`, mustContain: 'Dashboard' },
    { name: 'inventory', url: `${APP_BASE}/supplier/inventory`, mustContain: 'Inventory' },
    { name: 'orders', url: `${APP_BASE}/supplier/orders`, mustContain: 'Orders' },
    { name: 'analytics', url: `${APP_BASE}/supplier/analytics`, mustContain: 'Analytics' },
    { name: 'settings', url: `${APP_BASE}/supplier/settings`, mustContain: 'Settings' },
    { name: 'assistant', url: `${APP_BASE}/supplier/assistant`, mustContain: null },
    { name: 'customers', url: `${APP_BASE}/supplier/customers`, mustContain: null },
    { name: 'profile', url: `${APP_BASE}/supplier/profile`, mustContain: null },
  ];

  for (const route of routes) {
    await page.goto(route.url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(900);
    const bodyText = await page.locator('body').innerText().catch(() => '');
    routeChecks.push({
      name: route.name,
      url: route.url,
      hasExpectedContent: route.mustContain ? bodyText.includes(route.mustContain) : !bodyText.includes('404') && bodyText.length > 0,
      looksLike404: bodyText.includes('404') || bodyText.includes('not found') || bodyText.includes('This page could not be found'),
      snippet: bodyText.slice(0, 200),
    });
  }

  const supplierVoiceSupport = await page.evaluate(() => !!(window.SpeechRecognition || window.webkitSpeechRecognition)).catch(() => false);

  await context.close();

  return {
    supplierEmail: session.email,
    onboardingBanner,
    routeChecks,
    supplierVoiceSupport,
    collectorEvents: collector.events,
  };
}

async function main() {
  await fs.promises.mkdir(OUT_DIR, { recursive: true });

  const product = await getFirstProduct();

  const browser = await chromium.launch({ headless: true });

  const publicRoutes = [];
  const publicPage = await browser.newPage();
  const publicCollector = createCollector('public');
  publicCollector.attach(publicPage);
  for (const route of [
    '/',
    '/marketplace',
    '/categories',
    '/knowledge',
    '/suppliers',
    '/assistant',
    `/product/${product.id || product._id}`,
    '/cart',
    '/checkout',
    '/auth/login',
    '/auth/register',
  ]) {
    await publicPage.goto(`${APP_BASE}${route}`, { waitUntil: 'domcontentloaded' });
    await publicPage.waitForTimeout(800);
    const text = await publicPage.locator('body').innerText().catch(() => '');
    publicRoutes.push({
      route,
      looksLoaded: text.length > 0 && !text.includes('This page could not be found'),
      snippet: text.slice(0, 160),
    });
  }
  await publicPage.close();

  const buyer = await runBuyerFlow(browser, product);
  const supplierAudit = await runSupplierFlow(browser);

  await browser.close();

  const result = {
    timestamp: new Date().toISOString(),
    productId: product.id || product._id,
    publicRoutes,
    buyer,
    supplierAudit,
  };

  const outFile = path.join(OUT_DIR, 'audit-results.json');
  await fs.promises.writeFile(outFile, JSON.stringify(result, null, 2), 'utf8');
  console.log(JSON.stringify(result, null, 2));
  console.log(`AUDIT_RESULTS=${outFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
