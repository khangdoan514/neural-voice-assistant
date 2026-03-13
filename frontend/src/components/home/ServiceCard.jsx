import { useState } from "react"

export default function ServiceCard({ title, desc }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`relative overflow-hidden cursor-pointer transition-all duration-300 p-10 ${hovered ? "bg-white shadow-lg" : "bg-white"
        }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 bg-rust transition-transform duration-300 ${hovered ? "scale-x-100" : "scale-x-0"
          }`}
      />

      <h3 className="font-label text-xl font-bold tracking-[1px] uppercase text-nav-text mb-3">{title}</h3>
      <p className="text-md leading-relaxed text-muted font-light">{desc}</p>

      <div
        className={`transition-all duration-300 mt-6 font-label text-xs font-bold tracking-[2px] uppercase ${hovered ? "opacity-100 text-rust" : "opacity-30"
          }`}
      >
        Learn More →
      </div>
    </div>
  )
}