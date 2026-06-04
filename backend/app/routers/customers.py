from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import sys

from ..database import get_db
from .. import crud, schemas
from ..auth import create_access_token

router = APIRouter(prefix="/customers", tags=["customers"])


@router.post("/login", response_model=schemas.Token)
def customer_login(form_data: schemas.CustomerLoginRequest, db: Session = Depends(get_db)):
    """Customer login by email + phone."""
    print(f"[AUTH] Login attempt: email={form_data.email}, phone={form_data.phone}", file=sys.stderr)

    customer = crud.get_customer_by_email_and_phone(db, form_data.email, form_data.phone)
    if not customer or not customer.is_active:
        print(
            f"[AUTH] No order found for email={form_data.email}, phone={form_data.phone}",
            file=sys.stderr,
        )
        raise HTTPException(
            status_code=404,
            detail="No customer found for that email and phone number combination",
        )

    print(f"[AUTH] Login successful for {form_data.email} (phone: {form_data.phone})", file=sys.stderr)
    access_token = create_access_token(
        data={
            "customer_id": customer.id,
            "sub": customer.email,
            "phone": customer.phone,
            "name": customer.full_name,
            "role": "customer",
        }
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=schemas.Token)
def customer_register(form_data: schemas.CustomerRegisterRequest, db: Session = Depends(get_db)):
    """Create a persistent customer account."""
    print(
        f"[AUTH] Register attempt: email={form_data.email}, phone={form_data.phone}",
        file=sys.stderr,
    )

    matching_pair = crud.get_customer_by_email_and_phone(db, form_data.email, form_data.phone)
    if matching_pair:
        raise HTTPException(
            status_code=400,
            detail="An account with this email and phone number already exists. Please sign in instead.",
        )

    existing_email = crud.get_customer_by_email(db, form_data.email)
    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="This email is already associated with another phone number.",
        )

    existing_phone = crud.get_customer_by_phone(db, form_data.phone)
    if existing_phone:
        raise HTTPException(
            status_code=400,
            detail="This phone number is already associated with another email address.",
        )

    customer = crud.create_customer(
        db,
        schemas.CustomerCreate(
            full_name=form_data.full_name,
            email=form_data.email,
            phone=form_data.phone,
        ),
    )

    print(
        f"[AUTH] Register successful for {form_data.email} (phone: {form_data.phone})",
        file=sys.stderr,
    )
    
    access_token = create_access_token(
        data={
            "customer_id": customer.id,
            "sub": customer.email,
            "phone": customer.phone,
            "name": customer.full_name,
            "role": "customer",
        }
    )
    return {"access_token": access_token, "token_type": "bearer"}
