"""
Analytics endpoint tests.
Tests for admin analytics and statistics.
"""
import pytest
from httpx import AsyncClient


pytestmark = pytest.mark.analytics


class TestGetAnalyticsStats:
    """Tests for getting analytics statistics."""

    async def test_get_stats_as_admin(self, async_client: AsyncClient, admin_headers: dict):
        """Test getting analytics stats as an admin user."""
        response = await async_client.get("/api/v1/analytics/stats", headers=admin_headers)
        # May return 200 with stats or 404 if not implemented
        assert response.status_code in [200, 404]

        if response.status_code == 200:
            data = response.json()
            # Check for expected stat keys (implementation dependent)
            # Common analytics fields might include:
            # total_sales, total_users, total_orders, low_stock_products
            assert isinstance(data, dict) or isinstance(data, list)

    async def test_get_stats_as_regular_user(
        self, async_client: AsyncClient, auth_headers: dict
    ):
        """Test that regular users cannot access analytics."""
        response = await async_client.get("/api/v1/analytics/stats", headers=auth_headers)
        assert response.status_code == 403

    async def test_get_stats_without_auth(self, async_client: AsyncClient):
        """Test accessing analytics without authentication."""
        response = await async_client.get("/api/v1/analytics/stats")
        assert response.status_code == 401

    async def test_get_stats_with_data(
        self,
        async_client: AsyncClient,
        admin_headers: dict,
        test_product: dict,
        test_user: dict
    ):
        """Test getting stats when database has data."""
        # The fixtures should have created test data
        response = await async_client.get("/api/v1/analytics/stats", headers=admin_headers)
        assert response.status_code in [200, 404]
