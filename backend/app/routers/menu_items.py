from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from .. import crud, schemas
from ..auth import get_current_admin

router = APIRouter(prefix="/menu-items", tags=["menu-items"])


@router.get("/", response_model=List[schemas.MenuItemWithCategory])
def list_menu_items(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    available_only: bool = True,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all menu items (public endpoint)"""
    return crud.get_menu_items(
        db,
        skip=skip,
        limit=limit,
        category_id=category_id,
        available_only=available_only,
        search=search
    )


@router.get("/{item_id}", response_model=schemas.MenuItemWithCategory)
def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    """Get a specific menu item"""
    item = crud.get_menu_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item


@router.post("/", response_model=schemas.MenuItem)
def create_menu_item(
    item: schemas.MenuItemCreate,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin)
):
    """Create a new menu item (admin only)"""
    # Verify category exists
    category = crud.get_category(db, item.category_id)
    if not category:
        raise HTTPException(status_code=400, detail="Invalid category ID")
    return crud.create_menu_item(db, item)


@router.put("/{item_id}", response_model=schemas.MenuItem)
def update_menu_item(
    item_id: int,
    item: schemas.MenuItemUpdate,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin)
):
    """Update a menu item (admin only)"""
    # Verify category exists if being updated
    if item.category_id:
        category = crud.get_category(db, item.category_id)
        if not category:
            raise HTTPException(status_code=400, detail="Invalid category ID")
    
    db_item = crud.update_menu_item(db, item_id, item)
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return db_item


@router.delete("/{item_id}")
def delete_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin)
):
    """Delete a menu item (admin only)"""
    if not crud.delete_menu_item(db, item_id):
        raise HTTPException(status_code=404, detail="Menu item not found")
    return {"message": "Menu item deleted successfully"}


@router.patch("/{item_id}/availability")
def toggle_availability(
    item_id: int,
    is_available: bool,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin)
):
    """Toggle menu item availability (admin only)"""
    update = schemas.MenuItemUpdate(is_available=is_available)
    db_item = crud.update_menu_item(db, item_id, update)
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return {"message": f"Menu item availability set to {is_available}"}
