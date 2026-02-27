# Vendor & Service Configuration

## 1. LLM Provider (OpenAI)
-   **Tier**: Tier 2 (Usage limit $500/mo).
-   **Models**:
    -   `gpt-4-turbo-preview` (Supervisor, Recipe): High Intelligence.
    -   `gpt-3.5-turbo-0125` (Sales, Support): High Speed/Low Cost.
    -   `text-embedding-3-small`: Vector Search.
-   **Failover**: None (Single Provider). TODO: Add Anthropic as backup.

## 2. Database (self-hosted / Cloud)
-   **Production**: AWS RDS for PostgreSQL.
    -   Instance: `db.t3.medium`.
    -   Storage: 50GB GP3.
-   **Vector Search**: Requires `pgvector` extension installed on RDS.

## 3. Caching (Redis)
-   **Production**: AWS ElastiCache (Redis OSS).
    -   Instance: `cache.t3.micro`.
    -   Mode: Cluster Mode Disabled.

## 4. Cost Estimates (Monthly)
| Service | Est Cost | Notes |
| :--- | :--- | :--- |
| OpenAI | $50 | Variable based on Traffic. |
| AWS RDS | $40 | Reserved Instance. |
| Hosting | $20 | EC2/Vercel Pro. |
| **Total** | **~$110** | |
