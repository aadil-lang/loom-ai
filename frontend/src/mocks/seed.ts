import fs from 'fs';
import path from 'path';

// Deterministic Pseudo-Random Number Generator (Linear Congruential Generator)
let seed = 12345;
function random() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

function randomInt(min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number) {
  return random() * (max - min) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function randomElements<T>(arr: T[], count: number): T[] {
  const result = new Set<T>();
  while (result.size < count && result.size < arr.length) {
    result.add(randomElement(arr));
  }
  return Array.from(result);
}

// Entities
const categories = [
  { id: "c1", name: "Cotton", description: "100% pure cotton, perfect for summer wear." },
  { id: "c2", name: "Silk", description: "Premium quality silk with a natural sheen." },
  { id: "c3", name: "Denim", description: "Durable denim for jeans and jackets." },
  { id: "c4", name: "Linen", description: "Lightweight and absorbent linen." },
  { id: "c5", name: "Polyester", description: "Synthetic, highly durable and wrinkle-resistant." },
  { id: "c6", name: "Viscose", description: "Semi-synthetic rayon fabric with a silk-like drape." },
  { id: "c7", name: "Wool", description: "Warm, natural animal fiber for winter apparel." },
  { id: "c8", name: "Industrial", description: "Heavy-duty technical fabrics for industrial use." },
  { id: "c9", name: "Home Furnishing", description: "Upholstery, drapery, and bedding textiles." },
  { id: "c10", name: "Organic Blends", description: "Eco-friendly sustainable fabric blends." }
];

const countries = [
  { id: "cn", name: "China" },
  { id: "in", name: "India" },
  { id: "bd", name: "Bangladesh" },
  { id: "vn", name: "Vietnam" },
  { id: "tr", name: "Turkey" },
  { id: "it", name: "Italy" },
  { id: "uk", name: "United Kingdom" }
];

const suppliers = [
  { id: "s1", name: "LoomCorp Textiles", countryId: "in", rating: 4.8, established: 1995, badges: ["Verified", "Top Seller"] },
  { id: "s2", name: "FabricX Global", countryId: "cn", rating: 4.5, established: 2003, badges: ["Verified"] },
  { id: "s3", name: "Royal Mills", countryId: "uk", rating: 4.9, established: 1982, badges: ["Premium", "Eco-Certified"] },
  { id: "s4", name: "Istanbul Weavers", countryId: "tr", rating: 4.6, established: 2010, badges: ["Verified"] },
  { id: "s5", name: "Dhaka Knitwear Ltd", countryId: "bd", rating: 4.4, established: 2005, badges: ["High Volume"] },
  { id: "s6", name: "Milan Silk House", countryId: "it", rating: 5.0, established: 1950, badges: ["Premium", "Verified"] },
  { id: "s7", name: "Vietnam Garment Tech", countryId: "vn", rating: 4.2, established: 2015, badges: [] },
  { id: "s8", name: "Shanghai Textura", countryId: "cn", rating: 4.7, established: 1998, badges: ["Verified", "High Volume"] },
  { id: "s9", name: "Surat Synthetic Fabrics", countryId: "in", rating: 4.3, established: 2008, badges: [] },
  { id: "s10", name: "Florence Luxury Textiles", countryId: "it", rating: 4.9, established: 1965, badges: ["Premium"] }
];

const colors = [
  { id: "col1", name: "Navy Blue", hex: "#000080" },
  { id: "col2", name: "Emerald Green", hex: "#50C878" },
  { id: "col3", name: "Slate Gray", hex: "#708090" },
  { id: "col4", name: "Ruby Red", hex: "#E0115F" },
  { id: "col5", name: "Pure White", hex: "#FFFFFF" },
  { id: "col6", name: "Midnight Black", hex: "#000000" },
  { id: "col7", name: "Beige", hex: "#F5F5DC" },
  { id: "col8", name: "Mustard Yellow", hex: "#FFDB58" },
  { id: "col9", name: "Sky Blue", hex: "#87CEEB" },
  { id: "col10", name: "Burgundy", hex: "#800020" },
  { id: "col11", name: "Lavender", hex: "#E6E6FA" },
  { id: "col12", name: "Charcoal", hex: "#36454F" }
];

const certifications = [
  { id: "cert1", name: "OEKO-TEX Standard 100" },
  { id: "cert2", name: "GOTS (Global Organic Textile Standard)" },
  { id: "cert3", name: "ISO 9001" },
  { id: "cert4", name: "BCI (Better Cotton Initiative)" },
  { id: "cert5", name: "GRS (Global Recycled Standard)" }
];

const adjectives = ["Premium", "Eco-friendly", "Raw", "Heavyweight", "Breathable", "Luxury", "Standard", "Organic", "Recycled", "Ultra-soft", "Performance", "Classic"];
const descriptors = ["Woven", "Knitted", "Dyed", "Printed", "Embroidered", "Brushed", "Coated", "Stretch", "Jacquard", "Twill"];

const products = [];
for (let i = 1; i <= 400; i++) {
  const category = randomElement(categories);
  const supplier = randomElement(suppliers);
  const country = countries.find(c => c.id === supplier.countryId);
  
  const adj = randomElement(adjectives);
  const desc = randomElement(descriptors);
  const name = `${adj} ${category.name} - ${desc}`;

  const availableColors = randomElements(colors, randomInt(1, 5)).map(c => c.id);
  
  // Assign realistic certs based on badges/category
  const certs = [];
  if (supplier.badges.includes("Eco-Certified") || category.id === "c10" || adj === "Organic") {
    certs.push(certifications.find(c => c.id === "cert2")!.id); // GOTS
  }
  if (adj === "Recycled") {
    certs.push(certifications.find(c => c.id === "cert5")!.id); // GRS
  }
  certs.push(certifications.find(c => c.id === "cert1")!.id); // OEKO-TEX baseline
  if (category.id === "c1" || category.id === "c3") {
    if (random() > 0.5) certs.push(certifications.find(c => c.id === "cert4")!.id); // BCI
  }
  certs.push(certifications.find(c => c.id === "cert3")!.id); // ISO 9001

  // Deduplicate certs
  const uniqueCerts = Array.from(new Set(certs));

  // Pricing based on category (Silk is expensive, Polyester is cheap)
  let basePrice = 5;
  if (category.id === "c2") basePrice = 30; // Silk
  if (category.id === "c7") basePrice = 20; // Wool
  if (category.id === "c5") basePrice = 2; // Polyester
  
  const price = +(randomFloat(basePrice * 0.8, basePrice * 2.5)).toFixed(2);
  const moq = [50, 100, 250, 500, 1000, 2000][randomInt(0, 5)];
  const stock = randomInt(500, 20000);
  
  const gsm = randomInt(100, 450);
  const width = [44, 54, 58, 60, 72][randomInt(0, 4)] + '"';
  
  let composition = `${randomInt(60, 100)}% ${category.name}, ${randomInt(0, 40)}% Blend`;
  if (category.id === 'c1') composition = '100% Cotton';
  if (category.id === 'c2') composition = '100% Silk';

  products.push({
    id: `prod_${i}`,
    sku: `SKU-${Math.floor(random() * 999999).toString().padStart(6, '0')}`,
    name: name,
    categoryId: category.id,
    supplierId: supplier.id,
    pricePerMeter: price,
    moq: moq,
    stock: stock,
    gsm: gsm,
    width: width,
    composition: composition,
    availableColors: availableColors,
    countryOfOriginId: country?.id,
    certificationIds: uniqueCerts,
    description: `High-quality ${name.toLowerCase()} sourced directly from ${supplier.name} in ${country?.name}. Ideal for a wide range of B2B applications, offering excellent durability and finish.`,
    features: ["Durable", "Colorfast", "Shrink-resistant", "Export Quality"],
    rating: +(randomFloat(3.5, 5.0)).toFixed(1),
    reviewCount: randomInt(0, 500),
    images: [`https://placehold.co/600x400/eeeeee/999999?text=${encodeURIComponent(name)}`],
    status: random() > 0.05 ? "Active" : "Out of Stock"
  });
}

// Generate Orders
const orderStatuses = ["Pending", "Accepted", "Preparing", "Ready for Dispatch", "Completed", "Cancelled"];
const orders = [];
for (let i = 1; i <= 150; i++) {
  const numItems = randomInt(1, 4);
  const orderProducts = randomElements(products, numItems);
  
  let totalValue = 0;
  const items = orderProducts.map(p => {
    const qty = randomInt(p.moq, p.moq * 5);
    totalValue += p.pricePerMeter * qty;
    return {
      productId: p.id,
      quantity: qty,
      priceAtPurchase: p.pricePerMeter
    };
  });

  // Assign order to the supplier of the first product (simplified relation)
  const supplierId = orderProducts[0].supplierId;

  const dateOffset = randomInt(0, 60); // past 60 days
  const d = new Date();
  d.setDate(d.getDate() - dateOffset);

  orders.push({
    id: `ord_${i}`,
    buyerName: `Buyer Company ${randomInt(1, 100)}`,
    supplierId: supplierId,
    status: randomElement(orderStatuses),
    totalValue: +totalValue.toFixed(2),
    items: items,
    createdAt: d.toISOString(),
  });
}

// Generate Notifications
const notifications = [];
for (let i = 1; i <= 30; i++) {
  const types = ["New Order", "Low Inventory", "Product Approved", "Order Cancelled", "System Update"];
  const type = randomElement(types);
  let message = "";
  if (type === "New Order") message = `You have received a new order worth $${randomInt(500, 5000)}.`;
  if (type === "Low Inventory") message = `SKU-${randomInt(100000, 999999)} is running low on stock.`;
  if (type === "Product Approved") message = `Your new product listing has been approved.`;
  if (type === "Order Cancelled") message = `Order ord_${randomInt(1, 150)} was cancelled by the buyer.`;
  if (type === "System Update") message = `Scheduled maintenance will occur on Sunday at 2 AM UTC.`;

  const d = new Date();
  d.setDate(d.getDate() - randomInt(0, 10));

  notifications.push({
    id: `notif_${i}`,
    supplierId: randomElement(suppliers).id,
    type: type,
    message: message,
    isRead: random() > 0.5,
    createdAt: d.toISOString(),
  });
}

// Generate the JSON files
const outDir = path.join(__dirname);

fs.writeFileSync(path.join(outDir, 'categories.json'), JSON.stringify(categories, null, 2));
fs.writeFileSync(path.join(outDir, 'countries.json'), JSON.stringify(countries, null, 2));
fs.writeFileSync(path.join(outDir, 'suppliers.json'), JSON.stringify(suppliers, null, 2));
fs.writeFileSync(path.join(outDir, 'colors.json'), JSON.stringify(colors, null, 2));
fs.writeFileSync(path.join(outDir, 'certifications.json'), JSON.stringify(certifications, null, 2));
fs.writeFileSync(path.join(outDir, 'products.json'), JSON.stringify(products, null, 2));
fs.writeFileSync(path.join(outDir, 'orders.json'), JSON.stringify(orders, null, 2));
fs.writeFileSync(path.join(outDir, 'notifications.json'), JSON.stringify(notifications, null, 2));

console.log(`Successfully generated ${products.length} products and related entities in ${outDir}`);
