import { Link } from "react-router-dom"

const FOOTER_SECTIONS = [
  { heading: "Services", links: ["New Farm Construction", "Retro Older Houses", "In-House Shop", "On-Farm Repair"] },
  { heading: "Products", links: ["Feeding Systems", "Watering Systems", "Heating Systems", "Cooling & Fans", "Controllers", "LED Lighting"] },
  { heading: "Company", links: ["About Us", "Contact", "Hours of Operation", "Privacy Policy"] },
]

export default function Footer() {
  return (
    <footer className="bg-[#0D0B08] py-16 px-20 pt-16 pb-10 border-t border-rust/20">
      <div className="grid gap-16 mb-16" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
        <div>
          <div className="font-display text-2xl tracking-[3px] text-white mb-4">
            East Texas <span className="text-rust">Poultry Supply</span>
          </div>
          <p className="text-lg text-gray-500 leading-relaxed font-light mb-6">
            Top quality poultry equipment at competitive prices, backed by decades of expertise and a service team dedicated to your success.
          </p>
          <div className="font-label text-sm tracking-[3px] uppercase text-rust border border-rust/30 inline-block px-3 py-1.5">
            Est. 1958 · Center, Texas
          </div>
        </div>

        {FOOTER_SECTIONS.map(({ heading, links }) => (
          <div key={heading}>
            <h4 className="font-label text-lg font-bold tracking-[3px] uppercase text-white mb-5">{heading}</h4>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {links.map(link => (
                <li key={link} className="m-0 p-0">
                  <Link to="#" className="no-underline transition-colors duration-200 text-gray-500 text-md hover:text-rust">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-gray-800 pt-6">
        <span className="text-sm text-gray-500">© 2026 <span className="text-rust">East Texas Poultry Supply</span> — All Rights Reserved</span>
        <span className="text-sm text-gray-500">Center, TX &amp; Gonzales, TX</span>
      </div>
    </footer>
  )
}