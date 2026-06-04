from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import categories, menu_items, tables, orders, auth, admin, customers
from .config import settings

if settings.auto_create_tables:
    Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description="API for hotel restaurant takeaway ordering system",
    version="1.0.0",
    docs_url="/docs" if settings.enable_docs else None,
    redoc_url="/redoc" if settings.enable_docs else None,
    openapi_url="/openapi.json" if settings.enable_docs else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.api_v1_prefix)
app.include_router(admin.router, prefix=settings.api_v1_prefix)
app.include_router(categories.router, prefix=settings.api_v1_prefix)
app.include_router(menu_items.router, prefix=settings.api_v1_prefix)
app.include_router(tables.router, prefix=settings.api_v1_prefix)
app.include_router(orders.router, prefix=settings.api_v1_prefix)
app.include_router(customers.router, prefix=settings.api_v1_prefix)


@app.get("/")
def root():
    return {
        "message": settings.app_name,
        "docs": "/docs" if settings.enable_docs else None,
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
