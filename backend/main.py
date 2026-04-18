from routes.call_routes import call_bp
from routes.conversation_routes import conversation_bp
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import jwt
from datetime import datetime, timezone, timedelta
from werkzeug.security import check_password_hash
from database import find_user, update_timestamp
from database.connection import edit_user, get_user_by_id
from config import Config

# Disable loggings
logging.getLogger('werkzeug').disabled = True
logging.getLogger('flask.app').disabled = True

# Initialize Flask app
app = Flask(__name__)

# Validate configuration (will raise error if JWT_SECRET_KEY is missing)
Config.validate()

# Get config from Config class
JWT_SECRET_KEY = Config.JWT_SECRET_KEY
ALGORITHM = Config.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = Config.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = Config.REFRESH_TOKEN_EXPIRE_DAYS
FRONTEND_URL = Config.FRONTEND_URL

# Enable CORS
CORS(app, origins=[
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
    FRONTEND_URL,
    f"https://{FRONTEND_URL}",
    f"http://{FRONTEND_URL}"
])

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400
        
        # Find user in database
        user = find_user(email)
        
        # Check user and password_hash
        if not user or not user.password_hash:
            return jsonify({"error": "Invalid email or password"}), 401
        
        # String password_hash
        if not check_password_hash(user.password_hash, password):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Update last login
        update_timestamp(user.id)
        
        # Create tokens
        access_token = jwt.encode({
            'user_id': user.id,
            'email': user.email,
            'role': user.role,
            'exp': datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        }, JWT_SECRET_KEY, algorithm=ALGORITHM) # type: ignore
        
        refresh_token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        }, JWT_SECRET_KEY, algorithm=ALGORITHM) # type: ignore
        
        return jsonify({
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
                "role": user.role
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "Internal server error"}), 500

# Return user's profile
@app.route("/api/admin/profile", methods=["GET"])
def admin_profile():
    try:
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing Authorization Bearer token"}), 401

        token = auth_header.split(" ", 1)[1].strip()
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])  # type: ignore

        user_id = payload.get("user_id")
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401

        user_row = get_user_by_id(int(user_id))
        if not user_row:
            return jsonify({"error": "User not found"}), 404

        user_row["avatar"] = user_row.get("profile_picture")
        return jsonify({"success": True, "user": user_row}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Access token expired"}), 401
    except Exception as e:
        print(f"Admin profile error: {e}")
        return jsonify({"error": "Internal server error"}), 500

# Update user's profile
@app.route("/api/admin/profile", methods=["PUT"])
def update_admin_profile():
    try:
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing Authorization Bearer token"}), 401

        token = auth_header.split(" ", 1)[1].strip()
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])  # type: ignore

        user_id = payload.get("user_id")
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401

        data = request.get_json(silent=True) or {}
        updated = edit_user(
            int(user_id),
            email=data.get("email"),
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            profile_picture=data.get("profile_picture"),
        )

        if not updated:
            return jsonify({"error": "User not found"}), 404

        updated["avatar"] = updated.get("profile_picture")
        return jsonify({"success": True, "user": updated}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Access token expired"}), 401
    except Exception as e:
        print(f"Update admin profile error: {e}")
        return jsonify({"error": "Internal server error"}), 500

# Register blueprints
app.register_blueprint(call_bp, url_prefix='/twilio')
app.register_blueprint(conversation_bp)

@app.route("/")
def home():
    return "VoiceFlow is running!", 200

@app.route('/health')
def health():
    return "OK", 200

@app.route('/ngrok-test')
def ngrok_test():
    return "Ngrok test successful!", 200

if __name__ == "__main__":
    print("Starting VoiceFlow...")
    print("In another terminal: ngrok http 5001")
    app.run(host='0.0.0.0', port=5001, debug=False)