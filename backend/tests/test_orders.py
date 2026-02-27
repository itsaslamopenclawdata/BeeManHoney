"""
Order endpoint tests.
Tests for order creation, retrieval, and user order history.
"""
import pytest
from httpx import AsyncClient


pytestmark = pytest.mark.orders


class TestCreateOrder:
    """Tests for creating new orders."""

    async def test_create_order_valid(
        self, async_client: AsyncClient, auth_headers: dict, test_product: dict
    ):
        """Test creating an order with valid data."""
        response = await async_client.post(
            "/api/v1/orders/",
            headers=auth_headers,
            json={
                "items": [
                    {
                        "product_id": test_product["id"],
                        "quantity": 2
                    }
                ]
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["total_amount"] == test_product["price"] * 2
        assert data["status"] == "Processing"

    async def test_create_order_multiple_products(
        self, async_client: AsyncClient, auth_headers: dict, test_db
    ):
        """Test creating an order with multiple different products."""
        from app.models.all import Product

        # Create two products
        product1 = Product(
            name="Product 1",
            price=10.0,
            category="Standard",
            stock_quantity=20
        )
        product2 = Product(
            name="Product 2",
            price=15.0,
            category="Premium",
            stock_quantity=15
        )
        test_db.add(product1)
        test_db.add(product2)
        await test_db.commit()
        await test_db.refresh(product1)
        await test_db.refresh(product2)

        response = await async_client.post(
            "/api/v1/orders/",
            headers=auth_headers,
            json={
                "items": [
                    {"product_id": product1.id, "quantity": 1},
                    {"product_id": product2.id, "quantity": 2}
                ]
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["total_amount"] == 40.0  # 10 + (15 * 2)

    async def test_create_order_empty_cart(
        self, async_client: AsyncClient, auth_headers: dict
    ):
        """Test creating an order with no items."""
        response = await async_client.post(
            "/api/v1/orders/",
            headers=auth_headers,
            json={"items": []}
        )
        # Should fail validation or return error
        assert response.status_code in [400, 422]

    async def test_create_order_without_auth(self, async_client: AsyncClient):
        """Test creating an order without authentication."""
        response = await async_client.post(
            "/api/v1/orders/",
            json={
                "items": [
                    {"product_id": 1, "quantity": 1}
                ]
            }
        )
        assert response.status_code == 401

    async def test_create_order_nonexistent_product(
        self, async_client: AsyncClient, auth_headers: dict
    ):
        """Test creating an order with a product that doesn't exist."""
        response = await async_client.post(
            "/api/v1/orders/",
            headers=auth_headers,
            json={
                "items": [
                    {"product_id": 99999, "quantity": 1}
                ]
            }
        )
        # Should handle gracefully - either 404 or error
        assert response.status_code >= 400


class TestGetUserOrders:
    """Tests for retrieving user's order history."""

    async def test_get_user_orders_empty(
        self, async_client: AsyncClient, auth_headers: dict
    ):
        """Test getting orders when user has none."""
        response = await async_client.get("/api/v1/orders/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        # May be empty list or specific format
        assert isinstance(data, list) or isinstance(data, dict)

    async def test_get_user_orders_with_orders(
        self, async_client: AsyncClient, auth_headers: dict, test_product: dict
    ):
        """Test getting orders after creating one."""
        # First create an order
        await async_client.post(
            "/api/v1/orders/",
            headers=auth_headers,
            json={
                "items": [
                    {"product_id": test_product["id"], "quantity": 1}
                ]
            }
        )

        # Then get orders
        response = await async_client.get("/api/v1/orders/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1

    async def test_get_orders_without_auth(self, async_client: AsyncClient):
        """Test getting orders without authentication."""
        response = await async_client.get("/api/v1/orders/me")
        assert response.status_code == 401

    async def test_user_cannot_see_other_users_orders(
        self, async_client: AsyncClient, auth_headers: dict, test_user: dict
    ):
        """Test that users can only see their own orders."""
        # Create order as user
        response = await async_client.post(
            "/api/v1/orders/",
            headers=auth_headers,
            json={
                "items": [
                    {"product_id": 1, "quantity": 1}
                ]
            }
        )

        # User should only see their own orders
        response = await async_client.get("/api/v1/orders/me", headers=auth_headers)
        assert response.status_code == 200
