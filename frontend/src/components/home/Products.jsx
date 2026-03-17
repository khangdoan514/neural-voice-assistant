import { useState } from "react"
import Label from "../Label.jsx"

const PRODUCTS = [
  { name: "Feeding Systems", sub: "Pan feeders, augers, controllers, full chain systems", tag: "Popular" },
  { name: "Watering Systems", sub: "Nipple drinkers, pressure regulators, water tanks & pumps" },
  { name: "Heating Systems", sub: "Infraconic brooders, radiant heaters, forced air units" },
  { name: "Cooling Systems", sub: "Evaporative cooling pads, misters, tunnel ventilation" },
  { name: "Fans", sub: "Box fans, tunnel fans, circulation and exhaust solutions" },
  { name: "Controllers", sub: "Environmental controllers, tunnel timers, system automation", tag: "New" },
  { name: "Roll Seal Doors", sub: "Insulated tunnel door systems for optimal airflow control" },
  { name: "LED Lighting", sub: "Energy-efficient lighting designed for poultry environments" },
  { name: "Cleanout Equipment", sub: "Litter windrowers, belt scrapers, wash-down systems" },
  { name: "Motors & Belts", sub: "HVAC motors, capacitors, contactors, drive belts & bearings" },
];

function ProductCard({ name, sub, tag }) {
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
      <p className="text-body leading-relaxed text-muted font-light">{sub}</p>
    </div>
  )
}

export default function Products() {
  return (
    <section className="bg-mid/5 py-[clamp(3rem,8vw,6rem)] px-[clamp(1.5rem,5vw,5rem)]">
      <div className="mb-4">
        <Label>What We Sell</Label>
        <h2 className="font-display leading-none text-title text-nav-text">
          Product <span className="text-rust">Categories</span>
        </h2>
      </div>
      <p className="text-md text-muted leading-relaxed mb-16 font-light">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis dolorum ea mollitia eum quas! Ipsum quia ducimus reiciendis unde!{" "}
        <strong className="text-nav-text">ipsum dolor sit amet consectetur, adipisicing elit</strong>.
      </p>

      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
        {PRODUCTS.map((product) => (
          <ProductCard key={product.name} {...product} />
        ))}
      </div>
    </section>
  );
}