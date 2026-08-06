const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  const browser = await chromium.launch();
  
  const viewports = [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'mobile', width: 375, height: 667 }
  ];

  const routes = [
    { name: 'marketplace', url: 'http://localhost:3000/marketplace' },
    { name: 'categories', url: 'http://localhost:3000/categories' },
    { name: 'dashboard', url: 'http://localhost:3000/dashboard' }
  ];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    
    for (const route of routes) {
      console.log(`Taking screenshot of ${route.name} on ${viewport.name}...`);
      await page.goto(route.url, { waitUntil: 'networkidle' });
      await page.screenshot({ path: `screenshots/${route.name}-${viewport.name}.png`, fullPage: true });
    }
    
    // Test product details page
    try {
      const response = await page.evaluate(async () => {
        const res = await fetch('http://localhost:5000/api/v1/products');
        const json = await res.json();
        return json.data.data[0]._id;
      });
      if (response) {
        console.log(`Taking screenshot of product details on ${viewport.name}...`);
        await page.goto(`http://localhost:3000/product/${response}`, { waitUntil: 'networkidle' });
        await page.screenshot({ path: `screenshots/product-${viewport.name}.png`, fullPage: true });
      }
    } catch (e) {
      console.log('Failed to fetch product for details screenshot:', e.message);
    }

    await context.close();
  }

  await browser.close();
  console.log('Done!');
})();
