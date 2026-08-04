# LoomAI Backend Architecture & Strategy

## 1. Backend Architecture & Dependency Flow
The LoomAI backend strictly adheres to Clean Architecture principles. Dependencies flow downwards only. Higher layers (Controllers, API routes) depend on lower layers (Services), which depend on abstractions (Repositories), which finally interact with the MongoDB Data layer. 

**Dependency Direction:**
```text
Routes → Controllers → DTOs & Validators → Services → Repositories → MongoDB Models
```
*At no point does a Route invoke a Repository directly, nor does an AI Agent invoke a MongoDB Model directly.*

## 2. Folder Structure
The `backend/src/` directory is partitioned by technical concern and business domain:

- `ai/`: Contains agents, tools, memory, rag pipelines, and AI services (LLM, embeddings).
- `config/`: Modular environment and external provider configurations.
- `constants/`: Enums, roles, and static lists.
- `controllers/`: HTTP request/response handlers.
- `domain/`: Business entities and value objects.
- `dto/`: Data Transfer Objects for API contracts.
- `errors/`: Custom error classes.
- `events/`: Event-driven architecture payloads (publish/subscribe).
- `featureFlags/`: Toggles for incremental rollouts.
- `interfaces/`: TypeScript contracts for dependency inversion.
- `jobs/`: Scheduled tasks (cron).
- `mappers/`: Transforms MongoDB Documents into Domain Entities and DTOs.
- `middleware/`: Express pipeline interceptors (Auth, Error Handler).
- `models/`: Mongoose schemas.
- `monitoring/`: Health checks and metrics.
- `queue/`: Asynchronous job processing.
- `repositories/`: Data access layer (MongoDB operations).
- `responses/`: Standardized API responses.
- `routes/`: API endpoint definitions (versioned, e.g., `/v1`).
- `seed/`: Database initialization scripts.
- `services/`: Core business logic (The single source of truth for features).
- `storage/`: Abstractions for Cloudinary/S3 uploads.
- `utils/`: Cryptography, date, and generic helpers.

## 3. Request Lifecycle (REST API)
Every HTTP request follows a strict lifecycle:
1. **Request** hits `routes/v1/`.
2. **Middleware** verifies authentication and roles.
3. **Validator** checks body/params (rejects bad data).
4. **Controller** extracts data and calls the Service.
5. **Service** executes business logic and calls the Repository.
6. **Repository** queries MongoDB and returns a Mongoose Document.
7. **Service** receives the document, processes it, and returns it.
8. **Mapper** (invoked by Controller) transforms the Document into a DTO.
9. **Controller** wraps the DTO in `ApiResponse` and sends it back to the client.

## 4. AI Integration Strategy & LangGraph Plan
LangGraph agents function as autonomous operators within the system. They are strictly prohibited from duplicating business logic or accessing the database directly.

**Integration Flow:**
```text
LangGraph Agent → AI Tool (e.g., Inventory Search) → Business Service (e.g., ProductService) → Repository → MongoDB
```
* **AI Service Layer:** `ai/services/llmService.ts` acts as an adapter. Agents request completions/extractions from this service, meaning we can swap OpenAI for Groq or Ollama globally without modifying a single agent. This layer will also support translation services for multi-language Buyer/Supplier chat features.
* **AI Tools:** Tools are thin wrappers around existing Services. If an agent needs to forecast inventory, it calls an AI Tool which invokes `InventoryService.forecast()`.

## 5. RAG Integration Plan
The `ai/rag/` module is structured for a production-grade ingestion and retrieval pipeline:
- `loaders/`: Ingest PDFs, supplier catalogs, or web data.
- `splitters/`: Chunk text efficiently.
- `embeddings/`: Generate vectors via `embeddingService.ts`.
- `vectorstore/`: Store vectors in MongoDB Atlas Vector Search (or Pinecone).
- `retrievers/`: Fetch relevant chunks.
- `pipelines/`: Re-rank and assemble context for the LLM.
This structure requires zero architectural refactoring when we begin injecting supplier catalog PDFs.

## 6. Event Flow & Future Automation Strategy
- **Events (`events/`)**: The system supports decoupled operations. When `OrderService` completes an order, it emits an `ORDER_CREATED` event. Separate listeners in the events directory catch this and trigger notifications, emails, or AI analysis asynchronously.
- **Schedulers (`jobs/`)**: Cron jobs will live in `jobs/daily/` or `jobs/weekly/`. They will independently wake up, invoke Services (like `AnalyticsService`), and publish reports without disrupting the API layer.
- **Queues (`queue/`)**: Heavy tasks (like bulk product uploads or generating 10,000 embeddings) will be offloaded to a Redis-backed queue system, preventing the Express API from blocking.
