import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function ScrollToTop() {
  const { pathname } = useLocation()

  // Route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Page reload
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return null
}