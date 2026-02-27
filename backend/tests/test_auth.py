"""
Authentication endpoint tests.
Tests for user registration, login, and token validation.
"""
import pytest
from httpx import AsyncClient


pytestmark = pytest.mark.auth


class TestUserRegistration:
    """Tests for user registration endpoint."""

    async def test_register_valid_user(self, async_client: AsyncClient):
        """Test registering a new user with valid data."""
        response = await async_client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "SecurePassword123!",
                "full_name": "New User"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert data["full_name"] == "New User"
        assert "id" in data
        assert "hashed_password" not in data

    async def test_register_duplicate_email(self, async_client: AsyncClient, test_user: dict):
        """Test registering with an email that already exists."""
        response = await async_client.post(
            "/api/v1/auth/register",
            json={
                "email": test_user["email"],  # Already exists
                "password": "AnotherPassword123!",
                "full_name": "Another User"
            }
        )
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"].lower()

    async def test_register_invalid_email(self, async_client: AsyncClient):
        """Test registering with invalid email format."""
        response = await async_client.post(
            "/api/v1/auth/register",
            json={
                "email": "not-an-email",
                "password": "SecurePassword123!",
                "full_name": "Test User"
            }
        )
        assert response.status_code == 422  # Validation error

    async def test_register_weak_password(self, async_client: AsyncClient):
        """Test that registration accepts weak passwords (API doesn't enforce strength)."""
        # Note: Current API doesn't enforce password strength
        # This test documents current behavior
        response = await async_client.post(
            "/api/v1/auth/register",
            json={
                "email": "weak@example.com",
                "password": "123",
                "full_name": "Weak User"
            }
        )
        # API accepts weak passwords (should be improved)
        assert response.status_code == 200

    async def test_register_missing_fields(self, async_client: AsyncClient):
        """Test registration with missing required fields."""
        response = await async_client.post(
            "/api/v1/auth/register",
            json={
                "email": "test@example.com"
                # Missing password
            }
        )
        assert response.status_code == 422


class TestUserLogin:
    """Tests for user login endpoint."""

    async def test_login_valid_credentials(self, async_client: AsyncClient, test_user: dict):
        """Test login with valid email and password."""
        response = await async_client.post(
            "/api/v1/auth/token",
            data={
                "username": test_user["email"],
                "password": test_user["password"]
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    async def test_login_wrong_password(self, async_client: AsyncClient, test_user: dict):
        """Test login with incorrect password."""
        response = await async_client.post(
            "/api/v1/auth/token",
            data={
                "username": test_user["email"],
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()

    async def test_login_nonexistent_user(self, async_client: AsyncClient):
        """Test login with email that doesn't exist."""
        response = await async_client.post(
            "/api/v1/auth/token",
            data={
                "username": "nonexistent@example.com",
                "password": "somepassword"
            }
        )
        assert response.status_code == 401

    async def test_login_missing_fields(self, async_client: AsyncClient):
        """Test login without providing username/password."""
        response = await async_client.post(
            "/api/v1/auth/token",
            data={}
        )
        assert response.status_code == 422


class TestTokenValidation:
    """Tests for token validation on protected endpoints."""

    async def test_access_protected_without_token(self, async_client: AsyncClient):
        """Test accessing protected endpoint without authentication."""
        response = await async_client.get("/api/v1/orders/me")
        assert response.status_code == 401

    async def test_access_protected_with_valid_token(
        self, async_client: AsyncClient, auth_headers: dict
    ):
        """Test accessing protected endpoint with valid token."""
        response = await async_client.get("/api/v1/orders/me", headers=auth_headers)
        # May return 404 or empty list, but should not be 401
        assert response.status_code != 401

    async def test_access_protected_with_invalid_token(self, async_client: AsyncClient):
        """Test accessing protected endpoint with invalid token."""
        response = await async_client.get(
            "/api/v1/orders/me",
            headers={"Authorization": "Bearer invalid_token_here"}
        )
        assert response.status_code == 401

    async def test_access_admin_without_admin_role(
        self, async_client: AsyncClient, auth_headers: dict
    ):
        """Test accessing admin endpoint with regular user token."""
        response = await async_client.get("/api/v1/analytics/stats", headers=auth_headers)
        assert response.status_code == 403

    async def test_access_admin_with_admin_role(
        self, async_client: AsyncClient, admin_headers: dict
    ):
        """Test accessing admin endpoint with admin token."""
        response = await async_client.get("/api/v1/analytics/stats", headers=admin_headers)
        # Should return 200 or empty data, but not 401/403
        assert response.status_code in [200, 404]
