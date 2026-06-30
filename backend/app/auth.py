from datetime import datetime, timedelta
from typing import Optional, TypedDict
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from .database import get_db
from . import models, schemas
from .config import settings

SECRET_KEY = settings.secret_key
ALGORITHM = settings.jwt_algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


class CustomerIdentity(TypedDict):
    customer_id: int
    full_name: str
    email: str
    phone: str


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return password


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def authenticate_admin(db: Session, email: str, password: str) -> Optional[models.Admin]:
    admin = db.query(models.Admin).filter(models.Admin.email == email).first()
    if not admin:
        return None
    if not verify_password(password, admin.hashed_password):
        return None
    return admin


async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.Admin:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        role = payload.get("role")
        if role == "customer":
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    admin = db.query(models.Admin).filter(models.Admin.email == email).first()
    if admin is None:
        raise credentials_exception
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is deactivated"
        )
    return admin


async def get_current_customer(
    token: str = Depends(oauth2_scheme),
) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        role = payload.get("role")
        if role is not None and role != "customer":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    return email


async def get_optional_customer(
    token: str = Depends(oauth2_scheme),
) -> Optional[str]:
    if not token:
        return None
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise credentials_exception
        role = payload.get("role")
        if role is not None and role != "customer":
            raise credentials_exception
        return email
    except JWTError:
        raise credentials_exception


async def get_current_customer_phone(
    token: str = Depends(oauth2_scheme),
) -> str:
    """Extract phone number from customer JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        phone: str = payload.get("phone")
        if phone is None:
            raise credentials_exception
        role = payload.get("role")
        if role is not None and role != "customer":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    return phone


async def get_optional_customer_identity(
    token: str = Depends(oauth2_scheme),
) -> Optional[CustomerIdentity]:
    if not token:
        return None

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        customer_id = payload.get("customer_id")
        full_name: str = payload.get("name")
        email: str = payload.get("sub")
        phone: str = payload.get("phone")
        role = payload.get("role")

        if not customer_id or not full_name or not email or not phone or role != "customer":
            raise credentials_exception

        return {
            "customer_id": int(customer_id),
            "full_name": full_name,
            "email": email,
            "phone": phone,
        }
    except JWTError:
        raise credentials_exception


async def get_current_customer_identity(
    token: str = Depends(oauth2_scheme),
) -> CustomerIdentity:
    identity = await get_optional_customer_identity(token)
    if not identity:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return identity
