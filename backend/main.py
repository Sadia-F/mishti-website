# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from email.message import EmailMessage
import asyncio
import os
import asyncpg
import json
import smtplib
import ssl

# Create FastAPI app
app = FastAPI(title="Mishti & Mimi API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://mishti-and-mimi-website.vercel.app",
        "https://mishti-website-five.vercel.app",
        "https://sadia-f.github.io",
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
    occasion: str
    fulfillment: str
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
            
        email_sent = await asyncio.to_thread(send_order_notification, order_dict, result["id"])

        return {
            "message": "Order submitted successfully!",
            "orderId": result["id"],
            "status": "pending",
            "emailSent": email_sent,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def send_order_notification(order, order_id):
    """Email a new order to the configured owner inbox when SMTP is enabled."""
    username = os.getenv("SMTP_USERNAME")
    password = os.getenv("SMTP_PASSWORD")
    if not username or not password:
        print("Order saved, but email delivery is disabled: SMTP credentials are not configured.")
        return False

    recipient = "sadiaferdous003@gmail.com"
    sender = os.getenv("SMTP_FROM_EMAIL", username)
    host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    port = int(os.getenv("SMTP_PORT", "587"))

    message = EmailMessage()
    message["Subject"] = "New Mishti & Mimi order request"
    message["From"] = sender
    message["To"] = recipient
    message["Reply-To"] = str(order["email"])
    message.set_content(
        "A new order request was submitted.\n\n"
        f"Request number: {order_id}\n"
        f"Name: {order['customerName']}\n"
        f"Customer email: {order['email']}\n"
        f"Phone: {order['phone']}\n"
        f"Event date: {order['eventDate']}\n"
        f"Pickup or delivery date: {order['pickupDate']}\n"
        f"Fulfillment: {order['fulfillment']}\n"
        f"Occasion: {order['occasion']}\n"
        f"Mishti: {order['productType']}\n"
        f"Quantity package: {order['quantity']}\n"
        f"Custom amount: {order.get('customAmount') or 'Not requested'}\n"
        f"Custom colors: {'Yes' if order.get('colorCustomization') else 'No'}\n"
        f"Preferred payment: {order['paymentMethod']}\n"
        f"Additional information: {order.get('additionalInfo') or 'None'}\n"
    )

    try:
        if port == 465:
            with smtplib.SMTP_SSL(host, port, context=ssl.create_default_context(), timeout=20) as smtp:
                smtp.login(username, password)
                smtp.send_message(message)
        else:
            with smtplib.SMTP(host, port, timeout=20) as smtp:
                smtp.ehlo()
                smtp.starttls(context=ssl.create_default_context())
                smtp.ehlo()
                smtp.login(username, password)
                smtp.send_message(message)
        return True
    except Exception as error:
        print(f"Order notification email failed: {error}")
        return False

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
