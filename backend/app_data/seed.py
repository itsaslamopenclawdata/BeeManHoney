import asyncio
import logging
from app.db.session import AsyncSessionLocal
from app.models.all import Product, User
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
        "image_url": "https://example.com/manuka.png"
    },
    {
        "name": "Wildflower Honey",
        "description": "Pure polyfloral honey gathered from pristine wildflower meadows. Light and floral.",
        "price": 12.99,
        "category": "Standard",
        "stock_quantity": 200,
        "image_url": "https://example.com/wildflower.png"
    },
    {
        "name": "Acacia Honey",
        "description": "Clear, light honey that stays liquid longer. Mild vanilla notes.",
        "price": 18.50,
        "category": "Standard",
        "stock_quantity": 100,
        "image_url": "https://example.com/acacia.png"
    },
    {
        "name": "Buckwheat Honey",
        "description": "Dark, molasses-like honey rich in antioxidants. Robust flavor.",
        "price": 15.00,
        "category": "Dark",
        "stock_quantity": 80,
        "image_url": "https://example.com/buckwheat.png"
    }
]

async def init_db():
    async with AsyncSessionLocal() as db:
        logger.info("Creating Initial Data")
        
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
            logger.info("Admin User Created")

        # 2. Create Products
        for prod_data in INITIAL_PRODUCTS:
            result = await db.execute(select(Product).where(Product.name == prod_data["name"]))
            if not result.scalars().first():
                product = Product(**prod_data)
                db.add(product)
                logger.info(f"Product Created: {product.name}")
        
        await db.commit()

if __name__ == "__main__":
    asyncio.run(init_db())
