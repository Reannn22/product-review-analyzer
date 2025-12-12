from typing import Dict, Tuple, Optional
import google.generativeai as genai
from database import settings
import json
import logging
import requests
import os

logger = logging.getLogger(__name__)

# Set cache directory for Hugging Face models to avoid memory issues
os.environ['HF_DATASETS_CACHE'] = os.path.expanduser('~/.cache/huggingface/datasets')
os.environ['TRANSFORMERS_CACHE'] = os.path.expanduser('~/.cache/huggingface/models')

# Global pipeline - loaded lazily on first use
sentiment_pipeline = None

# Initialize Gemini for key points extraction
# Support both SDK and REST API methods
gemini_model = None
gemini_api_key = settings.GEMINI_API_KEY

if gemini_api_key:
    try:
        genai.configure(api_key=gemini_api_key)
        gemini_model = genai.GenerativeModel('gemini-pro')
        logger.info("✓ Gemini SDK initialized successfully")
    except Exception as e:
        logger.warning(f"⚠️  Gemini SDK initialization failed: {e}, will use REST API instead")
else:
    logger.warning("⚠️  GEMINI_API_KEY not set, key points extraction will use REST API only")

# Gemini REST API endpoint (from environment or use default)
GEMINI_API_URL = settings.GEMINI_API_URL

logger.info("✓ Analysis module initialized (models will load on first request)")

def analyze_sentiment_via_hf_api(text: str) -> Tuple[str, float]:
    """
    Analyze sentiment using HuggingFace Inference API (cloud-based).
    No local model download needed, faster and more reliable.
    Returns: (sentiment: str, confidence: float)
    """
    hf_token = settings.HF_API_TOKEN or settings.HUGGINGFACE_API_KEY
    
    if not hf_token:
        logger.warning("⚠️  HF_API_TOKEN not set, cannot use HuggingFace REST API")
        return None
    
    try:
        headers = {
            "Authorization": f"Bearer {hf_token}",
            "Content-Type": "application/json"
        }
        payload = {"inputs": text[:512]}
        
        url = settings.HUGGINGFACE_API_URL
        logger.debug(f"Calling HuggingFace API: {url}")
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        # Handle 410 Gone error - API moved, try alternative endpoint
        if response.status_code == 410:
            logger.warning("⚠️  HF API error 410: Endpoint moved, trying alternative...")
            alternative_url = url.replace(
                "https://api-inference.huggingface.co",
                "https://router.huggingface.co"
            )
            if alternative_url != url:
                try:
                    response = requests.post(
                        alternative_url,
                        headers=headers,
                        json=payload,
                        timeout=30
                    )
                except Exception:
                    logger.warning("⚠️  Alternative endpoint also failed")
                    return None
        
        if response.status_code == 200:
            result = response.json()
            
            # Handle response format: [[{label, score}]]
            if isinstance(result, list) and len(result) > 0:
                if isinstance(result[0], list) and len(result[0]) > 0:
                    prediction = result[0][0]
                else:
                    prediction = result[0]
                
                label = prediction.get('label', 'NEUTRAL').lower()
                score = float(prediction.get('score', 0.5))
                
                # Normalize label
                if label in ['positive', 'pos']:
                    logger.debug(f"✅ HF API Sentiment: positive ({score:.2f})")
                    return "positive", score
                elif label in ['negative', 'neg']:
                    logger.debug(f"✅ HF API Sentiment: negative ({score:.2f})")
                    return "negative", score
                else:
                    logger.debug(f"✅ HF API Sentiment: neutral ({score:.2f})")
                    return "neutral", score
        else:
            logger.warning(f"⚠️  HF API error {response.status_code}: {response.text[:200]}")
            return None
            
    except requests.exceptions.Timeout:
        logger.warning("⚠️  HuggingFace API timeout")
        return None
    except Exception as e:
        logger.warning(f"⚠️  HF API error: {str(e)}")
        return None
        logger.warning(f"⚠️  HuggingFace API error: {e}")
        return None

