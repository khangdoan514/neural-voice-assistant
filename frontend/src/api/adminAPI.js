const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001"

async function adminJson(accessToken, path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers || {}),
    },
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  
  return data
}

export async function fetchAdminProfileApi(accessToken) {
  if (!accessToken) return null
  const data = await adminJson(accessToken, "/api/admin/profile", { method: "GET" })
  if (!data.success || !data.user) {
    throw new Error(data.error || "Failed to load admin profile")
  }

  return data.user
}

export async function updateAdminProfileApi(accessToken, updates) {
  if (!accessToken) return null
  const data = await adminJson(accessToken, "/api/admin/profile", {
    method: "PUT",
    body: JSON.stringify(updates || {}),
  })

  if (!data.success || !data.user) {
    throw new Error(data.error || "Failed to update admin profile")
  }

  return data.user
}

export async function fetchConversationsListApi() {
  const data = await adminJson(null, "/api/conversations", { method: "GET" })
  if (Array.isArray(data)) return data
  if (data && typeof data === "object") {
    const arr = Object.values(data)
    return Array.isArray(arr) ? arr : []
  }

  return []
}

export async function fetchConversationContentApi(filename) {
  const data = await adminJson(null, `/api/conversations/${encodeURIComponent(filename)}`, {
    method: "GET",
  })
  
  if (!data || typeof data.content === "undefined") {
    throw new Error("Invalid conversation response")
  }

  return data
}

export async function fetchHomeHeroCardsApi() {
  const res = await fetch(`${API_BASE_URL}/api/content/home-hero`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  
  if (!data.success) {
    throw new Error(data.error || "Failed to load home hero content")
  }
  
  return data.cards
}

export async function saveHomeHeroCardsApi(accessToken, cards) {
  if (!accessToken) {
    throw new Error("Not authenticated")
  }
  
  const data = await adminJson(accessToken, "/api/admin/content/home-hero", {
    method: "PUT",
    body: JSON.stringify({ cards }),
  })
  
  if (!data.success) {
    throw new Error(data.error || "Failed to save home hero content")
  }

  return data.cards
}
