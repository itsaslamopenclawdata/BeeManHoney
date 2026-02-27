# Backend Requirements (Compatibility Matrix)

## 1. Core Runtime
-   **Python**: `3.11.7` (Slim Bookworm Docker Image)
-   **Pip**: `24.0`

## 2. Dependencies (`requirements.txt`)

```text
# Web Framework
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-multipart==0.0.6

# Database & ORM
sqlalchemy==2.0.25
asyncpg==0.29.0
alembic==1.13.1
psycopg2-binary==2.9.9

# AI & Agents
langchain==0.1.5
langchain-core==0.1.18
langchain-community==0.0.17
langchain-openai==0.0.5
langgraph==0.0.22

# Task Queue
celery==5.3.6
redis==5.0.1

# Utils
pydantic==2.6.0
pydantic-settings==2.1.0
httpx==0.26.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
```

## 3. Constraint Resolution
-   **Pydantic V1 vs V2**: FastAPI 0.100+ supports V2. LangChain 0.1+ supports V2. Stick to `pydantic>=2.6.0`.
-   **SQLAlchemy Async**: Must use `asyncpg` driver, not `psycopg2`.
