# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import os
import asyncpg
import json

# Create FastAPI app
app = FastAPI(title="Mishti & Mimi API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://mishti-and-mimi-website.vercel.app",
        "https://mishti-website-five.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection pool
db_pool = None

async def get_db():
    global db_pool
    if db_pool is None:
        db_pool = await asyncpg.create_pool(
            os.getenv("DATABASE_URL"),
            min_size=1,
            max_size=5
        )
    return db_pool

# Define the Order model
class OrderCreate(BaseModel):
    customerName: str
    email: EmailStr
    phone: str
    eventDate: str
    pickupDate: str
    productType: str
    quantity: str
    customAmount: Optional[int] = None
    paymentMethod: str
    additionalInfo: Optional[str] = None
    colorCustomization: bool = False
    agreeToTerms: bool = True

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to Mishti & Mimi API!"}

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Create order endpoint
@app.post("/api/orders")
async def create_order(order: OrderCreate):
    try:
        pool = await get_db()
        
        # Convert to dictionary and JSON
        order_dict = order.dict()
        order_dict["status"] = "pending"
        order_dict["createdAt"] = datetime.utcnow().isoformat()
        
        # Insert into PostgreSQL
        async with pool.acquire() as conn:
            result = await conn.fetchrow(
                """
                INSERT INTO orders (data, status, created_at)
                VALUES ($1, $2, $3)
                RETURNING id
                """,
                json.dumps(order_dict),
                "pending",
                datetime.utcnow()
            )
            
        return {
            "message": "Order submitted successfully!",
            "orderId": result["id"],
            "status": "pending"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get all orders
@app.get("/api/orders")
async def get_all_orders():
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT id, data, status, created_at
                FROM orders
                ORDER BY created_at DESC
                """
            )
        
        orders = []
        for row in rows:
            order = json.loads(row["data"])
            order["id"] = row["id"]
            order["status"] = row["status"]
            order["createdAt"] = row["created_at"].isoformat()
            orders.append(order)
            
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get single order by ID
@app.get("/api/orders/{order_id}")
async def get_order(order_id: int):
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                "SELECT id, data, status, created_at FROM orders WHERE id = $1",
                order_id
            )
        
        if row is None:
            raise HTTPException(status_code=404, detail="Order not found")
            
        order = json.loads(row["data"])
        order["id"] = row["id"]
        order["status"] = row["status"]
        order["createdAt"] = row["created_at"].isoformat()
        return order
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")

# Update order status
@app.put("/api/orders/{order_id}/status")
async def update_order_status(order_id: int, status: str):
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            result = await conn.execute(
                "UPDATE orders SET status = $1 WHERE id = $2",
                status, order_id
            )
            
        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail="Order not found")
            
        return {"message": f"Order status updated to {status}"}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")

# Delete order
@app.delete("/api/orders/{order_id}")
async def delete_order(order_id: int):
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            result = await conn.execute(
                "DELETE FROM orders WHERE id = $1",
                order_id
            )
            
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Order not found")
            
        return {"message": "Order deleted successfully"}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")

# Startup event - create table if it doesn't exist
@app.on_event("startup")
async def startup():
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS orders (
                    id SERIAL PRIMARY KEY,
                    data JSONB NOT NULL,
                    status VARCHAR(50) DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        print("✅ Database initialized successfully!")
    except Exception as e:
        print(f"❌ Database initialization error: {e}")

# Shutdown event - close pool
@app.on_event("shutdown")
async def shutdown():
    global db_pool
    if db_pool:
        await db_pool.close()