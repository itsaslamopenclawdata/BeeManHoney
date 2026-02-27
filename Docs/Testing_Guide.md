# BeeManHoney Testing Guide

This guide covers how to set up and run tests for both the backend (FastAPI) and frontend (React) components of the BeeManHoney application.

## Latest Test Results (2026-01-06)

### Backend Tests (pytest) - ✅ 38/41 PASSED (92.7%)

**Summary:**
- **Total Tests**: 41
- **Passed**: 38
- **Failed**: 3
- **Test Execution Time**: 23.49s

**Test Files:**
| Test File | Status | Details |
|-----------|--------|---------|
| `test_analytics.py` | ✅ 4/4 PASSED | Admin analytics endpoints |
| `test_auth.py` | ✅ 14/14 PASSED | User registration, login, token validation |
| `test_orders.py` | ✅ 8/9 PASSED | Order creation and retrieval |
| `test_products.py` | ✅ 12/14 PASSED | Product CRUD operations |

**Failed Tests:**
1. `test_create_order_empty_cart` - API accepts empty cart (returns 200 instead of 400/422)
2. `test_get_existing_product` - Endpoint returns 405 (Method Not Allowed)
3. `test_get_nonexistent_product` - Endpoint returns 405 (Method Not Allowed)

**Issues Found:**
- Missing `GET /products/{id}` endpoint in Products API
- Empty cart validation not implemented

### Frontend Tests (vitest) - ✅ 20/20 PASSED (100%)

**Summary:**
- **Total Tests**: 20
- **Passed**: 20
- **Failed**: 0
- **Test Execution Time**: 7.08s

**Test Files:**
| Test File | Status | Details |
|-----------|--------|---------|
| `Header.test.tsx` | ✅ 8/8 PASSED | Header component rendering and navigation |
| `Login.test.tsx` | ✅ 12/12 PASSED | Login page form interaction and validation |

