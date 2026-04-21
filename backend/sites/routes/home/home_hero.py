DEFAULT_HOME_HERO_LABELS = [
    "Farm Setup",
    "Poultry Farming",
    "Feeding Systems",
    "Equipment Service",
]

HOME_HERO_BOX_COUNT = 4
HOME_HERO_IMAGES_HARD_MAX = 10

def normalize_home_hero_cards(cards):
    if not isinstance(cards, list) or len(cards) != HOME_HERO_BOX_COUNT:
        return None
    
    out = []
    for i, c in enumerate(cards):
        if not isinstance(c, dict):
            return None
        
        label = str(c.get("label") or "").strip() or DEFAULT_HOME_HERO_LABELS[i]
        raw_images = c.get("images")
        if isinstance(raw_images, list):
            imgs = [str(x) if x is not None else "" for x in raw_images]
        elif isinstance(c.get("image"), str) and str(c.get("image")).strip():
            imgs = [str(c.get("image"))]
        else:
            imgs = []
        
        if len(imgs) > HOME_HERO_IMAGES_HARD_MAX:
            imgs = imgs[:HOME_HERO_IMAGES_HARD_MAX]
        
        out.append({"label": label, "images": imgs})
    
    return out