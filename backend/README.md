# Hotel Restaurant FastAPI Backend

## Setup

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your PostgreSQL connection string
```

### 3. Setup PostgreSQL Database

Create a PostgreSQL database:

```sql
CREATE DATABASE hotel_restaurant;
```

### 4. Seed the Database

```bash
python seed_data.py
```

### 5. Run the Server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Default Admin Credentials

- Email: `admin@grandhotel.com`
- Password: `admin123`

## API Endpoints

### Public Endpoints
- `GET /api/categories` - List categories
- `GET /api/menu-items` - List menu items
- `GET /api/tables/available` - List available tables
- `POST /api/orders` - Create order
- `GET /api/orders/by-number/{order_number}` - Track order

### Admin Endpoints (require authentication)
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current admin
- `GET /api/admin/dashboard` - Dashboard stats
- `POST/PUT/DELETE /api/categories/*` - Manage categories
- `POST/PUT/DELETE /api/menu-items/*` - Manage menu items
- `POST/PUT/DELETE /api/tables/*` - Manage tables
- `GET/PATCH /api/orders/*` - Manage orders

## Deployment

For production deployment, consider:

1. Use a production WSGI server like Gunicorn:
   ```bash
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

2. Update CORS origins in `app/main.py` with your frontend URL

3. Use a secure SECRET_KEY

4. Consider using Alembic for database migrations
