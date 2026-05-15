const faqs = [
  {
    question: "Does the customer need an app?",
    answer:
      "No. Customers open their loyalty card from a simple link or wallet shortcut.",
  },
  {
    question: "What happens when they reach the goal?",
    answer:
      "They unlock a reward screen that staff can verify and redeem instantly.",
  },
  {
    question: "Is it compatible with all phones?",
    answer:
      "Yes. Perko runs in any modern browser on iOS and Android.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most businesses are ready in under 10 minutes, including branding.",
  },
  {
    question: "Can I change the reward or stamp goal later?",
    answer:
      "Absolutely. You can update goals and rewards at any time.",
  },
  {
    question: "Do customers lose their progress?",
    answer:
      "Progress stays tied to their link or wallet card, so it is always there.",
  },
];

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="relative z-10 my-8 w-full pb-20 pt-10 pl-10 pr-6 sm:my-10 sm:pl-12 sm:pr-8 md:pl-16 md:pr-12 lg:my-12 lg:pl-24 lg:pr-16 xl:pl-32 xl:pr-24"
    >
      <div className="flex flex-col gap-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#66736d]">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#0f172a] sm:text-4xl">
            Quick answers before you launch
          </h2>
          <p className="mt-4 text-base text-[#0f172a]/70 sm:text-lg">
            Everything you need to know about running Perko in your business.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border-2 border-black bg-white p-5 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.45)]"
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-[#0f172a]">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-black text-xs">
                  +
                </span>
                {item.question}
              </summary>
              <p className="mt-3 text-sm text-[#0f172a]/70">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
