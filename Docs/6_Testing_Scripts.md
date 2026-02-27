# Testing Scripts & Strategy

## 1. Testing Philosophy (The "Vibe" Standard)
-   **Zero Regressions**: Every bug found adds a new test case.
-   **Endpoint Exhaustion**: Every API endpoint must have Positive, Negative, and Boundary tests.
-   **Mock external, Test internal**: Mock OpenAI and Email services; test DB and Redis logic for real.

## 2. Backend Endpoint Test Scripts (Pytest)

These scripts utilize `pytest-asyncio` and `httpx`.

### 2.1. Authentication Tests (`tests/test_auth.py`)
**Target**: `/auth/token`, `/auth/register`

```python
import pytest
from httpx import AsyncClient

# --- Positive Tests ---
@pytest.mark.asyncio
async def test_register_and_login_flow(async_client):
    # 1. Register
    payload = {"email": "test@vibe.com", "password": "StrongPassword1!", "full_name": "Tester"}
    resp = await async_client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 201
    assert "access_token" in resp.json()

    # 2. Login
    login_data = {"username": "test@vibe.com", "password": "StrongPassword1!"}
    resp = await async_client.post("/api/v1/auth/token", data=login_data)
    assert resp.status_code == 200
    assert resp.json()["token_type"] == "bearer"

# --- Negative Tests ---
@pytest.mark.asyncio
async def test_login_invalid_credentials(async_client):
    login_data = {"username": "wrong@vibe.com", "password": "wrongpassword"}
    resp = await async_client.post("/api/v1/auth/token", data=login_data)
    assert resp.status_code == 401

@pytest.mark.asyncio
async def test_register_duplicate_email(async_client, create_test_user):
    # create_test_user fixture already registered 'test@vibe.com'
    payload = {"email": "test@vibe.com", "password": "NewPassword1!", "full_name": "Dupe"}
    resp = await async_client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 400
```

### 2.2. Product Tests (`tests/test_products.py`)
**Target**: `/products`, `/products/{id}`

```python
@pytest.mark.asyncio
async def test_search_products(async_client):
    # Search for "Honey"
    resp = await async_client.get("/api/v1/products?q=Honey&limit=5")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) <= 5

@pytest.mark.asyncio
async def test_get_product_404(async_client):
    resp = await async_client.get("/api/v1/products/999999")
    assert resp.status_code == 404
```

### 2.3. AI Chat Tests (`tests/test_chat.py`)
**Target**: `/chat/stream`
**Critical**: Mocking the LangGraph execution.

```python
from unittest.mock import MagicMock

@pytest.mark.asyncio
async def test_chat_stream_flow(async_client, mocker, auth_header):
    # Mock the Agent Graph to return a generator
    mock_response_gen = iter(["Hello", " ", "World"])
    mocker.patch("app.agents.graph.stream_response", return_value=mock_response_gen)

    payload = {"message": "Hi", "thread_id": "uuid-123"}
    async with async_client.stream("POST", "/api/v1/chat/stream", json=payload, headers=auth_header) as response:
        assert response.status_code == 200
        # Check for SSE content
        async for line in response.aiter_lines():
             if line: assert line.startswith("data:")
```

### 2.4. Order Tests (`tests/test_orders.py`)
**Target**: `/orders/user/{id}`, `/cart/add`

```python
@pytest.mark.asyncio
async def test_access_other_user_orders_forbidden(async_client, auth_header, other_user_id):
    # Attempt to read another user's history
    resp = await async_client.get(f"/api/v1/orders/user/{other_user_id}", headers=auth_header)
    assert resp.status_code == 403 # OR 404 depending on implementation security
```

## 3. Frontend Testing Scripts (Vitest)

### 3.1. Component Unit Tests
**File**: `src/__tests__/ProductCard.test.tsx`

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard';

test('renders product info and handles add to cart', () => {
    const product = { id: 1, name: 'Gold Honey', price: 500, ... };
    const onAdd = vi.fn();
    
    render(<ProductCard product={product} onAddToCart={onAdd} />);
    
    expect(screen.getByText('Gold Honey')).toBeInTheDocument();
    expect(screen.getByText('₹500')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(onAdd).toHaveBeenCalledWith(product);
});
```

### 3.2. Integration Test (Login Flow)
**File**: `src/__tests__/Login.test.tsx`

```tsx
test('submits valid credentials', async () => {
    render(<Login />);
    
    // Fill form
    await userEvent.type(screen.getByLabelText(/email/i), 'user@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    // Mock API
    server.use(
        http.post('/api/v1/auth/token', () => {
            return HttpResponse.json({ access_token: 'fake-jwt' })
        })
    );
    
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Check redirect or success message
    expect(window.location.pathname).toBe('/home');
});
```
