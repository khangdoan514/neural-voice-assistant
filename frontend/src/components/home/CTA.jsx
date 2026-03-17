import BtnOutline from "./BtnOutline.jsx";
import BtnPrimary from "./BtnPrimary.jsx";

export default function CTA() {
  return (
    <section className="relative text-center overflow-hidden py-[clamp(3rem,8vw,6rem)] px-[clamp(1.5rem,5vw,5rem)] py-20 px-20 bg-white border-t border-mid/20 border-b border-mid/20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(196,82,26,0.08) 0%, transparent 65%)" }}
      />
      
      <h2 className="relative font-display leading-[0.95] text-title text-nav-text mb-6">
        Ready to <span className="text-rust">Equip</span><br />Your Farm?
      </h2>
      
      <p className="relative mx-auto text-body text-muted mb-12 max-w-md leading-relaxed">
        Reach out for quotes on new construction, equipment, or retrofit projects. Customer satisfaction is job one.
      </p>
      
      <div className="flex gap-4 justify-center relative">
        <BtnPrimary to="/contact">Contact Us Today</BtnPrimary>
        <BtnOutline to="/products">Browse All Products</BtnOutline>
      </div>
    </section>
  );
}