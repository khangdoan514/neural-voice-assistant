import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Label from "../Label.jsx"
import BtnOutline from "./BtnOutline.jsx"

// Default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Marker icons
const createMarkerIcon = (isSelected = false) => {
  const size = isSelected ? 40 : 30
  const innerSize = isSelected ? 24 : 18
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

// Map animations
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

export default function Locations() {
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
    <section className="bg-mid/5 py-[clamp(3rem,8vw,6rem)] px-[clamp(1.5rem,5vw,5rem)]">
      <div className="mb-4">
        <Label>Where We Operate</Label>
        <h2 className="font-display text-title leading-none text-nav-text">
          Two <span className="text-rust">Locations</span>
        </h2>
      </div>
      <p className="text-md text-muted leading-relaxed mb-16 font-light">
        Our primary service area covers south, central, and north Texas and extends into most of Louisiana. We also ship equipment and supplies{" "}
        <strong className="text-nav-text">anywhere in the world</strong>.
      </p>

      <div className="grid gap-16 items-start" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* OpenStreetMap */}
        <div className="flex items-center justify-center bg-barn border border-mid/20 p-2 aspect-[4/3] overflow-hidden rounded-lg">
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
                eventHandlers={{
                  click: () => handleLocationClick(location.id),
                }}
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
        </div>

        {/* Location Cards */}
        <div>
          <div className="flex flex-col gap-8 mb-8">
            {locations.map((location) => (
              <div
                key={location.id}
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

                {/* Quick link */}
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
              </div>
            ))}
          </div>

          <BtnOutline to="/contact">View All Hours & Directions</BtnOutline>
        </div>
      </div>
    </section>
  )
}