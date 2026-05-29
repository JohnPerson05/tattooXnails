import SectionReveal from "./SectionReveal";

const steps = [
  { num: "01", title: "Consultation", desc: "Share your vision — we'll discuss design, placement, and style." },
  { num: "02", title: "Design", desc: "Custom artwork created just for you. Revisions until it's perfect." },
  { num: "03", title: "Session", desc: "Sit back, relax, and watch your art come to life." },
  { num: "04", title: "Aftercare", desc: "Detailed care instructions to keep your piece looking fresh." },
];

const ProcessTimeline = () => (
  <section className="section-padding max-w-5xl mx-auto">
    <SectionReveal>
      <div className="text-center mb-14">
        <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">How It Works</span>
        <h2 className="font-display text-4xl md:text-5xl tracking-wider text-foreground mt-3">
          Our <span className="text-gradient-gold">Process</span>
        </h2>
      </div>
    </SectionReveal>
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border/50 -translate-x-1/2 hidden md:block" />
      <div className="space-y-8 md:space-y-12">
        {steps.map((step, i) => (
          <SectionReveal key={step.num} delay={i * 0.15}>
            <div className={`flex items-start gap-6 md:gap-12 ${i % 2 === 1 ? "md:flex-row-reverse md:text-right" : ""}`}>
              <div className="hidden md:flex flex-1" />
              <div className="relative z-10 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-lg shrink-0">
                {step.num}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl tracking-wider text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{step.desc}</p>
              </div>
            </div>
          </SectionReveal>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessTimeline;
