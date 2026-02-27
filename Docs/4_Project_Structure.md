# Project Directory Structure

## 1. Monorepo Layout (Strict)

```text
/
├── Frontend/                   # React Application
│   ├── public/                 # Static Assets (favicon, manifest)
│   ├── src/
│   │   ├── assets/             # Local Images/Fonts (logo.png)
│   │   ├── components/         # Reusable UI (Header, ProductCard)
│   │   ├── pages/              # Route Components (Home, Login)
│   │   ├── hooks/              # Custom Hooks (useAuth, useChat)
│   │   ├── services/           # Axios & SSE Clients
│   │   ├── context/            # Global State (AuthContext)
│   │   ├── types/              # TS Interfaces
│   │   └── utils/              # Formatting Helpers
│   ├── .env                    # VITE_API_BASE_URL
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                    # FastAPI Application
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/             # Versioned Endpoints
│   │   │       ├── auth.py
│   │   │       ├── products.py
│   │   │       └── chat.py
│   │   ├── core/               # Configuration
│   │   │   ├── config.py       # Pydantic Settings
│   │   │   └── security.py     # JWT & Hashing
│   │   ├── db/                 # Database
│   │   │   ├── base.py         # SQLAlchemy Base
│   │   │   └── session.py
│   │   ├── models/             # SQLAlchemy Models
│   │   ├── schemas/            # Pydantic Schemas
│   │   ├── services/           # Business Logic (isolating API from DB)
│   │   └── agents/             # AI Logic
│   │       ├── tools/          # LangChain Tools (Retrievers)
│   │       └── graph.py        # LangGraph StateMachine
│   ├── tests/                  # Pytest folder (mirrors app structure)
│   ├── alembic/                # DB Migrations
│   ├── Dockerfile
│   └── requirements.txt
│
├── Docs/                       # Documentation (20+ files)
├── deploy.sh                   # Production Deployment Script
└── docker-compose.yml          # Local Dev Orchestration
```

## 2. File Naming Conventions
-   **React Components**: PascalCase (`ProductCard.tsx`).
-   **React Hooks**: camelCase (`useCart.ts`).
-   **Python Modules**: snake_case (`product_service.py`).
-   **Python Classes**: PascalCase (`ProductService`).
-   **Database Tables**: snake_case_plural (`order_items`).
