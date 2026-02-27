# BeeManHoney 🐝🍯

A full-featured e-commerce platform for premium honey products built with React, FastAPI, and PostgreSQL.

## Features

### User Features
- **User Registration & Login** - Secure JWT-based authentication
- **Browse Products** - Filter by category (Premium, Standard, Dark, Infused)
- **Shopping Cart** - Add/remove items, quantity management
- **Checkout** - Address form, payment selection (COD/Razorpay)
- **Order Tracking** - View order history and status
- **User Profile** - Manage addresses, view orders, wishlist
- **FAQ Page** - Common questions answered

### Admin Features
- **Product Management** - Add, edit, delete products
- **Featured Products** - Mark products as featured for homepage
- **Active/Inactive Toggle** - Show/hide products
- **Order Management** - View and update order status
- **Analytics Dashboard** - Sales and order statistics

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Backend | FastAPI + Python |
| Database | PostgreSQL (with pgvector) |
| Cache | Redis |
| Auth | JWT |

## Quick Start

### Prerequisites
- Docker & Docker Compose
- OR Node.js 18+ + Python 3.10+

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/itsaslamopenclawdata/BeeManHoney.git
cd BeeManHoney

# Start all services
docker-compose up -d

# Access the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your values

# Run the server
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit VITE_API_BASE_URL

# Run development server
npm run dev
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql+asyncpg://admin:secret@localhost:5432/beemanhoney
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/token | Login (get JWT) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/products | List all products |
| GET | /api/v1/products/featured | List featured products |
| POST | /api/v1/products | Create product (admin) |
| PUT | /api/v1/products/{id} | Update product (admin) |
| DELETE | /api/v1/products/{id} | Delete product (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/orders/me | Get user's orders |
| POST | /api/v1/orders | Create new order |
| PATCH | /api/v1/orders/{id}/status | Update order status (admin) |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/addresses | Get saved addresses |
| POST | /api/v1/addresses | Add new address |
| GET | /api/v1/wishlist | Get wishlist |
| POST | /api/v1/wishlist | Add to wishlist |

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@beemanhoney.com | BeeManHoney@Admin2024!Secure |
| User | test@example.com | Test12345! |

## User Flow

```
1. Visit http://localhost:3000
2. Click "Sign Up" → Create account
3. Login with credentials
4. Browse Products → Add to Cart
5. Go to Cart → Click Checkout
6. Enter shipping address
7. Select Payment (COD/Razorpay)
8. Place Order → View in Order History
```

## Project Structure

```
BeeManHoney/
├── frontend/           # React + Vite frontend
│   ├── pages/         # Page components
│   ├── components/    # Reusable components
│   ├── services/     # API calls
│   └── utils/        # Utilities
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── api/     # API routes
│   │   ├── models/  # Database models
│   │   ├── schemas/ # Pydantic schemas
│   │   └── services/# Business logic
│   └── requirements.txt
├── Docs/             # Documentation
└── docker-compose.yml
```

## License

MIT
