import Eyebrow from "../components/home/Eyebrow.jsx"
import BtnOutline from "../components/home/BtnOutline.jsx"
import BtnPrimary from "../components/home/BtnPrimary.jsx"
import ProductCard from "../components/home/ProductCard.jsx"
import ServiceArea from "../components/home/ServiceArea.jsx"
import ServiceCard from "../components/home/ServiceCard.jsx"

// Data arrays
const SERVICES = [
  { title: "New Farm Construction", desc: "Full-service buildout for new poultry operations. From layout to final equipment installation, we handle every detail." },
  { title: "Retro Older Houses", desc: "Modernize aging facilities with updated systems and equipment. Increase efficiency without a full rebuild." },
  { title: "In-House Shop", desc: "Our busy repair shop handles motors, medication pumps, bearings, and all manner of poultry and farm equipment." },
  { title: "On-Farm Repair", desc: "We come to you. Our trained team provides on-site diagnostics and repair to minimize your downtime." },
]

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
]

const TIMELINE = [
  { year: "1958", title: "Founded in Center, TX", desc: "East Texas Poultry Supply opens its doors, serving local poultry growers with quality equipment." },
  { year: "Grew", title: "Expanded Service Area", desc: "Growth into south and central Texas as demand from growers across the region increased." },
  { year: "+TX", title: "Gonzales, TX Location", desc: "Second warehouse opens, extending full-service coverage to south and central Texas." },
  { year: "Now", title: "TX, LA & Beyond", desc: "Shipping poultry equipment and supplies anywhere in the world from our retail outlet." },
]

const MARQUEE_ITEMS = [
  "Feeding Systems", "Watering Systems", "Heating Systems", "Cooling Systems",
  "LED Lighting", "Fan Systems", "Controllers", "Roll Seal Doors",
  "Cleanout Equipment", "On-Farm Repair", "New Construction",
]

const STATS = [
  ["65+", "Years in Business"],
  ["2", "Locations"],
  ["100s", "Farms Served"]
]

const HERO_MOSAIC = [
  { label: "Poultry Farming", span: true, bg: "linear-gradient(135deg,#2C2010,#1A1208)" },
  { label: "Feeding Systems", span: false, bg: "linear-gradient(135deg,#3A2A18,#221A10)" },
  { label: "Equipment Service", span: false, bg: "linear-gradient(135deg,#281E12,#1C140C)" },
]

