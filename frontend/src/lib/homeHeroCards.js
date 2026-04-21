export const HERO_BOX_COUNT = 4
export const HERO_IMAGES_HARD_MAX = 10
export const DEFAULT_HERO_LABELS = [
  "Farm Setup",
  "Poultry Farming",
  "Feeding Systems",
  "Equipment Service",
]

// No pictures
export const DEFAULT_HERO_BACKGROUNDS = [
  "linear-gradient(135deg,#2C2010,#1A1208)",
  "linear-gradient(135deg,#2C2010,#1A1208)",
  "linear-gradient(135deg,#3A2A18,#221A10)",
  "linear-gradient(135deg,#281E12,#1C140C)",
]

// Default 4 boxes
export function createDefaultHeroCards() {
  return DEFAULT_HERO_LABELS.map((label) => ({
    label,
    images: [""],
  }))
}

// Default mosaics
export function createDefaultHeroMosaic() {
  return DEFAULT_HERO_LABELS.map((label, i) => ({
    label,
    images: [""],
    bg: DEFAULT_HERO_BACKGROUNDS[i] || DEFAULT_HERO_BACKGROUNDS[0],
  }))
}

// Normalize API payload
export function normalizeHeroCardsFromApi(cards) {
  if (!Array.isArray(cards) || cards.length !== HERO_BOX_COUNT) return null

  return cards.map((card, index) => {
    const label =
      typeof card.label === "string" && card.label.trim()
        ? card.label.trim()
        : DEFAULT_HERO_LABELS[index] || `Box ${index + 1}`

    let images = []
    if (Array.isArray(card.images)) {
      images = card.images.map((x) => (typeof x === "string" ? x : ""))
    } else if (typeof card.image === "string" && card.image) {
      images = [card.image]
    } else {
      images = []
    }

    if (images.length > HERO_IMAGES_HARD_MAX) {
      images = images.slice(0, HERO_IMAGES_HARD_MAX)
    }

    return { label, images }
  })
}

export function validateHeroCardsForSave(cards) {
  if (!Array.isArray(cards) || cards.length !== HERO_BOX_COUNT) {
    return `Exactly ${HERO_BOX_COUNT} hero boxes are required.`
  }

  for (let i = 0; i < cards.length; i++) {
    const imgs = cards[i]?.images
    if (!Array.isArray(imgs)) {
      return `Box ${i + 1}: images must be an array.`
    }
    
    if (imgs.length > HERO_IMAGES_HARD_MAX) {
      return `Box ${i + 1}: at most ${HERO_IMAGES_HARD_MAX} images.`
    }
  }
  return null
}
