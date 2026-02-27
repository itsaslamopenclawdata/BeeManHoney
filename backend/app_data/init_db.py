import asyncio
import logging
from app.db.session import engine
from app.db.base import Base
from app.models.all import User, Product, Order, OrderItem
from app.db.session import AsyncSessionLocal
from app.core import security
from sqlalchemy.future import select

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

INITIAL_PRODUCTS = [
    {
        "name": "Manuka Honey UMF 15+",
        "description": "Premium New Zealand Manuka Honey with UMF 15+ certification. Rich, earthy flavor.",
        "price": 45.99,
        "category": "Premium",
        "stock_quantity": 50,
        "image_url": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop"
    },
    {
        "name": "Wildflower Honey",
        "description": "Pure polyfloral honey gathered from pristine wildflower meadows. Light and floral.",
        "price": 12.99,
        "category": "Standard",
        "stock_quantity": 200,
        "image_url": "https://images.unsplash.com/photo-1621252179027-94459d27d3ee?w=400&h=400&fit=crop"
    },
    {
        "name": "Acacia Honey",
        "description": "Clear, light honey that stays liquid longer. Mild vanilla notes.",
        "price": 18.50,
        "category": "Standard",
        "stock_quantity": 100,
        "image_url": "https://images.unsplash.com/photo-1587049352850-919b8f2290f4?w=400&h=400&fit=crop"
    },
    {
        "name": "Buckwheat Honey",
        "description": "Dark, molasses-like honey rich in antioxidants. Robust flavor.",
        "price": 15.00,
        "category": "Dark",
        "stock_quantity": 80,
        "image_url": "https://images.unsplash.com/photo-1615486511484-92e172cc416d?w=400&h=400&fit=crop"
    }
]

async def create_tables():
    """Create all database tables"""
    async with engine.begin() as conn:
        logger.info("Creating database tables...")
        await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully!")

async def seed_database():
    """Seed database with initial data"""
    async with AsyncSessionLocal() as db:
        logger.info("Seeding database with initial data...")

        # 1. Create Admin User
        result = await db.execute(select(User).where(User.email == "admin@beemanhoney.com"))
        if not result.scalars().first():
            admin = User(
                email="admin@beemanhoney.com",
                hashed_password=security.get_password_hash("BeeManHoney@Admin2024!Secure"),
                full_name="Super Admin",
                role="admin"
            )
            db.add(admin)
            logger.info("✓ Admin user created")

        # 2. Create Test User
        result = await db.execute(select(User).where(User.email == "test@example.com"))
        if not result.scalars().first():
            test_user = User(
                email="test@example.com",
                hashed_password=security.get_password_hash("Test12345!"),
                full_name="Test User",
                role="customer"
            )
            db.add(test_user)
            logger.info("✓ Test user created")

        # 3. Create Products
        for prod_data in INITIAL_PRODUCTS:
            result = await db.execute(select(Product).where(Product.name == prod_data["name"]))
            if not result.scalars().first():
                product = Product(**prod_data)
                db.add(product)
                logger.info(f"✓ Product created: {product.name}")

        await db.commit()
        logger.info("Database seeding completed!")

async def init_db():
    """Initialize database - create tables and seed data"""
    await create_tables()
    await seed_database()

if __name__ == "__main__":
    asyncio.run(init_db())
