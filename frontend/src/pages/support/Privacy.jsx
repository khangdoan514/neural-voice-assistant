"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

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

/* ============================== Privacy Page ============================== */
export default function Privacy() {
  const TERMS = [
    {
      number: "01",
      title: "Terms",
      content: "By accessing this web site, you are agreeing to be bound by these web site Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this web site are protected by applicable copyright and trade mark law.",
    },
    {
      number: "02",
      title: "Use License",
      content: null,
      items: [
        "Permission is granted to temporarily download one copy of the materials on this web site for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.",
        "Under this license you may not: modify or copy the materials; use the materials for any commercial purpose or public display; attempt to decompile or reverse engineer any software; remove any copyright or proprietary notations; or transfer the materials to another person or mirror them on any other server.",
        "This license shall automatically terminate if you violate any of these restrictions and may be terminated by East Texas Poultry Supply at any time. Upon termination you must destroy any downloaded materials in your possession.",
      ],
    },
    {
      number: "03",
      title: "Disclaimer",
      content: 'The materials on this web site are provided "as is". East Texas Poultry Supply makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, East Texas Poultry Supply does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its web site or on any sites linked to this site.',
    },
    {
      number: "04",
      title: "Limitations",
      content: "In no event shall East Texas Poultry Supply or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this site, even if an authorized representative has been notified of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties or limitations of liability for consequential or incidental damages, these limitations may not apply to you.",
    },
    {
      number: "05",
      title: "Revisions and Errata",
      content: "The materials appearing on this web site could include technical, typographical, or photographic errors. East Texas Poultry Supply does not warrant that any of the materials on its web site are accurate, complete, or current. East Texas Poultry Supply may make changes to the materials contained on its web site at any time without notice and does not make any commitment to update the materials.",
    },
    {
      number: "06",
      title: "Links",
      content: "East Texas Poultry Supply has not reviewed all of the sites linked to its web site and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by East Texas Poultry Supply. Use of any such linked web site is at the user's own risk.",
    },
    {
      number: "07",
      title: "Site Terms of Use Modifications",
      content: "East Texas Poultry Supply may revise these terms of use for its web site at any time without notice. By using this web site you are agreeing to be bound by the then current version of these Terms and Conditions of Use.",
    },
    {
      number: "08",
      title: "Governing Law",
      content: "Any claim relating to this web site shall be governed by the laws of the State of Texas without regard to its conflict of law provisions.",
    },
  ]

  const PRIVACY_PRINCIPLES = [
    "Before or at the time of collecting personal information, we will identify the purposes for which information is being collected.",
    "We will collect and use personal information solely with the objective of fulfilling those purposes specified by us and for other compatible purposes, unless we obtain the consent of the individual concerned or as required by law.",
    "We will only retain personal information as long as necessary for the fulfillment of those purposes.",
    "We will collect personal information by lawful and fair means and, where appropriate, with the knowledge or consent of the individual concerned.",
    "Personal data should be relevant to the purposes for which it is to be used, and, to the extent necessary for those purposes, should be accurate, complete, and up-to-date.",
    "We will protect personal information by reasonable security safeguards against loss or theft, as well as unauthorized access, disclosure, copying, use or modification.",
    "We will make readily available to customers information about our policies and practices relating to the management of personal information.",
  ]

  return (
    <main className="bg-barn min-h-screen pt-16 overflow-x-hidden">
      <div className="max-w-full overflow-x-hidden">

        {/* ==================== Page Header ==================== */}
        <div className="bg-nav-text py-14 sm:py-18 md:py-22 lg:py-24 px-6 sm:px-10 md:px-14 lg:px-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px]"/>
          <motion.div
            className="relative"
            variants={sectionStagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={reveal} className="flex items-center gap-3 mb-5 font-label text-section-label font-bold tracking-[4px] uppercase text-rust">
              <span className="block w-8 h-0.5 bg-rust" />
              Legal
            </motion.div>
            <motion.h1 variants={reveal} className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-hero leading-[1.1] sm:leading-[0.92] text-white mb-4">
              Terms &amp; <span className="text-rust">Privacy</span>
            </motion.h1>
            <motion.p variants={reveal} className="font-label text-xs sm:text-sm md:text-md tracking-[2px] sm:tracking-[3px] uppercase text-white/40 mt-4">
              Last updated: April, 2026 · East Texas Poultry Supply
            </motion.p>
          </motion.div>
        </div>

        <div className="px-6 sm:px-10 md:px-14 lg:px-24 py-14 sm:py-18 md:py-22 lg:py-24">

          {/* ==================== Terms & Conditions ==================== */}
          <Section className="mb-18 sm:mb-22 md:mb-26 lg:mb-28">
            <SectionHeader
              label="Section One"
              title="Terms & "
              titleHighlight="Conditions"
              description="Your privacy is very important to us. Accordingly, we have developed this Policy in order for you to understand how we collect, use, communicate, disclose, and make use of personal information. The following outlines our privacy policy."
            />

            {TERMS.map(({ number, title, content, items }) => (
              <motion.div
                key={number}
                variants={reveal}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 py-6 sm:py-8 md:py-10 border-t border-mid/15 last:border-b last:border-mid/15"
              >
                <div className="flex-shrink-0 sm:w-14">
                  <span className="font-display text-3xl sm:text-4xl md:text-5xl text-nav-text leading-none">{number}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-label text-xl sm:text-2xl md:text-3xl font-bold tracking-[1px] sm:tracking-[2px] uppercase text-nav-text mb-3 sm:mb-4">{title}</h3>
                  {content && (
                    <p className="text-base sm:text-lg leading-relaxed text-muted font-light m-0">{content}</p>
                  )}
                  {items && (
                    <ul className="flex flex-col gap-2 sm:gap-3 list-none p-0 m-0">
                      {items.map((item, j) => (
                        <li key={j} className="flex gap-3 sm:gap-4 text-base sm:text-lg leading-relaxed text-muted font-light">
                          <span className="block w-3 sm:w-4 h-px bg-muted/40 mt-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </Section>

          {/* ==================== Privacy Policy ==================== */}
          <Section>
            <SectionHeader
              label="Section Two"
              title="Privacy "
              titleHighlight="Policy"
              description="Your privacy is very important to us. Accordingly, we have developed this Policy in order for you to understand how we collect, use, communicate, disclose, and make use of personal information. The following outlines our privacy policy."
            />

            <motion.div
              variants={contentStagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-7"
            >
              {PRIVACY_PRINCIPLES.map((principle, i) => (
                <motion.div
                  key={i}
                  variants={reveal}
                  className="bg-white border border-mid/15 border-l-2 border-l-rust p-5 sm:p-6 md:p-7"
                >
                  <div className="font-display text-xl sm:text-2xl text-rust leading-none mb-3 sm:mb-4 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-muted font-light m-0">{principle}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={reveal} className="mt-8 sm:mt-10 md:mt-12 border-t border-mid/20 pt-8 sm:pt-10">
              <p className="text-xs sm:text-sm leading-relaxed text-muted font-light max-w-3xl">
                We are committed to conducting our business in accordance with these principles in order to
                ensure that the confidentiality of personal information is protected and maintained.
              </p>
            </motion.div>
          </Section>
        </div>

        {/* ==================== CTA ==================== */}
        <Section className="bg-white border-t border-mid/15 px-6 sm:px-10 md:px-14 lg:px-24 py-10 sm:py-14 md:py-18 lg:py-20 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
          <motion.div variants={reveal} className="text-center sm:text-left">
            <p className="font-bold text-base sm:text-lg tracking-[2px] sm:tracking-[3px] uppercase text-rust mb-2">Questions?</p>
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-nav-text leading-tight sm:leading-none">Get in touch with our team.</h3>
          </motion.div>
          <motion.div variants={reveal} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <a
              href="/support/contact"
              className="inline-block transition-all duration-200 bg-rust text-white px-6 sm:px-8 py-2.5 sm:py-3.5 font-label font-bold text-xs tracking-[2px] sm:tracking-[3px] uppercase border-2 border-rust hover:bg-rust-dark hover:border-rust-dark text-center w-full sm:w-auto"
            >
              Contact Us
            </a>
          </motion.div>
        </Section>
      </div>
    </main>
  )
}