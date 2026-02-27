# Configuration Document (config.json)

This schema represents the runtime configuration injected via Environment Variables or a JSON file.

```json
{
  "app": {
    "name": "BeeManHoney AI",
    "env": "production",
    "debug": false,
    "version": "1.0.0"
  },
  "server": {
    "host": "0.0.0.0",
    "port": 8000,
    "cors_origins": ["https://beemanhoney.com"]
  },
  "db": {
    "host": "beemanhoney-db",
    "port": 5432,
    "pool_size": 20,
    "max_overflow": 10
  },
  "redis": {
    "host": "beemanhoney-redis",
    "port": 6379,
    "db": 0
  },
  "ai": {
    "openai_api_key": "sk-...",
    "supervisor_model": "gpt-4-turbo-preview",
    "worker_model": "gpt-3.5-turbo-0125",
    "embedding_model": "text-embedding-3-small",
    "temperature": 0.0
  },
  "auth": {
    "jwt_secret": "secure-random-string",
    "algorithm": "HS256",
    "expire_minutes": 60
  }
}
```

## Environment Variable Mapping
-   `DATABASE_URL` -> Overrides `db` config.
-   `OPENAI_API_KEY` -> Overrides `ai.openai_api_key`.
