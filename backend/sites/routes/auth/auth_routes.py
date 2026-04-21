from datetime import datetime, timedelta, timezone
import jwt
from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash
from config import Config
from database import find_user, update_timestamp

auth_bp = Blueprint("auth", __name__, url_prefix="/api")

JWT_SECRET_KEY = Config.JWT_SECRET_KEY
ALGORITHM = Config.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = Config.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = Config.REFRESH_TOKEN_EXPIRE_DAYS

@auth_bp.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return "", 200

    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        user = find_user(email)
        if not user or not user.password_hash:
            return jsonify({"error": "Invalid email or password"}), 401

        if not check_password_hash(user.password_hash, password):
            return jsonify({"error": "Invalid email or password"}), 401

        update_timestamp(user.id)
        access_token = jwt.encode(
            {
                "user_id": user.id,
                "email": user.email,
                "role": user.role,
                "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
            },
            JWT_SECRET_KEY,
            algorithm=ALGORITHM,  # type: ignore[arg-type]
        )

        refresh_token = jwt.encode(
            {
                "user_id": user.id,
                "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
            },
            JWT_SECRET_KEY,
            algorithm=ALGORITHM,  # type: ignore[arg-type]
        )

        return jsonify(
            {
                "success": True,
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": getattr(user, "first_name", None),
                    "last_name": getattr(user, "last_name", None),
                    "profile_picture": getattr(user, "profile_picture", None),
                    "avatar": getattr(user, "profile_picture", None),
                    "role": user.role,
                },
            }
        ), 200

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "Internal server error"}), 500
