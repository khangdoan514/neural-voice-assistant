import { useState, useEffect, useRef, useMemo } from "react"
import { Link } from "react-router-dom"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { fetchHomeHeroCardsApi } from "../api/adminAPI"
import { createDefaultHeroMosaic, normalizeHeroCardsFromApi } from "../lib/homeHeroCards"

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

function SectionHeader({ label, title, titleHighlight, description = "" }) {
  return (
    <>
      <motion.div variants={reveal} className="mb-4">
        <motion.div variants={reveal} className="flex items-center gap-3 mb-5 font-label font-section-label font-bold tracking-[4px] uppercase text-rust">
          <span className="block w-8 h-0.5 bg-rust" />
          {label}
        </motion.div>
        <motion.h2 variants={reveal} className="font-display text-title leading-none text-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          {title} {titleHighlight && <span className="text-rust">{titleHighlight}</span>}
        </motion.h2>
      </motion.div>
      <motion.p variants={reveal} className="text-sm sm:text-md text-muted leading-relaxed mb-8 sm:mb-12 md:mb-16 font-light">
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
    <h2 className={`font-display leading-tight text-title text-foreground mb-6 ${className}`}>
      {children}
    </h2>
  )
}

function PrimaryButton({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-block w-full sm:w-auto text-center no-underline transition-all duration-200 bg-rust text-paper px-6 sm:px-8 py-3 sm:py-3.5 font-label font-bold text-xs sm:text-body tracking-[2px] uppercase border-2 border-rust hover:bg-rust-dark hover:border-rust-dark hover:-translate-y-0.5 hover:shadow-lg"
    >
      {children}
    </Link>
  )
}

function OutlineButton({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-block w-full sm:w-auto text-center no-underline transition-all duration-200 bg-paper text-foreground px-6 sm:px-8 py-3 sm:py-3.5 font-label font-bold text-xs sm:text-body tracking-[2px] uppercase border-1 border-foreground hover:border-rust hover:text-rust"
    >
      {children}
    </Link>
  )
}

const HERO_INNER_SLIDE_MS = 2500
const HERO_INNER_SLIDE_EASE = [0.33, 1, 0.68, 1]

/** Centered indeterminate ring — used while hero content is fetched and while images preload. */
function HeroTileCenterSpinner({ className = "" }) {
  return (
    <div
      className={`pointer-events-none flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14 ${className}`}
      aria-hidden
    >
      <div className="h-full w-full rounded-full border-2 border-paper/25 border-t-rust border-r-rust/40 animate-spin shadow-lg" />
    </div>
  )
}

