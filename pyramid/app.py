from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import logging
from typing import List

# Import database, models, schemas
from database import engine, get_db, settings, Base
import models
import schemas
from analysis import analyze_review

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create all database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Product Review Analyzer API",
    description="API untuk menganalisis sentiment dan extract key points dari product reviews",
    version="1.0.0"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ Health Check ============
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "Product Review Analyzer API"}

# ============ Product Endpoints ============
@app.post("/api/products", response_model=schemas.ProductResponse, status_code=201, tags=["Products"])
async def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    """Create a new product"""
    try:
        db_product = models.Product(
            name=product.name,
            description=product.description
        )
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating product: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/products", response_model=List[schemas.ProductResponse], tags=["Products"])
async def get_products(db: Session = Depends(get_db)):
    """Get all products"""
    products = db.query(models.Product).all()
    return products

@app.get("/api/products/{product_id}", response_model=schemas.ProductResponse, tags=["Products"])
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a specific product"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# ============ Review Analysis Endpoint ============
@app.post("/api/analyze-review", response_model=schemas.ReviewAnalysisResult, status_code=201, tags=["Reviews"])
async def analyze_review_endpoint(
    request: schemas.ReviewAnalyzeRequest,
    db: Session = Depends(get_db)
):
    """
    Analyze a product review: sentiment analysis + key points extraction
    """
    try:
        # Verify product exists
        product = db.query(models.Product).filter(models.Product.id == request.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        logger.info(f"Analyzing review for product {request.product_id}")
        
        # Perform analysis
        analysis_result = analyze_review(request.review_text)
        
        # Create review record
        db_review = models.Review(
            product_id=request.product_id,
            review_text=request.review_text,
            sentiment=analysis_result["sentiment"],
            sentiment_score=analysis_result["sentiment_score"],
            key_points=",".join(analysis_result["key_points"]),
            analyzed_at=datetime.utcnow()
        )
        db.add(db_review)
        db.commit()
        db.refresh(db_review)
        
        logger.info(f"Review analyzed and saved with ID {db_review.id}")
        
        return schemas.ReviewAnalysisResult(
            sentiment=analysis_result["sentiment"],
            sentiment_score=analysis_result["sentiment_score"],
            key_points=analysis_result["key_points"]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error analyzing review: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# ============ Reviews Retrieval Endpoint ============
@app.get("/api/reviews", response_model=List[schemas.ReviewWithProductResponse], tags=["Reviews"])
async def get_reviews(
    product_id: int = None,
    sentiment: str = None,
    db: Session = Depends(get_db)
):
    """
    Get all reviews with optional filtering by product or sentiment
    Query params:
    - product_id: Filter by product ID
    - sentiment: Filter by sentiment (positive/negative/neutral)
    """
    try:
        query = db.query(models.Review)
        
        if product_id:
            query = query.filter(models.Review.product_id == product_id)
        
        if sentiment:
            valid_sentiments = ["positive", "negative", "neutral"]
            if sentiment.lower() not in valid_sentiments:
                raise HTTPException(status_code=400, detail=f"Invalid sentiment. Must be one of {valid_sentiments}")
            query = query.filter(models.Review.sentiment == sentiment.lower())
        
        reviews = query.order_by(models.Review.created_at.desc()).all()
        return reviews
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching reviews: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reviews/{review_id}", response_model=schemas.ReviewWithProductResponse, tags=["Reviews"])
async def get_review(review_id: int, db: Session = Depends(get_db)):
    """Get a specific review by ID"""
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

# ============ Statistics Endpoint ============
@app.get("/api/stats", tags=["Stats"])
async def get_statistics(product_id: int = None, db: Session = Depends(get_db)):
    """Get statistics about reviews and sentiment distribution"""
    try:
        query = db.query(models.Review)
        
        if product_id:
            query = query.filter(models.Review.product_id == product_id)
        
        reviews = query.all()
        
        if not reviews:
            return {
                "total_reviews": 0,
                "sentiment_distribution": {},
                "average_sentiment_score": 0
            }
        
        sentiment_count = {"positive": 0, "negative": 0, "neutral": 0}
        total_score = 0
        count_with_score = 0
        
        for review in reviews:
            if review.sentiment:
                sentiment_count[review.sentiment] += 1
            if review.sentiment_score:
                total_score += review.sentiment_score
                count_with_score += 1
        
        return {
            "total_reviews": len(reviews),
            "sentiment_distribution": sentiment_count,
            "average_sentiment_score": total_score / count_with_score if count_with_score > 0 else 0
        }
    except Exception as e:
        logger.error(f"Error fetching statistics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============ Error Handlers ============
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "error": exc.detail,
        "status_code": exc.status_code
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host=settings.BACKEND_HOST,
        port=settings.BACKEND_PORT,
        reload=settings.DEBUG
    )
