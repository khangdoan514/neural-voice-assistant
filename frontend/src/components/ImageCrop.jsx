import { useCallback, useMemo, useState } from "react"
import Cropper from "react-easy-crop"

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "anonymous")
    image.src = url
  })
}

async function getCroppedDataUrl(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext("2d")
  if (!ctx) return imageSrc

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )
  return canvas.toDataURL("image/jpeg", 0.92)
}

export default function ImageCrop({
  open,
  imageSrc,
  aspect = 1,
  onCancel,
  onConfirm,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isApplying, setIsApplying] = useState(false)

  const title = useMemo(() => (aspect === 1 ? "Crop image (square)" : "Crop image (rectangle)"), [aspect])

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return
    setIsApplying(true)
    try {
      const cropped = await getCroppedDataUrl(imageSrc, croppedAreaPixels)
      onConfirm(cropped)
    } finally {
      setIsApplying(false)
    }
  }, [croppedAreaPixels, imageSrc, onConfirm])

  if (!open || !imageSrc) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-scrim/70 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-rust/20 bg-barn p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-label text-base text-foreground">{title}</h3>
        </div>

        <div className="relative h-80 overflow-hidden rounded-lg border border-rust/15 bg-foreground/10">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
            showGrid
          />
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-xs text-muted">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-paper border border-rust/30 text-foreground rounded-lg hover:border-rust hover:text-rust transition-colors text-sm"
            disabled={isApplying}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isApplying}
            className="px-4 py-2 bg-rust text-paper rounded-lg hover:bg-rust-dark transition-colors text-sm disabled:opacity-60"
          >
            {isApplying ? "Applying..." : "Apply crop"}
          </button>
        </div>
      </div>
    </div>
  )
}
