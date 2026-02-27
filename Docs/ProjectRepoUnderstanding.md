# BeeManHoney Project Repository Understanding

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Backend Structure](#backend-structure)
4. [Frontend Structure](#frontend-structure)
5. [Infrastructure & Deployment](#infrastructure--deployment)
6. [Current Issues](#current-issues)
7. [Testing Strategy](#testing-strategy)
8. [Critical Files Reference](#critical-files-reference)

---

## Project Overview

**BeeManHoney** is an AI-driven e-commerce platform transitioning from a static website to an intelligent honey product marketplace.

### Core Value Proposition
- **"Deep Agents"**: AI-powered personalized apiarist (beekeeper) assistants
- Natural language product discovery and recommendations
- AI-generated recipes based on available honey products
- Context-aware customer support with memory

### Key Features
| Feature | Description |
|---------|-------------|
| Hybrid Authentication | Email/Password, OAuth, Physical QR Token login |
| AI Product Discovery | Semantic search using vector embeddings + keyword filtering |
| AI Customer Support | LangGraph-based agents with contextual memory |
| Shopping Cart | Persistent cart synchronization across devices |
| Recipe Integration | AI-generated recipes from honey product inventory |
| Admin Dashboard | Graphical analytics and KPI monitoring with Recharts |

---

## Architecture

### Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  React 18 + TypeScript + Vite + Tailwind CSS + Nginx        │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST/JSON + SSE
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY                             │
│                    FastAPI 0.109+                            │
└───────────┬─────────────────────────────────┬───────────────┘
            │                                 │
            ▼                                 ▼
┌──────────────────────┐          ┌──────────────────────┐
│   PostgreSQL 16      │          │      Redis 7         │
│   + pgvector         │          │   (Task Queue)       │
│                      │          └──────────┬───────────┘
└──────────────────────┘                     │
                                            │
                                            ▼
                              ┌──────────────────────┐
                              │   Celery Worker      │
                              │   + LangGraph        │
                              │   + OpenAI API       │
                              └──────────────────────┘
```

### Service Communication
- **Frontend ↔ API**: REST/JSON + SSE for real-time AI responses
- **API → Redis**: Enqueue Celery tasks
- **Worker ← Redis**: Consume tasks from queue
- **API/Worker ↔ PostgreSQL**: AsyncDB for relational & vector operations
- **Worker ↔ OpenAI**: HTTPS for AI inference

---

## Backend Structure

### Directory Layout
```
backend/
├── app/
│   ├── agents/           # AI/ML agents directory (EMPTY - planned)
│   ├── api/
│   │   ├── deps.py       # Dependency injection for auth
│   │   └── v1/           # API version 1
│   │       ├── auth.py   # Authentication endpoints
│   │       ├── products.py # Product management
│   │       ├── orders.py  # Order processing
│   │       └── analytics.py # Analytics/stats
│   ├── core/             # Core functionality
│   │   ├── config.py     # Configuration settings
│   │   └── security.py   # Security utilities
│   ├── db/
│   │   ├── base.py       # Base SQLAlchemy model
│   │   └── session.py    # Database session management
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   ├── services/         # Business logic (EMPTY)
│   └── main.py           # FastAPI application entry
├── alembic/              # Database migrations
├── app_data/             # Data seeding scripts
├── tests/                # Test directory (EMPTY)
├── Dockerfile            # Container configuration
├── requirements.txt      # Python dependencies
└── worker.py             # Celery worker (referenced but not implemented)
```

### API Endpoints

#### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | User registration |
| POST | `/token` | Login (returns JWT token) |

#### Products (`/api/v1/products`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List products (search, pagination) |
| POST | `/` | Create product (admin only) |
| PUT | `/{product_id}` | Update product (admin only) |
| DELETE | `/{product_id}` | Delete product (admin only) |

#### Orders (`/api/v1/orders`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create new order |
| GET | `/me` | Get current user's orders |

#### Analytics (`/api/v1/analytics`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Admin statistics (sales, users, low stock) |

#### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Service health status |

### Key Dependencies
```
FastAPI          0.109.0
SQLAlchemy       2.0.25
AsyncPG          0.29.0
Alembic          1.13.1
Celery           5.3.6
Redis            5.0.1
LangChain        0.1.5+
LangGraph        0.0.22+
OpenAI           (latest)
python-jose      (JWT)
passlib          (hashing)
```

### Running the Backend

**With Docker Compose (Recommended):**
```bash
docker-compose up -d
```

**Locally:**
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables in .env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/dbname
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=your_key

# Run migrations
alembic upgrade head

# Run API server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Run Celery worker (separate terminal)
celery -A app.worker.celery_app worker --loglevel=info
```

---

## Frontend Structure

### Directory Layout
```
frontend/
├── assets/           # Static assets (logo.png)
├── components/       # Reusable UI components
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── MobileNav.tsx
├── pages/           # Page-level components (routes)
│   ├── About.tsx
│   ├── AdminDashboard.tsx
│   ├── AdminLogin.tsx
│   ├── Contact.tsx
│   ├── History.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Products.tsx
│   ├── Recipes.tsx
│   ├── Signup.tsx
│   └── Sourcing.tsx
├── services/        # API services and configuration
│   └── api.ts       # Axios instance with interceptors
├── utils/           # Utility functions
│   └── currency.ts
├── App.tsx          # Main application with routing
├── index.css        # Global styles
├── index.html       # HTML entry point
├── main.tsx         # Application entry point
├── vite.config.ts   # Vite configuration
├── tailwind.config.js # Tailwind theme
├── tsconfig.json    # TypeScript config
├── Dockerfile       # Multi-stage build with Nginx
├── nginx.conf       # Nginx configuration
└── package.json     # Dependencies and scripts
```

### Key Dependencies
```json
{
  "react": "18.2.0",
  "react-dom": "18.2.0",
  "react-router-dom": "6.22.0",
  "vite": "5.1.0",
  "typescript": "5.2.2",
  "tailwindcss": "3.4.1",
  "axios": "1.6.7",
  "lucide-react": "0.344.0",
  "recharts": "2.12.0"
}
```

### State Management
- **Local State**: React's `useState` hook
- **Token Storage**: `localStorage` for JWT
- **API Client**: Axios with request interceptors for automatic token attachment
- **No Global State**: No Redux, Context API, or Zustand implemented

### Routing Structure
```tsx
<HashRouter>
  <Header />
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/products" element={<Products />} />
    <Route path="/recipes" element={<Recipes />} />
    <Route path="/sourcing" element={<Sourcing />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/history" element={<History />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin" element={<AdminDashboard />} />
  </Routes>
  <Footer />
</HashRouter>
```

### Tailwind Theme Configuration
```javascript
{
  primary: '#FFA726',      // Honey Gold
  secondary: '#D46F00',    // Deep Amber
  background: '#FDF8E4',   // Cream
  text: '#4A2C2A'          // Dark Brown
}
```

### Running the Frontend

**Development:**
```bash
npm run dev        # Start Vite dev server on port 5173
```

**Production Build:**
```bash
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## Infrastructure & Deployment

### Docker Compose Services

```yaml
version: '3.8'

services:
  # Frontend - React SPA served via Nginx
  frontend:
    build: ./frontend
    ports: ["3000:80"]
    depends_on: [api]
    environment:
      - VITE_API_BASE_URL=http://localhost:8000/api/v1

  # Backend API - FastAPI
  api:
    build: ./backend
    ports: ["8000:8000"]
    command: uvicorn app.main:app --reload
    volumes: [./backend:/app]
    environment:
      - DATABASE_URL=postgresql+asyncpg://admin:secret@db:5432/beemanhoney
      - REDIS_URL=redis://redis:6379/0
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started

  # AI Worker - Celery + LangGraph
  worker:
    build: ./backend
    command: celery -A app.worker.celery_app worker
    environment: [same as api]
    depends_on: [redis]

  # Database - PostgreSQL with pgvector
  db:
    image: ankane/pgvector:v0.5.1
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=beemanhoney
    volumes: [postgres_data:/var/lib/postgresql/data]
    ports: ["5432:5432"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]

  # Cache & Message Broker
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    command: redis-server --save 60 1

volumes:
  postgres_data:
```

### Environment Configuration

**Backend `.env`:**
```env
DATABASE_URL=postgresql+asyncpg://admin:secret@localhost:5432/beemanhoney
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=sk-...
JWT_SECRET=<generate_secure_random>
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
```

**Frontend `.env`:**
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## Current Issues

### 1. Git State Issues
| Issue | Severity | Fix |
|-------|----------|-----|
| Many root-level files marked as deleted | High | Commit restructure |
| `.gitignore`, `README.md` deleted | Medium | Recreate files |
| New `frontend/`, `backend/` untracked | High | Add to git |

### 2. Security Issues
| Issue | Severity | Location | Fix |
|-------|----------|----------|-----|
| Hardcoded JWT secret | Critical | `backend/app/core/config.py` | Move to env variable |
| Weak admin password | High | `backend/app_data/seed.py` | Use strong password |
| No input validation | Medium | API endpoints | Add Pydantic validation |

### 3. Missing Infrastructure
| Component | Status | Impact |
|-----------|--------|--------|
| Test suite | Not implemented | No quality assurance |
| AI agents | Empty directory | AI features incomplete |
| Services layer | Empty directory | Business logic mixed with routes |
| Celery worker | Referenced but not configured | Async tasks not working |
| Error handling | Basic | Poor user experience on errors |
| Logging | Not configured | Difficult debugging |
| Rate limiting | Not implemented | Vulnerable to abuse |

### 4. Configuration Issues
| Issue | Fix |
|-------|-----|
| No .env files | Create templates |
| CORS origins hardcoded | Use environment variable |
| No environment validation | Add pydantic-settings |

---

## Testing Strategy

### Backend Testing (Pytest)

**Test Dependencies to Add:**
```
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2
pytest-cov==4.1.0
factory-boy==3.3.0
```

**Test Structure:**
```
backend/tests/
├── conftest.py              # Shared fixtures
├── test_auth.py             # Authentication endpoints
├── test_products.py         # Product CRUD
├── test_orders.py           # Order processing
└── test_analytics.py        # Admin analytics
```

**Test Commands:**
```bash
cd backend
pytest                        # Run all tests
pytest --cov=app --cov-report=html  # With coverage
pytest tests/test_auth.py     # Specific file
pytest -v                     # Verbose output
```

### Frontend Testing (Vitest)

**Test Dependencies to Add:**
```json
{
  "@testing-library/react": "^14.1.2",
  "@testing-library/jest-dom": "^6.1.5",
  "@testing-library/user-event": "^14.5.1",
  "vitest": "^1.0.4",
  "jsdom": "^23.0.1",
  "msw": "^2.0.0",
  "@vitest/ui": "^1.0.4"
}
```

**Test Structure:**
```
frontend/tests/
├── components/
│   ├── Header.test.tsx
│   ├── Footer.test.tsx
│   └── MobileNav.test.tsx
├── pages/
│   ├── Home.test.tsx
│   ├── Products.test.tsx
│   ├── Login.test.tsx
│   └── AdminDashboard.test.tsx
└── utils/
    └── currency.test.ts
```

**Test Commands:**
```bash
cd frontend
npm test              # Run all tests
npm test -- --ui      # With UI
npm test -- --coverage  # With coverage
```

### Integration Testing

**Docker Compose Testing:**
```bash
# Start all services
docker-compose up -d

# Check health
docker-compose ps
curl http://localhost:8000/health
curl http://localhost:3000

# Run migrations
docker-compose exec api alembic upgrade head

# Seed data
docker-compose exec api python -m app_data.seed

# Run tests
docker-compose exec api pytest
docker-compose exec frontend npm test

# View logs
docker-compose logs -f
```

---

## Critical Files Reference

### Backend Critical Files

| File | Purpose | Issues |
|------|---------|--------|
| `backend/app/core/config.py` | Configuration management | Hardcoded JWT secret |
| `backend/app/api/v1/auth.py` | Authentication endpoints | Needs more validation |
| `backend/app/api/v1/products.py` | Product CRUD | Basic error handling |
| `backend/app_data/seed.py` | Database seeding | Weak admin password |
| `backend/requirements.txt` | Dependencies | Missing test packages |
| `backend/Dockerfile` | Container build | Appears functional |
| `backend/app/db/session.py` | DB connection | Review async configuration |

### Frontend Critical Files

| File | Purpose | Issues |
|------|---------|--------|
| `frontend/services/api.ts` | API client | Hardcoded base URL |
| `frontend/App.tsx` | Main app + routing | Review protected routes |
| `frontend/pages/AdminDashboard.tsx` | Admin panel | Verify authorization |
| `frontend/vite.config.ts` | Build config | Add test config |
| `frontend/package.json` | Dependencies | Missing test packages |
| `frontend/tailwind.config.js` | Theme config | Looks good |

### Infrastructure Files

| File | Purpose | Issues |
|------|---------|--------|
| `docker-compose.yml` | Service orchestration | Verify worker service |
| `.env` | Environment variables | Does not exist |
| `.gitignore` | Git exclusions | Deleted, needs recreation |

---

## Next Steps

1. **Immediate (Security)**
   - Fix JWT secret configuration
   - Update admin password
   - Create .env templates

2. **Short Term (Testing)**
   - Set up pytest backend
   - Set up vitest frontend
   - Create test fixtures

3. **Medium Term (Features)**
   - Implement AI agents
   - Complete Celery worker
   - Add comprehensive error handling

4. **Long Term (Production)**
   - Add rate limiting
   - Implement logging
   - Set up monitoring
   - Configure production deployment

---

*Document generated: 2026-01-06*
*Repository: BeeManHoney*
*Branch: main*
