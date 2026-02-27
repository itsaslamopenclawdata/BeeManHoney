# Deployment Playbook

This document contains actionable scripts for deploying BeeManHoney to a Production Docker Swarm or Single-Node Docker environment.

## 1. Environment Requirements
-   **OS**: Ubuntu 22.04 LTS
-   **Docker Engine**: v24.0+
-   **RAM**: Min 8GB (for AI Worker + Postgres)
-   **Storage**: 50GB NVMe

## 2. Secrets Management (Production)
Do NOT store secrets in `.env` files in production. Use Docker Secrets.

```bash
# Setup Secrets
printf "super-secret-db-password" | docker secret create db_password -
printf "sk-openai-api-key-..." | docker secret create openai_key -
printf "production-jwt-secret" | docker secret create jwt_secret -
```

## 3. Deployment Script (`deploy.sh`)

Save this as `deploy.sh` on the server.

```bash
#!/bin/bash
set -e

APP_NAME="beemanhoney"
TAG="latest"

echo ">>> 1. Pulling latest images..."
docker-compose -f docker-compose.prod.yml pull

echo ">>> 2. Applying Database Migrations..."
# Run a temporary container to upgrade DB schema
docker-compose -f docker-compose.prod.yml run --rm api alembic upgrade head

echo ">>> 3. Rolling Update..."
# Scale up new containers, drain old ones
docker-compose -f docker-compose.prod.yml up -d --remove-orphans

echo ">>> 4. Health Check..."
sleep 10
HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" http://localhost:8000/health)

if [ "$HTTP_STATUS" == "200" ]; then
    echo ">>> Deployment SUCCESS! System is live."
else
    echo ">>> ERROR: Health check failed with status $HTTP_STATUS"
    exit 1
fi
```

## 4. Rollback Procedure (`rollback.sh`)

Use this if `deploy.sh` fails Health Check.

```bash
#!/bin/bash
echo ">>> Rolling back to previous stable tag..."
# Assumes you tag images like :v1, :v2.
# Export PREV_TAG before running.

export IMAGE_TAG=${PREV_TAG:-"v1.0.0"}
docker-compose -f docker-compose.prod.yml up -d
echo ">>> Rolled back to $IMAGE_TAG"
```

## 5. Maintenance Mode
To enable maintenance mode without taking down the server, set the Redis key:

```bash
docker exec -it beemanhoney-redis redis-cli set system:maintenance "true"
```
The API middleware checks this key and returns `503 Service Unavailable` with a friendly message.
