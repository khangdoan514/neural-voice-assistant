export default function About() {
  const PILLARS = [
    {
      number: "01",
      title: "Customer Satisfaction",
      desc: "Customer satisfaction is job one. Today's poultry producers invest millions of dollars, often their family land and their time. That's why it's critical to team up with a reliable, time-tested supplier.",
    },
    {
      number: "02",
      title: "Top Quality Equipment",
      desc: "We offer top quality equipment at competitive prices. Our inventory includes all types of poultry equipment, water storage tanks, pressure pumps, and all parts for your water needs.",
    },
    {
      number: "03",
      title: "Expert Service Team",
      desc: "Our well-trained service team is ready to help growers if they need assistance — whether on the farm or in our repair shop, we keep your operation running.",
    },
    {
      number: "04",
      title: "Ships Worldwide",
      desc: "Our retail outlet is equipped to ship all over the world. Call us for quotes on new construction, refurbishing older houses, or equipment. You will be pleased with our prices and service.",
    },
  ]

  const INVENTORY = [
    { number: "01", title: "Poultry Equipment",    desc: "All types of poultry equipment for feeding, watering, heating, cooling, and ventilation systems." },
    { number: "02", title: "Water Systems",         desc: "Water storage tanks, pressure pumps, and all parts for your water needs." },
    { number: "03", title: "Electric Motors",       desc: "New and refurbished electric motors — the largest inventory of HVAC motors, capacitors, and contactors in the east Texas area." },
    { number: "04", title: "Drive Components",      desc: "A large selection of drive belts, pulleys, and bearings of all sizes for farm or industrial use." },
    { number: "05", title: "Repair Shop",           desc: "Our shop is always busy repairing motors, water medication pumps, bearings, poultry equipment, and heavy equipment used around the farm." },
    { number: "06", title: "Farm & Home Retail",    desc: "Our retail store is well stocked with a variety of items used at home or around the farm, including bins for horse, cattle, and other farming operations." },
  ]

  const TIMELINE = [
    { year: "1958",  title: "Founded in Center, TX",   desc: "East Texas Poultry Supply opens its doors in Center, Texas, serving local poultry growers with quality equipment and reliable service." },
    { year: "1970s", title: "Growing Reputation",      desc: "Word spreads across east Texas. Growers from neighboring counties begin relying on ETPS for equipment, parts, and repair work." },
    { year: "1990s", title: "Gonzales, TX Warehouse",  desc: "A second warehouse location opens in Gonzales, Texas, giving us the base to offer full service to south and central Texas." },
    { year: "2000s", title: "Expanded Service Region", desc: "Our primary service area expands to include south, central, and north Texas, extending over into Louisiana and most of that state." },
    { year: "Today", title: "TX, LA & Worldwide",      desc: "We continue to serve growers across Texas and Louisiana, and ship poultry equipment and supplies anywhere in the world." },
  ]

  return (
    <main className="bg-barn min-h-screen pt-16">

      {/* ── Page Header ── */}
      <div className="bg-nav-text py-20 px-20 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(196,82,26,0.12) 0%, transparent 60%)" }}
        />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5 font-label text-xs font-bold tracking-[4px] uppercase text-rust">
            <span className="block w-8 h-px bg-rust flex-shrink-0" />
            Our Company
          </div>
          <h1 className="font-display text-[clamp(48px,6vw,80px)] leading-[0.92] text-white mb-4">
            About <span className="text-rust">East Texas</span><br />Poultry Supply
          </h1>
          <p className="font-label text-xs tracking-[3px] uppercase text-white/40 mt-4">
            Est. 1958 · Center, Texas · Serving Growers for Over 65 Years
          </p>
        </div>
      </div>

      {/* ── Intro band ── */}
      <div className="border-b border-mid/20 bg-white px-20 py-8">
        <p className="text-sm text-muted font-light leading-relaxed max-w-3xl">
          East Texas Poultry Supply has proven their ability to help poultry growers achieve success
          for over one-half century. We offer top quality equipment at competitive prices and have a
          well-trained service team to help growers if they need assistance.
        </p>
      </div>

      <div className="px-20 py-20">

        {/* ── Our Story ── */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-3 font-label text-xs font-bold tracking-[4px] uppercase text-rust">
            <span className="block w-8 h-px bg-rust flex-shrink-0" />
            Our Story
          </div>
          <h2 className="font-display text-[clamp(32px,4vw,52px)] leading-none text-nav-text mb-16">
            A Name Built on <span className="text-mid/50">Experience</span>
          </h2>

          <div className="grid gap-16 items-start" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="flex flex-col gap-6">
              <p className="text-sm leading-relaxed text-muted font-light m-0">
                The part of our name <strong className="text-nav-text font-medium">"East Texas"</strong> simply
                refers to the city, Center, Texas, where we were founded in 1958. Since that humble beginning,
                we have expanded to include a separate location in Gonzales, Texas. Our primary service area now
                includes south, central, and north Texas and over into Louisiana and most of that state.
              </p>
              <p className="text-sm leading-relaxed text-muted font-light m-0">
                The part of our name <strong className="text-nav-text font-medium">"Poultry"</strong> refers to
                our primary business and does not reveal the entire scope of East Texas Poultry Supply. For example,
                we ship feed storage bins to horse, cattle, and other farming operations and have a retail store
                that is well stocked with a variety of items used at home or around the farm.
              </p>
              <p className="text-sm leading-relaxed text-muted font-light m-0">
                Today's poultry producers choose to invest millions of dollars, often their family land and their
                time, in order to achieve their goal of self-employment in this great industry. That is why it is
                so important for them to team up with a reliable and time-tested supplier for their housing,
                equipment, and service needs.
              </p>

              {/* Expanded service callout */}
              <div className="border-l-2 border-rust pl-6 py-2 mt-2">
                <p className="font-label text-xs font-bold tracking-[3px] uppercase text-rust mb-2">Expanded Service Area</p>
                <p className="text-sm leading-relaxed text-muted font-light m-0">
                  While we only have one retail store located in Center, Texas, our warehouse in Gonzales, Texas
                  gives us the base to offer full service to south and central Texas as well. Our ability to ship
                  poultry equipment and supplies anywhere also expands our market area.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              {TIMELINE.map(({ year, title, desc }) => (
                <div
                  key={year}
                  className="flex gap-8 py-7 border-t border-mid/15 last:border-b last:border-mid/15"
                >
                  <div className="flex-shrink-0 w-14">
                    <span className="font-display text-2xl text-rust leading-none">{year}</span>
                  </div>
                  <div className="flex-1">
                    <strong className="font-label text-sm font-bold tracking-[1px] uppercase text-nav-text block mb-1.5">{title}</strong>
                    <p className="text-sm leading-relaxed text-muted font-light m-0">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── What We Stand For ── */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-3 font-label text-xs font-bold tracking-[4px] uppercase text-rust">
            <span className="block w-8 h-px bg-rust flex-shrink-0" />
            What We Stand For
          </div>
          <h2 className="font-display text-[clamp(32px,4vw,52px)] leading-none text-nav-text mb-16">
            Our <span className="text-mid/50">Commitments</span>
          </h2>

          <div className="flex flex-col">
            {PILLARS.map(({ number, title, desc }) => (
              <div
                key={number}
                className="flex gap-8 py-10 border-t border-mid/15 last:border-b last:border-mid/15"
              >
                <div className="flex-shrink-0 w-14">
                  <span className="font-display text-4xl text-rust/25 leading-none">{number}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-label text-base font-bold tracking-[2px] uppercase text-nav-text mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted font-light m-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── What We Carry ── */}
        <div>
          <div className="flex items-center gap-3 mb-3 font-label text-xs font-bold tracking-[4px] uppercase text-rust">
            <span className="block w-8 h-px bg-rust flex-shrink-0" />
            Our Inventory
          </div>
          <h2 className="font-display text-[clamp(32px,4vw,52px)] leading-none text-nav-text mb-6">
            More Than Just <span className="text-mid/50">Poultry</span>
          </h2>
          <p className="text-sm leading-relaxed text-muted font-light max-w-3xl mb-16">
            Our inventory goes well beyond what our name implies. From industrial motors to farm retail goods,
            East Texas Poultry Supply is a full-service supplier for your operation.
          </p>

          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {INVENTORY.map(({ number, title, desc }) => (
              <div key={number} className="bg-white border border-mid/15 border-l-2 border-l-rust p-7">
                <div className="font-display text-2xl text-rust/20 leading-none mb-4 select-none">{number}</div>
                <h4 className="font-label text-sm font-bold tracking-[1px] uppercase text-nav-text mb-2">{title}</h4>
                <p className="text-sm leading-relaxed text-muted font-light m-0">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-mid/20 pt-10">
            <p className="text-sm leading-relaxed text-muted font-light max-w-3xl">
              Call us for quotes on new construction, refurbishing older houses, or equipment purchases.
              You will be pleased with our prices and service.
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-white border-t border-mid/15 px-20 py-16 flex items-center justify-between">
        <div>
          <p className="font-label text-xs tracking-[3px] uppercase text-rust mb-2">Get Started</p>
          <h3 className="font-display text-3xl text-nav-text leading-none">Ready to work with us?</h3>
        </div>
        <div className="flex gap-4">
          <a
            href="/contact"
            className="inline-block transition-all duration-200 bg-rust text-white px-8 py-3.5 font-label font-bold text-xs tracking-[3px] uppercase border-2 border-rust hover:bg-rust-dark hover:border-rust-dark"
          >
            Contact Us
          </a>
          <a
            href="/products"
            className="inline-block transition-all duration-200 text-nav-text px-8 py-3.5 font-label font-bold text-xs tracking-[3px] uppercase border-2 border-mid hover:border-rust hover:text-rust"
          >
            Browse Products
          </a>
        </div>
      </div>

    </main>
  )
}