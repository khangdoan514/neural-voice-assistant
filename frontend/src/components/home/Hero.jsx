import BtnOutline from "./BtnOutline.jsx";
import BtnPrimary from "./BtnPrimary.jsx";
import Label from "../Label.jsx"

const STATS = [
  ["65+", "Years in Business"],
  ["2", "Locations"],
  ["100s", "Farms Served"]
];

const HERO_MOSAIC = [
  { label: "Poultry Farming", bg: "linear-gradient(135deg,#2C2010,#1A1208)" },
  { label: "Poultry Farming", bg: "linear-gradient(135deg,#2C2010,#1A1208)" },
  { label: "Feeding Systems", bg: "linear-gradient(135deg,#3A2A18,#221A10)" },
  { label: "Equipment Service", bg: "linear-gradient(135deg,#281E12,#1C140C)" },
];

// Section Components
export default function Hero() {
  return (
    <section className="relative min-h-screen grid pt-16 overflow-hidden bg-barn" style={{ gridTemplateColumns: "1fr 1fr" }}>
      {/* Background Effects */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 70% 50%, rgba(196,82,26,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(212,180,131,0.04) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(196,82,26,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(196,82,26,0.07) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Left Content */}
      <div className="relative z-10 flex flex-col justify-center p-[clamp(1.5rem,5vw,5rem)]">
        <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <Label>Serving Poultry Growers Since 1958</Label>
        </div>

        <h1 className="animate-fade-up font-display leading-[0.95] text-nav-text mb-3" style={{ fontSize: "var(--text-hero)", animationDelay: "0.2s" }}>
          If It Goes In A{" "}
          <span className="text-rust block mt-4 mb-4">Poultry House,</span>
          We Have It.
        </h1>

        <p className="animate-fade-up font-display tracking-[4px] text-muted mb-4 mt-4" style={{ fontSize: "var(--text-subtitle)", animationDelay: "0.3s" }}>
          East Texas · Louisiana · South &amp; Central Texas
        </p>

        <p className="animate-fade-up leading-relaxed text-body text-muted max-w-md mb-12 font-light" style={{ animationDelay: "0.4s" }}>
          Top quality equipment at competitive prices, backed by a{" "}
          <strong className="text-nav-text font-medium">well-trained service team</strong>{" "}
          ready to help growers achieve success — just as we have for over half a century.
        </p>

        <div className="flex gap-4 items-center animate-fade-up mb-16" style={{ animationDelay: "0.5s" }}>
          <BtnPrimary to="/products">Browse Products</BtnPrimary>
          <BtnOutline to="/contact">Get a Quote</BtnOutline>
        </div>

        {/* Stats */}
        <div className="flex gap-[clamp(1.5rem,4vw,2.5rem)] animate-fade-up border-t border-mid/20 pt-[clamp(1.5rem,3vw,2rem]" style={{ animationDelay: "0.6s" }}>
          {STATS.map(([num, label]) => (
            <div key={label}>
              <div className="font-display text-title text-rust leading-none">{num}</div>
              <div className="font-label font-semibold text-body tracking-[2px] uppercase text-muted mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Mosaic */}
      <div className="relative z-10 grid overflow-hidden gap-0.5" style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
        {HERO_MOSAIC.map(({ label, bg }) => (
          <div
            key={label}
            className="relative flex items-center justify-center overflow-hidden"
            style={{ background: bg, gridRow: undefined }}
          >
            <span className="absolute bottom-3 left-3 font-label font-bold tracking-[2px] uppercase text-straw bg-nav-text/10 px-2 py-1 backdrop-blur-sm" style={{ fontSize: "var(--text-sm)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}