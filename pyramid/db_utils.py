"""
Database utility functions
"""
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool
from typing import Optional

def execute_raw_query(db: Session, query: str, params: Optional[dict] = None) -> list:
    """Execute a raw SQL query"""
    try:
        result = db.execute(text(query), params or {})
        return result.fetchall()
    except Exception as e:
        raise Exception(f"Database query error: {str(e)}")

def get_table_stats(db: Session, table_name: str) -> dict:
    """Get statistics about a table"""
    from sqlalchemy import inspect
    inspector = inspect(db.bind)
    
    if not inspector.has_table(table_name):
        return {"error": f"Table {table_name} not found"}
    
    columns = inspector.get_columns(table_name)
    return {
        "table_name": table_name,
        "column_count": len(columns),
        "columns": [col["name"] for col in columns],
    }

def check_db_health(db: Session) -> bool:
    """Check if database connection is healthy"""
    try:
        db.execute(text("SELECT 1"))
        return True
    except Exception:
        return False

def reset_table_sequence(db: Session, table_name: str, column_name: str = "id") -> None:
    """Reset sequence for auto-increment column (PostgreSQL)"""
    try:
        db.execute(text(f"ALTER SEQUENCE {table_name}_{column_name}_seq RESTART WITH 1"))
        db.commit()
    except Exception as e:
        print(f"Error resetting sequence: {str(e)}")
