import { useState } from "react"
import { loginApi } from "../api/loginAPI"

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = (email, password) => {
    const newErrors = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    return newErrors
  }

  const login = async (email, password, rememberMe) => {
    const validationErrors = validateForm(email, password)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return { success: false, errors: validationErrors }
    }

    setErrors({})
    setIsLoading(true)

    try {
      const result = await loginApi(email, password)

      if (result.ok) {
        const data = result.data
        if (rememberMe) {
          localStorage.setItem("accessToken", data.access_token)
          localStorage.setItem("refreshToken", data.refresh_token)
          localStorage.setItem("user", JSON.stringify(data.user))
        } else {
          sessionStorage.setItem("accessToken", data.access_token)
          sessionStorage.setItem("refreshToken", data.refresh_token)
          sessionStorage.setItem("user", JSON.stringify(data.user))
        }

        return {
          success: true,
          user: data.user,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        }
      }

      if ("error" in result && result.error) {
        setErrors({ general: result.error })
        return { success: false, error: result.error }
      }

      const data = result.data || {}
      setErrors({ general: data.error || "Invalid email or password" })
      return { success: false, error: data.error }
    } finally {
      setIsLoading(false)
    }
  }

  const clearErrors = () => {
    setErrors({})
  }

  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }))
    }
  }

  return { login, isLoading, errors, clearErrors, clearFieldError }
}
