import { useState } from "react"

export default function ProductCard({ name, sub, tag }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`relative cursor-pointer transition-all duration-200 p-7 bg-white ${hovered
        ? "border border-rust -translate-y-1 shadow-lg"
        : "border border-mid/20"
        }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {tag && (
        <span className="absolute top-3 right-3 text-[12px] font-bold tracking-[1px] uppercase bg-rust text-white px-1.5 py-0.5">
          {tag}
        </span>
      )}

      <h4 className="font-label text-xl font-bold tracking-[1px] uppercase text-nav-text mb-2">{name}</h4>
      <p className="text-md text-muted leading-relaxed">{sub}</p>
    </div>
  )
}