from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..models.all import get_db, Wishlist, Product, User
from ..schemas.all import WishlistCreate, WishlistResponse
from ..dependencies import get_current_user

router = APIRouter()

@router.get("/wishlist", response_model=List[WishlistResponse])
def get_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all items in user's wishlist"""
    return db.query(Wishlist).filter(Wishlist.user_id == current_user.id).all()

@router.post("/wishlist", response_model=WishlistResponse, status_code=status.HTTP_201_CREATED)
def add_to_wishlist(
    item: WishlistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a product to wishlist"""
    # Check if already in wishlist
    existing = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.product_id == item.product_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Product already in wishlist")
    
    # Check if product exists
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db_item = Wishlist(user_id=current_user.id, product_id=item.product_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/wishlist/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_wishlist(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a product from wishlist"""
    db_item = db.query(Wishlist).filter(
        Wishlist.id == item_id,
        Wishlist.user_id == current_user.id
    ).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    
    db.delete(db_item)
    db.commit()
    return None
