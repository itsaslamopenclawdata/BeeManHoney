# Admin Analytics Schema & Queries

This document defines the database structure required to track user activity and sales performance, along with the SQL queries used to populate the Admin Dashboard KPIs.

## 1. Database Schema (PostgreSQL)

### 1.1. Master User Table (`users`)
Stores profile and signup timestamp.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'customer', -- 'admin', 'customer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast signup statistics
CREATE INDEX idx_users_created_at ON users(created_at);
```

### 1.2. Login History Table (`login_history`)
Tracks every successful login event for engagement metrics.

```sql
CREATE TABLE login_history (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    device_agent TEXT
);

-- Index for time-series aggregation
CREATE INDEX idx_login_history_login_at ON login_history(login_at);
```

### 1.3. Transactions / Orders Table (`orders`)
Stores transactional data for sales analysis.

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL, -- Stored in INR
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(20) CHECK (status IN ('Processing', 'Shipped', 'Delivered', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for status filtering and sales aggregation
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

---

## 2. KPI Queries for Dashboard

### 2.1. Monthly Signups (Bar Chart)
```sql
SELECT 
    TO_CHAR(created_at, 'YYYY-MM') AS month, 
    COUNT(*) as signup_count
FROM users
WHERE created_at >= NOW() - INTERVAL '12 months'
GROUP BY 1
ORDER BY 1;
```

### 2.2. Monthly Active Logins (Line Chart)
```sql
SELECT 
    TO_CHAR(login_at, 'YYYY-MM') AS month, 
    COUNT(*) as login_count
FROM login_history
WHERE login_at >= NOW() - INTERVAL '12 months'
GROUP BY 1
ORDER BY 1;
```

### 2.3. Aggregate Sales (Total Revenue)
```sql
SELECT SUM(total_amount) as total_revenue
FROM orders
WHERE status != 'Cancelled';
```

### 2.4. Sales Yet to Deliver (Pending/Shipped)
```sql
SELECT COUNT(*) as pending_deliveries
FROM orders
WHERE status IN ('Processing', 'Shipped');
```
