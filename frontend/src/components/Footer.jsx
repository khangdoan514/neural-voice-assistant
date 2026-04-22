import { Link } from "react-router-dom"
import { useState } from "react"

export default function Footer() {
  const [openSections, setOpenSections] = useState({})

  const toggleSection = (heading) => {
    setOpenSections(prev => ({
      ...prev,
      [heading]: !prev[heading]
    }))
  }

  const FOOTER_SECTIONS = [
    {
      heading: "Services",
      links: [
        { label: "New Farm Construction", to: "/services/construction" },
        { label: "Retro Older Houses", to: "/services/retro" },
        { label: "In-House Shop", to: "/services/shop" },
        { label: "On-Farm Repair", to: "/services/repair" },
      ],
    },
    {
      heading: "Products",
      links: [
        { label: "Feeding Systems", to: "/products/feeding" },
        { label: "Watering Systems", to: "/products/watering" },
        { label: "Heating Systems", to: "/products/heating" },
        { label: "Cooling & Fans", to: "/products/cooling" },
        { label: "Controllers", to: "/products/controllers" },
        { label: "LED Lighting", to: "/products/lighting" },
      ],
    },
    {
      heading: "Support",
      links: [
        { label: "About Us", to: "/support/about" },
        { label: "Contact", to: "/support/contact" },
        { label: "Submit a Request", to: "/support/request" },
        { label: "Privacy Policy", to: "/support/privacy" },
      ],
    },
  ]

  return (
    <footer className="bg-scrim border-t border-rust/20 overflow-x-hidden">
      <div className="max-w-full overflow-x-hidden">
        
        {/* ==================== Content ==================== */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-20 pt-10 sm:pt-12 md:pt-14 lg:pt-16 pb-4 sm:pb-5 md:pb-6">
          
          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-[3fr_1fr_1fr_1fr] gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-8 sm:mb-10">
            {/* Logo & Info Section */}
            <div>
              <div className="font-display text-2xl sm:text-3xl tracking-[2px] sm:tracking-[3px] text-paper mb-3 sm:mb-4">
                East Texas <span className="text-rust">Poultry Supply</span>
              </div>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-light mb-4 sm:mb-6">
                Top quality poultry equipment at competitive prices, backed by decades of expertise and a service team dedicated to your success.
              </p>
              <div className="font-label text-xs sm:text-sm md:text-md tracking-[2px] sm:tracking-[3px] uppercase text-rust border border-rust/30 inline-block px-3 py-1.5">
                Est. 1958 · Center, Texas
              </div>
            </div>

            {/* Footer Sections */}
            {FOOTER_SECTIONS.map(({ heading, links }) => (
              <div key={heading}>
                <h4 className="font-label text-sm sm:text-base font-bold tracking-[2px] sm:tracking-[3px] uppercase text-paper mb-4 sm:mb-5">
                  {heading}
                </h4>
                <ul className="flex flex-col gap-2 sm:gap-2.5 list-none p-0 m-0">
                  {links.map(({ label, to }) => (
                    <li key={label} className="m-0 p-0">
                      <Link
                        to={to}
                        className="transition-colors duration-200 text-gray-500 text-sm sm:text-base hover:text-rust"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Tablet & Desktop Alternate Layout */}
          <div className="lg:hidden">
            {/* Logo & Info Section */}
            <div className="mb-8 sm:mb-10">
              <div className="font-display text-2xl sm:text-3xl tracking-[2px] sm:tracking-[3px] text-paper mb-3 sm:mb-4">
                East Texas <span className="text-rust">Poultry Supply</span>
              </div>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-light mb-4 sm:mb-6">
                Top quality poultry equipment at competitive prices, backed by decades of expertise and a service team dedicated to your success.
              </p>
              <div className="font-label text-xs sm:text-sm md:text-md tracking-[2px] sm:tracking-[3px] uppercase text-rust border border-rust/30 inline-block px-3 py-1.5">
                Est. 1958 · Center, Texas
              </div>
            </div>

            {/* 3 Columns */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-3 gap-4 sm:gap-3 md:gap-4 lg:gap-6 mb-8 sm:mb-10">
                {FOOTER_SECTIONS.map(({ heading, links }) => (
                  <div key={heading}>
                    <h4 className="font-label text-xs sm:text-sm font-bold tracking-[2px] uppercase text-paper mb-3">
                      {heading}
                    </h4>
                    <ul className="flex flex-col gap-1.5 sm:gap-2 list-none p-0 m-0">
                      {links.map(({ label, to }) => (
                        <li key={label} className="m-0 p-0">
                          <Link
                            to={to}
                            className="transition-colors duration-200 text-gray-500 text-xs sm:text-sm hover:text-rust"
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* < 640px */}
            <div className="sm:hidden">
              {FOOTER_SECTIONS.map(({ heading, links }) => (
                <div key={heading} className="border-b border-gray-800">
                  <button
                    onClick={() => toggleSection(heading)}
                    className="flex items-center justify-between w-full py-3 text-left"
                  >
                    <h4 className="font-label text-sm font-bold tracking-[2px] uppercase text-paper">
                      {heading}
                    </h4>
                    <span className="text-rust text-lg">
                      {openSections[heading] ? "▴" : "▾"}
                    </span>
                  </button>
                  {openSections[heading] && (
                    <ul className="flex flex-col gap-2 pb-3 pl-2 list-none">
                      {links.map(({ label, to }) => (
                        <li key={label}>
                          <Link
                            to={to}
                            className="transition-colors duration-200 text-gray-500 text-sm hover:text-rust block py-1"
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ==================== Copyright ==================== */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 border-t border-gray-800 pt-5 sm:pt-6 mt-2">
            <span className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              Copyright © 2026 <span className="text-rust">East Texas Poultry Supply</span> — All Rights Reserved
            </span>
            <span className="text-xs sm:text-sm text-gray-500 text-center sm:text-right">
              Center, TX 
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}