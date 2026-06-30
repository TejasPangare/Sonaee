from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas
from ..auth import get_current_admin

router = APIRouter(tags=["content"])


@router.get("/content/site", response_model=schemas.SiteContentResponse)
def get_site_content(db: Session = Depends(get_db)):
    return schemas.SiteContentResponse(
        sections=crud.get_content_sections(db),
        items=crud.get_content_items(db, active_only=True),
    )


@router.get("/admin/content/sections", response_model=list[schemas.ContentSection])
def list_content_sections(
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin),
):
    return crud.get_content_sections(db)


@router.put("/admin/content/sections/{key}", response_model=schemas.ContentSection)
def save_content_section(
    key: str,
    section: schemas.ContentSectionUpsert,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin),
):
    return crud.upsert_content_section(db, key, section)


@router.get("/admin/content/items", response_model=list[schemas.ContentItem])
def list_content_items(
    type: str | None = None,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin),
):
    return crud.get_content_items(db, item_type=type)


@router.post("/admin/content/items", response_model=schemas.ContentItem)
def create_content_item(
    item: schemas.ContentItemCreate,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin),
):
    return crud.create_content_item(db, item)


@router.put("/admin/content/items/{item_id}", response_model=schemas.ContentItem)
def update_content_item(
    item_id: int,
    item: schemas.ContentItemUpdate,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin),
):
    updated = crud.update_content_item(db, item_id, item)
    if not updated:
        raise HTTPException(status_code=404, detail="Content item not found")
    return updated


@router.delete("/admin/content/items/{item_id}")
def remove_content_item(
    item_id: int,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin),
):
    deleted = crud.delete_content_item(db, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Content item not found")
    return {"success": True}
