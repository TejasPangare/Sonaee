from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import categories, menu_items, tables, orders, auth, admin

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hotel Restaurant API",
    description="API for hotel restaurant takeaway ordering system",
    version="1.0.0"
)

# CORS middleware - configure for your frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend-domain.vercel.app",  # Update this
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(menu_items.router, prefix="/api")
app.include_router(tables.router, prefix="/api")
app.include_router(orders.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Hotel Restaurant API", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
