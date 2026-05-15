const testimonials = [
  {
    quote:
      "Since launching Perko, repeat visits are up and customers actually finish cards.",
    name: "Sofia Martinez",
    role: "Owner",
    business: "Matcha House",
  },
  {
    quote:
      "Setup took minutes. The digital stamps look premium and keep members coming back.",
    name: "Daniel Ruiz",
    role: "Gym Manager",
    business: "Pulse Fitness",
  },
  {
    quote:
      "We replaced paper cards and saw fewer lost rewards and more redemptions.",
    name: "Ava Patel",
    role: "Cafe Manager",
    business: "Cedar Brew",
  },
];

export default function SocialProof() {
  return (
    <section
      id="social-proof"
      className="relative z-10 my-8 w-full pb-20 pt-10 pl-10 pr-6 sm:my-10 sm:pl-12 sm:pr-8 md:pl-16 md:pr-12 lg:my-12 lg:pl-24 lg:pr-16 xl:pl-32 xl:pr-24"
    >
      <div className="flex flex-col gap-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#66736d]">
            SOCIAL PROOF
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#0f172a] sm:text-4xl">
            Trusted by owners who know their regulars
          </h2>
          <p className="mt-4 text-base text-[#0f172a]/70 sm:text-lg">
            Early adopters use Perko to keep loyalty simple, clear, and rewarding.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="flex h-full flex-col justify-between rounded-3xl border-2 border-black bg-white p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)]"
            >
              <p className="text-base leading-relaxed text-[#0f172a]">“{item.quote}”</p>
              <div className="mt-6">
                <p className="text-sm font-semibold text-[#0f172a]">{item.name}</p>
                <p className="text-sm text-[#0f172a]/60">
                  {item.role} · {item.business}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
