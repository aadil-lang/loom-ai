# LoomAI Marketplace Architecture

## 1. Design Overview
The Marketplace domain is completely decoupled from Authentication and specific user roles. The exposed endpoints (`/products/*` and `/categories/*`) are designed to be universally consumed by the Buyer Portal, Supplier Portal, Mobile Apps, and background AI processes.

## 2. Search Strategy (Current & Future)
Currently, search leverages native **MongoDB Compound Text Indexes**:
- The index covers `name`, `description`, `fabricType`, `tags`, and `composition`.
- Weights can be configured (e.g., `name` has higher weight than `description`).

### Evolution to Semantic Search
Because the business logic relies heavily on `ProductQueryDto`, future semantic search (using Vector Embeddings) will be completely transparent to the HTTP layer. 
1. We will generate embeddings for `name + description + fabricType + certifications`.
2. The `ProductRepository` will query an Atlas Vector Search index.
3. The API contract will not change; `?search=eco friendly cotton` will simply yield vastly improved results.

## 3. RAG Preparation
The `Product` Mongoose model has been deliberately expanded with strict fields:
- `fabricType`, `colors`, `certifications`, `tags`, `width`.
These fields are not just strings; they act as highly structured metadata that will be embedded alongside the raw text. This structured metadata allows LangGraph agents to apply **pre-filtering** before performing semantic search (e.g., finding "Blue Denim" but strictly enforcing `certifications = GOTS`).

## 4. AI-Ready Service Layer
`ProductService.ts` implements scaffolds that serve as LangGraph Tools:
- `findSimilarProducts(productId)`
- `compareProducts(productIds[])`
- `findAlternativeProducts(productId)`

These methods use raw DB logic today but provide the exact interface required for future intelligent automation without needing to rewrite any API endpoints.

## 5. Pagination & Performance
- Standardized metadata (`currentPage`, `totalPages`, `hasNext`) is returned on every list response.
- Repository queries use `.lean()` (where applicable) and precise `.skip()` / `.limit()` logic.
- Price filtering and sorting utilize ascending/descending B-Tree indexes for `O(log N)` retrieval speeds.
