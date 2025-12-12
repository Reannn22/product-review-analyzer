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

## Screenshots

### 1. New Product Form

![New Product Form](./screenshots/new-product-form.png)

### 2. Analyze Review

![Analyze Review](./screenshots/analyze-review.png)

### 3. Reviews Dashboard

![Reviews Dashboard](./screenshots/reviews-dashboard.png)

## Tech Stack

### Backend

- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Sentiment Analysis**: Hugging Face Transformers
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
├── backend/
│   ├── analysis.py              # Sentiment & key points analysis
│   ├── api_docs.py              # API documentation
│   ├── app.py                   # Main FastAPI application
│   ├── cache.py                 # Caching utilities
│   ├── config.py                # Configuration settings
│   ├── constants.py             # Constants
│   ├── database.py              # Database configuration
│   ├── db_utils.py              # Database utilities
│   ├── exceptions.py            # Custom exceptions
│   ├── health.py                # Health check endpoint
│   ├── logging_config.py        # Logging configuration
│   ├── middleware.py            # Custom middleware
│   ├── models.py                # SQLAlchemy models
│   ├── notifications.py         # Notification service
│   ├── repository.py            # Database repository
│   ├── requirements.txt         # Python dependencies
│   ├── response_utils.py        # Response utilities
│   ├── schemas.py               # Pydantic schemas
│   ├── schemas_enhanced.py      # Enhanced schemas
│   ├── security.py              # Security utilities
│   ├── tasks.py                 # Background tasks
│   ├── test_analysis.py         # Test analysis
│   ├── validators.py            # Validators
│   ├── .env.example             # Example environment variables
│   └── .gitignore               # Git ignore rules
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main React component
│   │   ├── index.css            # Global styling
│   │   ├── main.tsx             # Entry point
│   │   ├── api/
│   │   │   └── reviewService.ts # API client
│   │   ├── components/          # React components
│   │   │   ├── AnalysisResults.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductSelector.tsx
│   │   │   ├── ResultDisplay.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   ├── ReviewsList.tsx
│   │   │   ├── SentimentBadge.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   └── StatsDisplay.tsx
│   │   ├── config/
│   │   │   ├── app.ts
│   │   │   ├── routes.ts
│   │   │   └── theme.ts
│   │   ├── context/
│   │   │   ├── AppContext.tsx
│   │   │   ├── createDataContext.ts
│   │   │   └── DataContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAsync.ts
│   │   │   ├── useData.ts
│   │   │   └── useOptimization.ts
│   │   ├── services/
│   │   │   ├── HttpClient.ts
│   │   │   ├── NotificationService.ts
│   │   │   └── UserService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── apiClient.ts
│   │       ├── array.ts
│   │       ├── colors.ts
│   │       ├── dates.ts
│   │       ├── errors.ts
│   │       ├── formatters.ts
│   │       ├── interceptors.ts
│   │       ├── performance.ts
│   │       ├── storage.ts
│   │       └── validators.ts
│   ├── public/                  # Static assets
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── .env.example             # Example environment variables
│   └── .gitignore               # Git ignore rules
│
├── screenshots/
│   ├── analyze-review.png
│   ├── new-product-form.png
│   └── reviews-dashboard.png
│
├── .gitignore                   # Global git ignore
└── README.md                    # This file
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
cd backend

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
cd frontend

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
cd backend

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
cd frontend

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

- `POST /api/analyze-review` - Analyze a review (sentiment + key points)
- `GET /api/reviews` - Get all reviews (with optional filters)
- `GET /api/reviews/{review_id}` - Get a specific review

### Statistics

- `GET /api/stats` - Get sentiment statistics

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

- **Backend**: FastAPI validation using Pydantic and exception handlers
- **Frontend**: Error messages displayed in alert boxes with dismiss option
- **Database**: Connection pooling and automatic retries
- **API Calls**: Graceful fallbacks for API failures

## Troubleshooting

### Backend Issues

**Error: "ModuleNotFoundError: No module named 'fastapi'"**

```bash
pip install -r requirements.txt
```

**Error: "psycopg2: could not connect to server"**

```bash
# Ensure PostgreSQL is running and DATABASE_URL is correct in .env
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
# Check CORS settings in backend/app.py
```

**Error: "Module not found"**

```bash
npm install
```

## Performance Considerations

- **Sentiment Analysis**: Uses distilbert (lightweight) for fast inference (~100ms per review)
- **Key Points**: Gemini API call (~1-2 seconds per review)
- **Database**: PostgreSQL indexes on `product_id` and `sentiment` for fast queries
- **Frontend**: React component state caching for reviews and stats
- **UI**: Responsive design with mobile-first approach

## Security Notes

⚠️ **IMPORTANT**:

- Never commit `.env` files with real API keys to GitHub
- Use `.gitignore` to exclude sensitive files
- Validate input on both frontend and backend
- CORS is configured to allow frontend requests only
- PostgreSQL connections use connection pooling
- Pydantic models validate all API inputs

## Building for Production

```bash
# Backend
pip install gunicorn
gunicorn backend.app:app

# Frontend
npm run build
# Output in frontend/dist/
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
