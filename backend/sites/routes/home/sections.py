ALLOWED_SECTION_PAGE_KEYS = {
    "productsCooling",
    "productsHeating",
    "productsFeeding",
    "productsWatering",
    "productsFans",
    "productsControllers",
    "productsLighting",
    "productsUsedEquipment",
    "servicesConstruction",
    "servicesRepair",
    "servicesRetro",
    "servicesShop",
}

MAX_SECTIONS_PER_PAGE = 50
MAX_IMAGES_PER_SECTION = 20

def normalize_sections(value):
    if not isinstance(value, list):
        return []

    out = []
    for item in value[:MAX_SECTIONS_PER_PAGE]:
        if not isinstance(item, dict):
            continue

        normalized_images = []
        raw_images = item.get("images")
        if isinstance(raw_images, list):
            for raw in raw_images[:MAX_IMAGES_PER_SECTION]:
                if isinstance(raw, dict):
                    url = str(raw.get("url") or raw.get("image") or "").strip()
                    description = str(raw.get("description") or raw.get("caption") or "").strip()
                else:
                    url = str(raw or "").strip()
                    description = ""
                
                if url:
                    normalized_images.append({"url": url, "description": description})
        
        elif isinstance(item.get("image"), str):
            single = str(item.get("image") or "").strip()
            if single:
                normalized_images.append({"url": single, "description": ""})

        out.append(
            {
                "title": str(item.get("title") or "").strip(),
                "description": str(item.get("description") or "").strip(),
                "images": normalized_images,
            }
        )

    return out
