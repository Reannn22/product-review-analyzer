#!/usr/bin/env python
"""
Test script untuk memverifikasi Gemini API dan Hugging Face sentiment analysis
Run dari pyramid directory: python test_analysis.py
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_gemini_api():
    """Test Gemini API connection"""
    print("\n" + "="*60)
    print("Testing Gemini API...")
    print("="*60)
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ GEMINI_API_KEY not set in .env")
        return False
    
    print(f"✅ GEMINI_API_KEY found (length: {len(api_key)})")
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Test with simple prompt
        test_prompt = "What is 2+2? Reply with just the number."
        response = model.generate_content(test_prompt)
        
        print(f"✅ Gemini API is working!")
        print(f"   Response: {response.text}")
        return True
    except Exception as e:
        print(f"❌ Gemini API test failed: {e}")
        return False

def test_sentiment_analysis():
    """Test Hugging Face sentiment analysis"""
    print("\n" + "="*60)
    print("Testing Sentiment Analysis (Hugging Face)...")
    print("="*60)
    
    try:
        from transformers import pipeline
        
        print("Loading sentiment analysis model...")
        sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english",
            device=-1  # CPU
        )
        print("✅ Model loaded successfully")
        
        # Test with sample reviews
        test_reviews = [
            "This product is amazing! I love it.",
            "Terrible quality, don't buy this.",
            "It's okay, nothing special.",
        ]
        
        for review in test_reviews:
            result = sentiment_pipeline(review[:512])
            label = result[0]['label']
            score = result[0]['score']
            print(f"   Review: {review}")
            print(f"   → {label.upper()} ({score:.2f})")
        
        return True
    except Exception as e:
        print(f"❌ Sentiment analysis test failed: {e}")
        return False

def test_key_points_extraction():
    """Test key points extraction from review"""
    print("\n" + "="*60)
    print("Testing Key Points Extraction...")
    print("="*60)
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ GEMINI_API_KEY not set")
        return False
    
    try:
        import google.generativeai as genai
        import json
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        test_review = """
        This smartphone is incredible! The camera quality is outstanding - 
        photos come out crisp and clear even in low light. Battery lasts all day, 
        and the fast charging is super convenient. Performance is smooth for gaming 
        and multitasking. Only downside is the price, but you get what you pay for.
        """
        
        prompt = f"""Extract 3-5 key points from this review as a JSON array:
"{test_review}"

Return only valid JSON array of strings like: ["point 1", "point 2", ...]"""
        
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Clean up response
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1].strip()
            if response_text.startswith("json"):
                response_text = response_text[4:].strip()
        
        key_points = json.loads(response_text)
        print("✅ Key points extracted successfully:")
        for i, point in enumerate(key_points, 1):
            print(f"   {i}. {point}")
        
        return True
    except Exception as e:
        print(f"❌ Key points extraction failed: {e}")
        return False

def test_database_connection():
    """Test database connection"""
    print("\n" + "="*60)
    print("Testing Database Connection...")
    print("="*60)
    
    try:
        from database import engine, Base
        
        # Try to connect
        with engine.connect() as conn:
            print("✅ Database connection successful!")
            
            # Create tables if needed
            print("Creating tables...")
            Base.metadata.create_all(bind=engine)
            print("✅ Tables created/verified")
        
        return True
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        print("   Make sure PostgreSQL is running and DATABASE_URL is correct in .env")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("Product Review Analyzer - Test Suite")
    print("="*60)
    
    tests = [
        ("Database Connection", test_database_connection),
        ("Sentiment Analysis", test_sentiment_analysis),
        ("Gemini API", test_gemini_api),
        ("Key Points Extraction", test_key_points_extraction),
    ]
    
    results = {}
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"\n❌ Unexpected error in {test_name}: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    total = len(results)
    passed = sum(1 for v in results.values() if v)
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Ready to run the application.")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
    
    return 0 if passed == total else 1

if __name__ == "__main__":
    sys.exit(main())
