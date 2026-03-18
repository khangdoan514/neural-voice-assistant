import { Link } from "react-router-dom"

export default function Shop() {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-6xl text-rust mb-4">Shop</h1>
        <p className="text-muted max-w-2xl px-4">
          Our shop services are designed for optimal performance and energy efficiency.
        </p>
        <Link to="/" className="inline-block mt-8 text-rust hover:text-rust-light">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}