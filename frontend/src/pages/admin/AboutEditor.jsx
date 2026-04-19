import { motion } from "framer-motion"
import { PhotoIcon } from "@heroicons/react/24/outline"
import { fadeInUp } from "./variants"

export default function AboutEditor() {
  return (
    <motion.div className="w-full" variants={fadeInUp} initial="hidden" animate="visible">
      
    </motion.div>
  )
}
