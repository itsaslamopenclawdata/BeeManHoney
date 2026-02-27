from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from app.api import deps
from app.models.all import Order, User, Product
from app.db.session import get_db

router = APIRouter()

@router.get("/stats")
async def get_admin_stats(
    db: AsyncSession = Depends(get_db),
    admin: deps.User = Depends(deps.get_current_admin)
):
    # Total Sales
    sales_query = select(func.sum(Order.total_amount))
    sales_result = await db.execute(sales_query)
    total_sales = sales_result.scalar() or 0.0

    # User Count
    user_query = select(func.count(User.id))
    user_result = await db.execute(user_query)
    total_users = user_result.scalar() or 0

    # Low Stock Products
    stock_query = select(Product).where(Product.stock_quantity < 10).limit(5)
    stock_result = await db.execute(stock_query)
    low_stock = stock_result.scalars().all()

    return {
        "total_sales": total_sales,
        "total_users": total_users,
        "low_stock_products": [p.name for p in low_stock]
    }
