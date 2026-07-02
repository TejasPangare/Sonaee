from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from .. import crud, schemas
from ..auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["admin"])


class FCMTokenRequest(BaseModel):
    fcm_token: str


@router.get("/dashboard", response_model=schemas.DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin)
):
    """Get dashboard statistics (admin only)"""
    return crud.get_dashboard_stats(db)


@router.post("/register-fcm-token")
def register_fcm_token(
    request: FCMTokenRequest,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin)
):
    """Register or update FCM token for push notifications (admin only)"""
    crud.update_admin_fcm_token(db, admin.id, request.fcm_token)
    return {"message": "FCM token registered successfully"}
