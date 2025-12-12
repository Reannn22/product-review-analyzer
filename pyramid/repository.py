"""
Utility functions for database operations
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import TypeVar, Generic, Type, List, Optional
import models

T = TypeVar('T')

class BaseRepository(Generic[T]):
    """Base repository class for common database operations"""
    
    def __init__(self, db: Session, model: Type[T]):
        self.db = db
        self.model = model
    
    def create(self, **kwargs) -> T:
        """Create a new record"""
        instance = self.model(**kwargs)
        self.db.add(instance)
        self.db.commit()
        self.db.refresh(instance)
        return instance
    
    def get_by_id(self, id: int) -> Optional[T]:
        """Get record by ID"""
        return self.db.query(self.model).filter(self.model.id == id).first()
    
    def get_all(self, skip: int = 0, limit: int = 10) -> List[T]:
        """Get all records with pagination"""
        return self.db.query(self.model).offset(skip).limit(limit).all()
    
    def update(self, id: int, **kwargs) -> Optional[T]:
        """Update a record"""
        instance = self.get_by_id(id)
        if instance:
            for key, value in kwargs.items():
                setattr(instance, key, value)
            self.db.commit()
            self.db.refresh(instance)
        return instance
    
    def delete(self, id: int) -> bool:
        """Delete a record"""
        instance = self.get_by_id(id)
        if instance:
            self.db.delete(instance)
            self.db.commit()
            return True
        return False
    
    def count(self) -> int:
        """Count total records"""
        return self.db.query(func.count(self.model.id)).scalar()

class ProductRepository(BaseRepository):
    """Repository for Product model"""
    
    def get_products_with_review_count(self) -> List[dict]:
        """Get products with review count"""
        from sqlalchemy import join
        return (
            self.db.query(
                self.model,
                func.count(models.Review.id).label('review_count')
            )
            .outerjoin(models.Review)
            .group_by(self.model.id)
            .all()
        )

class ReviewRepository(BaseRepository):
    """Repository for Review model"""
    
    def get_reviews_by_product(self, product_id: int) -> List[T]:
        """Get all reviews for a product"""
        return (
            self.db.query(self.model)
            .filter(self.model.product_id == product_id)
            .order_by(self.model.created_at.desc())
            .all()
        )
    
    def get_product_review_count(self, product_id: int) -> int:
        """Get review count for a product"""
        return (
            self.db.query(func.count(self.model.id))
            .filter(self.model.product_id == product_id)
            .scalar()
        )
