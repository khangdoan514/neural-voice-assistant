import traceback
from flask import Blueprint, jsonify, request
from database.connection import HOME_HERO_CARDS_KEY, get_site_content
from sites.routes.home.home_hero import normalize_home_hero_cards

home_bp = Blueprint("home", __name__, url_prefix="/api/content")

@home_bp.route("/home-hero", methods=["GET", "OPTIONS"])
def home_hero_get():
    if request.method == "OPTIONS":
        return "", 200

    try:
        cards = get_site_content(HOME_HERO_CARDS_KEY)
        normalized = normalize_home_hero_cards(cards) if cards is not None else None
        return jsonify({"success": True, "cards": normalized}), 200

    except Exception as e:
        print(f"Home hero read error: {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500
