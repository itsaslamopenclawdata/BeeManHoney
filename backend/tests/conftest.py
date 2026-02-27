"""
Pytest configuration and shared fixtures for BeeManHoney backend tests.
"""
import asyncio
import os
import pytest
import pytest_asyncio
from typing import Generator, AsyncGenerator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy import TypeDecorator
from sqlalchemy.dialects.sqlite import VARCHAR

from app.main import app
from app.db.base import Base
from app.core.config import settings
from app.core import security


# Test database URL (in-memory SQLite for fast tests)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


# UUID type decorator for SQLite compatibility
class StringUUID(TypeDecorator):
    """Platform-independent UUID type for SQLite.

    Uses PostgreSQL UUID type when available, otherwise VARCHAR(32).
    """
    impl = VARCHAR(32)

    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            from sqlalchemy.dialects.postgresql import UUID
            return dialect.type_descriptor(UUID())
        else:
            return dialect.type_descriptor(VARCHAR(32))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return value
        else:
            return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            import uuid
            return uuid.UUID(value) if isinstance(value, str) else value


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def test_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Create a test database session.
    Uses in-memory SQLite for fast, isolated tests.
    """
    # Create async engine
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    # Replace UUID columns with StringUUID for SQLite compatibility
    from sqlalchemy.dialects.postgresql import UUID
    for table in Base.metadata.tables.values():
        for column in table.columns.values():
            if isinstance(column.type, UUID):
                column.type = StringUUID()

    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Create session
    async_session = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    session = async_session()

    # Override the get_db dependency
    from app.db import session as db_session
    original_get_db = db_session.get_db

    async def override_get_db():
        yield session

    app.dependency_overrides[db_session.get_db] = override_get_db

    yield session

    # Cleanup
    await session.close()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()

    # Restore original dependency
    app.dependency_overrides[db_session.get_db] = original_get_db


@pytest_asyncio.fixture(scope="function")
async def async_client(test_db: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """
    Create an async test client for the FastAPI app.
    """
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        yield client


@pytest_asyncio.fixture(scope="function")
async def test_user(test_db: AsyncSession) -> dict:
    """
    Create a test user in the database and return user data.
    """
    from app.models.all import User
    from sqlalchemy.future import select

    user = User(
        email="test@example.com",
        hashed_password=security.get_password_hash("testpassword123"),
        full_name="Test User",
        role="customer"
    )
    test_db.add(user)
    await test_db.commit()
    await test_db.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "password": "testpassword123",
        "full_name": user.full_name,
        "role": user.role
    }


@pytest_asyncio.fixture(scope="function")
async def test_admin(test_db: AsyncSession) -> dict:
    """
    Create a test admin user in the database and return admin data.
    """
    from app.models.all import User

    admin = User(
        email="admin@test.com",
        hashed_password=security.get_password_hash("adminpassword123"),
        full_name="Test Admin",
        role="admin"
    )
    test_db.add(admin)
    await test_db.commit()
    await test_db.refresh(admin)

    return {
        "id": admin.id,
        "email": admin.email,
        "password": "adminpassword123",
        "full_name": admin.full_name,
        "role": admin.role
    }


@pytest_asyncio.fixture(scope="function")
async def auth_headers(async_client: AsyncClient, test_user: dict) -> dict:
    """
    Get authentication headers for a test user.
    """
    response = await async_client.post(
        "/api/v1/auth/token",
        data={
            "username": test_user["email"],
            "password": test_user["password"]
        }
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture(scope="function")
async def admin_headers(async_client: AsyncClient, test_admin: dict) -> dict:
    """
    Get authentication headers for an admin user.
    """
    response = await async_client.post(
        "/api/v1/auth/token",
        data={
            "username": test_admin["email"],
            "password": test_admin["password"]
        }
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture(scope="function")
async def test_product(test_db: AsyncSession) -> dict:
    """
    Create a test product in the database.
    """
    from app.models.all import Product

    product = Product(
        name="Test Honey",
        description="A delicious test honey",
        price=19.99,
        category="Standard",
        stock_quantity=100,
        image_url="https://example.com/test_honey.png"
    )
    test_db.add(product)
    await test_db.commit()
    await test_db.refresh(product)

    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "category": product.category,
        "stock_quantity": product.stock_quantity,
        "image_url": product.image_url
    }


# Pytest configuration
def pytest_configure(config):
    """Configure pytest with custom markers."""
    config.addinivalue_line("markers", "auth: tests for authentication endpoints")
    config.addinivalue_line("markers", "products: tests for product endpoints")
    config.addinivalue_line("markers", "orders: tests for order endpoints")
    config.addinivalue_line("markers", "analytics: tests for analytics endpoints")
    config.addinivalue_line("markers", "integration: integration tests")
