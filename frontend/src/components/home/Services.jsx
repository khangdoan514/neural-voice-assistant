import { useState } from "react"
import Label from "../Label.jsx"

const SERVICES = [
  { title: "New Farm Construction", desc: "Full-service buildout for new poultry operations. From layout to final equipment installation, we handle every detail." },
  { title: "Retro Older Houses", desc: "Modernize aging facilities with updated systems and equipment. Increase efficiency without a full rebuild." },
  { title: "In-House Shop", desc: "Our busy repair shop handles motors, medication pumps, bearings, and all manner of poultry and farm equipment." },
  { title: "On-Farm Repair", desc: "We come to you. Our trained team provides on-site diagnostics and repair to minimize your downtime." },
];

function ServiceCard({ title, desc }) {
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
      <p className="text-body leading-relaxed text-muted font-light">{desc}</p>

      <div
        className={`transition-all duration-300 mt-6 font-label text-xs font-bold tracking-[2px] uppercase ${hovered ? "opacity-100 text-rust" : "opacity-30"
          }`}
      >
        Learn More →
      </div>
    </div>
  )
}

export default function Services() {
  return (
    <section className="py-[clamp(3rem,8vw,6rem)] px-[clamp(1.5rem,5vw,5rem)] bg-barn">
      <div className="mb-16">
        <Label>What We Do</Label>
        <h2 className="font-display leading-none text-title text-nav-text">
          Our <span className="text-rust">Services</span>
        </h2>
      </div>

      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(4,1fr)" }}
      >
        {SERVICES.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </section>
  );
}