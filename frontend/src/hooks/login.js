import { useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

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
    // Validate form
    const validationErrors = validateForm(email, password)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return { success: false, errors: validationErrors }
    }
    
    // Clear previous errors
    setErrors({})
    setIsLoading(true)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store tokens
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
          refreshToken: data.refresh_token
        }
      } else {
        setErrors({ general: data.error || "Invalid email or password" })
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Login error:", error)
      const errorMessage = "Unable to connect to server. Please try again."
      setErrors({ general: errorMessage })
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const clearErrors = () => {
    setErrors({})
  }

  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: "" }))
    }
  }

  return { login, isLoading, errors, clearErrors, clearFieldError }
}