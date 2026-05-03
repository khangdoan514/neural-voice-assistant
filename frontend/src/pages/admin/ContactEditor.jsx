import { motion } from "framer-motion"
import { PhotoIcon } from "@heroicons/react/24/outline"
import { fadeInUp, stagger } from "./variants"

const standardInputClass = [
  "w-full rounded-xl py-3.5 px-4 text-foreground placeholder:text-muted/40",
  "border bg-paper/95 shadow-none",
  "transition-[border-color] duration-200 ease-out",
  "focus:outline-none focus:ring-0 focus:border-rust",
  "border-rust/15 hover:border-rust/30",
].join(" ")

export default function ContactEditor({
  contactBusinessHoursImage,
  setContactBusinessHoursImage,
  handleContactBusinessImageUpload,
  contactPeople,
  updateContactPerson,
  addContactPerson,
  removeContactPerson,
  handleContactPersonImageUpload,
  saveContactContent,
  resetContactContent,
  isSavingContact,
  saveSuccess,
}) {
  return (
    <motion.div className="w-full" variants={fadeInUp} initial="hidden" animate="visible">
      <div className="flex items-center gap-2 mb-2">
        <PhotoIcon className="h-5 w-5 text-rust" />
        <h2 className="font-label text-xl text-foreground">Contact Page Images</h2>
      </div>
      <p className="text-base text-muted mb-6">
        Update Business Hours image and team photos shown on the Contact page.
      </p>

      <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="visible">
        <motion.div
          variants={fadeInUp}
          className="bg-barn/80 backdrop-blur-sm border border-rust/15 rounded-lg p-4 shadow-sm max-w-3xl"
        >
          <p className="text-sm uppercase tracking-[2px] text-rust font-label mb-3">Business Hours Image</p>
          <label className="block text-sm text-muted mb-1">Image URL</label>
          <input
            type="text"
            value={contactBusinessHoursImage}
            onChange={(e) => setContactBusinessHoursImage(e.target.value)}
            className={`${standardInputClass} mb-3`}
            placeholder="https://... or /images/..."
          />
          <label className="block text-sm text-muted mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleContactBusinessImageUpload(e.target.files?.[0])}
            className="w-full text-sm text-muted file:mr-3 file:rounded file:border-0 file:bg-rust/20 file:px-3 file:py-1.5 file:text-rust file:font-label"
          />
          <div className="mt-4 h-40 rounded overflow-hidden border border-rust/20 bg-paper/30">
            {contactBusinessHoursImage ? (
              <img src={contactBusinessHoursImage} alt="Business hours preview" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-muted">No image selected</div>
            )}
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="flex items-center justify-between">
          <p className="text-sm uppercase tracking-[2px] text-rust font-label">Team Members</p>
          <motion.button
            type="button"
            onClick={addContactPerson}
            className="px-3 py-1.5 bg-rust/20 text-rust rounded border border-rust/30 hover:bg-rust/30 transition-colors text-sm"
            whileTap={{ scale: 0.98 }}
          >
            + Add Person
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {contactPeople.map((person, index) => (
            <motion.div
              key={`contact-person-${index}`}
              variants={fadeInUp}
              className="bg-barn/80 backdrop-blur-sm border border-rust/15 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm uppercase tracking-[2px] text-rust font-label">Person {index + 1}</p>
                <motion.button
                  type="button"
                  onClick={() => removeContactPerson(index)}
                  disabled={contactPeople.length <= 2}
                  className="text-xs px-2 py-1 border border-rust/30 rounded text-rust hover:bg-rust/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.98 }}
                >
                  Remove
                </motion.button>
              </div>
              <label className="block text-sm text-muted mb-1">Name</label>
              <input
                type="text"
                value={person.name}
                onChange={(e) => updateContactPerson(index, "name", e.target.value)}
                className={`${standardInputClass} mb-3`}
              />
              <label className="block text-sm text-muted mb-1">Role</label>
              <input
                type="text"
                value={person.role}
                onChange={(e) => updateContactPerson(index, "role", e.target.value)}
                className={`${standardInputClass} mb-3`}
              />
              <label className="block text-sm text-muted mb-1">Phone</label>
              <input
                type="text"
                value={person.phone}
                onChange={(e) => updateContactPerson(index, "phone", e.target.value)}
                className={`${standardInputClass} mb-3`}
              />
              <label className="block text-sm text-muted mb-1">Email</label>
              <input
                type="text"
                value={person.email}
                onChange={(e) => updateContactPerson(index, "email", e.target.value)}
                className={`${standardInputClass} mb-3`}
              />
              <label className="block text-sm text-muted mb-1">Image URL</label>
              <input
                type="text"
                value={person.image}
                onChange={(e) => updateContactPerson(index, "image", e.target.value)}
                className={`${standardInputClass} mb-3`}
                placeholder="https://... or /images/..."
              />
              <label className="block text-sm text-muted mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleContactPersonImageUpload(index, e.target.files?.[0])}
                className="w-full text-sm text-muted file:mr-3 file:rounded file:border-0 file:bg-rust/20 file:px-3 file:py-1.5 file:text-rust file:font-label"
              />
              <div className="mt-4 h-32 rounded overflow-hidden border border-rust/20 bg-paper/30">
                {person.image ? (
                  <img src={person.image} alt={`Contact person ${index + 1}`} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-muted">No image selected</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <motion.button
          type="button"
          onClick={saveContactContent}
          disabled={isSavingContact}
          className="px-4 py-2 bg-rust text-paper rounded-lg hover:bg-rust-dark transition-colors text-base disabled:opacity-60"
          whileTap={{ scale: 0.98 }}
        >
          {isSavingContact ? "Saving..." : "Save Contact Changes"}
        </motion.button>
        <motion.button
          type="button"
          onClick={resetContactContent}
          className="px-4 py-2 bg-paper border border-rust/30 text-foreground rounded-lg hover:border-rust hover:text-rust transition-colors text-base"
          whileTap={{ scale: 0.98 }}
        >
          Reset to Defaults
        </motion.button>
      </div>

      {saveSuccess && <p className="mt-4 text-base text-green-500">{saveSuccess}</p>}
    </motion.div>
  )
}
