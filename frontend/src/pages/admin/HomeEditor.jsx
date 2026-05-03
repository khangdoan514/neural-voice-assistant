import { motion } from "framer-motion"
import { PhotoIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import { fadeInUp, stagger } from "./variants"
import { HERO_IMAGES_HARD_MAX } from "../../lib/homeHeroCards"

const editorCardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.99 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.38,
      delay: index * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const standardInputClass = [
  "w-full rounded-xl py-3.5 px-4 text-foreground placeholder:text-muted/40",
  "border bg-paper/95 shadow-none",
  "transition-[border-color] duration-200 ease-out",
  "focus:outline-none focus:ring-0 focus:border-rust",
  "border-rust/15 hover:border-rust/30",
].join(" ")

export default function HomeEditor({
  homeHeroCards,
  updateHomeCardLabel,
  updateHomeBoxImage,
  addHomeBoxImage,
  removeHomeBoxImage,
  handleHomeBoxImageUpload,
  saveHomeContent,
  resetHomeContent,
  isSavingHome,
  saveSuccess,
}) {
  return (
    <motion.div className="w-full" variants={fadeInUp} initial="hidden" animate="visible">
      <div className="p-1 sm:p-2">
        <motion.div
          className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {homeHeroCards.map((card, boxIndex) => (
            <motion.div
              key={`hero-card-${boxIndex}`}
              custom={boxIndex}
              variants={editorCardVariants}
              className="bg-barn/80 backdrop-blur-sm border border-rust/15 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-sm uppercase tracking-[2px] text-rust font-label">Hero box {boxIndex + 1}</p>
                <span className="text-xs text-muted">{(card.images || []).length} image(s)</span>
              </div>

              <label className="block text-sm text-muted mb-1">Label</label>
              <input
                type="text"
                value={card.label}
                onChange={(e) => updateHomeCardLabel(boxIndex, e.target.value)}
                className={`${standardInputClass} mb-4`}
                placeholder="Card label"
              />

              {(card.images || []).length === 0 && (
                <p className="text-sm text-muted mb-3">No images yet — this box will show the gradient fallback only.</p>
              )}

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(card.images || []).map((imgUrl, imageIndex) => (
                  <div
                    key={`box-${boxIndex}-img-${imageIndex}`}
                    className=""
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-label uppercase tracking-wider text-muted">Image {imageIndex + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeHomeBoxImage(boxIndex, imageIndex)}
                        className="inline-flex items-center gap-1 text-xs text-rust/80 hover:text-rust"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                    <label className="block text-xs text-muted mb-1">Upload</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleHomeBoxImageUpload(boxIndex, imageIndex, e.target.files?.[0])}
                      className="text-xs text-muted file:mr-2 file:rounded-lg file:border-0 file:bg-rust/20 file:px-2.5 file:py-1.5 file:text-rust file:font-label"
                    />
                    <div className={`mt-2 h-20 rounded overflow-hidden bg-paper/40 ${imgUrl ? "" : "border border-rust/20"}`}>
                      {imgUrl ? (
                        <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted">Empty slot</div>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addHomeBoxImage(boxIndex)}
                  disabled={(card.images || []).length >= HERO_IMAGES_HARD_MAX}
                  className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dashed border-rust/40 text-sm text-rust hover:bg-rust/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add image
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <motion.button
            type="button"
            onClick={saveHomeContent}
            disabled={isSavingHome}
            className="px-4 py-2 bg-rust text-paper rounded-lg hover:bg-rust-dark transition-colors text-base disabled:opacity-60"
            whileTap={{ scale: 0.98 }}
          >
            {isSavingHome ? "Saving..." : "Save Home Changes"}
          </motion.button>
          <motion.button
            type="button"
            onClick={resetHomeContent}
            className="px-4 py-2 bg-paper border border-rust/30 text-foreground rounded-lg hover:border-rust hover:text-rust transition-colors text-base"
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
