import { motion } from "framer-motion"
import { fadeInUp } from "./variants"

export default function Welcome({ adminProfile }) {
  const first = adminProfile?.first_name?.trim() || ""
  const last = adminProfile?.last_name?.trim() || ""
  const name = [first, last].filter(Boolean).join(" ") || adminProfile?.email || "there"

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center"
    >
      <p className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight">
        Welcome back,{" "}
        <span className="text-rust">
          {name}
        </span>
        !
      </p>
      <p className="mt-4 max-w-md text-sm sm:text-base text-muted">
        Choose a section from the sidebar to get started.
      </p>
    </motion.div>
  )
}
