import { motion } from "framer-motion"
import { PhotoIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import { fadeInUp, stagger } from "./variants"
import { HERO_IMAGES_HARD_MAX } from "../../lib/homeHeroCards"

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
        <div className="flex items-center gap-2 mb-2">
          <PhotoIcon className="h-5 w-5 text-rust" />
          <h2 className="font-label text-xl text-foreground">Home Hero Mosaic</h2>
        </div>
        <p className="text-base text-muted mb-2 max-w-3xl">
          Each box has its own slideshow on the public Home page (auto-advance every 2.5 seconds). Add as many image
          URLs or uploads as you like per box (up to {HERO_IMAGES_HARD_MAX} per box).
        </p>

        <motion.div
          className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {homeHeroCards.map((card, boxIndex) => (
            <motion.div
              key={`hero-card-${boxIndex}`}
              variants={fadeInUp}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
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
                className="w-full rounded bg-paper border border-rust/20 px-3 py-2 text-base text-foreground mb-4"
                placeholder="Card label"
              />

              {(card.images || []).length === 0 && (
                <p className="text-sm text-muted mb-3">No images yet — this box will show the gradient fallback only.</p>
              )}

              <div className="space-y-3">
                {(card.images || []).map((imgUrl, imageIndex) => (
                  <div
                    key={`box-${boxIndex}-img-${imageIndex}`}
                    className="rounded-lg border border-rust/15 bg-paper/20 p-3"
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
                    <label className="block text-xs text-muted mb-1">URL</label>
                    <input
                      type="text"
                      value={imgUrl}
                      onChange={(e) => updateHomeBoxImage(boxIndex, imageIndex, e.target.value)}
                      className="w-full rounded bg-paper border border-rust/20 px-2 py-1.5 text-sm text-foreground mb-2"
                      placeholder="https://... or /images/..."
                    />
                    <label className="block text-xs text-muted mb-1">Upload</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleHomeBoxImageUpload(boxIndex, imageIndex, e.target.files?.[0])}
                      className="w-full text-xs text-muted file:mr-2 file:rounded file:border-0 file:bg-rust/20 file:px-2 file:py-1 file:text-rust file:font-label"
                    />
                    <div className="mt-2 h-20 rounded overflow-hidden border border-rust/20 bg-paper/40">
                      {imgUrl ? (
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted">Empty slot</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addHomeBoxImage(boxIndex)}
                disabled={(card.images || []).length >= HERO_IMAGES_HARD_MAX}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-rust/40 text-sm text-rust hover:bg-rust/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Add image
              </button>
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