// Section Components
function Hero() {
  return (
    <section className="relative min-h-screen grid pt-16 overflow-hidden bg-barn" style={{ gridTemplateColumns: "1fr 1fr" }}>
      {/* Background Effects */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 70% 50%, rgba(196,82,26,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(212,180,131,0.04) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(196,82,26,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,82,26,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Left Content */}
      <div className="relative z-10 flex flex-col justify-center p-20">
        <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <Eyebrow>Serving Poultry Growers Since 1958</Eyebrow>
        </div>

        <h1 className="animate-fade-up font-display text-[clamp(56px,7vw,96px)] leading-[0.95] text-nav-text mb-3" style={{ animationDelay: "0.2s" }}>
          If It Goes In A{" "}
          <span className="text-rust block mt-4 mb-4">Poultry House,</span>
          We Have It.
        </h1>

        <p className="animate-fade-up font-display text-[clamp(18px,2.5vw,28px)] tracking-[4px] text-mid text-muted mb-8" style={{ animationDelay: "0.3s" }}>
          East Texas · Louisiana · South &amp; Central Texas
        </p>

        <p className="animate-fade-up text-base leading-relaxed text-muted max-w-md mb-12 font-light" style={{ animationDelay: "0.4s" }}>
          Top quality equipment at competitive prices, backed by a{" "}
          <strong className="text-nav-text font-medium">well-trained service team</strong>{" "}
          ready to help growers achieve success — just as we have for over half a century.
        </p>

        <div className="flex gap-4 items-center animate-fade-up mb-16" style={{ animationDelay: "0.5s" }}>
          <BtnPrimary to="/products">Browse Products</BtnPrimary>
          <BtnOutline to="/contact">Get a Quote</BtnOutline>
        </div>

        {/* Stats */}
        <div className="flex gap-10 animate-fade-up pt-10 border-t border-mid/20" style={{ animationDelay: "0.6s" }}>
          {STATS.map(([num, label]) => (
            <div key={label}>
              <div className="font-display text-[42px] text-rust leading-none">{num}</div>
              <div className="font-label text-xs font-semibold tracking-[2px] uppercase text-muted mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Mosaic */}
      <div className="relative z-10 grid overflow-hidden gap-0.5" style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
        {HERO_MOSAIC.map(({ label, span, bg }) => (
          <div
            key={label}
            className="relative flex items-center justify-center overflow-hidden"
            style={{ background: bg, gridRow: span ? "span 2" : undefined }}
          >
            <span className="absolute bottom-3 left-3 font-label text-[15px] font-bold tracking-[2px] uppercase text-straw bg-nav-text/10 px-2 py-1 backdrop-blur-sm">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  
  return (
    <div className="bg-rust py-4 overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-block">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-label text-lg tracking-[4px] text-white/90 px-10"
          >
            <span className="text-white/40">◆  </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function About() {
  return (
    <section
      className="grid gap-20 items-center py-24 px-20 bg-barn"
      style={{ gridTemplateColumns: "1fr 1fr" }}
    >
      <div>
        <Eyebrow>Our Story</Eyebrow>
        <h2 className="font-display text-[clamp(36px,4vw,56px)] leading-tight text-nav-text mb-6">
          Built on <span className="text-rust">Trust.</span><br />
          Proven Over <span className="text-rust">Decades.</span>
        </h2>
        
        <p className="text-base leading-relaxed text-muted font-light mb-5">
          <strong className="text-nav-text font-medium">East Texas Poultry Supply</strong> has proven their ability to help poultry growers achieve success for over half a century. We offer top quality equipment at competitive prices and have a well-trained service team ready to assist.
        </p>
        
        <p className="text-base leading-relaxed text-muted font-light mb-5">
          Founded in Center, Texas in 1958, we've expanded to include a second location in Gonzales, Texas — allowing us to serve south, central, and north Texas, plus Louisiana.
        </p>
        
        <p className="text-base leading-relaxed text-muted font-light mb-5">
          Beyond poultry, our retail store stocks water storage tanks, pressure pumps, HVAC motors, capacitors, drive belts, and bearings for farm or industrial use. <strong className="text-nav-text font-medium">We ship worldwide.</strong>
        </p>
        
        <div className="mt-8">
          <BtnPrimary to="/about">About Our Company</BtnPrimary>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col">
        {TIMELINE.map(({ year, title, desc }, index) => (
          <div
            key={year}
            className="grid relative py-6 border-b border-mid/20"
            style={{ gridTemplateColumns: "80px 1fr", gap: "24px" }}
          >
            {index < TIMELINE.length - 1 && (
              <div className="absolute left-[76px] top-0 bottom-0 w-0.5 bg-rust/20" />
            )}
            <div className="font-display text-[28px] text-rust leading-none">{year}</div>
            <div className="text-sm leading-relaxed text-muted pt-1.5">
              <strong className="text-nav-text block text-base mb-1">{title}</strong>
              {desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="py-24 px-20 bg-barn">
      <div className="mb-16">
        <Eyebrow>What We Do</Eyebrow>
        <h2 className="font-display text-[clamp(36px,4vw,56px)] leading-none text-nav-text">
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
  )
}

function Products() {
  return (
    <section className="bg-mid/5 py-24 px-20">
      <div className="mb-16">
        <Eyebrow>What We Sell</Eyebrow>
        <h2 className="font-display text-[clamp(36px,4vw,56px)] leading-none text-nav-text">
          Product <span className="text-rust">Categories</span>
        </h2>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
        {PRODUCTS.map((product) => (
          <ProductCard key={product.name} {...product} />
        ))}
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="relative text-center overflow-hidden py-24 px-20 bg-barn">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(196,82,26,0.08) 0%, transparent 65%)" }}
      />
      
      <h2 className="relative font-display text-[clamp(36px,6vw,72px)] leading-[0.95] text-nav-text mb-6">
        Ready to <span className="text-rust">Equip</span><br />Your Farm?
      </h2>
      
      <p className="relative mx-auto text-base text-muted mb-12 max-w-md leading-relaxed">
        Reach out for quotes on new construction, equipment, or retrofit projects. Customer satisfaction is job one.
      </p>
      
      <div className="flex gap-4 justify-center relative">
        <BtnPrimary to="/contact">Contact Us Today</BtnPrimary>
        <BtnOutline to="/products">Browse All Products</BtnOutline>
      </div>
    </section>
  )
}

// Main Export
export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Products />
      <ServiceArea />
      <CTA />
    </main>
  )
}