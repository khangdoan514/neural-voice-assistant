"use client"
import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

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

/* ============================== About Page ============================== */
export default function About() {
  const defaultStoryImage = "/images/about/story-photo.jpg"
  const [storyImage, setStoryImage] = useState(defaultStoryImage)

  const TIMELINE = [
    { year: "1958", title: "Founded in Center, TX", desc: "East Texas Poultry Supply opens its doors in Center, Texas, serving local poultry growers with quality equipment and reliable service." },
    { year: "1970s", title: "Growing Reputation", desc: "Word spreads across east Texas. Growers from neighboring counties begin relying on ETPS for equipment, parts, and repair work." },
    { year: "1990s", title: "Gonzales, TX Warehouse", desc: "A second warehouse location opens in Gonzales, Texas, giving us the base to offer full service to south and central Texas." },
    { year: "2000s", title: "Expanded Service Region", desc: "Our primary service area expands to include south, central, and north Texas, extending over into Louisiana and most of that state." },
    { year: "Today", title: "TX, LA & Worldwide", desc: "We continue to serve growers across Texas and Louisiana, and ship poultry equipment and supplies anywhere in the world." },
  ]

  useEffect(() => {
    const savedStoryImage = localStorage.getItem("aboutStoryImage")
    if (savedStoryImage) {
      setStoryImage(savedStoryImage)
    }
  }, [])

  return (
    <main className="bg-barn min-h-screen pt-16 overflow-x-hidden">
      <div className="max-w-full overflow-x-hidden">

        {/* ==================== Page Header ==================== */}
        <div className="bg-foreground py-14 sm:py-18 md:py-22 lg:py-24 px-6 sm:px-10 md:px-14 lg:px-24 relative overflow-hidden">
          <div className="support-band-grid pointer-events-none absolute inset-0" aria-hidden />
          <div className="support-band-glow pointer-events-none absolute inset-0" aria-hidden />
          <motion.div
            className="relative"
            variants={sectionStagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={reveal} className="flex items-center gap-3 mb-5 font-label text-section-label font-bold tracking-[4px] uppercase text-rust">
              <span className="block w-8 h-0.5 bg-rust" />
              Our Company
            </motion.div>
            <motion.h1 variants={reveal} className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-hero leading-[1.1] sm:leading-[0.92] text-paper mb-4">
              About <span className="text-rust">East Texas</span> Poultry Supply
            </motion.h1>
            <motion.p variants={reveal} className="font-label text-xs sm:text-sm md:text-md tracking-[2px] sm:tracking-[3px] uppercase text-paper/40 mt-4">
              Est. 1958 · Center, Texas · Serving Growers for Over 75 Years
            </motion.p>
          </motion.div>
        </div>

        <div className="px-6 sm:px-10 md:px-14 lg:px-24 py-14 sm:py-18 md:py-22 lg:py-24">

          {/* ==================== Our Story ==================== */}
          <Section>
            <SectionHeader
              label="Who We Are"
              title="Our "
              titleHighlight="Story"
              description="East Texas Poultry Supply has proven their ability to help poultry growers achieve success for over one-half century. Founded in Center, Texas in 1958, we have grown to serve growers across Texas, Louisiana, and worldwide."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
              {/* Narrative */}
              <motion.div variants={contentStagger} className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
                <motion.p variants={reveal} className="text-base sm:text-lg leading-relaxed text-muted font-light m-0">
                  The part of our name <strong className="text-foreground font-medium">"East Texas"</strong> simply
                  refers to the city, Center, Texas, where we were founded in 1958. Since that humble beginning,
                  we have expanded to include a separate location in Gonzales, Texas. Our primary service area now
                  includes south, central, and north Texas and over into Louisiana and most of that state.
                </motion.p>
                <motion.p variants={reveal} className="text-base sm:text-lg leading-relaxed text-muted font-light m-0">
                  The part of our name <strong className="text-foreground font-medium">"Poultry"</strong> refers to
                  our primary business and does not reveal the entire scope of East Texas Poultry Supply. For example,
                  we ship feed storage bins to horse, cattle, and other farming operations and have a retail store
                  that is well stocked with a variety of items used at home or around the farm.
                </motion.p>
                <motion.p variants={reveal} className="text-base sm:text-lg leading-relaxed text-muted font-light m-0">
                  Today's poultry producers choose to invest millions of dollars, often their family land and their
                  time, in order to achieve their goal of self-employment in this great industry. That is why it is
                  so important for them to team up with a reliable and time-tested supplier for their housing,
                  equipment, and service needs.
                </motion.p>
                <motion.figure variants={reveal} className="overflow-hidden rounded-sm border border-mid/20 bg-paper">
                  <img
                    src={storyImage}
                    alt="East Texas Poultry Supply story"
                    className="w-full h-56 sm:h-64 lg:h-72 object-cover"
                  />
                </motion.figure>
                <motion.div variants={reveal} className="border-l-2 border-rust pl-4 sm:pl-6 py-2 mt-2">
                  <p className="font-label text-xs font-bold tracking-[2px] sm:tracking-[3px] uppercase text-rust mb-2">Expanded Service Area</p>
                  <p className="text-base sm:text-lg leading-relaxed text-muted font-light m-0">
                    While we only have one retail store located in Center, Texas, our warehouse in Gonzales, Texas
                    gives us the base to offer full service to south and central Texas as well. Our ability to ship
                    poultry equipment and supplies anywhere also expands our market area.
                  </p>
                </motion.div>
              </motion.div>

              {/* Timeline */}
              <motion.div variants={contentStagger}>
                {TIMELINE.map(({ year, title, desc }) => (
                  <motion.div
                    key={year}
                    variants={reveal}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-6 md:gap-8 py-5 sm:py-7 md:py-9 border-t border-mid/15 last:border-b last:border-mid/15"
                  >
                    <div className="flex-shrink-0 sm:w-14">
                      <span className="font-display text-xl sm:text-2xl text-rust leading-none">{year}</span>
                    </div>
                    <div className="flex-1">
                      <strong className="font-label text-xs sm:text-sm font-bold tracking-[1px] uppercase text-foreground block mb-1.5">{title}</strong>
                      <p className="text-sm sm:text-base leading-relaxed text-muted font-light m-0">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Section>
        </div>

        {/* ==================== CTA ==================== */}
        <Section className="bg-paper border-t border-mid/15 px-6 sm:px-10 md:px-14 lg:px-24 py-10 sm:py-14 md:py-18 lg:py-20 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
          <motion.div variants={reveal} className="text-center sm:text-left">
            <p className="font-bold text-base sm:text-lg tracking-[2px] sm:tracking-[3px] uppercase text-rust mb-2">Get Started</p>
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-foreground leading-tight sm:leading-none">Ready to work with us?</h3>
          </motion.div>
          <motion.div variants={reveal} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <a
              href="/support/contact"
              className="inline-block transition-all duration-200 bg-rust text-paper px-6 sm:px-8 py-2.5 sm:py-3.5 font-label font-bold text-xs tracking-[2px] sm:tracking-[3px] uppercase border-2 border-rust hover:bg-rust-dark hover:border-rust-dark text-center w-full sm:w-auto"
            >
              Contact Us
            </a>
            <a
              href="/products"
              className="inline-block transition-all duration-200 text-foreground px-6 sm:px-8 py-2.5 sm:py-3.5 font-label font-bold text-xs tracking-[2px] sm:tracking-[3px] uppercase border-2 border-mid hover:border-rust hover:text-rust text-center w-full sm:w-auto"
            >
              Browse Products
            </a>
          </motion.div>
        </Section>
      </div>
    </main>
  )
}