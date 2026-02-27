from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..models.all import get_db, Address, User
from ..schemas.all import AddressCreate, AddressResponse
from ..dependencies import get_current_user

router = APIRouter()

@router.get("/addresses", response_model=List[AddressResponse])
def get_addresses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all saved addresses for the current user"""
    return db.query(Address).filter(Address.user_id == current_user.id).all()

@router.post("/addresses", response_model=AddressResponse, status_code=status.HTTP_201_CREATED)
def create_address(
    address: AddressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a new shipping address"""
    # If this is set as default, unset other defaults
    if address.is_default:
        db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})
    
    db_address = Address(**address.dict(), user_id=current_user.id)
    db.add(db_address)
    db.commit()
    db.refresh(db_address)
    return db_address

@router.put("/addresses/{address_id}", response_model=AddressResponse)
def update_address(
    address_id: int,
    address: AddressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an existing address"""
    db_address = db.query(Address).filter(
        Address.id == address_id,
        Address.user_id == current_user.id
    ).first()
    
    if not db_address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    # If this is set as default, unset other defaults
    if address.is_default:
        db.query(Address).filter(
            Address.user_id == current_user.id,
            Address.id != address_id
        ).update({"is_default": False})
    
    for key, value in address.dict().items():
        setattr(db_address, key, value)
    
    db.commit()
    db.refresh(db_address)
    return db_address

@router.delete("/addresses/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_address(
    address_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an address"""
    db_address = db.query(Address).filter(
        Address.id == address_id,
        Address.user_id == current_user.id
    ).first()
    
    if not db_address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    db.delete(db_address)
    db.commit()
    return None
