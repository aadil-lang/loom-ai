const fs = require('fs');
const path = require('path');

const categories = [
  'Fabric Types',
  'Manufacturing',
  'Quality Control',
  'Certifications',
  'Procurement',
  'Logistics',
  'Marketplace Guides',
  'Sustainability'
];

const subcategoriesMap = {
  'Fabric Types': ['Cotton', 'Linen', 'Silk', 'Denim', 'Polyester', 'Rayon', 'Viscose', 'Nylon', 'Canvas', 'Poplin', 'Satin', 'Crepe', 'Chiffon', 'Georgette', 'Velvet', 'Oxford', 'Jersey', 'Terry', 'Lycra', 'Blends'],
  'Manufacturing': ['Spinning', 'Weaving', 'Knitting', 'Dyeing', 'Printing', 'Finishing', 'Garment Manufacturing'],
  'Quality Control': ['GSM', 'Thread Count', 'Shrinkage', 'Color Fastness', 'Pilling', 'Abrasion', 'Tensile Strength', 'Moisture Management'],
  'Certifications': ['OEKO-TEX', 'GOTS', 'ISO', 'BCI', 'GRS', 'Fair Trade', 'Organic Cotton'],
  'Procurement': ['MOQ', 'Lead Time', 'Supplier Selection', 'Sampling', 'Negotiation', 'Bulk Orders', 'Costing', 'RFQ Basics'],
  'Logistics': ['Warehousing', 'Packaging', 'Shipping', 'Export', 'Import', 'HS Codes', 'Incoterms'],
  'Marketplace Guides': ['Buyer Guide', 'Supplier Guide', 'Order Lifecycle', 'Inventory', 'Reviews', 'Analytics'],
  'Sustainability': ['Organic Textiles', 'Recycled Fabrics', 'Water Conservation', 'Carbon Footprint', 'Circular Fashion']
};

const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

const generateContent = (title, category, subcat) => {
  return `
# ${title}

Welcome to the definitive guide on **${title}**. This document is designed for enterprise textile professionals seeking a deeper understanding of ${subcat} within the broader context of ${category}.

## Overview

${subcat} is a critical element in the modern textile industry. The evolution of ${subcat} has allowed for unprecedented scaling and efficiency. Whether you are a buyer or supplier, mastering this concept ensures you remain competitive in the global market.

### Key Factors

1. **Material Quality**: Always ensure raw materials meet the minimum standard required for ${subcat}.
2. **Regulatory Compliance**: Follow local and international guidelines.
3. **Cost Efficiency**: Evaluate the total cost of ownership when dealing with ${subcat}.

## Technical Specifications

| Property | Standard Value | Tolerance |
|----------|----------------|-----------|
| Density  | Medium         | +/- 5%    |
| Durability | High           | N/A       |
| Applications | Universal | N/A |

### Process Workflow

To properly implement ${subcat}, follow these steps:
- Initial assessment and sampling
- Quality control and lab testing
- Bulk production and continuous monitoring
- Final inspection and packaging

## Best Practices

> "Success in the textile industry requires continuous learning. ${subcat} is no exception."

- Regular audits of your supply chain.
- Ensure transparency and traceability.
- Stay updated on the latest technological advancements in ${category}.

## Conclusion

By integrating these practices into your workflow, you can optimize your operations and achieve superior product quality. For more information, please refer to the related articles in our Knowledge Base.
  `;
};

const articles = [];
let idCounter = 1;

for (const category of categories) {
  const subcats = subcategoriesMap[category];
  for (const subcat of subcats) {
    // Generate 1-2 articles per subcategory
    const numArticles = Math.random() > 0.3 ? 2 : 1; // 70% chance of 2 articles
    for (let i = 0; i < numArticles; i++) {
      const title = i === 0 ? `The Comprehensive Guide to ${subcat}` : `Advanced Techniques in ${subcat}`;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      
      articles.push({
        title,
        slug,
        summary: `An essential enterprise-grade guide covering the foundational and advanced aspects of ${subcat}.`,
        content: generateContent(title, category, subcat),
        category,
        subcategory: subcat,
        tags: [category.toLowerCase().replace(' ', '-'), subcat.toLowerCase().replace(' ', '-'), 'enterprise', 'textiles'],
        difficulty,
        author: 'LoomAI Knowledge Team',
        estimatedReadTime: Math.floor(Math.random() * 10) + 3,
        featuredImage: 'https://images.unsplash.com/photo-1590614392211-13797c27ec8b?w=800&q=80',
        published: true,
        metadata: {
          category,
          subcategory: subcat,
          tags: [category.toLowerCase(), subcat.toLowerCase()],
          difficulty,
          keywords: [subcat, category, 'textile industry', 'B2B', 'LoomAI'],
          estimatedReadTime: 5,
          published: true,
          lastUpdated: new Date().toISOString()
        }
      });
    }
  }
}

const outputPath = path.join(__dirname, 'knowledge.json');
fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2));
console.log(`Generated ${articles.length} articles to ${outputPath}`);
