"use client";

import { Highlighter } from "../ui/highlighter";

const steps = [
  {
    number: '1',
    src: '/step1.png',
    alt: 'Scan purchase',
    title: 'Scan',
    description: 'Open the wallet and scan after purchase.',
  },
  {
    number: '2',
    src: '/step2.png',
    alt: 'Collect stamps',
    title: 'Collect',
    description: 'Every visit drops a stamp into your card.',
  },
  {
    number: '3',
    src: '/step3.png',
    alt: 'Unlock reward',
    title: 'Reward',
    description: 'Redeem a free item once you complete the card.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative z-10 my-8 flex min-h-screen w-full flex-col pb-10 pt-10 pl-10 pr-6 sm:my-10 sm:pl-12 sm:pr-8 md:pl-16 md:pr-12 lg:my-12 lg:pl-24 lg:pr-16 xl:pl-32 xl:pr-24"
    >
      <div className="flex flex-col justify-between gap-8 lg:flex-row">
        <div className="flex w-full flex-col lg:w-1/2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#66736d]">
            COMO FUNCIONA
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#0f172a] sm:text-4xl">
            Lealtad en {" "}
             <Highlighter action="box" color="#000000" strokeWidth={1}>3</Highlighter>{" "}
            simples pasos
          </h2>
          <p className="mt-4 text-base text-[#0f172a]/70 sm:text-lg">
            Scan after purchase, collect stamps in your digital wallet, and unlock a free reward
            after X stamps.
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-15 flex-1">
        <div className="flex h-full w-full max-w-297 flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-8 lg:bg-size-[calc(100%-3rem)_3px] lg:bg-position-[left_center]">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-1 flex-col">
              <div className="relative">
                <div className="absolute -left-4 -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                  {step.number}
                </div>
                <div className="aspect-square w-full max-w-86 overflow-hidden rounded-3xl border-2 border-black bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] sm:max-w-92.5">
                  <div className="flex h-full w-full items-center justify-center">
                    <img src={step.src} alt={step.alt} className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-md font-semibold uppercase tracking-[0.18em] text-black">{step.title}</p>
              <p className="mt-1 text-md text-[#0f172a]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
