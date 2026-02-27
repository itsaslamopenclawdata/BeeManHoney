from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
import uuid

# --- Users ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: uuid.UUID
    role: str
    created_at: datetime
    class Config:
        from_attributes = True

# --- Products ---
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: Optional[str] = None
    stock_quantity: int = 0
    image_url: Optional[str] = None
    is_featured: bool = False
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    class Config:
        from_attributes = True

# --- Addresses ---
class AddressBase(BaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    pincode: str
    is_default: bool = False

class AddressCreate(AddressBase):
    pass

class AddressResponse(AddressBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    class Config:
        from_attributes = True

# --- Orders ---
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: Optional[str] = None
    billing_address: Optional[str] = None
    shipping_cost: Optional[float] = 0.0
    tax: Optional[float] = 0.0
    discount: Optional[float] = 0.0
    promo_code: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    quantity: int
    price_at_purchase: float
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    total_amount: float
    status: str
    created_at: datetime
    shipping_address: Optional[str] = None
    billing_address: Optional[str] = None
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    return_reason: Optional[str] = None
    shipping_cost: float = 0.0
    tax: float = 0.0
    discount: float = 0.0
    items: List[OrderItemResponse] = []
    class Config:
        from_attributes = True

# --- Shipping ---
class ShippingBase(BaseModel):
    carrier: Optional[str] = None
    tracking_number: Optional[str] = None

class ShippingCreate(ShippingBase):
    order_id: uuid.UUID

class ShippingResponse(ShippingBase):
    id: uuid.UUID
    order_id: uuid.UUID
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    created_at: datetime
    class Config:
        from_attributes = True

# --- Returns ---
class ReturnCreate(BaseModel):
    order_id: uuid.UUID
    reason: str

class ReturnResponse(BaseModel):
    id: uuid.UUID
    order_id: uuid.UUID
    reason: str
    status: str
    requested_at: datetime
    processed_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# --- Promo Codes ---
class PromoCodeBase(BaseModel):
    code: str
    discount_percent: float = 0.0
    discount_amount: float = 0.0
    min_order_value: float = 0.0
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    max_uses: int = 0
    is_active: bool = True

class PromoCodeCreate(PromoCodeBase):
    pass

class PromoCodeResponse(PromoCodeBase):
    id: uuid.UUID
    current_uses: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Wishlist ---
class WishlistCreate(BaseModel):
    product_id: int

class WishlistResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    product_id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Reviews ---
class ReviewBase(BaseModel):
    product_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    class Config:
        from_attributes = True

# --- Auth ---
class Token(BaseModel):
    access_token: str
    token_type: str
