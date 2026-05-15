"use client";

import Image from "next/image";
import StampPreviewCard from "@/app/(admin)/onboarding/components/StampPreviewCard";

export default function HowItWorks() {

  return (
    <>
      <style>
        {`@keyframes stampBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        .stamp-bounce {
          animation: stampBounce 2s ease-in-out infinite;
          will-change: transform;
        }`}
      </style>
      <section
        id="how-it-works"
        className="relative z-10 my-8 flex min-h-screen w-full flex-col pb-24 pt-10 pl-10 pr-6 sm:my-10 sm:pl-12 sm:pr-8 md:pl-16 md:pr-12 lg:my-12 lg:pl-24 lg:pr-16 xl:pl-32 xl:pr-24"
      >
        <div className="flex flex-col justify-between gap-8 lg:flex-row">
          <div className="flex w-full flex-col lg:w-1/2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#66736d]">
              COMO FUNCIONA
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#0f172a] sm:text-4xl">
              Lealtad en simples pasos
            </h2>
            <p className="mt-4 text-base text-[#0f172a]/70 sm:text-lg">
              Scan after purchase, collect stamps in your digital wallet, and unlock a free reward
              after X stamps.
            </p>
          </div>
          {/* <div className="h-22 w-32 shrink-0 self-start sm:h-50 sm:w-72 stamp-bounce rotate-0">
            <StampPreviewCard businessName="Matcha House" logoPreview="/matcha.png" />
          </div> */}
        </div>

        <div className="relative mt-10 flex-1">
          <div className="flex h-full w-full max-w-297 flex-col gap-10 bg-[linear-gradient(rgba(0,0,0,1),rgba(0,0,0,1))] bg-size-[4px_calc(100%-3rem)] bg-position-[center_top] bg-no-repeat lg:flex-row lg:items-stretch lg:gap-8 lg:bg-size-[calc(100%-3rem)_3px] lg:bg-position-[left_center]">
            <div className="flex flex-1 flex-col">
              <div className="relative">  
                <div className="absolute -left-4 -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                  1
                </div>
                <div className="aspect-square w-full max-w-86 overflow-hidden rounded-3xl border-2 border-black bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] sm:max-w-92.5">
                  <div className="flex h-full w-full items-center justify-center">
                    <Image
                      src="/step1.png"
                      alt="Scan purchase"
                      width={260}
                      height={180}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#66736d]">Scan</p>
              <p className="mt-2 text-sm text-[#0f172a]/60">Open the wallet and scan after purchase.</p>
            </div>

            <div className="flex flex-1 flex-col">
              <div className="relative">
                <div className="absolute -left-4 -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                  2
                </div>
                <div className="aspect-square w-full max-w-86 overflow-hidden rounded-3xl border-2 border-black bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] sm:max-w-92.5">
                  <div className="flex h-full w-full items-center justify-center">
                    <Image
                      src="/step2.png"
                      alt="Collect stamps"
                      width={260}
                      height={180}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#66736d]">Collect</p>
              <p className="mt-2 text-sm text-[#0f172a]/60">Every visit drops a stamp into your card.</p>
            </div>

            <div className="flex flex-1 flex-col">
              <div className="relative">
                <div className="absolute -left-4 -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                  3
                </div>
                <div className="aspect-square w-full max-w-86 overflow-hidden rounded-3xl border-2 border-black bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] sm:max-w-92.5">
                  <div className="flex h-full w-full items-center justify-center">
                    <Image
                      src="/guru.png"
                      alt="Unlock reward"
                      width={260}
                      height={180}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#66736d]">Reward</p>
              <p className="mt-2 text-sm text-[#0f172a]/60">Redeem a free item once you complete the card.</p>
            </div>
          </div>
        </div>

      </section>
    </>

  );
}
