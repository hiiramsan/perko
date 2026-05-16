"use client";

import { Highlighter } from "../ui/highlighter";
import FaqComponent from "./FaqComponent";

export default function FaqSection() {


  return (
    <section
      id="faq"
      className="relative z-10 my-8 w-full pt-10 pl-10 pr-6 sm:my-10 sm:pl-12 sm:pr-8 md:pl-16 md:pr-12 lg:my-12 lg:pl-24 lg:pr-16 xl:pl-32 xl:pr-24"
    >
      <div className="flex flex-col gap-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#66736d]">FAQ</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#0f172a] sm:text-4xl">
            Espera... ¿Aún tienes{" "}
            <Highlighter action="circle" color="#05668D" strokeWidth={1}>dudas?</Highlighter>
          </h2>
          <p className="mt-4 text-base text-[#0f172a]/70 sm:text-lg">
            Estamos aquí para ayudarte a resolver cualquier duda de forma rápida y sencilla.
          </p>
        </div>

        <FaqComponent />
      </div>
    </section>
  )
}
