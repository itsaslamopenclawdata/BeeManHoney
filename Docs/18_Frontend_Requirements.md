# Frontend Requirements (Compatibility Matrix)

## 1. Core Runtime
-   **Node.js**: `v18.19.0` (LTS)
-   **NPM**: `v10.2.0`

## 2. Dependencies (`package.json`)
Strict version pegging to ensure stability.

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "axios": "^1.6.7",
    "lucide-react": "^0.344.0",
    "framer-motion": "^11.0.3",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "vite": "^5.1.0",
    "@vitejs/plugin-react": "^4.2.1",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.17",
    "typescript": "^5.2.2",
    "vitest": "^1.2.2"
  }
}
```

## 3. Conflict Resolution
-   **React 18 vs 19**: Stay on 18.2 until ecosystem stabilizes.
-   **ESLint**: Use `eslint-config-react-app` for best compatibility.
