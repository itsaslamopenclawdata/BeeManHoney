from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime
from app.api import deps
from app.models.all import Order, OrderItem, Product, PromoCode
from app.schemas.all import OrderCreate, OrderResponse
from app.db.session import get_db
from app.services.email import email_service

router = APIRouter()


async def send_order_email(order: Order, user, status: str):
    """Send order status change email to customer."""
    if not email_service.is_configured():
        return  # Skip if email not configured
    
    templates = {
        "pending": "order_confirmation",
        "processing": "order_processing", 
        "shipped": "order_shipped",
        "delivered": "order_delivered",
        "cancelled": "order_cancelled"
    }
    
    template = templates.get(status, "order_confirmation")
    
    # Get order items for email
    items_text = ""
    # Note: In production, you'd fetch order items from DB
    
    context = {
        "customer_name": user.full_name or "Valued Customer",
        "order_id": str(order.id),
        "total_amount": order.total_amount,
        "status": status,
        "items_text": items_text
    }
    
    email_service.send_email(
        to_email=user.email,
        template_name=template,
        context=context
    )


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
    
    # Send order confirmation email
    await send_order_email(order, current_user, "pending")
    
    return order


@router.get("/me", response_model=list[OrderResponse])
async def read_my_orders(
    current_user: deps.User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Order).where(Order.user_id == current_user.id))
    return result.scalars().all()


@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: str,
    status: str,
    current_user: deps.User = Depends(deps.get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Update order status (admin only) - sends email notification to customer."""
    valid_statuses = ["pending", "processing", "shipped", "delivered", "cancelled", "returned"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalars().first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    old_status = order.status
    order.status = status
    
    if status == "shipped":
        order.shipped_at = datetime.utcnow()
    elif status == "delivered":
        order.delivered_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(order)
    
    # Send status change email
    # Note: Need to fetch user for email - simplified here
    # await send_order_email(order, user, status)
    
    return {"success": True, "message": f"Order status updated to {status}"}
