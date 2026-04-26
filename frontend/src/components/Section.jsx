import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
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

function parseSections(raw) {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function Section({ pageTitle, fallbackDescription, sectionsStorageKey }) {
  const [sections, setSections] = useState([])

  useEffect(() => {
    setSections(parseSections(localStorage.getItem(sectionsStorageKey)))
  }, [sectionsStorageKey])

  const titledSections = useMemo(
    () =>
      sections.filter((section) => {
        const title = typeof section?.title === "string" ? section.title.trim() : ""
        return title.length > 0
      }),
    [sections]
  )

  if (titledSections.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
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
    <main className="bg-barn min-h-screen pt-24 pb-12 px-6 sm:px-10 md:px-14 lg:px-24">
      <div className="max-w-6xl mx-auto space-y-10">
        {titledSections.map((section, index) => {
          const title = section.title.trim()
          const description = typeof section.description === "string" ? section.description.trim() : ""
          const image = typeof section.image === "string" ? section.image.trim() : ""

          return (
            <motion.section
              key={`${title}-${index}`}
              initial="hidden"
              animate="visible"
              variants={reveal}
              className="bg-paper/90 border border-mid/20 rounded-xl p-6 sm:p-8"
            >
              <SectionHeader label={`Section ${index + 1}`} title={title} titleHighlight="" description={description} />
              {image && (
                <motion.div variants={reveal} className="overflow-hidden rounded-lg border border-mid/20 bg-paper">
                  <img src={image} alt={title} className="w-full h-56 sm:h-72 object-cover" />
                </motion.div>
              )}
            </motion.section>
          )
        })}

        <div className="text-center">
          <Link to="/" className="inline-block mt-2 text-rust hover:text-rust-light">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
