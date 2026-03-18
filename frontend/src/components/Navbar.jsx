import { Link } from "react-router-dom"
import { useState } from "react"

export default function Navbar() {
  const NAV_LINKS = [
    { to: "/", label: "Home" },
    {
      label: "Services",
      children: [
        { to: "/services/construction", label: "New Farm Construction" },
        { to: "/services/retro", label: "Retro Older Houses" },
        { to: "/services/shop", label: "In-House Shop" },
        { to: "/services/repair", label: "On-Farm Repair" },
      ],
    },
    {
      label: "Products",
      children: [
        { to: "/products/feeding", label: "Feeding Systems" },
        { to: "/products/watering", label: "Watering Systems" },
        { to: "/products/heating", label: "Heating Systems" },
        { to: "/products/cooling", label: "Cooling Systems" },
        { to: "/products/fans", label: "Fans" },
        { to: "/products/controllers", label: "Controllers" },
        { to: "/products/lighting", label: "LED Lighting" },
        { to: "/products/cleanout", label: "Cleanout Equipment" },
      ],
    },
    { to: "/pictures", label: "Pictures" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ]

  const [openMenu, setOpenMenu] = useState(null)

  return (
    <nav className="fixed top-0 w-full z-50 h-16 flex items-center justify-between px-12 bg-nav-bg/96 backdrop-blur-md border-b border-rust/30">
      {/* ==================== Logo ==================== */}
      <Link
        to="/"
        className="flex items-center h-full gap-2 text-nav-text font-label font-semibold text-xl tracking-[2px]"
      >
        East Texas
        <span className="text-rust">Poultry Supply</span>
      </Link>

      {/* ==================== Links ==================== */}
      <div className="flex items-center h-full">
        {NAV_LINKS.map((item) => (
          <div
            key={item.label}
            className="relative h-full"
            onMouseEnter={() => item.children && setOpenMenu(item.label)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            {item.to ? (
              <Link
                to={item.to}
                className="flex items-center h-full px-5 text-nav-text font-label text-[15px] font-semibold tracking-[2px] uppercase hover:text-nav-hover transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <button
                className={`flex items-center h-full px-5 bg-transparent border-none cursor-pointer font-label text-[15px] font-semibold tracking-[2px] uppercase transition-colors duration-200 ${openMenu === item.label ? "text-nav-hover" : "text-nav-text"
                  }`}
              >
                {item.label} ▾
              </button>
            )}

            {/* ==================== Dropdown ==================== */}
            {item.children && (
              <div
                className={`absolute top-full left-0 min-w-60 transition-all duration-200 bg-nav-bg border border-rust/30 border-t-2 border-t-rust ${openMenu === item.label
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.to}
                    to={child.to}
                    className="block px-5 py-2.5 text-[13px] font-medium tracking-[1px] text-nav-text border-b border-dropdown-border hover:bg-rust/15 hover:text-nav-hover hover:pl-7 transition-all duration-150"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* ==================== Login Button ==================== */}
        <Link
          to="/login"
          className="flex items-center h-auto ml-4 px-5 py-2 bg-rust text-white font-label text-xs font-bold tracking-[2px] uppercase hover:bg-rust-dark transition-colors duration-200"
        >
          Login
        </Link>
      </div>
    </nav>
  )
}