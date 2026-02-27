# High Level Design (HLD)

## 1. System Context & Data Flow

### 1.1. The "Deep Agent" Loop
Unlike traditional chatbots, our Agents run in a dedicated `Worker` container to prevent blocking the API.

1.  **Ingest**: User POSTs message to `/chat/stream`.
2.  **Queue**: API pushes job `(thread_id, user_message)` to Redis `celery` queue.
3.  **Process**:
    -   Celery Worker picks up job.
    -   Hydrates `LangGraph` state from Redis.
    -   Executes Agent steps (LLM -> Tool -> LLM).
4.  **Stream**:
    -   Worker Publishes tokens to Redis Channel `chat:{thread_id}`.
    -   API (SSE Endpoint) Subscribes to `chat:{thread_id}` and yields to Client.

### 1.2. Product Search (RAG) Flow
1.  **Indexing**: Periodic task fetches products from DB -> Generates Embeddings (OpenAI) -> Updates `pgvector`.
2.  **Retrieval**: `Sales Agent` invokes `vector_search`. Query is embedded -> Cosine Similarity Scan (HNSW Index) -> Top K results returned.

## 2. Design Constraints

### 2.1. Statelessness
-   **API**: Must remain stateless. No in-memory sessions. Use Redis for `session_id`.
-   **Worker**: Must be able to restart without losing order data (Postgres) or active conversation pointers (Redis Checkpoints).

### 2.2. Scalability
-   **Read Heavy**: Products page. Solution: CDN for images, Redis Cache for API responses.
-   **Compute Heavy**: AI Chat. Solution: Horizontal Autoscaling of `Worker` containers based on Queue Depth.
