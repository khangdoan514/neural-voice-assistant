import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { useLogin } from "../hooks/useLogin"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })
  const navigate = useNavigate()
  
  // Use hook
  const { login, isLoading, errors, clearFieldError } = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const result = await login(formData.email, formData.password, formData.rememberMe)
    
    if (result.success) {
      if (result.user.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/dashboard")
      }
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
    // Clear error for this field when user starts typing
    clearFieldError(name)
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-barn py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/5 backdrop-blur-sm p-10 rounded-xl border border-rust/20">
        {/* Header */}
        <div>
          <h2 className="text-center font-display text-4xl text-nav-text mb-2">
            Admin <span className="text-rust">Login</span>
          </h2>
          <p className="text-center text-muted text-sm">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-label text-cream mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-charcoal border ${
                  errors.email ? 'border-rust' : 'border-rust/30'
                } rounded-lg text-nav-text placeholder-muted/50 focus:outline-none focus:border-rust transition-colors`}
                placeholder="admin@etpoultry.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-label text-cream mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-charcoal border ${
                    errors.password ? 'border-rust' : 'border-rust/30'
                  } rounded-lg text-nav-text placeholder-muted/50 focus:outline-none focus:border-rust transition-colors pr-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-cream transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-rust bg-charcoal border-rust/30 rounded focus:ring-rust"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-muted">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="text-rust hover:text-rust-light transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-rust hover:bg-rust-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rust disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted hover:text-rust transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}