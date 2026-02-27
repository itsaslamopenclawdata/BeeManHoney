# Implementation Reference Guide

This document provides step-by-step "Copy & Paste" instructions to initialize the BeeManHoney repository.

## Phase 1: Environment Setup

### 1.1. Docker Infrastructure
Create `docker-compose.yml` in the root (Monorepo context).

```yaml
version: '3.8'

services:
  # --- Persistence Layer ---
  db:
    image: ankane/pgvector:v0.5.1
    container_name: beemanhoney-db
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-admin}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-secret}
      POSTGRES_DB: beemanhoney
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: beemanhoney-redis
    ports:
      - "6379:6379"
    command: redis-server --save 60 1 --loglevel warning

  # --- Backend Services ---
  api:
    build: 
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: beemanhoney-api
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    volumes:
      - ./backend:/app
    environment:
      DATABASE_URL: postgresql+asyncpg://admin:secret@db:5432/beemanhoney
      REDIS_URL: redis://redis:6379/0
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started

  worker:
    build: 
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: beemanhoney-worker
    command: celery -A app.worker.celery_app worker --loglevel=info
    volumes:
      - ./backend:/app
    environment:
      DATABASE_URL: postgresql+asyncpg://admin:secret@db:5432/beemanhoney
      REDIS_URL: redis://redis:6379/0
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      redis:
        condition: service_started

volumes:
  postgres_data:
```

## Phase 2: Backend Initialization

### 2.1. Python Dependencies
Create `backend/requirements.txt`:
```text
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.25
asyncpg==0.29.0
alembic==1.13.1
pydantic==2.6.0
pydantic-settings==2.1.0
langchain==0.1.5
langgraph==0.0.22
langchain-openai==0.0.5
celery==5.3.6
redis==5.0.1
python-multipart==0.0.6
psycopg2-binary==2.9.9
httpx==0.26.0
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
```

### 2.2. Database & Migrations
1.  **Init Alembic**:
    ```bash
    docker-compose run --rm api alembic init alembic
    ```
2.  **Configure Async Alembic**:
    Modify `backend/alembic/env.py` to use `AsyncEngine`.
3.  **Generate Migration**:
    ```bash
    docker-compose run --rm api alembic revision --autogenerate -m "Init"
    ```
4.  **Apply**:
    ```bash
    docker-compose run --rm api alembic upgrade head
    ```

## Phase 3: Frontend Initialization (Vite)

### 3.1. Create App
```bash
cd Frontend
npm install
# Ensure .env is set
echo "VITE_API_BASE_URL=http://localhost:8000/api/v1" > .env
npm run dev
```
