from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from ..database import get_db
from .. import crud, schemas
from ..auth import (
    authenticate_admin,
    create_access_token,
    get_current_admin,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=schemas.Token)
def login(
    form_data: schemas.LoginRequest,
    db: Session = Depends(get_db)
):
    """Admin login"""
    admin = authenticate_admin(db, form_data.email, form_data.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.email, "role": "admin"},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.Admin)
def get_current_admin_info(admin: schemas.Admin = Depends(get_current_admin)):
    """Get current admin info"""
    return admin


@router.post("/register", response_model=schemas.Admin)
def register_admin(
    admin: schemas.AdminCreate,
    db: Session = Depends(get_db),
    current_admin: schemas.Admin = Depends(get_current_admin)
):
    """Register a new admin (superadmin only)"""
    if not current_admin.is_superadmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only superadmins can create new admin accounts"
        )
    
    existing = crud.get_admin_by_email(db, admin.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    return crud.create_admin(db, admin)