function HeroBoxCarousel({ label, images, bg, className = "", contentLoading = false }) {
  const slots = useMemo(() => (Array.isArray(images) ? images : []), [images])
  const n = slots.length
  const [innerIdx, setInnerIdx] = useState(0)
  const imageUrls = useMemo(() => {
    const seen = new Set()
    const out = []
    for (const s of slots) {
      const u = (s || "").trim()
      if (u && !seen.has(u)) {
        seen.add(u)
        out.push(u)
      }
    }
    return out
  }, [slots])

  const [imagesReady, setImagesReady] = useState(() => imageUrls.length === 0)

  useEffect(() => {
    if (imageUrls.length === 0) {
      setImagesReady(true)
      return
    }
    setImagesReady(false)
    let alive = true
    let remaining = imageUrls.length
    const done = () => {
      remaining -= 1
      if (remaining <= 0 && alive) setImagesReady(true)
    }
    for (const u of imageUrls) {
      const img = new Image()
      img.onload = done
      img.onerror = done
      img.src = u
    }
    return () => {
      alive = false
    }
  }, [imageUrls])

  useEffect(() => {
    setInnerIdx(0)
  }, [n])

  useEffect(() => {
    if (n <= 1) return undefined
    const id = setInterval(() => {
      setInnerIdx((p) => (p + 1) % n)
    }, HERO_INNER_SLIDE_MS)
    return () => clearInterval(id)
  }, [n])

  const shellClass = `${className} relative block h-full w-full min-h-[min(40vh,300px)] overflow-hidden sm:min-h-[min(42vh,340px)] lg:min-h-[min(36vh,260px)]`
  const showImageLoadOverlay = !contentLoading && n > 0 && imageUrls.length > 0 && !imagesReady

  if (n === 0) {
    return (
      <div className={shellClass} style={{ backgroundImage: bg, backgroundSize: "cover", backgroundPosition: "center" }}>
        <AnimatePresence>
          {contentLoading && (
            <motion.div
              key="hero-db-load"
              className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-scrim/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              aria-busy="true"
              aria-label={`Loading ${label}`}
            >
              <HeroTileCenterSpinner className="relative z-10" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="absolute bottom-3 left-3 z-40 font-label font-bold tracking-[2px] uppercase text-straw bg-foreground/20 px-2 py-1 backdrop-blur-sm text-xs sm:text-sm">
          {label}
        </span>
      </div>
    )
  }

  const slidePercent = 100 / n

  return (
    <div className={shellClass}>
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{ width: `${n * 100}%` }}
          initial={false}
          animate={{ x: `${-(slidePercent * innerIdx)}%` }}
          transition={{ duration: 0.55, ease: HERO_INNER_SLIDE_EASE }}
        >
          {slots.map((src, i) => {
            const u = (src || "").trim()
            return (
              <div
                key={`slide-${i}`}
                className="h-full shrink-0 bg-cover bg-center"
                style={{
                  width: `${slidePercent}%`,
                  backgroundImage: u
                    ? `linear-gradient(180deg,color-mix(in srgb,var(--color-scrim) 12%,transparent),color-mix(in srgb,var(--color-scrim) 65%,transparent)), url(${u})`
                    : bg,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            )
          })}
        </motion.div>
      </div>

      <AnimatePresence>
        {contentLoading && (
          <motion.div
            key="hero-db-load"
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-scrim/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            aria-busy="true"
            aria-label={`Loading ${label}`}
          >
            <HeroTileCenterSpinner className="relative z-10" />
          </motion.div>
        )}
        {showImageLoadOverlay && (
          <motion.div
            key="hero-tile-img-load"
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            aria-busy="true"
            aria-label={`Loading ${label} images`}
          >
            <div className="absolute inset-0 bg-scrim/25 backdrop-blur-[2px]" />
            <motion.div
              className="absolute inset-3 rounded-md border-2 border-dashed border-rust/55 sm:inset-4"
              style={{ transformOrigin: "50% 50%" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-3 rounded-md border-2 border-rust/25 sm:inset-4"
              animate={{ opacity: [0.35, 0.85, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <HeroTileCenterSpinner className="relative z-10" />
          </motion.div>
        )}
      </AnimatePresence>

      <span className="pointer-events-none absolute bottom-3 left-3 z-40 font-label font-bold tracking-[2px] uppercase text-straw bg-foreground/20 px-2 py-1 backdrop-blur-sm text-xs sm:text-sm">
        {label}
      </span>
      {n > 1 && (
        <div className="pointer-events-none absolute bottom-3 right-3 z-40 flex items-center gap-1.5" aria-hidden="true">
          {slots.map((_, i) => (
            <span
              key={`dot-${i}`}
              className={`h-1 rounded-full transition-all duration-300 ${innerIdx === i ? "w-5 bg-straw" : "w-1.5 bg-paper/45"}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================== Hero ==============================
function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const STATS = [
    ["75+", "Years in Business"],
    ["2", "Locations"],
    ["100s", "Farms Served"]
  ];

  const [heroMosaic, setHeroMosaic] = useState(() => createDefaultHeroMosaic())
  const [heroContentLoading, setHeroContentLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const cards = await fetchHomeHeroCardsApi()
        if (cancelled) return
        if (!cards) return
        const normalized = normalizeHeroCardsFromApi(cards)
        if (!normalized) return
        const base = createDefaultHeroMosaic()
        setHeroMosaic(
          normalized.map((card, index) => ({
            ...base[index],
            label: card.label,
            images: card.images,
          }))
        )
      } catch (err) {
        console.error("Failed to load Home hero cards", err)
      } finally {
        if (!cancelled) setHeroContentLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroMosaic.length) % heroMosaic.length)
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroMosaic.length)
  }

  return (
    <section className="relative min-h-screen grid grid-cols-1 items-stretch lg:grid-cols-2 pt-16 overflow-hidden bg-barn">
      {/* ==================== Background Effects ==================== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, color-mix(in srgb, var(--color-rust) 8%, transparent) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, color-mix(in srgb, var(--color-straw) 4%, transparent) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in srgb, var(--color-rust) 7%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-rust) 7%, transparent) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* ==================== Left - Content ==================== */}
      <motion.div
        className="relative z-10 flex flex-col justify-center p-[clamp(1.25rem,4.5vw,5rem)]"
        variants={sectionStagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={reveal}>
          <Label>Since 1958</Label>
        </motion.div>

        <motion.h1
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-hero leading-[1.05] sm:leading-[1] lg:leading-[0.95] text-foreground mb-3"
          variants={reveal}
        >
          If It Goes In A{" "}
          <span className="text-rust block mt-4 mb-4">Poultry House,</span>
          We Have It.
        </motion.h1>

        <motion.p
          className="font-display text-sm sm:text-base md:text-lg lg:text-subtitle tracking-[2px] sm:tracking-[3px] lg:tracking-[4px] text-muted mb-4 mt-4"
          variants={reveal}
        >
          East Texas · Louisiana · South &amp; Central Texas
        </motion.p>

        <motion.p
          className="leading-relaxed text-body text-muted max-w-md mb-8 font-light"
          variants={reveal}
        >
          Top quality equipment at competitive prices, backed by a{" "}
          <strong className="text-foreground font-medium">well-trained service team</strong>{" "}
          ready to help growers achieve success — just as we have for over half a century.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center mb-10 sm:mb-12"
          variants={reveal}
        >
          <PrimaryButton to="/products">Browse Products</PrimaryButton>
          <OutlineButton to="/contact">Get a Quote</OutlineButton>
        </motion.div>

        {/* ==================== Stats ==================== */}
        <motion.div
          className="flex flex-wrap gap-x-8 gap-y-4 sm:gap-[clamp(1.5rem,4vw,2.5rem)] border-t border-mid/20 pt-[clamp(1.25rem,3vw,2rem)]"
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
        className="relative z-10 flex min-h-[min(48vh,400px)] flex-col overflow-hidden px-4 pb-6 sm:px-6 sm:pb-8 lg:h-full lg:min-h-0 lg:self-stretch lg:px-0 lg:pb-0"
        variants={contentStagger}
        initial="hidden"
        animate="visible"
      >
        {/* Mobile/Tablet: slider window */}
        <div className="relative shrink-0 lg:hidden">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${currentSlide * 100}%` }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              {heroMosaic.map((tile, idx) => (
                <motion.div
                  key={`${tile.label}-${idx}`}
                  className="relative w-full shrink-0 aspect-[4/3] sm:aspect-[5/3]"
                  variants={reveal}
                >
                  <HeroBoxCarousel
                    label={tile.label}
                    images={tile.images}
                    bg={tile.bg}
                    className="h-full w-full"
                    contentLoading={heroContentLoading}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <button
              type="button"
              onClick={handlePrevSlide}
              className="px-3 py-1.5 text-xs font-label font-bold tracking-[2px] uppercase border border-mid/40 text-foreground hover:border-rust hover:text-rust transition-colors"
            >
              Prev
            </button>
            <div className="flex items-center gap-2">
              {heroMosaic.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${currentSlide === index ? "w-6 bg-rust" : "w-2 bg-mid/40"}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleNextSlide}
              className="px-3 py-1.5 text-xs font-label font-bold tracking-[2px] uppercase border border-mid/40 text-foreground hover:border-rust hover:text-rust transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        {/* Desktop: 2x2 fills column height; carousel uses min-height (label is position:absolute). */}
        <div className="hidden min-h-0 flex-1 lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:gap-0.5">
          {heroMosaic.map((tile, idx) => (
            <motion.div
              key={`${tile.label}-${idx}`}
              className="relative min-h-0 overflow-hidden"
              variants={reveal}
            >
              <HeroBoxCarousel
                label={tile.label}
                images={tile.images}
                bg={tile.bg}
                className="h-full"
                contentLoading={heroContentLoading}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ============================== Marquee ==============================
function Marquee() {
  const MARQUEE_ITEMS = [
    "Feeding Systems", "Watering Systems", "Heating Systems", "Cooling Systems",
    "LED Lighting", "Fan Systems", "Controllers", "Roll Seal Doors",
    "Used Equipment", "On-Farm Repair", "New Construction",
  ];

  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="bg-rust mb-18 sm:mb-22 md:mb-26 lg:mb-28 py-3 sm:py-4 overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-block">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-label text-xs sm:text-section-label tracking-[2px] sm:tracking-[4px] text-paper/90 px-6 sm:px-10"
          >
            <span className="text-paper/40">◆  </span>
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
      className="mb-18 sm:mb-22 md:mb-26 lg:mb-28 px-6 sm:px-10 md:px-14 lg:px-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
      {/* ==================== Left - Story ==================== */}
      <motion.div variants={reveal}>
        <SectionHeader
          label="Who We Are"
          title="Built on "
          titleHighlight="Trust"
          description="East Texas Poultry Supply has helped poultry growers succeed for decades with quality equipment, dependable service, and deep regional experience."
        />

        <p className="leading-relaxed text-muted text-sm sm:text-body font-light mb-5">
          <strong className="text-foreground font-medium">East Texas Poultry Supply</strong> has proven their ability to help poultry growers achieve success for over half a century. We offer top quality equipment at competitive prices and have a well-trained service team ready to assist.
        </p>

        <p className="leading-relaxed text-muted text-sm sm:text-body font-light mb-5">
          Founded in Center, Texas in 1958, we've expanded to include a second location in Gonzales, Texas — allowing us to serve south, central, and north Texas, plus Louisiana.
        </p>

        <p className="leading-relaxed text-muted text-sm sm:text-body font-light mb-5">
          Beyond poultry, our retail store stocks water storage tanks, pressure pumps, HVAC motors, capacitors, drive belts, and bearings for farm or industrial use. <strong className="text-foreground font-medium">We ship worldwide.</strong>
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
            className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-3 sm:gap-6 relative py-5 sm:py-6"
          >
            {index < TIMELINE.length - 1 && (
              <div className="hidden sm:block absolute left-[76px] top-0 bottom-0 w-0.5 bg-rust/20" />
            )}
            <div className="font-display text-2xl sm:text-subtitle text-rust leading-none">{year}</div>
            <div className="pt-1.5">
              <strong className="text-xs sm:text-section-label text-foreground block mb-1">{title}</strong>
              <div className="text-sm sm:text-body text-muted">{desc}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      </div>
    </Section>
  );
}

// ============================== Services ==============================
function Services() {
  const SERVICES = [
    { to: "/services/construction", title: "New Farm Construction", desc: "Full-service buildout for new poultry operations. From layout to final equipment installation, we handle every detail." },
    { to: "/services/retro", title: "Retro Older Houses", desc: "Modernize aging facilities with updated systems and equipment. Increase efficiency without a full rebuild." },
    { to: "/services/shop", title: "In-House Shop", desc: "Our busy repair shop handles motors, medication pumps, bearings, and all manner of poultry and farm equipment." },
    { to: "/services/repair", title: "On-Farm Repair", desc: "We come to you. Our trained team provides on-site diagnostics and repair to minimize your downtime." },
  ];

  const [hovered, setHovered] = useState(null)

  return (
    <Section className="mb-18 sm:mb-22 md:mb-26 lg:mb-28 px-6 sm:px-10 md:px-14 lg:px-24">
      <SectionHeader
        label="What We Do"
        title="Our "
        titleHighlight="Services"
        description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis dolorum ea mollitia eum quas! Ipsum quia ducimus reiciendis unde!"
      />
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-7"
        variants={contentStagger}
      >
        {SERVICES.map((service, index) => (
          <motion.div key={service.title} variants={reveal}>
            <Link to={service.to}>
              <div
                className={`relative h-full overflow-hidden cursor-pointer transition-all duration-300 p-6 sm:p-8 md:p-10 ${hovered === index ? "bg-paper shadow-lg" : "bg-paper"
                  }`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 bg-rust transition-transform duration-300 ${hovered === index ? "scale-x-100" : "scale-x-0"
                    }`}
                />

                <h3 className="font-label text-lg sm:text-xl font-bold tracking-[1px] uppercase text-foreground mb-3">{service.title}</h3>
                <p className="text-sm sm:text-body leading-relaxed text-muted font-light">{service.desc}</p>

                <div
                  className={`transition-all duration-300 mt-6 font-label text-sm font-bold tracking-[2px] uppercase ${hovered === index ? "opacity-100 text-rust" : "opacity-30"
                    }`}
                >
                  Learn More →
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

// ============================== Products ==============================
function Products() {
  const PRODUCTS = [
    { to: "/products/feeding", name: "Feeding Systems", sub: "Pan feeders, augers, controllers, full chain systems", tag: "Popular" },
    { to: "/products/watering", name: "Watering Systems", sub: "Nipple drinkers, pressure regulators, water tanks & pumps" },
    { to: "/products/heating", name: "Heating Systems", sub: "Infraconic brooders, radiant heaters, forced air units" },
    { to: "/products/cooling", name: "Cooling Systems", sub: "Evaporative cooling pads, misters, tunnel ventilation" },
    { to: "/products/fans", name: "Fans", sub: "Box fans, tunnel fans, circulation and exhaust solutions" },
    { to: "/products/controllers", name: "Controllers", sub: "Environmental controllers, tunnel timers, system automation", tag: "New" },
    { to: "", name: "Roll Seal Doors", sub: "Insulated tunnel door systems for optimal airflow control" },
    { to: "/products/lighting", name: "LED Lighting", sub: "Energy-efficient lighting designed for poultry environments" },
    { to: "/products/equipment", name: "Used Equipment", sub: "Quality pre-owned equipment for dependable farm performance and value" },
    { to: "", name: "Motors & Belts", sub: "HVAC motors, capacitors, contactors, drive belts & bearings" },
  ];

  const [hovered, setHovered] = useState(null)

  return (
    <Section className="mb-18 sm:mb-22 md:mb-26 lg:mb-28 px-6 sm:px-10 md:px-14 lg:px-24">
      <SectionHeader
        label="What We Sell"
        title="Product "
        titleHighlight="Categories"
        description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis dolorum ea mollitia eum quas! Ipsum quia ducimus reiciendis unde!"
      />
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-7"
        variants={contentStagger}
      >
        {PRODUCTS.map((product, index) => (
          <motion.div key={product.name} variants={reveal}>
            <Link to={product.to}>
              <div
                className={`relative h-full cursor-pointer transition-all duration-200 p-6 sm:p-8 md:p-10 bg-paper ${hovered === index
                  ? "border border-rust -translate-y-1 shadow-lg"
                  : "border border-mid/20"
                  }`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                {product.tag && (
                  <span className="absolute top-3 right-3 text-[12px] font-bold tracking-[1px] uppercase bg-rust text-paper px-1.5 py-0.5">
                    {product.tag}
                  </span>
                )}

                <h3 className="font-label text-lg sm:text-xl font-bold tracking-[1px] uppercase text-foreground mb-2">{product.name}</h3>
                <p className="text-sm sm:text-body leading-relaxed text-muted font-light">{product.sub}</p>

                <div
                    className={`transition-all duration-300 mt-6 font-label text-sm font-bold tracking-[2px] uppercase ${hovered === index ? "opacity-100 text-rust" : "opacity-30"
                      }`}
                  >
                    Learn More →
                  </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

// ============================== Call To Action ==============================
function CTA() {
  return (
    <Section className="relative text-center overflow-hidden px-6 sm:px-10 md:px-14 lg:px-24 py-10 sm:py-14 md:py-18 lg:py-20 bg-paper border-t border-mid/15">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-rust) 8%, transparent) 0%, transparent 65%)",
        }}
      />

      <motion.h2 variants={reveal} className="relative font-display leading-[1] text-3xl sm:text-4xl md:text-title text-foreground mb-5 sm:mb-6">
        Ready to <span className="text-rust">Equip</span><br />Your Farm?
      </motion.h2>

      <motion.p variants={reveal} className="relative mx-auto text-sm sm:text-body text-muted mb-8 sm:mb-12 max-w-md leading-relaxed">
        Reach out for quotes on new construction, equipment, or retrofit projects. Customer satisfaction is job one.
      </motion.p>

      <motion.div variants={reveal} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center relative max-w-md sm:max-w-none mx-auto">
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
      <CTA />
    </main>
  );
}