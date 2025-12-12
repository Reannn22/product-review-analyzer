# Product Review Analyzer

**Tugas Individu 3 - PAW P13 (AI pada Aplikasi Web)**

**Nama**: Reyhan Caapri Moraga  
**NIM**: 123140022  
**Tanggal Pengumpulan**: 13 Desember 2025

---

A full-stack application for analyzing product reviews using sentiment analysis and key points extraction. Built with FastAPI (backend), React (frontend), PostgreSQL (database), and powered by Hugging Face and Google Gemini AI.

## ✅ Completion Checklist

- ✅ User dapat input product review (text)
- ✅ Analyze sentiment (positive/negative/neutral) menggunakan Hugging Face
- ✅ Extract key points menggunakan Gemini
- ✅ Display hasil analysis di React frontend
- ✅ Save results ke PostgreSQL database
- ✅ Working backend API dengan 2 endpoints:
  - ✅ `POST /api/analyze-review` - Analyze new review
  - ✅ `GET /api/reviews` - Get all reviews
- ✅ React frontend dengan form input dan results display
- ✅ Database integration (SQLAlchemy + PostgreSQL)
- ✅ Error handling dan loading states
- ✅ Documentation (README.md)
- ✅ Modern UI dengan Lucide icons
- ✅ Responsive design

## Features

- ✅ **Product Management**: Create and manage products for review analysis
- 📝 **Review Submission**: Submit detailed product reviews via intuitive UI
- 🧠 **Sentiment Analysis**: Automatic sentiment classification (positive/negative/neutral) using Hugging Face transformer models
- 🔑 **Key Points Extraction**: Extract important points from reviews using Google Gemini AI
- 📊 **Review Dashboard**: View all reviews with filtering by product or sentiment
- 📈 **Statistics**: Real-time sentiment distribution and average confidence scores
- 🎯 **REST API**: Fully documented API endpoints for programmatic access
- 🔄 **Persistent Storage**: All reviews and analysis results saved to PostgreSQL
- ⚡ **Error Handling**: Comprehensive error handling and user feedback
- 🎨 **Responsive UI**: Modern, responsive React interface with Lucide icons
- 🌙 **Dark Mode Support**: Built-in dark/light theme support

## Tech Stack

### Backend

- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Sentiment Analysis**: Hugging Face Transformers (distilbert-base-uncased-finetuned-sst-2-english)
- **Key Points Extraction**: Google Generative AI (Gemini Pro)
- **Task Queue**: ASGI/Uvicorn
- **Validation**: Pydantic

### Frontend

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0.0
- **Icons**: Lucide React
- **Linting**: ESLint 9.39.1

### Database

- **Type**: PostgreSQL 12+
- **ORM**: SQLAlchemy 2.0

## Project Structure

```
product-review-analyzer/
├── pyramid/                     # Backend (FastAPI)
│   ├── app.py                  # Main FastAPI application
│   ├── database.py             # Database configuration
│   ├── models.py               # SQLAlchemy models
│   ├── schemas.py              # Pydantic request/response schemas
│   ├── analysis.py             # Sentiment & key points analysis
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example            # Example environment variables
│   ├── __pycache__/            # Python cache
│   └── .gitignore              # Git ignore rules
│
├── react/                       # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.tsx             # Main React component
│   │   ├── index.css           # Global styling (Tailwind)
│   │   ├── main.tsx            # Entry point
│   │   ├── api/
│   │   │   └── reviewService.ts       # API client
│   │   ├── components/         # React components
│   │   │   ├── App.tsx
│   │   │   ├── AnalysisResults.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductSelector.tsx
│   │   │   ├── ResultDisplay.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   ├── ReviewsList.tsx
│   │   │   ├── SentimentBadge.tsx
│   │   │   └── StatsDisplay.tsx
│   │   └── styles/        # Component-specific CSS (legacy)
│   ├── public/            # Static assets
│   ├── .env.local         # Frontend environment (create from .env.example)
│   ├── .env.example       # Example frontend environment
│   ├── .gitignore         # Git ignore rules
│   ├── package.json       # Dependencies
│   ├── vite.config.ts     # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── postcss.config.js  # PostCSS configuration
│   └── tsconfig.json      # TypeScript configuration
│
├── .gitignore             # Global git ignore
└── README.md              # This file
```

