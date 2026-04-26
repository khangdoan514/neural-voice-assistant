import traceback
import jwt
from flask import Blueprint, jsonify, request
from config import Config
from database.connection import (
    HOME_HERO_CARDS_KEY,
    edit_user,
    get_user_by_id,
    upsert_site_content,
)

from sites.routes.home.home_hero import (
    DEFAULT_HOME_HERO_LABELS,
    HOME_HERO_BOX_COUNT,
    HOME_HERO_IMAGES_HARD_MAX,
)
from sites.routes.home.sections import ALLOWED_SECTION_PAGE_KEYS, normalize_sections

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

JWT_SECRET_KEY = Config.JWT_SECRET_KEY
ALGORITHM = Config.ALGORITHM

# Decode bearer user ID
def decode_user_id():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None, (jsonify({"error": "Missing Authorization Bearer token"}), 401)
    
    token = auth_header.split(" ", 1)[1].strip()
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])  # type: ignore[arg-type]
    except jwt.ExpiredSignatureError:
        return None, (jsonify({"error": "Access token expired"}), 401)
    except Exception:
        return None, (jsonify({"error": "Invalid token"}), 401)

    user_id = payload.get("user_id")
    if not user_id:
        return None, (jsonify({"error": "Invalid token"}), 401)
    
    return int(user_id), None

@admin_bp.route("/profile", methods=["GET"])
def admin_profile():
    try:
        user_id, err = decode_user_id()
        if err is not None:
            return err

        user_row = get_user_by_id(user_id)
        if not user_row:
            return jsonify({"error": "User not found"}), 404

        user_row["avatar"] = user_row.get("profile_picture")
        return jsonify({"success": True, "user": user_row}), 200

    except Exception as e:
        print(f"Admin profile error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@admin_bp.route("/profile", methods=["PUT"])
def update_admin_profile():
    try:
        user_id, err = decode_user_id()
        if err is not None:
            return err

        data = request.get_json(silent=True) or {}
        updated = edit_user(
            user_id,
            email=data.get("email"),
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            profile_picture=data.get("profile_picture"),
        )

        if not updated:
            return jsonify({"error": "User not found"}), 404

        updated["avatar"] = updated.get("profile_picture")
        return jsonify({"success": True, "user": updated}), 200

    except Exception as e:
        print(f"Update admin profile error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@admin_bp.route("/content/home-hero", methods=["PUT", "OPTIONS"])
def update_home_content():
    if request.method == "OPTIONS":
        return "", 200

    try:
        _, err = decode_user_id()
        if err is not None:
            return err

        data = request.get_json(silent=True) or {}
        cards = data.get("cards")
        if not isinstance(cards, list) or len(cards) != HOME_HERO_BOX_COUNT:
            return jsonify({"error": f"cards must be an array of exactly {HOME_HERO_BOX_COUNT} items"}), 400

        normalized = []
        for i, c in enumerate(cards):
            if not isinstance(c, dict):
                return jsonify({"error": f"cards[{i}] must be an object"}), 400

            label = str(c.get("label") or "").strip() or DEFAULT_HOME_HERO_LABELS[i]
            raw_images = c.get("images")

            if isinstance(raw_images, list):
                imgs = [str(x) if x is not None else "" for x in raw_images]
                if len(imgs) > HOME_HERO_IMAGES_HARD_MAX:
                    return jsonify(
                        {"error": f"cards[{i}].images must have at most {HOME_HERO_IMAGES_HARD_MAX} items"}
                    ), 400
            elif isinstance(c.get("image"), str):
                img = str(c.get("image") or "")
                imgs = [img] if img.strip() else []
            else:
                imgs = []

            normalized.append({"label": label, "images": imgs})

        row = upsert_site_content(HOME_HERO_CARDS_KEY, normalized)
        return jsonify({"success": True, "cards": row.get("value")}), 200

    except Exception as e:
        print(f"Home hero write error: {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500

@admin_bp.route("/content/sections/<page_key>", methods=["PUT", "OPTIONS"])
def update_page_sections(page_key):
    if request.method == "OPTIONS":
        return "", 200

    if page_key not in ALLOWED_SECTION_PAGE_KEYS:
        return jsonify({"error": "Unknown page key"}), 404

    try:
        _, err = decode_user_id()
        if err is not None:
            return err

        data = request.get_json(silent=True) or {}
        normalized = normalize_sections(data.get("sections"))
        row = upsert_site_content(page_key, normalized)
        return jsonify({"success": True, "sections": row.get("value")}), 200

    except Exception as e:
        print(f"Sections write error ({page_key}): {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500
