from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from app.api import deps
from app.schemas.all import ProductCreate, ProductResponse
from app.models.all import Product
from app.db.session import get_db

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
async def read_products(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Product)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{product_id}", response_model=ProductResponse)
async def read_product(
    product_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductResponse)
async def create_product(
    product_in: ProductCreate, 
    db: AsyncSession = Depends(get_db),
    admin: deps.User = Depends(deps.get_current_admin)
):
    product = Product(**product_in.dict())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_in: ProductCreate,
    db: AsyncSession = Depends(get_db),
    admin: deps.User = Depends(deps.get_current_admin)
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for field, value in product_in.dict(exclude_unset=True).items():
        setattr(product, field, value)
    
    await db.commit()
    await db.refresh(product)
    return product

@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    admin: deps.User = Depends(deps.get_current_admin)
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    await db.delete(product)
    await db.commit()
    return {"status": "success"}
