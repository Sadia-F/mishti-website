# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Create FastAPI app
app = FastAPI(title="Mishti & Mimi API")

# Configure CORS (allows frontend to talk to backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (we'll switch to MongoDB later)
orders_db = []
order_counter = 0

# Define the Order model (what data we expect)
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

# Root endpoint to test if API is running
@app.get("/")
async def root():
    return {"message": "Welcome to Mishti & Mimi API!"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Create order endpoint
@app.post("/api/orders")
async def create_order(order: OrderCreate):
    global order_counter
    
    try:
        # Convert to dictionary
        order_dict = order.dict()
        
        # Add metadata
        order_counter += 1
        order_dict["id"] = order_counter
        order_dict["status"] = "pending"
        order_dict["createdAt"] = datetime.utcnow().isoformat()
        
        # Store in memory
        orders_db.append(order_dict)
        
        # Return success response
        return {
            "message": "Order submitted successfully!",
            "orderId": order_counter,
            "status": "pending"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get all orders (for admin dashboard later)
@app.get("/api/orders")
async def get_all_orders():
    return orders_db

# Get single order by ID
@app.get("/api/orders/{order_id}")
async def get_order(order_id: int):
    for order in orders_db:
        if order["id"] == order_id:
            return order
    raise HTTPException(status_code=404, detail="Order not found")