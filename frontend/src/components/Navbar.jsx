import { Link } from "react-router-dom"
import { useState } from "react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)

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
        { to: "/products/equipment", label: "Used Equipment" },
      ],
    },
    { to: "/pictures", label: "Pictures" },
    {
      label: "Support",
      children: [
        { to: "/support/about", label: "About Us" },
        { to: "/support/contact", label: "Contact Us" },
        { to: "/support/request", label: "Service Request" },
        { to: "/support/privacy", label: "Terms & Privacy" },
      ],
    },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 h-16 flex items-center justify-between px-4 lg:px-12 bg-paper/96 backdrop-blur-md border-b border-rust/30">
      {/* ==================== Logo ==================== */}
      <Link
        to="/"
        className="flex items-center h-full gap-2 text-foreground font-label font-semibold text-xl tracking-[2px]"
        onClick={() => setMobileMenuOpen(false)}
      >
        East Texas
        <span className="text-rust">Poultry Supply</span>
      </Link>

      {/* ==================== Mobile Menu Button ==================== */}
      <button 
        className="block lg:hidden bg-transparent border border-rust/50 rounded p-2 cursor-pointer z-50"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className="text-2xl text-foreground">{mobileMenuOpen ? "✕" : "☰"}</span>
      </button>

      {/* ==================== Desktop Navigation ==================== */}
      <div className="hidden lg:flex items-center h-full gap-0">
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
                className="flex items-center h-full px-5 text-foreground font-label text-[15px] font-semibold tracking-[2px] uppercase hover:text-rust transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <button
                className={`flex items-center h-full px-5 bg-transparent border-none cursor-pointer font-label text-[15px] font-semibold tracking-[2px] uppercase transition-colors duration-200 ${
                  openMenu === item.label ? "text-rust" : "text-foreground"
                }`}
              >
                {item.label} <span className="ml-1">▾</span>
              </button>
            )}

            {/* Desktop Dropdown */}
            {item.children && (
              <div
                className={`absolute top-full left-0 min-w-60 bg-paper border border-rust/30 border-t-2 border-t-rust transition-all duration-200 z-[100] ${
                  openMenu === item.label 
                    ? "opacity-100 translate-y-0 pointer-events-auto" 
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.to}
                    to={child.to}
                    className="block px-5 py-2.5 text-[13px] font-medium tracking-[1px] text-foreground border-b border-muted/10 hover:bg-rust/15 hover:text-rust hover:pl-7 transition-all duration-150"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/*  Desktop Login Button */}
        <Link
          to="/login"
          className="inline-flex items-center justify-center ml-4 px-5 py-2 bg-rust text-paper font-label text-xs font-bold tracking-[2px] uppercase hover:bg-rust-dark transition-colors duration-200"
        >
          Login
        </Link>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full h-[calc(100vh-64px)] bg-paper/98 backdrop-blur-md z-40 overflow-y-auto py-5 block lg:hidden">
          {NAV_LINKS.map((item) => (
            <div key={item.label} className="w-full border-b border-rust/10">
              {item.to ? (
                <Link
                  to={item.to}
                  className="flex items-center px-5 py-3 text-foreground font-label text-[15px] font-semibold tracking-[2px] uppercase hover:text-rust transition-colors duration-200 w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <button
                    className={`flex items-center justify-between w-full px-5 py-3 bg-transparent border-none cursor-pointer font-label text-[15px] font-semibold tracking-[2px] uppercase transition-colors duration-200 ${
                      openMenu === item.label ? "text-rust" : "text-foreground"
                    }`}
                    onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                  >
                    {item.label} <span className="ml-1">{openMenu === item.label ? "▴" : "▾"}</span>
                  </button>
                  
                  {/* Mobile Dropdown */}
                  {item.children && openMenu === item.label && (
                    <div className="bg-paper/50 pl-5">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className="block px-5 py-2.5 text-[13px] font-medium tracking-[1px] text-foreground border-l-2 border-rust hover:bg-rust/15 hover:text-rust hover:pl-7 transition-all duration-150"
                          onClick={() => {
                            setMobileMenuOpen(false)
                            setOpenMenu(null)
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          
          {/* Mobile Login Button */}
          <Link
            to="/login"
            className="flex items-center justify-center mx-5 mt-5 px-5 py-2 bg-rust text-paper font-label text-xs font-bold tracking-[2px] uppercase hover:bg-rust-dark transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  )
}