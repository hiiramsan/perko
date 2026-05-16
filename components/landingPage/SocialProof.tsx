import { Highlighter } from "../ui/highlighter";
import { MarqueeHorizontal } from "./MarqueeHorizontal";
import { MarqueeVertical } from "./MarqueeVertical";

export default function SocialProof() {
  return (
    <section
      id="social-proof"
      className="relative min-h-screen z-10 my-8 w-full pb-20 pt-10 pl-10 pr-6 sm:my-10 sm:pl-12 sm:pr-8 md:pl-16 md:pr-12 lg:my-12 lg:pl-24 lg:pr-16 xl:pl-32 xl:pr-24"
    >
      <div className="flex flex-col gap-8">
        <div className="ml-auto flex w-full max-w-2xl flex-col items-end text-right">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#66736d]">
            ESTO DICEN DE NOSOTROS
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#0f172a] sm:text-4xl">
            Elegido por negocios que {" "}
            <Highlighter action="highlight" color="#FF9800" strokeWidth={3}> conocen</Highlighter>{" "}
             a sus clientes frecuentes.
          </h2>
        </div>
        <div>
          <div className="lg:hidden">
            <MarqueeVertical />
          </div>
          <div className="hidden lg:block">
            <MarqueeHorizontal />
          </div>
        </div>
      </div>
    </section>
  );
}
