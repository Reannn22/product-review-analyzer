from transformers import pipeline
from typing import Dict, Tuple
import google.generativeai as genai
from database import settings
import json
import logging

logger = logging.getLogger(__name__)

# Initialize sentiment analysis pipeline
try:
    sentiment_pipeline = pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english",
        device=-1  # CPU, use 0 for GPU
    )
except Exception as e:
    logger.error(f"Failed to load sentiment model: {e}")
    sentiment_pipeline = None

# Initialize Gemini for key points extraction
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-pro')
else:
    gemini_model = None
    logger.warning("GEMINI_API_KEY not set, key points extraction will be skipped")

def analyze_sentiment(text: str) -> Tuple[str, float]:
    """
    Analyze sentiment of review text using Hugging Face model.
    Returns: (sentiment: str, confidence: float)
    """
    if not sentiment_pipeline:
        raise RuntimeError("Sentiment analysis model not initialized")
    
    try:
        result = sentiment_pipeline(text[:512])  # Limit to 512 tokens
        
        label = result[0]['label'].lower()
        score = result[0]['score']
        
        # Map labels to our enum
        if label == 'positive':
            return "positive", score
        elif label == 'negative':
            return "negative", score
        else:
            return "neutral", score
    except Exception as e:
        logger.error(f"Sentiment analysis error: {e}")
        raise

def extract_key_points(text: str, max_points: int = 5) -> list:
    """
    Extract key points from review text using Gemini API.
    Returns: list of key points
    """
    if not gemini_model:
        logger.warning("Gemini model not initialized, returning empty key points")
        return []
    
    try:
        prompt = f"""Analyze the following product review and extract {max_points} key points or main topics discussed.
Return only a JSON array of strings with the key points. Each point should be concise (max 15 words).

Review: "{text}"

Return format: ["point 1", "point 2", "point 3", ...]"""
        
        response = gemini_model.generate_content(prompt)
        
        # Parse JSON response
        try:
            response_text = response.text.strip()
            # Handle case where response might have markdown code blocks
            if response_text.startswith("```"):
                response_text = response_text.split("```")[1].strip()
                if response_text.startswith("json"):
                    response_text = response_text[4:].strip()
            
            key_points = json.loads(response_text)
            return key_points if isinstance(key_points, list) else []
        except json.JSONDecodeError:
            logger.error(f"Failed to parse Gemini response as JSON: {response.text}")
            # Fallback: extract sentences as key points
            sentences = text.split('. ')
            return sentences[:max_points]
    except Exception as e:
        logger.error(f"Key points extraction error: {e}")
        # Fallback: return empty list so review can still be analyzed
        return []

def analyze_review(review_text: str) -> Dict:
    """
    Complete analysis: sentiment + key points
    """
    sentiment, sentiment_score = analyze_sentiment(review_text)
    key_points = extract_key_points(review_text)
    
    return {
        "sentiment": sentiment,
        "sentiment_score": sentiment_score,
        "key_points": key_points
    }
