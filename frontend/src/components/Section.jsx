import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { fetchPageSectionsApi } from "../api/adminAPI"

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}

function PageCenterSpinner({ className = "" }) {
  return (
    <div className={`pointer-events-none flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14 ${className}`} aria-hidden>
      <div className="h-full w-full rounded-full border-2 border-paper/25 border-t-rust border-r-rust/40 animate-spin shadow-lg" />
    </div>
  )
}

function SectionLoadingOverlay({ pageTitle }) {
  return (
    <motion.div
      key="section-page-loading"
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-scrim/25"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      aria-busy="true"
      aria-label={`Loading ${pageTitle}`}
    >
      <motion.div
        className="absolute inset-4 rounded-md border-2 border-dashed border-rust/45 sm:inset-8"
        style={{ transformOrigin: "50% 50%" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />
      <PageCenterSpinner className="relative z-10" />
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

export default function Section({ pageTitle, fallbackDescription, sectionsStorageKey }) {
  const [sections, setSections] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setSections([])

    ;(async () => {
      try {
        const loaded = await fetchPageSectionsApi(sectionsStorageKey)
        if (!cancelled) {
          setSections(Array.isArray(loaded) ? loaded : [])
        }
      } catch {
        if (!cancelled) {
          setSections([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [sectionsStorageKey])

  const titledSections = useMemo(
    () =>
      sections.filter((section) => {
        const title = typeof section?.title === "string" ? section.title.trim() : ""
        return title.length > 0
      }),
    [sections]
  )

  if (isLoading && titledSections.length === 0) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-barn pt-24">
        <AnimatePresence mode="wait">
          <SectionLoadingOverlay pageTitle={pageTitle} />
        </AnimatePresence>
      </main>
    )
  }

  if (!isLoading && titledSections.length === 0) {
    return (
      <div className="min-h-screen bg-barn pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-6xl text-rust mb-4">{pageTitle}</h1>
          <p className="text-muted max-w-2xl px-4">{fallbackDescription}</p>
          <Link to="/" className="inline-block mt-8 text-rust hover:text-rust-light">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="bg-barn min-h-screen pt-24 pb-12 px-6 sm:px-10 md:px-14 lg:px-24 relative overflow-hidden">
      <div className="w-full max-w-none space-y-14 sm:space-y-16 md:space-y-20">
        {titledSections.map((section, index) => {
          const title = section.title.trim()
          const description = typeof section.description === "string" ? section.description.trim() : ""
          const images = Array.isArray(section.images)
            ? section.images
              .map((img) => {
                if (typeof img === "string") {
                  const url = img.trim()
                  return url ? { url, description: "" } : null
                }
                if (img && typeof img === "object") {
                  const url = String(img.url || img.image || "").trim()
                  const imageDescription = String(img.description || img.caption || "").trim()
                  return url ? { url, description: imageDescription } : null
                }
                return null
              })
              .filter(Boolean)
            : typeof section.image === "string" && section.image.trim()
              ? [{ url: section.image.trim(), description: "" }]
              : []

          return (
            <motion.section
              key={`${title}-${index}`}
              initial="hidden"
              animate="visible"
              variants={reveal}
              className="w-full border-b border-rust/15 pb-12 sm:pb-14 md:pb-16 last:border-b-0 last:pb-0"
            >
              <SectionHeader label={`Section ${index + 1}`} title={title} titleHighlight="" description={description} />
              {images.length > 0 && (
                <motion.div
                  variants={reveal}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
                >
                  {images.map((img, imageIndex) => (
                    <figure
                      key={`${title}-img-${imageIndex}`}
                      className="flex flex-col overflow-hidden rounded-lg border border-rust/25"
                    >
                      <img
                        src={img.url}
                        alt={`${title} ${imageIndex + 1}`}
                        className="w-full h-auto max-w-full object-contain"
                      />
                      {img.description && (
                        <figcaption className="px-4 py-3 text-sm text-muted border-t border-rust/20">
                          {img.description}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </motion.div>
              )}
            </motion.section>
          )
        })}
      </div>
    </main>
  )
}
