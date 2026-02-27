# Development Workflow

## 1. Branching Strategy (GitFlow)

1.  **`main`**: Protected. Production code only. Tags trigger deployment.
2.  **`develop`**: Protected. Staging integration.
3.  **`feature/ID-name`**: Short-lived branches. PRs merge to `develop`.
    -   Example: `feature/auth-login`, `feature/ai-recipe-agent`.
4.  **`hotfix/ID-name`**: Critical fixes. Branch from `main`, merge to `main` AND `develop`.

## 2. Workflow Steps

### Step 1: Feature Start
```bash
git checkout develop
git pull
git checkout -b feature/new-logo
```

### Step 2: Implementation & Local Test
-   **Frontend**: `npm run lint` & `npm run test`.
-   **Backend**: `pytest` & `black .`.

### Step 3: Pull Request (PR)
-   **Title**: `[FE] Add Logo to Header`
-   **Description**: Link to Jira/Task ID. Screenshots required for UI changes.
-   **Reviewers**: Min 1 approval required.

### Step 4: Merge & deploy
-   Auto-merge to `develop` on approval.
-   CI Pipeline builds Docker image (`:dev` tag).
-   Deploy to Staging server.

## 3. CI/CD Pipeline (GitHub Actions)

### `.github/workflows/ci.yml`
```yaml
name: CI
on: [push, pull_request]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with: { python-version: '3.11' }
      - run: pip install -r backend/requirements.txt
      - run: pytest backend/tests

  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Node.js
        uses: actions/setup-node@v3
        with: { node-version: '18' }
      - run: cd Frontend && npm ci && npm test
```
