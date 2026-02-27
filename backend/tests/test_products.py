"""
Product endpoint tests.
Tests for product listing, creation, update, and deletion.
"""
import pytest
from httpx import AsyncClient


pytestmark = pytest.mark.products


class TestListProducts:
    """Tests for listing products."""

    async def test_list_all_products(self, async_client: AsyncClient, test_product: dict):
        """Test getting list of all products."""
        response = await async_client.get("/api/v1/products/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    async def test_list_empty_products(self, async_client: AsyncClient, test_db):
        """Test getting products when none exist."""
        # Clear any existing products
        from app.models.all import Product
        from sqlalchemy.future import select

        result = await test_db.execute(select(Product))
        for product in result.scalars().all():
            await test_db.delete(product)
        await test_db.commit()

        response = await async_client.get("/api/v1/products/")
        assert response.status_code == 200
        assert response.json() == []


class TestGetProduct:
    """Tests for getting a specific product."""

    async def test_get_existing_product(
        self, async_client: AsyncClient, test_product: dict
    ):
        """Test getting an existing product by ID."""
        response = await async_client.get(f"/api/v1/products/{test_product['id']}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == test_product["id"]
        assert data["name"] == test_product["name"]

    async def test_get_nonexistent_product(self, async_client: AsyncClient):
        """Test getting a product that doesn't exist."""
        response = await async_client.get("/api/v1/products/99999")
        assert response.status_code == 404


class TestCreateProduct:
    """Tests for creating new products (admin only)."""

    async def test_create_product_as_admin(
        self, async_client: AsyncClient, admin_headers: dict
    ):
        """Test creating a product as an admin."""
        response = await async_client.post(
            "/api/v1/products/",
            headers=admin_headers,
            json={
                "name": "Clover Honey",
                "description": "Sweet clover honey",
                "price": 14.99,
                "category": "Standard",
                "stock_quantity": 50
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Clover Honey"
        assert data["price"] == 14.99
        assert "id" in data

    async def test_create_product_as_regular_user(
        self, async_client: AsyncClient, auth_headers: dict
    ):
        """Test that regular users cannot create products."""
        response = await async_client.post(
            "/api/v1/products/",
            headers=auth_headers,
            json={
                "name": "Unauthorized Honey",
                "description": "Should not be created",
                "price": 9.99,
                "category": "Standard",
                "stock_quantity": 10
            }
        )
        assert response.status_code == 403

    async def test_create_product_without_auth(self, async_client: AsyncClient):
        """Test creating a product without authentication."""
        response = await async_client.post(
            "/api/v1/products/",
            json={
                "name": "Unauthorized Honey",
                "description": "Should not be created",
                "price": 9.99,
                "category": "Standard",
                "stock_quantity": 10
            }
        )
        assert response.status_code == 401

    async def test_create_product_invalid_data(
        self, async_client: AsyncClient, admin_headers: dict
    ):
        """Test creating a product with invalid data."""
        response = await async_client.post(
            "/api/v1/products/",
            headers=admin_headers,
            json={
                "name": "Invalid Honey",
                # Missing required price field
                "category": "Standard"
            }
        )
        assert response.status_code == 422


class TestUpdateProduct:
    """Tests for updating existing products (admin only)."""

    async def test_update_product_as_admin(
        self, async_client: AsyncClient, admin_headers: dict, test_product: dict
    ):
        """Test updating a product as an admin."""
        response = await async_client.put(
            f"/api/v1/products/{test_product['id']}",
            headers=admin_headers,
            json={
                "name": "Updated Test Honey",
                "price": 24.99,
                "stock_quantity": 75
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Test Honey"
        assert data["price"] == 24.99
        assert data["stock_quantity"] == 75

    async def test_update_product_as_regular_user(
        self, async_client: AsyncClient, auth_headers: dict, test_product: dict
    ):
        """Test that regular users cannot update products."""
        response = await async_client.put(
            f"/api/v1/products/{test_product['id']}",
            headers=auth_headers,
            json={
                "name": "Hacked Honey",
                "price": 0.01
            }
        )
        assert response.status_code == 403

    async def test_update_nonexistent_product(
        self, async_client: AsyncClient, admin_headers: dict
    ):
        """Test updating a product that doesn't exist."""
        response = await async_client.put(
            "/api/v1/products/99999",
            headers=admin_headers,
            json={
                "name": "Ghost Honey",
                "price": 19.99
            }
        )
        assert response.status_code == 404


class TestDeleteProduct:
    """Tests for deleting products (admin only)."""

    async def test_delete_product_as_admin(
        self, async_client: AsyncClient, admin_headers: dict, test_db
    ):
        """Test deleting a product as an admin."""
        from app.models.all import Product

        # Create a product to delete
        product = Product(
            name="To Be Deleted",
            description="This will be deleted",
            price=10.0,
            category="Standard",
            stock_quantity=5
        )
        test_db.add(product)
        await test_db.commit()
        await test_db.refresh(product)

        response = await async_client.delete(
            f"/api/v1/products/{product.id}",
            headers=admin_headers
        )
        assert response.status_code == 200

    async def test_delete_product_as_regular_user(
        self, async_client: AsyncClient, auth_headers: dict, test_product: dict
    ):
        """Test that regular users cannot delete products."""
        response = await async_client.delete(
            f"/api/v1/products/{test_product['id']}",
            headers=auth_headers
        )
        assert response.status_code == 403

    async def test_delete_nonexistent_product(
        self, async_client: AsyncClient, admin_headers: dict
    ):
        """Test deleting a product that doesn't exist."""
        response = await async_client.delete(
            "/api/v1/products/99999",
            headers=admin_headers
        )
        assert response.status_code == 404
