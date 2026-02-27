# Low Level Design (LLD)

## 1. Database Schema (PostgreSQL)

### 1.1. Core Tables

```sql
-- ENABLE VECTOR EXTENSION
CREATE EXTENSION IF NOT EXISTS vector;

-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    stock_quantity INT DEFAULT 0,
    image_url TEXT,
    embedding vector(1536) -- OpenAI text-embedding-3-small
);

-- HNSW Index for fast vector search
CREATE INDEX ON products USING hnsw (embedding vector_cosine_ops);

-- ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'Processing',
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ORDER ITEMS (Transactional)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL
);
```

## 2. Backend Class Design

### 2.1. LangGraph State Definition (`backend/app/agents/state.py`)
```python
class AgentState(TypedDict):
    """The scratchpad for the graph execution."""
    messages: Annotated[list[BaseMessage], operator.add]
    next_node: str | None
    user_id: str
    cart_items: list[dict]
```

### 2.2. Service Layer Pattern
We use the Service Repository pattern to decouple FastAPI from SQLAlchemy.

-   **`ProductService`**: Handles RAG logic + DB CRUD.
-   **`OrderService`**: Handles Transactional commits + Inventory decrement.

## 3. Frontend Component State
-   **Cart**: Managed via `useContext` (Global) + `localStorage` (Persistence).
    -   `type CartItem = { product: Product; qty: number }`
-   **Chat**: Managed via `useChat` hook.
    -   Maintains `history: Message[]`.
    -   Handles `EventSource` connection lifecycle.
