const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001"

export async function loginApi(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json().catch(() => ({}))
    if (response.ok && data.success) {
      return { ok: true, data }
    }
    return { ok: false, data, status: response.status }
  } catch {
    return { ok: false, error: "Unable to connect to server. Please try again." }
  }
}
