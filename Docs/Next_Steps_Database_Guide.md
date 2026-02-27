# BeeManHoney - Next Steps & Database Guide

## Table of Contents
1. [Next Steps](#next-steps)
2. [Database Tables](#database-tables)
3. [Accessing Database via Docker Desktop](#accessing-database-via-docker-desktop)
4. [Manual Database Testing](#manual-database-testing)
5. [Common Database Queries](#common-database-queries)

---

## Next Steps

### Immediate Priority (High)

1. **Fix Backend API Endpoints** (3 failing tests)
   - [ ] Add `GET /products/{id}` endpoint to fetch individual product
   - [ ] Add empty cart validation in order creation endpoint
   - **Files**: `backend/app/api/v1/products.py`, `backend/app/api/v1/orders.py`

2. **Implement Celery Worker** (Currently disabled)
   - [ ] Create `backend/app/worker.py` with Celery app configuration
   - [ ] Implement AI agent tasks in `backend/app/agents/`
   - [ ] Enable worker service in docker-compose.yml
   - **Impact**: Enables background AI processing

3. **Run Docker Services**
   ```bash
   # Start all services
   docker-compose up -d

   # Run database migrations
   docker-compose exec api alembic upgrade head

   # Seed initial data
   docker-compose exec api python -m app_data.seed

   # Verify services
   docker-compose ps
   curl http://localhost:8000/health
   curl http://localhost:3000
   ```

### Medium Priority

4. **Implement Missing Features**
   - [ ] AI Agents in `backend/app/agents/` (currently empty)
   - [ ] Services layer in `backend/app/services/` (currently empty)
   - [ ] Product embeddings for semantic search (pgvector)

5. **Add More Tests**
   - [ ] Frontend tests for other pages (Products, Admin Dashboard, etc.)
   - [ ] Integration tests with Docker Compose
   - [ ] E2E tests with Playwright or Cypress

6. **Security Enhancements**
   - [ ] Add rate limiting
   - [ ] Implement proper CORS configuration
   - [ ] Add input validation decorators
   - [ ] Implement refresh token mechanism

### Low Priority (Future Enhancements)

7. **Performance & Monitoring**
   - [ ] Add database connection pooling
   - [ ] Implement logging (Python logging, Winston for Node)
   - [ ] Add monitoring/metrics (Prometheus, Grafana)
   - [ ] Implement caching (Redis caching layer)

8. **Documentation**
   - [ ] API documentation with Swagger/OpenAPI
   - [ ] Component documentation (Storybook)
   - [ ] Deployment documentation
   - [ ] Contributing guidelines

9. **Production Deployment**
   - [ ] Set up CI/CD pipeline (GitHub Actions)
   - [ ] Configure production environment variables
   - [ ] Set up SSL/HTTPS certificates
   - [ ] Configure backup strategies

---

## Database Tables

### Database: `beemanhoney`
- **Host**: localhost:5432 (via Docker)
- **User**: admin
- **Password**: secret
- **Type**: PostgreSQL 16 with pgvector extension

### Table Structure

#### 1. `users` - User Accounts
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | User unique identifier |
| email | VARCHAR | UNIQUE, NOT NULL, INDEXED | User email address |
| hashed_password | VARCHAR | NOT NULL | Bcrypt hashed password |
| full_name | VARCHAR | NULLABLE | User's full name |
| role | VARCHAR | DEFAULT 'customer' | User role: 'admin' or 'customer' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Account creation timestamp |

**Relationships:**
- One-to-many with `orders` table

#### 2. `products` - Product Catalog
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, INDEXED | Product unique identifier |
| name | VARCHAR | NOT NULL, INDEXED | Product name |
| description | TEXT | NULLABLE | Product description |
| price | FLOAT | NOT NULL | Product price |
| category | VARCHAR | INDEXED | Product category |
| stock_quantity | INTEGER | DEFAULT 0 | Available stock |
| image_url | VARCHAR | NULLABLE | Product image URL |

**Relationships:**
- One-to-many with `order_items` table

#### 3. `orders` - Customer Orders
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Order unique identifier |
| user_id | UUID | FOREIGN KEY → users.id | Customer who placed order |
| total_amount | FLOAT | NOT NULL | Total order amount |
| status | VARCHAR | DEFAULT 'Processing' | Order status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Order creation timestamp |

**Relationships:**
- Many-to-one with `users` table
- One-to-many with `order_items` table

#### 4. `order_items` - Order Line Items
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Line item unique identifier |
| order_id | UUID | FOREIGN KEY → orders.id | Parent order |
| product_id | INTEGER | FOREIGN KEY → products.id | Product reference |
| quantity | INTEGER | NOT NULL | Quantity ordered |
| price_at_purchase | FLOAT | NOT NULL | Price when ordered |

**Relationships:**
- Many-to-one with `orders` table
- Many-to-one with `products` table

---

## Accessing Database via Docker Desktop

### Method 1: Using Docker Desktop CLI

1. **Open Docker Desktop**
   - Start Docker Desktop application
   - Ensure the `beemanhoney-db` container is running

2. **Access Container Shell**
   ```bash
   # Open terminal in Docker Desktop or use command line
   docker exec -it beemanhoney-db psql -U admin -d beemanhoney
   ```

3. **You're now in PostgreSQL!** Run SQL queries:
   ```sql
   -- List all tables
   \dt

   -- Describe a table
   \d users

   -- List all users
   SELECT * FROM users;

   -- Exit
   \q
   ```

### Method 2: Using TablePlus / pgAdmin / DBeaver (GUI Tools)

1. **Install a PostgreSQL Client**
   - **TablePlus** (Recommended): https://tableplus.com/
   - **pgAdmin**: https://www.pgadmin.org/
   - **DBeaver**: https://dbeaver.io/

2. **Create New Connection**
   - **Host**: `localhost`
   - **Port**: `5432`
   - **User**: `admin`
   - **Password**: `secret`
   - **Database**: `beemanhoney`

3. **Connect and Explore**
   - Browse tables in the left sidebar
   - Run queries in the query editor
   - View table structures and data

### Method 3: Using VS Code Database Extension

1. **Install Extension**
   - Install "PostgreSQL" extension by Microsoft
   - Or install "SQLTools" extension

2. **Add Connection**
   - Press `Ctrl+Shift+P` → "SQLTools: New Connection"
   - Select PostgreSQL
   - Enter connection details (as above)

3. **Explore Database**
   - Right-click tables → "Show Table Data"
   - Write queries in the SQL editor

---

## Manual Database Testing

### Start Services

```bash
# Navigate to project root
cd F:\BeeManHoney\BeeManHoney

# Start Docker services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api
docker-compose logs -f db
```

### Run Migrations & Seed Data

```bash
# Run database migrations
docker-compose exec api alembic upgrade head

# Seed initial data (products and admin user)
docker-compose exec api python -m app_data.seed
```

### Access Database

```bash
# Using psql in container
docker exec -it beemanhoney-db psql -U admin -d beemanhoney

# Or use Docker Desktop → Containers → beemanhoney-db → Console → "psql -U admin -d beemanhoney"
```

---

## Common Database Queries

### View All Data

```sql
-- View all users
SELECT id, email, full_name, role, created_at FROM users;

-- View all products
SELECT id, name, price, category, stock_quantity FROM products;

-- View all orders
SELECT id, user_id, total_amount, status, created_at FROM orders;

-- View order items with product details
SELECT
  oi.id,
  o.id as order_id,
  p.name as product_name,
  oi.quantity,
  oi.price_at_purchase
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN products p ON oi.product_id = p.id;
```

### Test Queries

```sql
-- Count records in each table
SELECT
  (SELECT COUNT(*) FROM users) as users_count,
  (SELECT COUNT(*) FROM products) as products_count,
  (SELECT COUNT(*) FROM orders) as orders_count,
  (SELECT COUNT(*) FROM order_items) as order_items_count;

-- Find admin users
SELECT * FROM users WHERE role = 'admin';

-- Find products with low stock
SELECT name, stock_quantity FROM products WHERE stock_quantity < 10;

-- Find recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

-- Calculate total revenue
SELECT SUM(total_amount) as total_revenue FROM orders WHERE status = 'Processing';
```

### Manual Test Data

```sql
-- Insert a test product
INSERT INTO products (name, description, price, category, stock_quantity, image_url)
VALUES ('Test Honey', 'Delicious test honey', 19.99, 'Standard', 100, 'https://example.com/test.png');

-- Insert a test customer
INSERT INTO users (email, hashed_password, full_name, role)
VALUES ('test@example.com', '$2b$12$dummy_hash', 'Test User', 'customer');

-- Verify insertions
SELECT * FROM products WHERE name = 'Test Honey';
SELECT * FROM users WHERE email = 'test@example.com';

-- Clean up test data
DELETE FROM products WHERE name = 'Test Honey';
DELETE FROM users WHERE email = 'test@example.com';
```

---

## Docker Desktop Useful Commands

### Container Management

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View container logs
docker logs beemanhoney-db
docker logs beemanhoney-api
docker logs beemanhoney-frontend

# Follow logs in real-time
docker logs -f beemanhoney-api

# Restart a specific container
docker restart beemanhoney-api

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v
```

### Database Backup & Restore

```bash
# Backup database
docker exec beemanhoney-db pg_dump -U admin beemanhoney > backup.sql

# Restore database
cat backup.sql | docker exec -i beemanhoney-db psql -U admin -d beemanhoney

# Backup with data only
docker exec beemanhoney-db pg_dump -U admin --data-only beemanhoney > data_backup.sql
```

---

## Troubleshooting

### Database Connection Issues

**Problem**: Can't connect to database from local machine
```bash
# Solution 1: Check if port 5432 is available
netstat -ano | findstr :5432

# Solution 2: Verify container is running
docker ps | grep beemanhoney-db

# Solution 3: Check database logs
docker logs beemanhoney-db
```

### Container Not Starting

**Problem**: Container exits immediately
```bash
# Check logs for errors
docker-compose logs db

# Check container status
docker-compose ps

# Recreate containers
docker-compose down
docker-compose up -d --force-recreate
```

### Migrations Not Running

**Problem**: Tables don't exist
```bash
# Check if migrations ran
docker-compose exec api alembic current

# Run migrations manually
docker-compose exec api alembic upgrade head

# Verify tables exist
docker exec -it beemanhoney-db psql -U admin -d beemanhoney -c "\dt"
```

---

## Quick Reference

### Connection Details
- **Database**: beemanhoney
- **Host**: localhost
- **Port**: 5432
- **User**: admin
- **Password**: secret
- **Container**: beemanhoney-db

### Important Commands
```bash
# Start services
docker-compose up -d

# Run migrations
docker-compose exec api alembic upgrade head

# Seed data
docker-compose exec api python -m app_data.seed

# Access database
docker exec -it beemanhoney-db psql -U admin -d beemanhoney

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Default Admin Account (from seed data)
- **Email**: admin@beemanhoney.com
- **Password**: BeeManHoney@Admin2024!Secure
