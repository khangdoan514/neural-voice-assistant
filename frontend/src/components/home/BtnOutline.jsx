import { Link } from "react-router-dom"

export default function BtnOutline({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-block no-underline transition-all duration-200 bg-white text-nav-text px-8 py-3.5 font-label font-bold text-label tracking-[2px] uppercase border-1 border-nav-text hover:border-rust hover:text-rust"
    >
      {children}
    </Link>
  )
}