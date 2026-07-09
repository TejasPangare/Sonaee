from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..auth import get_current_admin
from ..database import get_db

router = APIRouter(prefix="/admin/event-categories", tags=["event-categories"])


def _normalize_event_category_payload(item: schemas.ContentItemCreate | schemas.ContentItemUpdate):
    payload = item.model_dump()
    payload["type"] = "event_category"
    return payload


@router.get("", response_model=list[schemas.ContentItem])
def list_event_categories(
    active_only: bool = False,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin),
):
    return crud.get_event_categories(db, active_only=active_only)


@router.post("", response_model=schemas.ContentItem)
def create_event_category(
    item: schemas.ContentItemCreate,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin),
):
    return crud.create_event_category(db, schemas.ContentItemCreate(**_normalize_event_category_payload(item)))


@router.put("/{item_id}", response_model=schemas.ContentItem)
def update_event_category(
    item_id: int,
    item: schemas.ContentItemUpdate,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin),
):
    updated = crud.update_event_category(
        db,
        item_id,
        schemas.ContentItemUpdate(**_normalize_event_category_payload(item)),
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Event category not found")
    return updated


@router.delete("/{item_id}")
def delete_event_category(
    item_id: int,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin),
):
    deleted = crud.delete_event_category(db, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Event category not found")
    return {"success": True}