**All tests passing!** Test fixes applied:
1. Fixed nested Router issue in Header tests
2. Fixed button selector issues in Login tests (multiple "Login" buttons)

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Testing](#backend-testing)
3. [Frontend Testing](#frontend-testing)
4. [Integration Testing](#integration-testing)
5. [Continuous Integration](#continuous-integration)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Python**: 3.11+
- **Node.js**: 18+
- **Docker**: Latest version (for integration tests)
- **Git**: Latest version

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd BeeManHoney

# Backend setup
cd backend
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

---

## Backend Testing

### Running Backend Tests

```bash
# Navigate to backend directory
cd backend

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_auth.py

# Run with coverage report
pytest --cov=app --cov-report=html

# Run tests matching a pattern
pytest -k "test_login"
```

### Backend Test Structure

```
backend/tests/
├── conftest.py              # Shared fixtures
├── test_auth.py             # Authentication tests
├── test_products.py         # Product CRUD tests
├── test_orders.py           # Order processing tests
└── test_analytics.py        # Analytics tests
```

### Backend Fixtures

The `conftest.py` file provides these fixtures:

| Fixture | Description |
|---------|-------------|
| `test_db` | In-memory SQLite database for isolated tests |
| `async_client` | HTTPX async client for testing API endpoints |
| `test_user` | Creates a test customer user |
| `test_admin` | Creates a test admin user |
| `auth_headers` | Authentication headers for regular user |
| `admin_headers` | Authentication headers for admin |
| `test_product` | Creates a test product |

### Writing Backend Tests

```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_example(async_client: AsyncClient, auth_headers: dict):
    """Test example with authenticated client."""
    response = await async_client.get(
        "/api/v1/orders/me",
        headers=auth_headers
    )
    assert response.status_code == 200
```

### Backend Test Coverage

Current test coverage targets:

| Module | Coverage Target |
|--------|----------------|
| Authentication (/api/v1/auth) | 100% |
| Products (/api/v1/products) | 90%+ |
| Orders (/api/v1/orders) | 90%+ |
| Analytics (/api/v1/analytics) | 80%+ |

---

## Frontend Testing

### Running Frontend Tests

```bash
# Navigate to frontend directory
cd frontend

# Run all tests
npm test

# Run with UI mode
npm run test:ui

# Run with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

### Frontend Test Structure

```
frontend/
├── setupTests.ts           # Test configuration
├── components/
│   └── Header.test.tsx     # Component tests
└── pages/
    └── Login.test.tsx      # Page tests
```

### Writing Frontend Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />, { wrapper: BrowserRouter });
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Frontend Test Utilities

- **`render`**: Renders a React component
- **`screen`**: Queries the rendered component
- **`fireEvent`**: Simulates user events
- **`waitFor`**: Waits for async updates
- **`userEvent`**: More realistic user interactions

---

## Integration Testing

### Docker Compose Testing

```bash
# Start all services
docker-compose up -d

# Check service health
docker-compose ps
curl http://localhost:8000/health
curl http://localhost:3000

# Run database migrations
docker-compose exec api alembic upgrade head

# Seed initial data
docker-compose exec api python -m app_data.seed

# Run backend tests in container
docker-compose exec api pytest

# Run frontend tests in container
docker-compose exec frontend npm test

# View logs
docker-compose logs -f api
docker-compose logs -f frontend

# Stop services
docker-compose down
```

### Manual API Testing

```bash
# Register a new user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=password123"

# Get products (with token)
curl http://localhost:8000/api/v1/products/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest --cov=app

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      - name: Run tests
        run: |
          cd frontend
          npm test
```

---

## Testing Setup Fixes Applied

During the initial test setup, the following issues were identified and resolved:

### Backend Fixes

1. **`__init__.py` File Issue**
   - **Problem**: `app/api/v1/__init__.py` was a directory instead of a file
   - **Solution**: Removed the directory and created a proper `__init__.py` file
   - **Command**: `cd backend/app/api/v1 && rm -rf __init__.py && echo "# V1 API module" > __init__.py`

2. **UUID Type Compatibility**
   - **Problem**: SQLite doesn't support PostgreSQL's UUID type natively
   - **Solution**: Created a `StringUUID` type decorator in `conftest.py` to handle UUID columns in SQLite
   - **Impact**: All 41 backend tests can now run with in-memory SQLite

3. **pytest-asyncio Configuration**
   - **Problem**: Async tests were being skipped
   - **Solution**: Created `pytest.ini` with `asyncio_mode = auto` setting
   - **Result**: All async tests now execute properly

### Frontend Fixes

1. **Header.test.tsx - Nested Router Issue**
   - **Problem**: Test was creating a BrowserRouter inside another BrowserRouter
   - **Solution**: Removed duplicate BrowserRouter wrapper in "highlights active route" test
   - **File**: `frontend/components/Header.test.tsx`
   - **Change**: Used `renderWithRouter(<Header />)` instead of manually wrapping in BrowserRouter

2. **Login.test.tsx - Multiple Button Selector Issue**
   - **Problem**: Multiple buttons with "Login" text caused ambiguous selector errors
   - **Solution**: Changed from `getByRole('button', { name: /login/i })` to finding specific button by text content
   - **File**: `frontend/pages/Login.test.tsx`
   - **Change**:
     ```typescript
     // Before
     const loginButton = screen.getByRole('button', { name: /login/i });
     // After
     const buttons = screen.getAllByRole('button');
     const loginButton = buttons.find(btn => btn.textContent === 'Login');
     ```

3. **Login.test.tsx - QR Close Button Selector**
   - **Problem**: Test couldn't find the correct close button in QR mode
   - **Solution**: Used specific CSS class `hover:bg-gray-100` to identify the X button
   - **File**: `frontend/pages/Login.test.tsx`
   - **Change**:
     ```typescript
     const closeButton = screen.getAllByRole('button').find(
       btn => btn.classList.contains('hover:bg-gray-100')
     );
     ```

### Security Fixes

1. **JWT Secret Configuration**
   - **File**: `backend/app/core/config.py`
   - **Change**: Removed hardcoded JWT secret, now required from environment variable
   - **Impact**: Production deployments will have secure JWT secrets

2. **Admin Password Update**
   - **File**: `backend/app_data/seed.py`
   - **Change**: Updated default admin password from `Admin123!` to `BeeManHoney@Admin2024!Secure`
   - **Impact**: Stronger default password for admin account

### Environment Configuration

1. **Created `.env` files** for both frontend and backend
2. **Created `.gitignore** to exclude sensitive files
3. **Added OpenAI API key** to backend environment (user-provided)

---

## Troubleshooting

### Backend Issues

**Issue: Tests fail with "ImportError"**
```bash
# Solution: Install dependencies
pip install -r requirements.txt
```

**Issue: Database connection errors**
```bash
# Solution: Tests use in-memory SQLite, no database needed
# If using real database, check DATABASE_URL in .env
```

**Issue: Async tests not running**
```bash
# Solution: Install pytest-asyncio
pip install pytest-asyncio==0.21.1
```

### Frontend Issues

**Issue: Vitest can't find modules**
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: Test environment issues**
```bash
# Solution: Check setupTests.ts is properly configured
# Ensure vitest.config.ts has correct setupFiles path
```

**Issue: React Router issues in tests**
```bash
# Solution: Always wrap components in BrowserRouter
render(<Component />, { wrapper: BrowserRouter })
```

### Docker Issues

**Issue: Container exits immediately**
```bash
# Solution: Check logs
docker-compose logs api
docker-compose logs db

# Verify environment variables are set
docker-compose exec api env
```

**Issue: Port conflicts**
```bash
# Solution: Change ports in docker-compose.yml
# Or stop conflicting services
netstat -ano | findstr :8000
```

---

## Test Checklist

Before committing code, ensure:

- [ ] All backend tests pass: `pytest`
- [ ] All frontend tests pass: `npm test`
- [ ] New tests added for new features
- [ ] Test coverage not decreased
- [ ] No console errors in browser
- [ ] Integration tests pass with Docker

---

## Resources

- **Pytest Documentation**: https://docs.pytest.org/
- **Vitest Documentation**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/
- **FastAPI Testing**: https://fastapi.tiangolo.com/tutorial/testing/
