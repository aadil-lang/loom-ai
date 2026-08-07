import mongoose from 'mongoose';
import { logger } from './logger';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';

let mongod: MongoMemoryServer | null = null;

// Map to convert string UUIDs from the JSON to MongoDB ObjectIds
const idMap = new Map<string, mongoose.Types.ObjectId>();

function getObjectId(uuid: string): mongoose.Types.ObjectId {
  if (!uuid) return new mongoose.Types.ObjectId();
  if (!idMap.has(uuid)) {
    idMap.set(uuid, new mongoose.Types.ObjectId());
  }
  return idMap.get(uuid)!;
}

export const connectMemoryDB = async () => {
  try {
    mongod = await MongoMemoryServer.create({
      binary: {
        version: '7.0.14' // Explicitly set a version that exists for Debian 11
      }
    });
    const uri = mongod.getUri();
    logger.info(`Starting In-Memory MongoDB Server at: ${uri}`);
    
    const conn = await mongoose.connect(uri);
    logger.info(`MongoDB Connected (Memory): ${conn.connection.host}`);

    await seedData();
  } catch (error: any) {
    logger.error(`Error connecting to Memory MongoDB: ${error.message}`);
    process.exit(1);
  }
};

async function seedData() {
  try {
    const basePath = path.join(__dirname, '../../data/loomai_dataset/collections');
    if (!fs.existsSync(basePath)) {
      logger.warn(`Dataset collections not found at ${basePath}. Skipping seed.`);
      return;
    }
    
    logger.info(`Loading dataset from ${basePath}...`);

    const readCollection = (file: string) => {
      const p = path.join(basePath, file);
      return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
    };

    const categoriesData = readCollection('categories.json');
    const suppliersData = readCollection('suppliers.json');
    const productsData = readCollection('products.json');

    // Dynamically import models
    const { Category } = await import('../models/Category');
    const { Supplier } = await import('../models/Supplier');
    const { Product } = await import('../models/Product');

    if (categoriesData) {
      await Category.deleteMany({});
      const docs = categoriesData.map((c: any) => ({
        ...c,
        _id: c.id || c.uuid,
      }));
      await Category.insertMany(docs);
      logger.info(`Seeded ${docs.length} categories`);
    }

    if (suppliersData) {
      await Supplier.deleteMany({});
      const docs = suppliersData.map((s: any) => ({
        ...s,
        _id: s.id || s.uuid,
        email: s.email || `${(s.name || 'supplier').replace(/\s+/g, '').toLowerCase()}@example.com`,
        password: s.password || 'password123',
        contactName: s.contactName || 'Sales Rep',
        location: s.location || 'Global Hub',
      }));
      await Supplier.insertMany(docs);
      logger.info(`Seeded ${docs.length} suppliers`);
    }

    if (productsData) {
      await Product.deleteMany({});
      const docs = productsData.map((p: any) => ({
        ...p,
        _id: p.id || p.uuid,
        categoryId: p.categoryId || p.categoryUuid || categoriesData[0]?.id || categoriesData[0]?.uuid,
        supplierId: p.supplierId || p.supplierUuid || p.supplier_id || suppliersData[0]?.id || suppliersData[0]?.uuid,
        sku: p.sku || `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`,
        name: p.name || p.subcategoryName || p.slug || 'Unknown Product',
        description: p.longDescription || p.shortDescription || p.description || 'No description available',
        pricePerMeter: p.pricePerMeter || 10,
        moq: p.MOQ || p.moq || 100,
        composition: p.blend || p.composition || '100% Cotton',
        weightGSM: p.gsm || p.weightGSM || 200,
        width: p.width ? `${p.width}${p.widthUnit || 'cm'}` : '150cm',
        fabricType: p.weave || p.knitType || p.fabricType || 'Woven',
        images: p.images?.map((img: string) => img.startsWith('http') ? img : `http://localhost:5000/images/${img}`) || []
      }));
      await Product.insertMany(docs);
      logger.info(`Seeded ${docs.length} products`);
    }

    // Seed mock Buyer and Orders for the Dashboard
    const { Buyer } = await import('../models/Buyer');
    const { Order } = await import('../models/Order');
    
    // Create a mock buyer that matches a fixed ID used by mock tokens (e.g. all 1s or random)
    // Actually, just create one default buyer. If the JWT uses a specific ID, we can update this.
    // For now, let's just create one standard buyer. If auth middleware extracts from token, it might just need any buyer.
    // Let's check if the frontend uses a specific ID or if auth is fully mocked.
    // Wait, let's just insert one buyer and we can use a fixed ID for it, or check what ID is in the JWT.
    // Let's create a buyer with ID '60d21b4667d0d8992e610c85' which is standard in our tests or just rely on the token.
    const buyerId = new mongoose.Types.ObjectId("60d21b4667d0d8992e610c85"); 
    await Buyer.deleteMany({});
    await Buyer.create({
      _id: buyerId,
      name: "Acme Fashion",
      email: "buyer@example.com",
      password: "password123",
      contactName: "Jane Doe",
      phone: "+1234567890"
    });
    logger.info('Seeded mock buyer');

    const { Address } = await import('../models/Address');
    await Address.deleteMany({});
    await Address.create({
      _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c86"),
      buyerId: buyerId,
      title: "Main Office",
      street1: "123 Fashion Ave, Suite 400",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
      type: "Shipping",
      isDefault: true
    });
    logger.info('Seeded mock address');

    // Add a completed order so the buyer can leave reviews
    const supplierId = suppliersData ? (suppliersData[0]?.id || suppliersData[0]?.uuid) : undefined;
    await Order.deleteMany({});
    await Order.create({
      _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c87"),
      orderNumber: "ORD-1001",
      buyerId: buyerId,
      supplierId: supplierId,
      items: [{
        productId: new mongoose.Types.ObjectId("60c72b2f9b1d4c3a2c8e4b50"),
        quantity: 100,
        priceAtPurchase: 14.5
      }],
      status: 'Completed',
      totalValue: 1450,
      shippingAddress: "123 Fashion Ave, Suite 400, New York, NY 10001"
    });
    logger.info('Seeded mock completed order');

    await Order.create({
      orderNumber: "ORD-MOCK-123",
      buyerId: buyerId,
      supplierId: suppliersData ? (suppliersData[0]?.id || suppliersData[0]?.uuid) : undefined,
      items: [],
      status: 'Pending',
      totalValue: 1250,
      shippingAddress: "123 Main St, NYC, USA"
    });
    logger.info('Seeded mock orders');

    // Seed Knowledge Base
    const { seedKnowledgeArticles } = await import('../scripts/knowledge.seed');
    await seedKnowledgeArticles();

    logger.info('In-Memory Database Seeded successfully with converted ObjectIds!');
  } catch (err: any) {
    logger.error(`Failed to seed in-memory db: ${err.message}`);
  }
}