def analyze_sentiment(text: str) -> Tuple[str, float]:
    """
    Analyze sentiment of review text.
    Tries HuggingFace REST API first (if token available),
    falls back to local model loading.
    Returns: (sentiment: str, confidence: float)
    """
    global sentiment_pipeline
    
    # Try HuggingFace REST API first (preferred - no local download)
    hf_result = analyze_sentiment_via_hf_api(text)
    if hf_result:
        return hf_result
    
    logger.info("HF API unavailable, falling back to local model...")
    
    # Lazy load model if not already loaded
    if not sentiment_pipeline:
        logger.info("🔄 Loading sentiment model on first request (this may take a moment)...")
        try:
            from transformers import pipeline
            import warnings
            # Suppress warnings during model loading
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                sentiment_pipeline = pipeline(
                    "sentiment-analysis",
                    model="distilbert-base-uncased-finetuned-sst-2-english",
                    device=-1,  # CPU
                    torch_dtype="auto"
                )
            logger.info("✅ Sentiment model loaded successfully")
        except MemoryError:
            logger.error("❌ Not enough memory to load sentiment model")
            return "neutral", 0.5
        except Exception as e:
            logger.error(f"❌ Failed to load sentiment model: {type(e).__name__}: {e}")
            # Don't return yet - model might load next time
            return "neutral", 0.5
    
    try:
        result = sentiment_pipeline(text[:512], truncation=True)
        
        label = result[0]['label'].lower()
        score = float(result[0]['score'])
        
        # Map labels to our enum
        if label == 'positive':
            logger.debug(f"Sentiment: positive ({score:.2f})")
            return "positive", score
        elif label == 'negative':
            logger.debug(f"Sentiment: negative ({score:.2f})")
            return "negative", score
        else:
            logger.debug(f"Sentiment: neutral ({score:.2f})")
            return "neutral", score
    except Exception as e:
        logger.error(f"❌ Sentiment analysis error: {type(e).__name__}: {e}")
        return "neutral", 0.5

def extract_key_points_via_rest_api(text: str, max_points: int = 5) -> list:
    """
    Extract key points using Gemini REST API directly.
    More flexible than SDK method.
    """
    if not gemini_api_key:
        logger.warning("GEMINI_API_KEY not set")
        return []
    
    try:
        prompt = f"""Analyze the following product review and extract {max_points} key points or main topics discussed.
Return ONLY a valid JSON array of strings with the key points. Each point should be concise (max 15 words).
Do not include any markdown, code blocks, or additional text.

Review: "{text}"

JSON array format: ["point 1", "point 2", "point 3"]"""
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ]
        }
        
        params = {"key": gemini_api_key}
        
        logger.info(f"Sending request to Gemini API: {GEMINI_API_URL}")
        response = requests.post(
            GEMINI_API_URL,
            json=payload,
            params=params,
            timeout=30
        )
        
        if response.status_code != 200:
            logger.error(f"Gemini API error {response.status_code}: {response.text}")
            return []
        
        response_data = response.json()
        logger.debug(f"Gemini response: {response_data}")
        
        # Extract text from response
        try:
            response_text = response_data['candidates'][0]['content']['parts'][0]['text'].strip()
            logger.debug(f"Extracted text: {response_text}")
            
            # Parse JSON
            key_points = json.loads(response_text)
            if isinstance(key_points, list):
                logger.info(f"✓ Extracted {len(key_points)} key points")
                return key_points
            else:
                logger.error("Response is not a JSON array")
                return []
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            logger.error(f"Failed to parse Gemini response: {e}")
            logger.error(f"Response data: {response_data}")
            return []
    
    except requests.exceptions.Timeout:
        logger.error("Gemini API request timeout")
        return []
    except Exception as e:
        logger.error(f"Gemini REST API error: {e}")
        return []

def extract_key_points_via_sdk(text: str, max_points: int = 5) -> list:
    """
    Extract key points using Gemini SDK.
    Fallback if REST API is not preferred.
    """
    if not gemini_model:
        logger.warning("Gemini model not initialized")
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
            sentences = [s.strip() for s in text.split('.') if s.strip()]
            return sentences[:max_points]
    except Exception as e:
        logger.error(f"Key points extraction via SDK error: {e}")
        return []

def extract_key_points(text: str, max_points: int = 5) -> list:
    """
    Extract key points from review text using Gemini API.
    Tries REST API first (more reliable), falls back to SDK if needed.
    Returns: list of key points
    """
    # Try REST API first (preferred method)
    key_points = extract_key_points_via_rest_api(text, max_points)
    
    # If REST API fails and SDK is available, try SDK
    if not key_points and gemini_model:
        logger.info("REST API failed, falling back to SDK method")
        key_points = extract_key_points_via_sdk(text, max_points)
    
    return key_points

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

