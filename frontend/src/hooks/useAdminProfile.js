import { useCallback, useState } from "react"
import { fetchAdminProfileApi, updateAdminProfileApi } from "../api/adminAPI"

export const useAdminProfile = () => {
  const [adminProfile, setAdminProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchAdminProfile = useCallback(async (accessToken) => {
    if (!accessToken) return null

    setIsLoading(true)
    setError("")

    try {
      const user = await fetchAdminProfileApi(accessToken)
      setAdminProfile(user)
      return user
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load admin profile"
      setError(message)
      console.error(err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateAdminProfile = useCallback(async (accessToken, updates) => {
    if (!accessToken) return null

    setIsLoading(true)
    setError("")

    try {
      const user = await updateAdminProfileApi(accessToken, updates)
      setAdminProfile(user)
      return user
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update admin profile"
      setError(message)
      console.error(err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { adminProfile, isLoading, error, fetchAdminProfile, updateAdminProfile }
}
