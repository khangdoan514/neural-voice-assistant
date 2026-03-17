const MARQUEE_ITEMS = [
  "Feeding Systems", "Watering Systems", "Heating Systems", "Cooling Systems",
  "LED Lighting", "Fan Systems", "Controllers", "Roll Seal Doors",
  "Cleanout Equipment", "On-Farm Repair", "New Construction",
];

export default function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  
  return (
    <div className="bg-rust py-4 overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-block">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-label text-label tracking-[4px] text-white/90 px-10"
          >
            <span className="text-white/40">◆  </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}