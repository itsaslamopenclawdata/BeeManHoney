# BeeManHoney Database Schema

## Entity Relationship Diagram

```
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (UUID) PK        │
│ email               │
│ hashed_password     │
│ full_name           │
│ role                │
│ created_at          │
└─────────────────────┘
           │
           │ 1:N
           │
           ▼
┌─────────────────────┐
│       orders        │
├─────────────────────┤
│ id (UUID) PK        │
│ user_id (UUID) FK   │◄──────────────────┐
│ total_amount        │                    │
│ status              │                    │
│ created_at          │                    │
└─────────────────────┘                    │
           │                                │
           │ 1:N                            │
           │                                │ N:1
           ▼                                │
┌─────────────────────┐              ┌─────────────────────┐
│     order_items     │              │       users         │
├─────────────────────┤              └─────────────────────┘
│ id (UUID) PK        │
│ order_id (UUID) FK  │
│ product_id (INT) FK │────────┐
│ quantity            │        │
│ price_at_purchase   │        │
└─────────────────────┘        │
                                │
                                │ N:1
                                ▼
                       ┌─────────────────────┐
                       │     products        │
                       ├─────────────────────┤
                       │ id (INT) PK         │
                       │ name                │
                       │ description         │
                       │ price               │
                       │ category            │
                       │ stock_quantity      │
                       │ image_url           │
                       └─────────────────────┘
```

## Table Details

### users
User account information and authentication.

| Column | Type | Attributes |
|--------|------|------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| email | VARCHAR(255) | UNIQUE, NOT NULL, INDEXED |
| hashed_password | VARCHAR(255) | NOT NULL |
| full_name | VARCHAR(255) | NULLABLE |
| role | VARCHAR(50) | DEFAULT 'customer', CHECK: role IN ('admin', 'customer') |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

**Indexes:**
- `idx_users_email` on email column
- Primary key on id column

---

### products
Product catalog with honey varieties.

| Column | Type | Attributes |
|--------|------|------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL, INDEXED |
| description | TEXT | NULLABLE |
| price | FLOAT | NOT NULL |
| category | VARCHAR(100) | INDEXED, NULLABLE |
| stock_quantity | INTEGER | DEFAULT 0 |
| image_url | VARCHAR(500) | NULLABLE |

**Indexes:**
- `idx_products_name` on name column
- `idx_products_category` on category column
- Primary key on id column

---

### orders
Customer orders with status tracking.

| Column | Type | Attributes |
|--------|------|------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| user_id | UUID | FOREIGN KEY → users.id, NOT NULL |
| total_amount | FLOAT | NOT NULL |
| status | VARCHAR(50) | DEFAULT 'Processing' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

**Foreign Keys:**
- `fk_orders_user_id` → users(id)

**Indexes:**
- Primary key on id column
- Index on user_id column

---

### order_items
Individual line items within an order.

| Column | Type | Attributes |
|--------|------|------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| order_id | UUID | FOREIGN KEY → orders.id, NOT NULL |
| product_id | INTEGER | FOREIGN KEY → products.id, NOT NULL |
| quantity | INTEGER | NOT NULL |
| price_at_purchase | FLOAT | NOT NULL |

**Foreign Keys:**
- `fk_order_items_order_id` → orders(id)
- `fk_order_items_product_id` → products(id)

**Indexes:**
- Primary key on id column
- Index on order_id column
- Index on product_id column

---

## Relationships

### users → orders (One-to-Many)
- One user can have many orders
- Each order belongs to exactly one user

### orders → order_items (One-to-Many)
- One order can have many order items
- Each order item belongs to exactly one order

### products → order_items (One-to-Many)
- One product can appear in many order items
- Each order item references exactly one product

---

## Sample Data

### users table
```sql
| id                                   | email                    | hashed_password                     | full_name     | role   | created_at                 |
|--------------------------------------|--------------------------|-------------------------------------|---------------|--------|----------------------------|
| 550e8400-e29b-41d4-a716-446655440000 | admin@beemanhoney.com    | $2b$12$hashed_password_here          | Super Admin   | admin  | 2026-01-06 10:00:00 UTC    |
| 550e8400-e29b-41d4-a716-446655440001 | customer@example.com    | $2b$12$hashed_password_here          | John Doe      | customer | 2026-01-06 11:00:00 UTC    |
```

### products table
```sql
| id | name                | description                           | price | category | stock_quantity | image_url                   |
|----|---------------------|---------------------------------------|-------|----------|----------------|-----------------------------|
| 1  | Manuka Honey UMF 15+ | Premium New Zealand Manuka Honey     | 45.99 | Premium  | 50             | https://example.com/manuka.png |
| 2  | Wildflower Honey    | Pure polyfloral honey                 | 12.99 | Standard | 200            | https://example.com/wildflower.png |
| 3  | Acacia Honey        | Clear, light honey                    | 18.50 | Standard | 100            | https://example.com/acacia.png |
| 4  | Buckwheat Honey     | Dark, molasses-like honey             | 15.00 | Dark     | 80             | https://example.com/buckwheat.png |
```

### orders table
```sql
| id                                   | user_id                              | total_amount | status     | created_at                 |
|--------------------------------------|--------------------------------------|--------------|------------|----------------------------|
| 660e8400-e29b-41d4-a716-446655440000 | 550e8400-e29b-41d4-a716-446655440001 | 25.98        | Processing | 2026-01-06 12:00:00 UTC    |
```

### order_items table
```sql
| id                                   | order_id                             | product_id | quantity | price_at_purchase |
|--------------------------------------|--------------------------------------|------------|----------|-------------------|
| 770e8400-e29b-41d4-a716-446655440000 | 660e8400-e29b-41d4-a716-446655440000 | 2          | 2        | 12.99             |
| 770e8400-e29b-41d4-a716-446655440001 | 660e8400-e29b-41d4-a716-446655440000 | 3          | 1        | 18.50             |
```

---

## Database Statistics

### Initial Data (from seed.py)
- **Users**: 1 (admin)
- **Products**: 4 (Manuka, Wildflower, Acacia, Buckwheat)
- **Orders**: 0
- **Order Items**: 0

### Expected Growth
- **Users**: ~100-1000+ (customer accounts)
- **Products**: ~50-200 (honey varieties)
- **Orders**: ~1000-10000+ (order history)
- **Order Items**: ~3000-30000+ (order line items)

---

## PostgreSQL Extensions

### pgvector (Installed)
- **Purpose**: Vector similarity search for AI-powered product recommendations
- **Status**: Available but not currently used in models
- **Future Use**: Product embeddings for semantic search

### How to Add Vector Embeddings (Future)

```sql
-- Add embedding column to products
ALTER TABLE products ADD COLUMN embedding vector(1536);

-- Create vector index for similarity search
CREATE INDEX ON products USING ivfflat (embedding vector_cosine_ops);

-- Insert embedding for a product
UPDATE products
SET embedding = '[0.1, 0.2, 0.3, ...]'  -- OpenAI embedding
WHERE id = 1;

-- Find similar products
SELECT name, embedding <=> '[0.1, 0.2, 0.3, ...]' AS distance
FROM products
ORDER BY embedding <=> '[0.1, 0.2, 0.3, ...]'
LIMIT 5;
```
