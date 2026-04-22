import { motion } from "framer-motion"
import { fadeInUp } from "./variants"

export default function Settings({
  settingsFirstName,
  setSettingsFirstName,
  settingsLastName,
  setSettingsLastName,
  settingsEmail,
  setSettingsEmail,
  settingsProfilePicture,
  setSettingsProfilePicture,
  handleSettingsImageUpload,
  saveSettings,
  isSavingSettings,
  isLoadingProfile,
  saveSuccess,
}) {
  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 bg-paper/30 border border-rust/20 rounded-xl p-5">
          <p className="text-sm uppercase tracking-[2px] text-rust font-label mb-3">Profile picture</p>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full overflow-hidden border border-rust/25 bg-paper flex items-center justify-center">
              {settingsProfilePicture ? (
                <img src={settingsProfilePicture} alt="Admin profile" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-rust font-label font-bold text-xl">
                  {(settingsFirstName || settingsEmail || "A").slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-sm text-muted mb-1">Image URL</label>
              <input
                type="text"
                value={settingsProfilePicture}
                onChange={(e) => setSettingsProfilePicture(e.target.value)}
                className="w-full rounded-lg bg-paper border border-rust/20 px-3 py-2 text-base text-foreground focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust/40"
                placeholder="https://... or data:image/... or /images/..."
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-muted cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleSettingsImageUpload(e.target.files?.[0])}
                  />
                  <span className="px-3 py-2 rounded-lg bg-barn/60 border border-rust/20 text-foreground hover:border-rust/50 transition-colors">
                    Upload image
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setSettingsProfilePicture("")}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-paper/30 border border-rust/20 rounded-xl p-5">
          <p className="text-sm uppercase tracking-[2px] text-rust font-label mb-4">Account details</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1">First name</label>
              <input
                type="text"
                value={settingsFirstName}
                onChange={(e) => setSettingsFirstName(e.target.value)}
                className="w-full rounded-lg bg-paper border border-rust/20 px-3 py-2 text-base text-foreground focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust/40"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Last name</label>
              <input
                type="text"
                value={settingsLastName}
                onChange={(e) => setSettingsLastName(e.target.value)}
                className="w-full rounded-lg bg-paper border border-rust/20 px-3 py-2 text-base text-foreground focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust/40"
                placeholder="Last name"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-muted mb-1">Email</label>
              <input
                type="email"
                value={settingsEmail}
                onChange={(e) => setSettingsEmail(e.target.value)}
                className="w-full rounded-lg bg-paper border border-rust/20 px-3 py-2 text-base text-foreground focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust/40"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="text-sm text-muted">{isLoadingProfile ? "Loading profile..." : " "}</div>
            <button
              type="button"
              onClick={saveSettings}
              disabled={isSavingSettings}
              className={`px-4 py-2 rounded-lg font-label text-sm uppercase tracking-[2px] transition-all ${
                isSavingSettings ? "bg-rust/30 text-rust/70 cursor-not-allowed" : "bg-rust text-paper hover:bg-rust/90"
              }`}
            >
              {isSavingSettings ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
      {saveSuccess && <p className="mt-4 text-base text-green-500">{saveSuccess}</p>}
    </motion.div>
  )
}
