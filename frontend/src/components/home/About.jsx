import BtnPrimary from "./BtnPrimary.jsx";
import Label from "../Label.jsx"

const TIMELINE = [
  { year: "1958", title: "Founded in Center, TX", desc: "East Texas Poultry Supply opens its doors, serving local poultry growers with quality equipment." },
  { year: "Grew", title: "Expanded Service Area", desc: "Growth into south and central Texas as demand from growers across the region increased." },
  { year: "+TX", title: "Gonzales, TX Location", desc: "Second warehouse opens, extending full-service coverage to south and central Texas." },
  { year: "Now", title: "TX, LA & Beyond", desc: "Shipping poultry equipment and supplies anywhere in the world from our retail outlet." },
];

export default function About() {
  return (
    <section
      className="grid gap-[clamp(2rem,5vw,5rem)] items-center py-[clamp(3rem,8vw,6rem)] px-[clamp(1.5rem,5vw,5rem)] bg-barn"
      style={{ gridTemplateColumns: "repeat(2,1fr)" }}
    >
      <div>
        <Label>Our Story</Label>
        <h2 className="font-display leading-tight text-title text-nav-text mb-6">
          Built on <span className="text-rust">Trust.</span><br />
          Proven Over <span className="text-rust">Decades.</span>
        </h2>
        
        <p className="leading-relaxed text-muted text-body font-light mb-5">
          <strong className="text-nav-text font-medium">East Texas Poultry Supply</strong> has proven their ability to help poultry growers achieve success for over half a century. We offer top quality equipment at competitive prices and have a well-trained service team ready to assist.
        </p>
        
        <p className="leading-relaxed text-muted text-body font-light mb-5">
          Founded in Center, Texas in 1958, we've expanded to include a second location in Gonzales, Texas — allowing us to serve south, central, and north Texas, plus Louisiana.
        </p>
        
        <p className="leading-relaxed text-muted text-body font-light mb-5">
          Beyond poultry, our retail store stocks water storage tanks, pressure pumps, HVAC motors, capacitors, drive belts, and bearings for farm or industrial use. <strong className="text-nav-text font-medium">We ship worldwide.</strong>
        </p>
        
        <div className="mt-8">
          <BtnPrimary to="/about">About Our Company</BtnPrimary>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col">
        {TIMELINE.map(({ year, title, desc }, index) => (
          <div
            key={year}
            className="grid relative py-6"
            style={{ gridTemplateColumns: "80px 1fr", gap: "24px" }}
          >
            {index < TIMELINE.length && (
              <div className="absolute left-[76px] top-0 bottom-0 w-0.5 bg-rust/20" />
            )}
            <div className="font-display text-subtitle text-rust leading-none">{year}</div>
            <div className="pt-1.5">
              <strong className="text-label text-nav-text block mb-1">{title}</strong>
              <div className="text-body">
                {desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}