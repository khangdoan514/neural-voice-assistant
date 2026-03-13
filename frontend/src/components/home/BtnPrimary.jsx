import { Link } from "react-router-dom"

export default function BtnPrimary({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-block no-underline transition-all duration-200 bg-rust text-white px-8 py-3.5 font-label font-bold text-sm tracking-[2px] uppercase border-2 border-rust hover:bg-rust-dark hover:border-rust-dark hover:-translate-y-0.5 hover:shadow-lg"
    >
      {children}
    </Link>
  )
}