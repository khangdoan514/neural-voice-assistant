import os
from pathlib import Path
from typing import Any, Dict, List, Optional
import psycopg2
from psycopg2.extras import Json, RealDictCursor
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
load_dotenv()

HOME_HERO_CARDS_KEY = "home_hero_cards"

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT", "5432"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        cursor_factory=RealDictCursor,
    )

def _fetchone_dict(cur) -> Optional[Dict[str, Any]]:
    row = cur.fetchone()
    return dict(row) if row is not None else None

def _fetchall_dict(cur) -> List[Dict[str, Any]]:
    rows = cur.fetchall()
    return [dict(r) for r in rows] if rows else []

def init_db() -> None:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            profile_picture TEXT,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )
        """
    )

    # Ensure index exists
    cur.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS site_content (
            key TEXT PRIMARY KEY,
            value JSONB NOT NULL,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    conn.commit()
    cur.close()
    conn.close()
    print("Database initialized successfully")

# Insert user
def add_user(
    *,
    email: str,
    password_hash: str,
    role: str = "user",
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO users (email, first_name, last_name, password_hash, role)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id, email, first_name, last_name, profile_picture, role, created_at, updated_at, last_login
        """,
        (email.lower(), first_name, last_name, password_hash, role),
    )

    row = _fetchone_dict(cur)
    conn.commit()
    cur.close()
    conn.close()

    if row is None:
        raise RuntimeError("Failed to insert user")
    
    return row

def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, email, first_name, last_name, profile_picture, role, created_at, updated_at, last_login
        FROM users
        WHERE id = %s
        """,
        (user_id,),
    )

    row = _fetchone_dict(cur)
    cur.close()
    conn.close()
    return row

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, email, first_name, last_name, profile_picture, role, created_at, updated_at, last_login
        FROM users
        WHERE email = %s
        """,
        (email.lower(),),
    )

    row = _fetchone_dict(cur)
    cur.close()
    conn.close()
    return row

def list_users(limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, email, first_name, last_name, profile_picture, role, created_at, updated_at, last_login
        FROM users
        ORDER BY id DESC
        LIMIT %s OFFSET %s
        """,
        (limit, offset),
    )

    rows = _fetchall_dict(cur)
    cur.close()
    conn.close()
    return rows

# Update selected fields
def edit_user(
    user_id: int,
    *,
    email: Optional[str] = None,
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    profile_picture: Optional[str] = None,
    role: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    fields: List[str] = []
    values: List[Any] = []

    if email is not None:
        fields.append("email = %s")
        values.append(email.lower())
    
    if first_name is not None:
        fields.append("first_name = %s")
        values.append(first_name)
    
    if last_name is not None:
        fields.append("last_name = %s")
        values.append(last_name)
    
    if profile_picture is not None:
        fields.append("profile_picture = %s")
        values.append(profile_picture)
    
    if role is not None:
        fields.append("role = %s")
        values.append(role)
    
    if not fields:
        return get_user_by_id(user_id)

    conn = get_db_connection()
    cur = conn.cursor()
    sql = f"""
        UPDATE users
        SET {", ".join(fields)}, updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
        RETURNING id, email, first_name, last_name, profile_picture, role, created_at, updated_at, last_login
    """

    values.append(user_id)
    cur.execute(sql, tuple(values))
    
    row = _fetchone_dict(cur)
    conn.commit()
    cur.close()
    conn.close()
    return row

# Delete user
def remove_user(user_id: int) -> bool:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
    deleted = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return deleted

#Return parsed JSON value
def get_site_content(key: str) -> Optional[Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT value FROM site_content WHERE key = %s", (key,))
    row = _fetchone_dict(cur)
    cur.close()
    conn.close()
    if row is None:
        return None
    
    return row.get("value")

# Insert or replace JSON document
def upsert_site_content(key: str, value: Any) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO site_content (key, value, updated_at)
        VALUES (%s, %s, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET
            value = EXCLUDED.value,
            updated_at = CURRENT_TIMESTAMP
        RETURNING key, value, updated_at
        """,
        (key, Json(value)),
    )

    row = _fetchone_dict(cur)
    conn.commit()
    cur.close()
    conn.close()
    if row is None:
        raise RuntimeError("Failed to upsert site_content")
    
    return row