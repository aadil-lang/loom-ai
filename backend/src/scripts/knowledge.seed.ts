import fs from 'fs';
import path from 'path';
import { logger } from '../config/logger';

export const seedKnowledgeArticles = async () => {
  try {
    const filePath = path.join(__dirname, 'knowledge.json');
    
    if (!fs.existsSync(filePath)) {
      logger.warn(`knowledge.json not found at ${filePath}. Skipping Knowledge Base seed.`);
      return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const articles = JSON.parse(fileContent);

    // Dynamically import the model so this can be used anywhere
    const { KnowledgeArticle } = await import('../models/KnowledgeArticle');

    await KnowledgeArticle.deleteMany({});
    await KnowledgeArticle.insertMany(articles);

    logger.info(`Successfully seeded ${articles.length} Knowledge Articles into MongoDB.`);
  } catch (error: any) {
    logger.error(`Error seeding Knowledge Articles: ${error.message}`);
  }
};
