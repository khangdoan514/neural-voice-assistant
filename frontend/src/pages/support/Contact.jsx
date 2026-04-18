import { motion, useInView } from "framer-motion"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import L from "leaflet"
import { useEffect, useRef, useState } from "react"
import "leaflet/dist/leaflet.css"

/* ============================== Variants ============================== */
const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}

const sectionStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0 } },
}

const contentStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

/* ============================== Functions ============================== */

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

const createMarkerIcon = (isSelected = false) => {
  const size = isSelected ? 30 : 20
  const color = isSelected ? "#E8693A" : "#C4521A"

  return new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        ${isSelected ? `
          <circle cx="12" cy="12" r="14" fill="${color}" opacity="0.3">
            <animate attributeName="r" values="10;14;10" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.5s" repeatCount="indefinite" />
          </circle>
        ` : ""}
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2">
          ${isSelected ? `
            <animate attributeName="r" values="10;11;10" dur="1s" repeatCount="indefinite" />
          ` : ""}
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
    map.setView(center, zoom, { animate: true, duration: 0.5 })
  }, [center, zoom, map])
  return null
}

function Section({ children, className = "" }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-6% 0px" })

  return (
    <motion.div
      ref={ref}
      variants={sectionStagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
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
        <motion.h2 variants={reveal} className="font-display text-title leading-none text-nav-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          {title} {titleHighlight && <span className="text-rust">{titleHighlight}</span>}
        </motion.h2>
      </motion.div>
      <motion.p variants={reveal} className="text-sm sm:text-md text-muted leading-relaxed mb-8 sm:mb-12 md:mb-16 font-light">
        {description}
      </motion.p>
    </>
  )
}

/* ============================== Contact Page ============================== */
export default function Contact() {
  const defaultBusinessHoursImage = "/images/support/business-hours.jpg"
  const defaultContactPeople = [
    { name: "First Last 1", role: "Service Coordinator", phone: "(000) 000-0000", email: "first.last1@etpsupply.com", image: "something" },
    { name: "First Last 2", role: "Parts & Sales Support", phone: "(000) 000-0000", email: "first.last2@etpsupply.com", image: "something" },
  ]
  const [businessHoursImage, setBusinessHoursImage] = useState(defaultBusinessHoursImage)
  const [contactPeople, setContactPeople] = useState(defaultContactPeople)
  const BUSINESS_HOURS = [
    { days: "Monday - Friday", hours: "7:00 AM - 5:00 PM" },
    { days: "Saturday", hours: "8:00 AM - 12:00 PM" },
    { days: "Sunday", hours: "Closed" },
  ]
  const locations = [
    { id: "center", name: "Center, Texas - Main Store", address: "1592 Southview Cir, Center, TX 75935", phone: "(936) 555-0123", position: [31.776431568131077, -94.18537553195539], hours: "Mon-Fri: 7am-5pm, Sat: 8am-12pm" },
    { id: "gonzales", name: "Gonzales, Texas - Warehouse", address: "456 Oak Avenue, Gonzales, TX 78629", phone: "(830) 555-0456", position: [29.5016, -97.4525], hours: "Mon-Fri: 8am-4pm" },
  ]
  const [selectedLocation, setSelectedLocation] = useState("center")
  const [mapCenter, setMapCenter] = useState([31.7955, -94.1791])
  const [mapZoom, setMapZoom] = useState(8)

  useEffect(() => {
    const savedBusinessHoursImage = localStorage.getItem("contactBusinessHoursImage")
    if (savedBusinessHoursImage) {
      setBusinessHoursImage(savedBusinessHoursImage)
    }

    const savedPeople = localStorage.getItem("contactPeople")
    if (savedPeople) {
      try {
        const parsed = JSON.parse(savedPeople)
        if (Array.isArray(parsed) && parsed.length >= 1) {
          setContactPeople(parsed)
          return
        }
      } catch (err) {
        console.error("Failed to parse contact people", err)
      }
    }

    const savedPeopleImages = localStorage.getItem("contactPeopleImages")
    if (!savedPeopleImages) return
    try {
      const parsed = JSON.parse(savedPeopleImages)
      if (!Array.isArray(parsed) || parsed.length < 1) return
      setContactPeople((prev) =>
        prev.map((person, index) => ({
          ...person,
          image: parsed[index] || person.image,
        }))
      )
    } catch (err) {
      console.error("Failed to parse contact people images", err)
    }
  }, [])

  const handleLocationClick = (locationId) => {
    const location = locations.find((l) => l.id === locationId)
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
    <main className="bg-barn min-h-screen pt-16 overflow-x-hidden">
      <div className="max-w-full overflow-x-hidden">
        <div className="bg-nav-text py-14 sm:py-18 md:py-22 lg:py-24 px-6 sm:px-10 md:px-14 lg:px-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px]"/>
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_30%_50%,rgba(196,82,26,0.12)_0%,transparent_60%)]" />
          <motion.div className="relative" variants={sectionStagger} initial="hidden" animate="visible">
            <motion.div variants={reveal} className="flex items-center gap-3 mb-5 font-label text-section-label font-bold tracking-[4px] uppercase text-rust">
              <span className="block w-8 h-0.5 bg-rust" />
              Support
            </motion.div>
            <motion.h1 variants={reveal} className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-hero leading-[1.1] sm:leading-[0.92] text-white mb-4">
              Contact <span className="text-rust">Us</span>
            </motion.h1>
            <motion.p variants={reveal} className="font-label text-xs sm:text-sm md:text-md tracking-[2px] sm:tracking-[3px] uppercase text-white/40 mt-4">
              We are here to help with equipment, service, and support
            </motion.p>
          </motion.div>
        </div>

        <div className="px-6 sm:px-10 md:px-14 lg:px-24 py-14 sm:py-18 md:py-22 lg:py-24">
          <Section className="mb-18 sm:mb-22 md:mb-26 lg:mb-28">
            <SectionHeader
              label="Business Hours"
              title="When We Are "
              titleHighlight="Open"
              description="Plan your visit or call during our regular support hours."
            />
            <motion.div variants={reveal} className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-mid/15 pr-0 lg:pr-8 pb-6 lg:pb-0">
                  <div className="h-56 sm:h-64 md:h-72 bg-charcoal/20">
                    <img
                      src={businessHoursImage}
                      alt="Business hours and storefront"
                      className="w-full h-full object-cover rounded-sm"
                    />
                  </div>
                  <div className="pt-5 sm:pt-6">
                    <p className="font-label text-xs sm:text-sm font-bold tracking-[3px] uppercase text-rust mb-2">Before You Visit</p>
                    <p className="text-sm sm:text-base leading-relaxed text-muted font-light">
                      Our team is available for parts, service scheduling, and equipment support during business hours.
                      If you are planning a specific pickup or technical consultation, calling ahead helps us serve you faster.
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-1 pt-6 lg:pt-0 lg:pl-8">
                  <p className="font-label text-xs sm:text-sm font-bold tracking-[3px] uppercase text-rust mb-4">Hours</p>
                  <div className="space-y-3">
                    {BUSINESS_HOURS.map(({ days, hours }) => (
                      <div key={days} className="flex items-start justify-between gap-4 border-t border-mid/15 pt-3 first:border-t-0 first:pt-0">
                        <p className="text-sm sm:text-base text-nav-text font-label">{days}</p>
                        <p className="text-sm sm:text-base text-muted text-right">{hours}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </Section>

          <Section className="mb-18 sm:mb-22 md:mb-26 lg:mb-28">
            <SectionHeader
              label="Get In Touch"
              title="How To Reach "
              titleHighlight="Our Team"
              description="Reach out directly to our support team members. Share your project details, house size, and equipment questions so we can help quickly."
            />
            <motion.div variants={contentStagger} className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {contactPeople.map(({ name, role, phone, email, image }) => (
                  <motion.div key={`${name}-${email}`} variants={reveal} className="overflow-hidden w-full md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333%-1rem)] max-w-sm">
                    <div className="h-52 sm:h-56 bg-charcoal/20 border border-mid/20 rounded-sm overflow-hidden">
                      <img src={image} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <div className="pt-4 sm:pt-5">
                      <h3 className="font-label text-lg sm:text-xl font-bold tracking-[1px] uppercase text-nav-text mb-1">{name}</h3>
                      <p className="text-sm text-muted mb-4">{role}</p>
                      <p className="text-sm sm:text-base text-nav-text mb-2"><span className="font-label text-rust">Phone:</span> {phone}</p>
                      <p className="text-sm sm:text-base text-nav-text break-all"><span className="font-label text-rust">Email:</span> {email}</p>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </Section>

          <Section className="mb-18 sm:mb-22 md:mb-26 lg:mb-28">
            <SectionHeader
              label="Where We Operate"
              title="Two "
              titleHighlight="Locations"
              description="Our primary service area covers south, central, and north Texas and extends into most of Louisiana. We also ship equipment and supplies anywhere in the world."
            />
            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start" variants={contentStagger}>
              <motion.div variants={reveal} className="flex items-center justify-center bg-barn border border-mid/20 p-2 aspect-[4/3] overflow-hidden rounded-lg">
                <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }} className="z-0">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapController center={mapCenter} zoom={mapZoom} />
                  {locations.map((location) => (
                    <Marker key={location.id} position={location.position} icon={createMarkerIcon(selectedLocation === location.id)} eventHandlers={{ click: () => handleLocationClick(location.id) }}>
                      {selectedLocation === location.id && (
                        <Popup>
                          <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold text-rust text-base mb-2">{location.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                            <p className="text-sm text-gray-600 mb-2">{location.phone}</p>
                            <p className="text-sm text-gray-600 mb-3"><span className="font-semibold">Hours:</span> {location.hours}</p>
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

              <motion.div variants={contentStagger}>
                <div className="flex flex-col gap-5 sm:gap-8">
                  {locations.map((location) => (
                    <motion.div
                      key={location.id}
                      variants={reveal}
                      onClick={() => handleLocationClick(location.id)}
                      className={`border-l-2 sm:border-l-3 p-5 sm:p-8 transition-all duration-300 cursor-pointer ${
                        selectedLocation === location.id ? "border-rust-light bg-rust/10 shadow-lg sm:scale-105" : "border-rust bg-mid/5 hover:bg-rust/5"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-lg sm:text-xl tracking-[1px] uppercase text-nav-text mb-2">{location.name}</h4>
                        {selectedLocation === location.id && <span className="text-xs bg-rust text-white px-2 py-1 rounded">Selected</span>}
                      </div>
                      <p className="text-sm sm:text-md text-muted mb-1">{location.address}</p>
                      <p className="text-sm sm:text-md text-muted">{location.phone}</p>
                      {selectedLocation === location.id && (
                        <div className="mt-4 pt-3 border-t border-rust/20">
                          <p className="text-sm text-rust mb-2"><span className="font-bold">Hours:</span> {location.hours}</p>
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
              </motion.div>
            </motion.div>
          </Section>
        </div>

        <Section className="bg-white border-t border-mid/15 px-6 sm:px-10 md:px-14 lg:px-24 py-10 sm:py-14 md:py-18 lg:py-20 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
          <motion.div variants={reveal} className="text-center sm:text-left">
            <p className="font-bold text-base sm:text-lg tracking-[2px] sm:tracking-[3px] uppercase text-rust mb-2">Need Service?</p>
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-nav-text leading-tight sm:leading-none">Submit a request and we will follow up quickly.</h3>
          </motion.div>
          <motion.div variants={reveal} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <a href="/support/request" className="inline-block transition-all duration-200 bg-rust text-white px-6 sm:px-8 py-2.5 sm:py-3.5 font-label font-bold text-xs tracking-[2px] sm:tracking-[3px] uppercase border-2 border-rust hover:bg-rust-dark hover:border-rust-dark text-center w-full sm:w-auto">
              Submit Request
            </a>
          </motion.div>
        </Section>
      </div>
    </main>
  )
}