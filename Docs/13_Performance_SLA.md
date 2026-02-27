# Performance SLA

## 1. Latency Targets (P95)
| Operation | Target | Hard Limit |
| :--- | :--- | :--- |
| **Static Assets** | < 50ms | 200ms |
| **API Read (DB)** | < 100ms | 500ms |
| **API Write (DB)** | < 200ms | 1s |
| **Vector Search** | < 300ms | 1s |
| **LLM Token 1** | < 1.5s | 4s |

## 2. Throughput Capabilities
-   **Concurrency**: 500 Active Users.
-   **Chat Capacity**: 50 Simultaneous Streams per Worker Node.

## 3. Monitoring & Alerting
-   **Uptime**: 99.9% (approx 43m downtime/month).
-   **Alert Thresholds**:
    -   CPU Usage > 80% for 5 mins -> **Warning**.
    -   Error Rate (5xx) > 1% -> **Critical (PagerDuty)**.
    -   Disk Space < 10% -> **Critical**.

## 4. Recovery (RTO/RPO)
-   **RPO (Data Loss)**: 15 Minutes (Redis Snapshot interval).
-   **RTO (Recovery Time)**: 10 Minutes (Docker Swarm Scaling).