## Prerequisites

Before running the application, ensure you have:

1. **Python 3.9+** - [Download](https://www.python.org/)
2. **Node.js 18+** - [Download](https://nodejs.org/)
3. **PostgreSQL 12+** - [Download](https://www.postgresql.org/)
4. **API Keys**:
   - Hugging Face API key (optional, models can run locally)
   - Google Gemini API key - [Get here](https://makersuite.google.com/app/apikey)

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd pyramid

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env
# Edit .env with your configuration:
# - DATABASE_URL: PostgreSQL connection string
# - HUGGINGFACE_API_KEY: Your Hugging Face API key (optional)
# - GEMINI_API_KEY: Your Google Gemini API key (required for key points extraction)

# Verify .env is in .gitignore
cat .gitignore  # Should contain ".env"
```

### 2. Database Setup

```bash
# Make sure PostgreSQL is running

# Create database
psql -U postgres -c "CREATE DATABASE product_review_db;"

# The tables will be automatically created when you first run the backend
# SQLAlchemy will create all tables defined in models.py
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd react

# Install dependencies
npm install

# Create .env.local file
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Verify environment is created properly
cat .env.local
```

## Running the Application

### Start Backend Server

```bash
cd pyramid

# Activate virtual environment (if not already activated)
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Run FastAPI server
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

- API Documentation (Swagger): `http://localhost:8000/docs`
- Alternative docs (ReDoc): `http://localhost:8000/redoc`

### Start Frontend Server

```bash
cd react

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/{product_id}` - Get a specific product

### Reviews & Analysis

- **`POST /api/analyze-review`** - Analyze a review (sentiment + key points)

  ```json
  {
    "product_id": 1,
    "review_text": "This product is amazing! Great quality and fast shipping."
  }
  ```

  **Response**:
  ```json
  {
    "id": 1,
    "product_id": 1,
    "review_text": "This product is amazing! Great quality and fast shipping.",
    "sentiment": "positive",
    "sentiment_score": 0.9987,
    "key_points": [
      "Great quality",
      "Fast shipping",
      "Amazing product"
    ],
    "created_at": "2025-12-12T10:30:00Z"
  }
  ```

- **`GET /api/reviews`** - Get all reviews (with optional filters)

  - Query params: `product_id`, `sentiment`
  - Example: `/api/reviews?product_id=1&sentiment=positive`
  - Response: Array of review objects

- `GET /api/reviews/{review_id}` - Get a specific review

### Statistics

- `GET /api/stats` - Get sentiment statistics
  - Query params: `product_id` (optional)
  - Response:
    ```json
    {
      "total_reviews": 7,
      "average_sentiment_score": 0.64,
      "sentiment_distribution": {
        "positive": 1,
        "negative": 1,
        "neutral": 5
      }
    }
    ```

### Health

- `GET /health` - Health check endpoint

## Environment Variables

### Backend (.env)

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/product_review_db

# API Keys
HUGGINGFACE_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here

# Server Configuration
DEBUG=True
BACKEND_PORT=8000
BACKEND_HOST=0.0.0.0
FRONTEND_URL=http://localhost:5173

# CORS Configuration
ALLOWED_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:8000
```

## Usage Guide

1. **Create a Product**:
   - Click "+ New Product" button in header
   - Enter product name and description
   - Click "Create Product"

2. **Submit a Review**:
   - Select a product from product selector
   - Enter your review in the text area (minimum 10 characters)
   - Click "Analyze Review"

3. **View Results**:
   - Sentiment analysis with confidence score appears instantly
   - Key points extracted from your review are displayed
   - Review is saved to the database automatically

4. **Browse Reviews**:
   - All reviews for the selected product appear below
   - View sentiment distribution and statistics
   - Scroll to see more reviews

## Error Handling

The application includes comprehensive error handling:

- **Backend**: 
  - FastAPI validation using Pydantic
  - Exception handlers for API errors
  - Database connection error handling
  - API timeout and retry logic

- **Frontend**: 
  - Error messages displayed in red alert boxes
  - Dismiss button to clear error messages
  - Loading states with spinner
  - Graceful fallbacks for API failures

- **Database**: 
  - Connection pooling
  - Automatic table creation
  - Transaction rollback on error

## Troubleshooting

### Backend Issues

**Error: "ModuleNotFoundError: No module named 'fastapi'"**

```bash
# Make sure virtual environment is activated and requirements are installed
pip install -r requirements.txt
```

**Error: "psycopg2: could not connect to server"**

```bash
# Ensure PostgreSQL is running
# Windows: net start PostgreSQL14
# macOS: brew services start postgresql@14
# Linux: sudo systemctl start postgresql

# Check connection string in .env file
# Format: postgresql://username:password@localhost:5432/database_name
```

**Error: "GEMINI_API_KEY not found"**

```bash
# Get your key from: https://makersuite.google.com/app/apikey
# Add to .env file under GEMINI_API_KEY
# Make sure to restart the server after updating .env
```

**Error: "[plugin:vite:css]" or Tailwind errors**

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Rebuild the frontend
npm run build
```

### Frontend Issues

**Error: "Failed to fetch from backend"**

```bash
# Ensure backend is running on http://localhost:8000
# Check VITE_API_URL in .env.local
# Check CORS settings in pyramid/app.py
# Verify backend host/port configuration
```

**Error: "Module not found" or "Port already in use"**

```bash
# Reinstall dependencies
npm install

# Use different port if 5173 is in use
npm run dev -- --port 5174
```

## Performance Considerations

- **Sentiment Analysis**: Uses distilbert (lightweight) for fast inference (~100ms per review)
- **Key Points**: Gemini API call (~1-2 seconds per review)
- **Database**: PostgreSQL indexes on `product_id` and `sentiment` for fast queries
- **Frontend**: React component state caching for reviews and stats
- **UI**: Responsive design with mobile-first approach

## Security Notes

⚠️ **IMPORTANT FOR SUBMISSION**:

- ✅ **Never commit `.env` files** with real API keys to GitHub
- ✅ **Use `.gitignore`** to exclude sensitive files:
  ```
  .env
  .env.local
  node_modules/
  __pycache__/
  *.pyc
  venv/
  dist/
  build/
  ```
- ✅ Validate input on both frontend and backend
- ✅ CORS is configured to allow frontend requests only
- ✅ PostgreSQL connections use connection pooling
- ✅ Pydantic models validate all API inputs

## Git Setup & Submission

### Initialize Git Repository

```bash
# Initialize git if not already done
git init

# Add all files except sensitive ones (already in .gitignore)
git add .

# Create initial commit
git commit -m "Initial commit: Product Review Analyzer - Tugas Individu 3"

# Add remote repository
git remote add origin https://github.com/yourusername/product-review-analyzer.git

# Push to GitHub
git push -u origin main
```

### GitHub Repository Checklist

- ✅ Repository contains all source code
- ✅ `.env` and `.env.local` are in `.gitignore` (NOT in repository)
- ✅ `node_modules/` and `__pycache__/` are in `.gitignore`
- ✅ README.md is complete and comprehensive
- ✅ `.env.example` files provided for reference
- ✅ All commits have meaningful messages

### Submission Format

Create a **tugas_individu3.pdf** file containing:

```
TUGAS INDIVIDU 3 - PAW P13
AI pada Aplikasi Web

Nama: Reyhan Caapri Moraga
NIM: 123140022
Tanggal Pengumpulan: 13 Desember 2025

GitHub Repository: https://github.com/yourusername/product-review-analyzer

Deskripsi Proyek:
Aplikasi Product Review Analyzer dengan fitur sentiment analysis menggunakan
Hugging Face dan key points extraction menggunakan Google Gemini AI.

Stack Teknologi:
- Backend: FastAPI, PostgreSQL, SQLAlchemy
- Frontend: React, Vite, TypeScript, Tailwind CSS
- AI: Hugging Face Transformers, Google Gemini

Fitur yang Diimplementasikan:
✅ Product management (create, read)
✅ Review submission form dengan validasi
✅ Sentiment analysis (positive/negative/neutral)
✅ Key points extraction
✅ Results display dengan modern UI
✅ Database persistence
✅ Error handling dan loading states
✅ Responsive design dengan mobile support
✅ Modern UI dengan Lucide icons

API Endpoints:
- POST /api/analyze-review - Analyze new review
- GET /api/reviews - Get all reviews
- GET /api/products - Get all products
- POST /api/products - Create product
- GET /api/stats - Get sentiment statistics

Cara Menjalankan:
1. Backend: python -m uvicorn pyramid.app:app --reload
2. Frontend: cd react && npm run dev
3. Akses: http://localhost:5173
```

## Building for Production

```bash
# Backend
pip install gunicorn
gunicorn pyramid.app:app

# Frontend
npm run build
# Output in react/dist/
```

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Review pagination/infinite scroll
- [ ] Export reviews as CSV/PDF
- [ ] Advanced filtering and search
- [ ] Batch review processing
- [ ] Review ratings and helpful votes
- [ ] Multi-language support
- [ ] Caching layer (Redis)
- [ ] Rate limiting
- [ ] WebSocket updates for real-time reviews
- [ ] Admin dashboard
- [ ] Review moderation

## Development

### Running Tests

```bash
# Backend
cd pyramid
pytest

# Frontend
cd react
npm run test
```

### Code Quality

```bash
# Frontend linting
npm run lint

# Backend code formatting
pip install black
black .

# Type checking
mypy pyramid/
```

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Hugging Face Documentation](https://huggingface.co/docs)
- [Google Gemini API](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## License

This project is open source and available under the MIT License.

## Author

**Reyhan Caapri Moraga** (NIM: 123140022)  
Universitas Telkom - PAW P13  
December 2025

## Support

For issues, questions, or suggestions:
1. Check the error messages and console logs
2. Refer to the troubleshooting section above
3. Review the GitHub issues page
4. Contact the maintainer

---

**Last Updated**: December 12, 2025  
**Status**: Complete ✅


## Project Structure

```
product-review-analyzer/
├── pyramid/                  # Backend (FastAPI)
│   ├── app.py              # Main FastAPI application
│   ├── database.py         # Database configuration
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic request/response schemas
│   ├── analysis.py         # Sentiment & key points analysis
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Example environment variables
│   └── .env                # Environment variables (create from .env.example)
│
└── react/                   # Frontend (React + Vite)
    ├── src/
    │   ├── App.tsx         # Main React component
    │   ├── App.css         # App styling
    │   ├── main.tsx        # Entry point
    │   ├── api/
    │   │   └── reviewService.ts  # API client
    │   ├── components/     # React components
    │   │   ├── LoadingState.tsx
    │   │   ├── ErrorMessage.tsx
    │   │   ├── ResultDisplay.tsx
    │   │   └── ReviewsList.tsx
    │   └── styles/        # Component-specific CSS
    ├── .env.local         # Frontend environment (create from .env.example)
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

## Prerequisites

Before running the application, ensure you have:

1. **Python 3.9+** - [Download](https://www.python.org/)
2. **Node.js 18+** - [Download](https://nodejs.org/)
3. **PostgreSQL 12+** - [Download](https://www.postgresql.org/)
4. **API Keys**:
   - Hugging Face API key (optional, models can run locally)
   - Google Gemini API key - [Get here](https://makersuite.google.com/app/apikey)

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd pyramid

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration:
# - DATABASE_URL: PostgreSQL connection string
# - HUGGINGFACE_API_KEY: Your Hugging Face API key (optional)
# - GEMINI_API_KEY: Your Google Gemini API key (required for key points extraction)
```

### 2. Database Setup

```bash
# Make sure PostgreSQL is running

# Create database
psql -U postgres -c "CREATE DATABASE product_review_db;"

# The tables will be automatically created when you first run the backend
# SQLAlchemy will create all tables defined in models.py
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd react

# Install dependencies
npm install

# Create .env.local file
VITE_API_URL=http://localhost:8000

# Verify environment is created properly
cat .env.local
```

## Running the Application

### Start Backend Server

```bash
cd pyramid

# Activate virtual environment (if not already activated)
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Run FastAPI server
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

### Start Frontend Server

```bash
cd react

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/{product_id}` - Get a specific product

### Reviews & Analysis

- **`POST /api/analyze-review`** - Analyze a review (sentiment + key points)

  ```json
  {
    "product_id": 1,
    "review_text": "This product is amazing! Great quality and fast shipping."
  }
  ```

- **`GET /api/reviews`** - Get all reviews (with optional filters)

  - Query params: `product_id`, `sentiment`
  - Example: `/api/reviews?product_id=1&sentiment=positive`

- `GET /api/reviews/{review_id}` - Get a specific review

### Statistics

- `GET /api/stats` - Get sentiment statistics
  - Query params: `product_id` (optional)
  - Response: total reviews, sentiment distribution, average score

### Health

- `GET /health` - Health check endpoint

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/product_review_db

# API Keys
HUGGINGFACE_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here

# Configuration
DEBUG=True
BACKEND_PORT=8000
BACKEND_HOST=0.0.0.0
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:8000
```

## Usage Guide

1. **Create a Product**:

   - Click "+ Add Product" in the sidebar
   - Enter product name and description
   - Click "Create"

2. **Submit a Review**:

   - Select a product from the sidebar
   - Enter your review in the text area (minimum 10 characters)
   - Click "Analyze Review"

3. **View Results**:

   - Sentiment analysis with confidence score appears instantly
   - Key points extracted from your review are displayed
   - Review is saved to the database automatically

4. **Browse Reviews**:
   - All reviews for the selected product appear below
   - View sentiment distribution and statistics
   - Scroll to see more reviews

## Error Handling

The application includes comprehensive error handling:

- **Backend**: FastAPI validation and exception handlers
- **Frontend**: Error messages displayed to user with dismiss option
- **Database**: Connection pooling and automatic retries
- **API Calls**: Graceful fallbacks for API failures

## Troubleshooting

### Backend Issues

**Error: "ModuleNotFoundError: No module named 'fastapi'"**

```bash
# Make sure virtual environment is activated and requirements are installed
pip install -r requirements.txt
```

**Error: "psycopg2: could not connect to server"**

```bash
# Ensure PostgreSQL is running and DATABASE_URL is correct
# Check connection string in .env file
```

**Error: "GEMINI_API_KEY not found"**

```bash
# Get your key from: https://makersuite.google.com/app/apikey
# Add to .env file under GEMINI_API_KEY
```

### Frontend Issues

**Error: "Failed to fetch from backend"**

```bash
# Ensure backend is running on http://localhost:8000
# Check VITE_API_URL in .env.local
# Check CORS settings in pyramid/app.py
```

**Error: "Module not found"**

```bash
# Reinstall dependencies
npm install
```

## Performance Considerations

- **Sentiment Analysis**: Uses distilbert (lightweight) for fast inference (~100ms per review)
- **Key Points**: Gemini API call (~1-2 seconds per review)
- **Database**: PostgreSQL indexes on `product_id` and `sentiment` for fast queries
- **Caching**: Frontend caches reviews and stats in component state

## Security Notes

- Never commit `.env` files with real API keys
- Use environment variables for sensitive data
- Validate input on both frontend and backend
- CORS is configured to allow frontend requests only
- PostgreSQL connections use connection pooling

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Review pagination/infinite scroll
- [ ] Export reviews as CSV/PDF
- [ ] Advanced filtering and search
- [ ] Batch review processing
- [ ] Review ratings and helpful votes
- [ ] Multi-language support
- [ ] Caching layer (Redis)
- [ ] Rate limiting
- [ ] WebSocket updates for real-time reviews

## Development

### Running Tests

```bash
# Backend
cd pyramid
pytest

# Frontend
cd react
npm run test
```

### Building for Production

```bash
# Backend
pip install gunicorn
gunicorn app:app

# Frontend
npm run build
# Output in react/dist/
```

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please refer to the error messages or check the console logs for debugging information.

## Related Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Hugging Face Documentation](https://huggingface.co/docs)
- [Google Gemini API](https://ai.google.dev/)
