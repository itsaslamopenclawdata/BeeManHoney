from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import models so Alembic can see them
# from app.models.all import User, Product, Order, OrderItem

