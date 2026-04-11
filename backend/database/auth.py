from .connection import get_db_connection
from .models import User
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List, cast

# Find a user by email
def find_user(email: str) -> Optional[User]:
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "SELECT id, email, password_hash, role, created_at, updated_at, last_login FROM users WHERE email = %s",
        (email.lower(),)
    )
    
    result = cur.fetchone()
    cur.close()
    conn.close()
    
    if result is None:
        return None
    return User.from_dict(dict(result))

# Create a new user
def create_user(email: str, password_hash: str, role: str = 'user') -> Optional[User]:
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO users (email, password_hash, role) VALUES (%s, %s, %s) RETURNING id, email, role, created_at",
        (email.lower(), password_hash, role)
    )
    
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    if result is None:
        return None
    return User.from_dict(dict(result))

# Update user's last login timestamp
def update_timestamp(user_id: int) -> None:
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "UPDATE users SET last_login = %s WHERE id = %s",
        (datetime.now(timezone.utc), user_id)
    )
    
    conn.commit()
    cur.close()
    conn.close()

# Check if user exists
def user_exists(email: str) -> bool:
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT id FROM users WHERE email = %s", (email.lower(),))
    exists = cur.fetchone() is not None
    
    cur.close()
    conn.close()
    
    return exists