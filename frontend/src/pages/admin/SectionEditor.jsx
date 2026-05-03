import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import { fadeInUp, stagger } from "./variants"
import { fetchPageSectionsApi, savePageSectionsApi } from "../../api/adminAPI"

const EMPTY_SECTION = {
  title: "",
  description: "",
  images: [{ url: "", description: "" }],
}

const standardInputClass = [
  "w-full rounded-xl py-3.5 px-4 text-foreground placeholder:text-muted/40",
  "border bg-paper/95 shadow-none",
  "transition-[border-color] duration-200 ease-out",
  "focus:outline-none focus:ring-0 focus:border-rust",
  "border-rust/15 hover:border-rust/30",
].join(" ")

const standardTextareaClass = [
  "w-full rounded-xl px-4 py-3 text-foreground placeholder:text-muted/40",
  "border bg-paper/95 shadow-none",
  "transition-[border-color] duration-200 ease-out",
  "focus:outline-none focus:ring-0 focus:border-rust",
  "border-rust/15 hover:border-rust/30",
].join(" ")

export default function SectionEditor({ pageLabel, sectionsStorageKey, cropImageFile }) {
  const [sections, setSections] = useState([])
  const [saveMessage, setSaveMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setErrorMessage("")
    ;(async () => {
      try {
        const loaded = await fetchPageSectionsApi(sectionsStorageKey)
        if (!cancelled) {
          const normalized = Array.isArray(loaded)
            ? loaded.map((section) => {
              const rawImages = Array.isArray(section?.images)
                ? section.images
                : typeof section?.image === "string" && section.image
                  ? [section.image]
                  : [{ url: "", description: "" }]
              return {
                title: typeof section?.title === "string" ? section.title : "",
                description: typeof section?.description === "string" ? section.description : "",
                images: rawImages.map((img) => {
                  if (img && typeof img === "object") {
                    return {
                      url: String(img.url || img.image || ""),
                      description: String(img.description || img.caption || ""),
                    }
                  }
                  return { url: String(img || ""), description: "" }
                }),
              }
            })
            : []
          setSections(normalized)
        }
      } catch (err) {
        if (!cancelled) {
          setSections([])
          setErrorMessage(err instanceof Error ? err.message : "Failed to load sections")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    })()

    setSaveMessage("")
    return () => {
      cancelled = true
    }
  }, [sectionsStorageKey])

  const updateSection = (index, field, value) => {
    setSections((prev) => prev.map((section, i) => (i === index ? { ...section, [field]: value } : section)))
  }

  const addSection = () => {
    setSections((prev) => [...prev, { ...EMPTY_SECTION }])
  }

  const removeSection = (index) => {
    setSections((prev) => prev.filter((_, i) => i !== index))
  }

  const updateSectionImage = (sectionIndex, imageIndex, field, value) => {
    setSections((prev) =>
      prev.map((section, i) => {
        if (i !== sectionIndex) return section
        const images = Array.isArray(section.images) ? [...section.images] : []
        const current =
          images[imageIndex] && typeof images[imageIndex] === "object"
            ? images[imageIndex]
            : { url: String(images[imageIndex] || ""), description: "" }
        images[imageIndex] = { ...current, [field]: value }
        return { ...section, images }
      })
    )
  }

  const addSectionImage = (sectionIndex) => {
    setSections((prev) =>
      prev.map((section, i) => {
        if (i !== sectionIndex) return section
        const images = Array.isArray(section.images) ? [...section.images] : []
        images.push({ url: "", description: "" })
        return { ...section, images }
      })
    )
  }

  const removeSectionImage = (sectionIndex, imageIndex) => {
    setSections((prev) =>
      prev.map((section, i) => {
        if (i !== sectionIndex) return section
        const images = Array.isArray(section.images) ? [...section.images] : []
        if (images.length <= 1) return { ...section, images: [{ url: "", description: "" }] }
        images.splice(imageIndex, 1)
        return { ...section, images }
      })
    )
  }

  const handleSectionImageUpload = async (sectionIndex, imageIndex, file) => {
    if (!file) return
    if (typeof cropImageFile === "function") {
      const cropped = await cropImageFile(file, 4 / 3)
      if (cropped) {
        updateSectionImage(sectionIndex, imageIndex, "url", cropped)
      }
      return
    }

    const reader = new FileReader()
    reader.onload = () => updateSectionImage(sectionIndex, imageIndex, "url", String(reader.result || ""))
    reader.readAsDataURL(file)
  }

  const saveSections = () => {
    const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
    setIsSaving(true)
    setErrorMessage("")
    const payload = sections.map((section) => ({
      title: String(section.title || ""),
      description: String(section.description || ""),
      images: (Array.isArray(section.images) ? section.images : [])
        .map((img) => {
          if (img && typeof img === "object") {
            return {
              url: String(img.url || "").trim(),
              description: String(img.description || "").trim(),
            }
          }
          return { url: String(img || "").trim(), description: "" }
        })
        .filter((img) => img.url),
    }))
    savePageSectionsApi(accessToken, sectionsStorageKey, payload)
      .then((saved) => {
        setSections(Array.isArray(saved) ? saved : [])
        setSaveMessage(`${pageLabel} sections saved.`)
        setTimeout(() => setSaveMessage(""), 2000)
      })
      .catch((err) => {
        setErrorMessage(err instanceof Error ? err.message : "Failed to save sections")
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  const resetSections = () => {
    const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
    setIsSaving(true)
    setErrorMessage("")
    savePageSectionsApi(accessToken, sectionsStorageKey, [])
      .then((saved) => {
        setSections(Array.isArray(saved) ? saved : [])
        setSaveMessage(`${pageLabel} sections reset.`)
        setTimeout(() => setSaveMessage(""), 2000)
      })
      .catch((err) => {
        setErrorMessage(err instanceof Error ? err.message : "Failed to reset sections")
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  return (
    <motion.div className="w-full" variants={fadeInUp} initial="hidden" animate="visible">
      <div className="p-1 sm:p-2">
        <div className="mb-5">
          <h2 className="font-label text-xl text-foreground">{pageLabel} Sections</h2>
          <p className="text-sm text-muted mt-1">
            Add sections with title, description, and multiple images. Section content is shown on the page only when title is filled.
          </p>
        </div>

        {isLoading && <p className="text-sm text-muted mb-4">Loading sections...</p>}
        {errorMessage && <p className="text-sm text-red-500 mb-4">{errorMessage}</p>}

        <motion.div
          className="grid grid-cols-1 gap-4 sm:gap-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {sections.map((section, index) => (
            <motion.div
              key={`section-${index}`}
              variants={fadeInUp}
              className="bg-barn/80 backdrop-blur-sm border border-rust/15 rounded-lg p-4 shadow-sm"
            >
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-sm uppercase tracking-[2px] text-rust font-label">Section {index + 1}</p>
              <button
                type="button"
                onClick={() => removeSection(index)}
                className="inline-flex items-center gap-1 text-xs text-rust/80 hover:text-rust"
              >
                <TrashIcon className="h-4 w-4" />
                Remove
              </button>
            </div>

            <label className="block text-sm text-muted mb-1">Title</label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => updateSection(index, "title", e.target.value)}
              className={`${standardInputClass} mb-3`}
              placeholder="Section title"
            />

            <label className="block text-sm text-muted mb-1">Description</label>
            <textarea
              rows={4}
              value={section.description}
              onChange={(e) => updateSection(index, "description", e.target.value)}
              className={`${standardTextareaClass} mb-3`}
              placeholder="Section description"
            />

            <label className="block text-sm text-muted mb-1">Images</label>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(Array.isArray(section.images) ? section.images : [{ url: "", description: "" }]).map((image, imageIndex) => (
                <div key={`section-${index}-image-${imageIndex}`} className="rounded-lg bg-paper/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-label uppercase tracking-wider text-muted">Image {imageIndex + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeSectionImage(index, imageIndex)}
                      className="inline-flex items-center gap-1 text-xs text-rust/80 hover:text-rust"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Remove
                    </button>
                  </div>

                  <label className="block text-xs text-muted mb-1">Image Description</label>
                  <textarea
                    rows={2}
                    value={typeof image === "object" ? image.description : ""}
                    onChange={(e) => updateSectionImage(index, imageIndex, "description", e.target.value)}
                    className={`${standardTextareaClass} mb-2 text-sm`}
                    placeholder="Description shown under this image"
                  />

                  <label className="block text-xs text-muted mb-1">Upload</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSectionImageUpload(index, imageIndex, e.target.files?.[0])}
                    className="text-xs text-muted file:mr-2 file:rounded-lg file:border-0 file:bg-rust/20 file:px-2.5 file:py-1.5 file:text-rust file:font-label"
                  />

                  <div className="mt-2 h-24 rounded overflow-hidden border border-rust/20 bg-paper/30">
                    {(typeof image === "object" ? image.url : String(image || "")) ? (
                      <img
                        src={typeof image === "object" ? image.url : String(image || "")}
                        alt={`Section ${index + 1} image ${imageIndex + 1}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted">No image selected</div>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addSectionImage(index)}
                className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dashed border-rust/40 text-sm text-rust hover:bg-rust/10 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Add image
              </button>
            </div>
            </motion.div>
          ))}
        </motion.div>

        <button
          type="button"
          onClick={addSection}
          className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-dashed border-rust/40 text-sm text-rust hover:bg-rust/10 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Add section
        </button>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            type="button"
            onClick={saveSections}
            disabled={isSaving}
            className="px-4 py-2 bg-rust text-paper rounded-lg hover:bg-rust-dark transition-colors text-base disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Sections"}
          </button>
          <button
            type="button"
            onClick={resetSections}
            disabled={isSaving}
            className="px-4 py-2 bg-paper border border-rust/30 text-foreground rounded-lg hover:border-rust hover:text-rust transition-colors text-base disabled:opacity-60"
          >
            Reset to Placeholder
          </button>
        </div>

        {saveMessage && <p className="mt-4 text-base text-green-500">{saveMessage}</p>}
      </div>
    </motion.div>
  )
}
