import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { motion, useInView } from "framer-motion"
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

/* ============================== Variants ============================== */
const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}

const sectionStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const contentStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

// ============================== Functions ==============================
function Section({ children, className = "", style }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-6% 0px" })
  return (
    <motion.section
      ref={ref}
      variants={sectionStagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
      style={style}
    >
      {children}
    </motion.section>
  )
}

function SectionHeader({ label, title, titleHighlight, description = "", className = "" }) {
  return (
    <>
      <motion.div variants={reveal} className={`mb-4 ${className}`}>
        <div className="flex items-center gap-3 mb-5 font-label font-section-label font-bold tracking-[4px] uppercase text-rust">
          <span className="block w-8 h-0.5 bg-rust" />
          {label}
        </div>
        <h2 className="font-display text-title leading-none text-nav-text">
          {title} {titleHighlight && <span className="text-rust">{titleHighlight}</span>}
        </h2>
      </motion.div>
      <motion.p variants={reveal} className="text-md text-muted leading-relaxed mb-16 font-light">
        {description}
      </motion.p>
    </>
  )
}

function Label({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5 font-label font-section-label font-bold tracking-[4px] uppercase text-rust">
      <span className="block w-8 h-0.5 bg-rust" />
      {children}
    </div>
  )
}

function Title({ children, className = "" }) {
  return (
    <h2 className={`font-display leading-tight text-title text-nav-text mb-6 ${className}`}>
      {children}
    </h2>
  )
}

function PrimaryButton({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-block no-underline transition-all duration-200 bg-rust text-white px-8 py-3.5 font-label font-bold text-body tracking-[2px] uppercase border-2 border-rust hover:bg-rust-dark hover:border-rust-dark hover:-translate-y-0.5 hover:shadow-lg"
    >
      {children}
    </Link>
  )
}

function OutlineButton({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-block no-underline transition-all duration-200 bg-white text-nav-text px-8 py-3.5 font-label font-bold text-body tracking-[2px] uppercase border-1 border-nav-text hover:border-rust hover:text-rust"
    >
      {children}
    </Link>
  )
}

// ============================== Hero ==============================
function Hero() {
  const STATS = [
    ["75+", "Years in Business"],
    ["2", "Locations"],
    ["100s", "Farms Served"]
  ];

  const HERO_MOSAIC = [
    { label: "Something", bg: "linear-gradient(135deg,#2C2010,#1A1208)" },
    { label: "Poultry Farming", bg: "linear-gradient(135deg,#2C2010,#1A1208)" },
    { label: "Feeding Systems", bg: "linear-gradient(135deg,#3A2A18,#221A10)" },
    { label: "Equipment Service", bg: "linear-gradient(135deg,#281E12,#1C140C)" },
  ];

  return (
    <section className="relative min-h-screen grid pt-16 overflow-hidden bg-barn" style={{ gridTemplateColumns: "1fr 1fr" }}>
      {/* ==================== Background Effects ==================== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 70% 50%, rgba(196,82,26,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(212,180,131,0.04) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(196,82,26,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(196,82,26,0.07) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* ==================== Left - Content ==================== */}
      <motion.div
        className="relative z-10 flex flex-col justify-center p-[clamp(1.5rem,5vw,5rem)]"
        variants={sectionStagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={reveal}>
          <Label>Serving Poultry Growers Since 1958</Label>
        </motion.div>

        <motion.h1
          className="font-display text-hero leading-[0.95] text-nav-text mb-3"
          variants={reveal}
        >
          If It Goes In A{" "}
          <span className="text-rust block mt-4 mb-4">Poultry House,</span>
          We Have It.
        </motion.h1>

        <motion.p
          className="font-display text-subtitle tracking-[4px] text-muted mb-4 mt-4"
          variants={reveal}
        >
          East Texas · Louisiana · South &amp; Central Texas
        </motion.p>

        <motion.p
          className="leading-relaxed text-body text-muted max-w-md mb-8 font-light"
          variants={reveal}
        >
          Top quality equipment at competitive prices, backed by a{" "}
          <strong className="text-nav-text font-medium">well-trained service team</strong>{" "}
          ready to help growers achieve success — just as we have for over half a century.
        </motion.p>

        <motion.div
          className="flex gap-4 items-center mb-12"
          variants={reveal}
        >
          <PrimaryButton to="/products">Browse Products</PrimaryButton>
          <OutlineButton to="/contact">Get a Quote</OutlineButton>
        </motion.div>

        {/* ==================== Stats ==================== */}
        <motion.div
          className="flex gap-[clamp(1.5rem,4vw,2.5rem)] border-t border-mid/20 pt-[clamp(1.5rem,3vw,2rem)]"
          variants={contentStagger}
        >
          {STATS.map(([num, label]) => (
            <motion.div key={label} variants={reveal}>
              <div className="font-display text-title text-rust leading-none">{num}</div>
              <div className="font-label font-semibold text-body tracking-[2px] uppercase text-muted mt-1">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ==================== Right - Mosaic ==================== */}
      <motion.div
        className="relative z-10 grid overflow-hidden gap-0.5"
        style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}
        variants={contentStagger}
        initial="hidden"
        animate="visible"
      >
        {HERO_MOSAIC.map(({ label, bg }) => (
          <motion.div
            key={label}
            className="relative flex items-center justify-center overflow-hidden"
            style={{ background: bg }}
            variants={reveal}
          >
            <span className="absolute bottom-3 left-3 font-label font-bold tracking-[2px] uppercase text-straw bg-nav-text/10 px-2 py-1 backdrop-blur-sm" style={{ fontSize: "var(--text-sm)" }}>
              {label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ============================== Marquee ==============================
function Marquee() {
  const MARQUEE_ITEMS = [
    "Feeding Systems", "Watering Systems", "Heating Systems", "Cooling Systems",
    "LED Lighting", "Fan Systems", "Controllers", "Roll Seal Doors",
    "Cleanout Equipment", "On-Farm Repair", "New Construction",
  ];

  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="bg-rust py-4 overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-block">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-label text-section-label tracking-[4px] text-white/90 px-10"
          >
            <span className="text-white/40">◆  </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================== About ==============================
function About() {
  const TIMELINE = [
    { year: "1958", title: "Founded in Center, TX", desc: "East Texas Poultry Supply opens its doors, serving local poultry growers with quality equipment." },
    { year: "Grew", title: "Expanded Service Area", desc: "Growth into south and central Texas as demand from growers across the region increased." },
    { year: "+TX", title: "Gonzales, TX Location", desc: "Second warehouse opens, extending full-service coverage to south and central Texas." },
    { year: "Now", title: "TX, LA & Beyond", desc: "Shipping poultry equipment and supplies anywhere in the world from our retail outlet." },
  ];

  return (
    <Section
      className="grid gap-[clamp(2rem,5vw,5rem)] items-center py-[clamp(3rem,8vw,6rem)] px-[clamp(1.5rem,5vw,5rem)] bg-barn"
      style={{ gridTemplateColumns: "repeat(2,1fr)" }}
    >
      {/* ==================== Left - Story ==================== */}
      <motion.div variants={reveal}>
        <Label>Our Story</Label>
        <Title>
          Built on <span className="text-rust">Trust.</span><br />
          Proven Over <span className="text-rust">Decades.</span>
        </Title>

        <p className="leading-relaxed text-muted text-body font-light mb-5">
          <strong className="text-nav-text font-medium">East Texas Poultry Supply</strong> has proven their ability to help poultry growers achieve success for over half a century. We offer top quality equipment at competitive prices and have a well-trained service team ready to assist.
        </p>

        <p className="leading-relaxed text-muted text-body font-light mb-5">
          Founded in Center, Texas in 1958, we've expanded to include a second location in Gonzales, Texas — allowing us to serve south, central, and north Texas, plus Louisiana.
        </p>

        <p className="leading-relaxed text-muted text-body font-light mb-5">
          Beyond poultry, our retail store stocks water storage tanks, pressure pumps, HVAC motors, capacitors, drive belts, and bearings for farm or industrial use. <strong className="text-nav-text font-medium">We ship worldwide.</strong>
        </p>

        <div className="mt-8">
          <PrimaryButton to="/about">About Our Company</PrimaryButton>
        </div>
      </motion.div>

      {/* ==================== Right - Timeline ==================== */}
      <motion.div
        className="flex flex-col"
        variants={contentStagger}
      >
        {TIMELINE.map(({ year, title, desc }, index) => (
          <motion.div
            key={year}
            variants={reveal}
            className="grid relative py-6"
            style={{ gridTemplateColumns: "80px 1fr", gap: "24px" }}
          >
            {index < TIMELINE.length && (
              <div className="absolute left-[76px] top-0 bottom-0 w-0.5 bg-rust/20" />
            )}
            <div className="font-display text-subtitle text-rust leading-none">{year}</div>
            <div className="pt-1.5">
              <strong className="text-section-label text-nav-text block mb-1">{title}</strong>
              <div className="text-body">{desc}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

// ============================== Services ==============================
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

function Services() {
  const SERVICES = [
    { title: "New Farm Construction", desc: "Full-service buildout for new poultry operations. From layout to final equipment installation, we handle every detail." },
    { title: "Retro Older Houses", desc: "Modernize aging facilities with updated systems and equipment. Increase efficiency without a full rebuild." },
    { title: "In-House Shop", desc: "Our busy repair shop handles motors, medication pumps, bearings, and all manner of poultry and farm equipment." },
    { title: "On-Farm Repair", desc: "We come to you. Our trained team provides on-site diagnostics and repair to minimize your downtime." },
  ];

  return (
    <Section className="py-[clamp(3rem,8vw,6rem)] px-[clamp(1.5rem,5vw,5rem)] bg-barn">
      <SectionHeader
        label="What We Do"
        title="Our "
        titleHighlight="Services"
        description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis dolorum ea mollitia eum quas! Ipsum quia ducimus reiciendis unde!"
      />
      <motion.div
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(4,1fr)" }}
        variants={contentStagger}
      >
        {SERVICES.map((service) => (
          <motion.div key={service.title} variants={reveal}>
            <ServiceCard {...service} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

// ============================== Products ==============================
function ProductCard({ name, sub, tag }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`relative h-full cursor-pointer transition-all duration-200 p-7 bg-white ${hovered
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

function Products() {
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

  return (
    <Section className="bg-mid/5 py-[clamp(3rem,8vw,6rem)] px-[clamp(1.5rem,5vw,5rem)]">
      <SectionHeader
        label="What We Sell"
        title="Product "
        titleHighlight="Categories"
        description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis dolorum ea mollitia eum quas! Ipsum quia ducimus reiciendis unde!"
      />
      <motion.div
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(5,1fr)" }}
        variants={contentStagger}
      >
        {PRODUCTS.map((product) => (
          <motion.div key={product.name} variants={reveal}>
            <ProductCard {...product} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

// ============================== Locations ==============================
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const createMarkerIcon = (isSelected = false) => {
  const size = isSelected ? 30 : 20
  const color = isSelected ? '#E8693A' : '#C4521A'

  return new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        ${isSelected ? `
          <circle cx="12" cy="12" r="14" fill="${color}" opacity="0.3">
            <animate attributeName="r" values="10;14;10" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.5s" repeatCount="indefinite" />
          </circle>
        ` : ''}
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2">
          ${isSelected ? `
            <animate attributeName="r" values="10;11;10" dur="1s" repeatCount="indefinite" />
          ` : ''}
        </circle>
        <circle cx="12" cy="12" r="6" fill="white"/>
      </svg>
    `)}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}

function MapController({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 0.5
    })
  }, [center, zoom, map])
  return null
}

function Locations() {
  const [selectedLocation, setSelectedLocation] = useState("center")
  const [mapCenter, setMapCenter] = useState([31.7955, -94.1791])
  const [mapZoom, setMapZoom] = useState(8)

  const locations = [
    {
      id: "center",
      name: "Center, Texas — Main Store",
      address: "1592 Southview Cir, Center, TX 75935",
      phone: "(936) 555-0123",
      position: [31.776431568131077, -94.18537553195539],
      hours: "Mon-Fri: 7am-5pm, Sat: 8am-12pm",
    },
    {
      id: "gonzales",
      name: "Gonzales, Texas — Warehouse",
      address: "456 Oak Avenue, Gonzales, TX 78629",
      phone: "(830) 555-0456",
      position: [29.5016, -97.4525],
      hours: "Mon-Fri: 8am-4pm",
    },
  ]

  const handleLocationClick = (locationId) => {
    const location = locations.find(l => l.id === locationId)
    if (location) {
      setSelectedLocation(locationId)
      setMapCenter(location.position)
      setMapZoom(12)
    }
  }

  const getDirectionsLink = (position, storeName) => {
    const query = encodeURIComponent(storeName)
    return `https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}&destination_place_id=${query}`
  }

  return (
    <Section className="bg-mid/5 py-[clamp(3rem,8vw,6rem)] px-[clamp(1.5rem,5vw,5rem)]">
      <SectionHeader
        label="Where We Operate"
        title="Two "
        titleHighlight="Locations"
        description="Our primary service area covers south, central, and north Texas and extends into most of Louisiana. We also ship equipment and supplies anywhere in the world."
      />

      <motion.div
        className="grid gap-16 items-start"
        style={{ gridTemplateColumns: "1fr 1fr" }}
        variants={contentStagger}
      >
        {/* ==================== Map ==================== */}
        <motion.div
          variants={reveal}
          className="flex items-center justify-center bg-barn border border-mid/20 p-2 aspect-[4/3] overflow-hidden rounded-lg"
        >
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapController center={mapCenter} zoom={mapZoom} />
            {locations.map((location) => (
              <Marker
                key={location.id}
                position={location.position}
                icon={createMarkerIcon(selectedLocation === location.id)}
                eventHandlers={{ click: () => handleLocationClick(location.id) }}
              >
                {selectedLocation === location.id && (
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-rust text-base mb-2">{location.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                      <p className="text-sm text-gray-600 mb-2">{location.phone}</p>
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-semibold">Hours:</span> {location.hours}
                      </p>
                      <a
                        href={getDirectionsLink(location.position, location.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm bg-rust text-white px-3 py-2 rounded hover:bg-rust-dark transition-colors text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Get Directions
                      </a>
                    </div>
                  </Popup>
                )}
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        {/* ==================== Location Cards ==================== */}
        <motion.div variants={contentStagger}>
          <div className="flex flex-col gap-8 mb-8">
            {locations.map((location) => (
              <motion.div
                key={location.id}
                variants={reveal}
                onClick={() => handleLocationClick(location.id)}
                className={`
                  border-l-3 p-8
                  transition-all duration-300 cursor-pointer
                  ${selectedLocation === location.id
                    ? 'border-rust-light bg-rust/10 shadow-lg scale-105'
                    : 'border-rust bg-mid/5 hover:bg-rust/5 hover:scale-102'
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-xl tracking-[1px] uppercase text-nav-text mb-2">
                    {location.name}
                  </h4>
                  {selectedLocation === location.id && (
                    <span className="text-xs bg-rust text-white px-2 py-1 rounded">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-md text-muted mb-1">{location.address}</p>
                <p className="text-md text-muted">{location.phone}</p>

                {selectedLocation === location.id && (
                  <div className="mt-4 pt-3 border-t border-rust/20">
                    <p className="text-sm text-rust mb-2">
                      <span className="font-bold">Hours:</span> {location.hours}
                    </p>
                    <a
                      href={getDirectionsLink(location.position, location.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs bg-rust text-white px-3 py-1.5 rounded hover:bg-rust-dark transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Directions
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div variants={reveal}>
            <OutlineButton to="/contact">View All Hours & Directions</OutlineButton>
          </motion.div>
        </motion.div>
      </motion.div>
    </Section>
  )
}

// ============================== Call To Action ==============================
function CTA() {
  return (
    <Section className="relative text-center overflow-hidden py-[clamp(3rem,8vw,6rem)] px-[clamp(1.5rem,5vw,5rem)] py-20 px-20 bg-white border-t border-mid/20 border-b border-mid/20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(196,82,26,0.08) 0%, transparent 65%)" }}
      />

      <motion.h2
        variants={reveal}
        className="relative font-display leading-[0.95] text-title text-nav-text mb-6"
      >
        Ready to <span className="text-rust">Equip</span><br />Your Farm?
      </motion.h2>

      <motion.p
        variants={reveal}
        className="relative mx-auto text-body text-muted mb-12 max-w-md leading-relaxed"
      >
        Reach out for quotes on new construction, equipment, or retrofit projects. Customer satisfaction is job one.
      </motion.p>

      <motion.div variants={reveal} className="flex gap-4 justify-center relative">
        <PrimaryButton to="/contact">Contact Us Today</PrimaryButton>
        <OutlineButton to="/products">Browse All Products</OutlineButton>
      </motion.div>
    </Section>
  );
}

// ============================== Home Page ==============================
export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Products />
      <Locations />
      <CTA />
    </main>
  );
}