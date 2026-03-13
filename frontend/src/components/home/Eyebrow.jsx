export default function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5 font-label text-lg font-bold tracking-[4px] uppercase text-rust">
      <span className="block w-8 h-0.5 bg-rust" />
      {children}
    </div>
  )
}