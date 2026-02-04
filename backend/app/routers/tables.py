from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from .. import crud, schemas
from ..auth import get_current_admin

router = APIRouter(prefix="/tables", tags=["tables"])


@router.get("/", response_model=List[schemas.Table])
def list_tables(
    skip: int = 0,
    limit: int = 100,
    status: Optional[schemas.TableStatus] = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all tables"""
    return crud.get_tables(db, skip=skip, limit=limit, status=status, active_only=active_only)


@router.get("/available", response_model=List[schemas.Table])
def list_available_tables(db: Session = Depends(get_db)):
    """Get available tables for dine-in orders (public endpoint)"""
    return crud.get_tables(db, status=schemas.TableStatus.AVAILABLE, active_only=True)


@router.get("/{table_id}", response_model=schemas.Table)
def get_table(table_id: int, db: Session = Depends(get_db)):
    """Get a specific table"""
    table = crud.get_table(db, table_id)
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    return table


@router.post("/", response_model=schemas.Table)
def create_table(
    table: schemas.TableCreate,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin)
):
    """Create a new table (admin only)"""
    return crud.create_table(db, table)


@router.put("/{table_id}", response_model=schemas.Table)
def update_table(
    table_id: int,
    table: schemas.TableUpdate,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin)
):
    """Update a table (admin only)"""
    db_table = crud.update_table(db, table_id, table)
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    return db_table


@router.delete("/{table_id}")
def delete_table(
    table_id: int,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin)
):
    """Delete a table (admin only)"""
    if not crud.delete_table(db, table_id):
        raise HTTPException(status_code=404, detail="Table not found")
    return {"message": "Table deleted successfully"}


@router.patch("/{table_id}/status")
def update_table_status(
    table_id: int,
    status: schemas.TableStatus,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin)
):
    """Update table status (admin only)"""
    update = schemas.TableUpdate(status=status)
    db_table = crud.update_table(db, table_id, update)
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    return {"message": f"Table status updated to {status}"}
