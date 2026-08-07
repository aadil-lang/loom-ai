
const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const products = db.collection('products');
  
  const docs = await products.find({}).toArray();
  let updatedCount = 0;
  for (const doc of docs) {
    if (doc.images && Array.isArray(doc.images)) {
      let changed = false;
      const newImages = doc.images.map(img => {
        if (!img.startsWith('/loomai-images/')) {
          changed = true;
          return '/loomai-images/' + img.replace(/^\/+/, ''); // Handle cases where it might just be /cotton...
        }
        return img;
      });
      
      if (changed) {
        await products.updateOne({ _id: doc._id }, { $set: { images: newImages } });
        updatedCount++;
      }
    }
  }
  console.log('Updated ' + updatedCount + ' products.');
  process.exit(0);
}
run().catch(console.error);
