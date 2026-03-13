import { Link } from "react-router-dom"

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
    heading: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Hours of Operation", to: "/contact" },
      { label: "Privacy Policy", to: "/privacy" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#0D0B08] py-16 px-20 pt-10 pb-5 border-t border-rust/20">
      <div className="grid gap-16 mb-10" style={{ gridTemplateColumns: "3fr 1fr 1fr 1fr" }}>
        <div>
          <div className="font-display text-3xl tracking-[3px] text-white mb-4">
            East Texas <span className="text-rust">Poultry Supply</span>
          </div>
          <p className="text-base text-gray-500 leading-relaxed font-light mb-6">
            Top quality poultry equipment at competitive prices, backed by decades of expertise and a service team dedicated to your success.
          </p>
          <div className="font-label text-md tracking-[3px] uppercase text-rust border border-rust/30 inline-block px-3 py-1.5">
            Est. 1958 · Center, Texas
          </div>
        </div>

        {FOOTER_SECTIONS.map(({ heading, links }) => (
          <div key={heading}>
            <h4 className="font-label text-md font-bold tracking-[3px] uppercase text-white mb-5">{heading}</h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              {links.map(({ label, to }) => (
                <li key={label} className="m-0 p-0">
                  <Link
                    to={to}
                    className="transition-colors duration-200 text-gray-500 text-lg hover:text-rust"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-gray-800 pt-6">
        <span className="text-sm text-gray-500">
          Copyright © 2026 <span className="text-rust">&nbsp;East Texas Poultry Supply</span> — All Rights Reserved
        </span>
        <span className="text-sm text-gray-500">Center, TX &amp; Gonzales, TX</span>
      </div>
    </footer>
  )
}