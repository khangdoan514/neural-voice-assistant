import { motion } from "framer-motion"
import { PhotoIcon } from "@heroicons/react/24/outline"
import { fadeInUp, stagger } from "./variants"

export default function HomeEditor({
  homeHeroCards,
  updateHomeCard,
  handleImageUpload,
  saveHomeContent,
  resetHomeContent,
  isSavingHome,
  saveSuccess,
}) {
  return (
    <motion.div className="w-full" variants={fadeInUp} initial="hidden" animate="visible">
      <div className="p-1 sm:p-2">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {homeHeroCards.map((card, index) => (
            <motion.div
              key={`hero-card-${index}`}
              variants={fadeInUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-barn/80 backdrop-blur-sm border border-rust/15 rounded-lg p-4 shadow-sm"
            >
              <p className="text-sm uppercase tracking-[2px] text-rust font-label mb-3">Hero Box {index + 1}</p>

              <label className="block text-sm text-muted mb-1">Label</label>
              <input
                type="text"
                value={card.label}
                onChange={(e) => updateHomeCard(index, "label", e.target.value)}
                className="w-full rounded bg-charcoal border border-rust/20 px-3 py-2 text-base text-nav-text mb-3"
                placeholder="Card label"
              />

              <label className="block text-sm text-muted mb-1">Image URL</label>
              <input
                type="text"
                value={card.image}
                onChange={(e) => updateHomeCard(index, "image", e.target.value)}
                className="w-full rounded bg-charcoal border border-rust/20 px-3 py-2 text-base text-nav-text mb-3"
                placeholder="https://... or /images/..."
              />

              <label className="block text-sm text-muted mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(index, e.target.files?.[0])}
                className="w-full text-sm text-muted file:mr-3 file:rounded file:border-0 file:bg-rust/20 file:px-3 file:py-1.5 file:text-rust file:font-label"
              />

              <div className="mt-4 h-24 rounded overflow-hidden border border-rust/20 bg-charcoal/30">
                {card.image ? (
                  <img src={card.image} alt={card.label || `Hero card ${index + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-muted">No image selected</div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <motion.button
            type="button"
            onClick={saveHomeContent}
            disabled={isSavingHome}
            className="px-4 py-2 bg-rust text-white rounded-lg hover:bg-rust-dark transition-colors text-base disabled:opacity-60"
            whileTap={{ scale: 0.98 }}
          >
            {isSavingHome ? "Saving..." : "Save Home Changes"}
          </motion.button>
          <motion.button
            type="button"
            onClick={resetHomeContent}
            className="px-4 py-2 bg-charcoal border border-rust/30 text-nav-text rounded-lg hover:border-rust hover:text-rust transition-colors text-base"
            whileTap={{ scale: 0.98 }}
          >
            Reset to Defaults
          </motion.button>
        </div>

        {saveSuccess && <p className="mt-4 text-base text-green-500">{saveSuccess}</p>}
      </div>
    </motion.div>
  )
}
