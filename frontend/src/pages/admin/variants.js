export const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
}

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
