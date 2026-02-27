from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.api import deps
from app.models.all import Order, OrderItem, Product, PromoCode
from app.schemas.all import OrderCreate, OrderResponse
from app.db.session import get_db

router = APIRouter()

@router.post("/", response_model=OrderResponse)
async def create_order(
    order_in: OrderCreate,
    current_user: deps.User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Validate cart is not empty
    if not order_in.items or len(order_in.items) == 0:
        raise HTTPException(status_code=400, detail="Cart cannot be empty")

    # Calculate subtotal
    subtotal = 0.0
    db_items = []
    
    # Calculate Total and Verify Stock
    for item in order_in.items:
        result = await db.execute(select(Product).where(Product.id == item.product_id))
        product = result.scalars().first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock_quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for {product.name}")
        
        # Deduct Stock
        product.stock_quantity -= item.quantity
        
        # Calculate Price
        cost = product.price * item.quantity
        subtotal += cost
        
        # Create Order Item
        db_items.append(OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_purchase=product.price
        ))
    
    # Apply promo code if provided
    discount = 0.0
    if order_in.promo_code:
        result = await db.execute(
            select(PromoCode).where(
                PromoCode.code == order_in.promo_code,
                PromoCode.is_active == True
            )
        )
        promo = result.scalars().first()
        if not promo:
            raise HTTPException(status_code=400, detail="Invalid promo code")
        
        # Check validity
        now = datetime.utcnow()
        if promo.valid_from and promo.valid_from > now:
            raise HTTPException(status_code=400, detail="Promo code not yet valid")
        if promo.valid_until and promo.valid_until < now:
            raise HTTPException(status_code=400, detail="Promo code expired")
        if promo.max_uses > 0 and promo.current_uses >= promo.max_uses:
            raise HTTPException(status_code=400, detail="Promo code usage limit reached")
        if subtotal < promo.min_order_value:
            raise HTTPException(
                status_code=400, 
                detail=f"Minimum order value of {promo.min_order_value} required"
            )
        
        # Calculate discount
        if promo.discount_percent > 0:
            discount = subtotal * (promo.discount_percent / 100)
        elif promo.discount_amount > 0:
            discount = promo.discount_amount
        
        # Update promo code usage
        promo.current_uses += 1
    
    # Calculate totals
    tax = order_in.tax or 0.0
    shipping_cost = order_in.shipping_cost or 0.0
    total_amount = subtotal + tax + shipping_cost - discount
    
    # Create Order
    order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        status="pending",
        shipping_address=order_in.shipping_address,
        billing_address=order_in.billing_address,
        shipping_cost=shipping_cost,
        tax=tax,
        discount=discount
    )
    db.add(order)
    await db.flush() # Get Order ID
    
    for db_item in db_items:
        db_item.order_id = order.id
        db.add(db_item)
        
    await db.commit()
    await db.refresh(order)
    return order

@router.get("/me", response_model=list[OrderResponse])
async def read_my_orders(
    current_user: deps.User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Order).where(Order.user_id == current_user.id))
    return result.scalars().all()

from datetime import datetime
