import traceback
from flask import Blueprint, jsonify, request
from database.connection import HOME_HERO_CARDS_KEY, get_site_content
from sites.routes.home.home_hero import normalize_home_hero_cards
from sites.routes.home.sections import ALLOWED_SECTION_PAGE_KEYS, normalize_sections

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

@home_bp.route("/sections/<page_key>", methods=["GET", "OPTIONS"])
def page_sections_get(page_key):
    if request.method == "OPTIONS":
        return "", 200

    if page_key not in ALLOWED_SECTION_PAGE_KEYS:
        return jsonify({"error": "Unknown page key"}), 404

    try:
        sections = get_site_content(page_key)
        normalized = normalize_sections(sections)
        return jsonify({"success": True, "sections": normalized}), 200

    except Exception as e:
        print(f"Sections read error ({page_key}): {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500
