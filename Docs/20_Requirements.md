# Master Consolidations & Dependency Graph

## 1. Full Stack Compatibility
-   **Protocol**: HTTP/1.1 (REST) + HTTP/2 (SSE).
-   **Auth**: Bearer Token (JWT HS256).
-   **Content-Type**: `application/json`.

## 2. Dependency Graph

```mermaid
graph TD
    subgraph Frontend [React 18 + Vite]
        UI[UI Components] --> Router[React Router]
        Router --> Axios[Axios Client]
        Router --> SSE[EventSource]
    end

    subgraph Backend [FastAPI + Python 3.11]
        Axios -->|REST| API[FastAPI]
        SSE -->|Streams| API
        API -->|Validate| Pydantic[Pydantic V2]
        API -->|ORM| SQLA[SQLAlchemy 2.0]
        API -->|Task| Redis[Redis PubSub]
    end

    subgraph Data [Persistence]
        SQLA -->|Async| DB[(Postgres 16)]
        DB -->|Vector| PGVector[pgvector]
        Redis -->|Queue| Celery[Celery Worker]
    end

    subgraph AI [Agent Runtime]
        Celery -->|State| LangGraph[LangGraph]
        LangGraph -->|LLM| OpenAI[GPT-4]
    end
```

## 3. Deployment constraints
-   **Docker**: All services share a `bridge` network.
-   **Volume**: Postgres data must be persisted to `postgres_data` volume.
-   **Secrets**: Must use Docker Secrets or ENV injection in Prod (Not .env files).
