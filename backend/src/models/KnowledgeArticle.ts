import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeArticle extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string; // Markdown
  category: string;
  subcategory: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  author: string;
  estimatedReadTime: number; // in minutes
  featuredImage?: string;
  published: boolean;
  
  // Future RAG / AI Preparation
  documentId?: string;
  chunkId?: string;
  metadata?: {
    category: string;
    subcategory: string;
    tags: string[];
    difficulty: string;
    keywords: string[];
    estimatedReadTime: number;
    published: boolean;
    lastUpdated: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeArticleSchema: Schema = new Schema(
  {
    _id: { type: String },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    tags: [{ type: String }],
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    author: { type: String, default: 'LoomAI Knowledge Team' },
    estimatedReadTime: { type: Number, default: 5 },
    featuredImage: { type: String },
    published: { type: Boolean, default: true },

    documentId: { type: String },
    chunkId: { type: String },
    metadata: {
      category: { type: String },
      subcategory: { type: String },
      tags: [{ type: String }],
      difficulty: { type: String },
      keywords: [{ type: String }],
      estimatedReadTime: { type: Number },
      published: { type: Boolean },
      lastUpdated: { type: Date }
    }
  },
  { timestamps: true }
);

// Search Indexing
KnowledgeArticleSchema.index({
  title: 'text',
  summary: 'text',
  content: 'text',
  tags: 'text',
  'metadata.keywords': 'text'
});

// Category indexing for fast filtering
KnowledgeArticleSchema.index({ category: 1, subcategory: 1 });
KnowledgeArticleSchema.index({ tags: 1 });
KnowledgeArticleSchema.index({ published: 1, createdAt: -1 });

export const KnowledgeArticle = mongoose.model<IKnowledgeArticle>('KnowledgeArticle', KnowledgeArticleSchema);
