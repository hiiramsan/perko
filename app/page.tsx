import Link from "next/link";
import { BadgeCheck, Check } from "lucide-react";

export default function Home() {
  const matchaStamps = Array.from({ length: 10 }, (_, index) => index < 2);
  const lunaStamps = Array.from({ length: 10 }, (_, index) => index < 4);
  const cedarStamps = Array.from({ length: 10 }, (_, index) => index < 8);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#f7f8fa]">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 h-130 w-130 rounded-full bg-[#d8e6df] blur-[130px]" />
        <div className="absolute -bottom-1/2 -right-1/4 h-110 w-110 rounded-full bg-[#e6ece9] blur-[120px]" />
        <div className="absolute right-1/4 top-1/4 h-50 w-50 rounded-full bg-[#eef2f1] blur-[70px]" />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute h-44 w-64 sm:h-50 sm:w-72 top-[15%] left-[5%] sm:left-[10%] lg:left-auto lg:right-[18%] lg:top-[14%]">
          <div className="h-full w-full rounded-2xl bg-[#4f7a35] p-3 shadow-[0_18px_40px_-20px_rgba(16,40,16,0.5)] sm:p-5 rotate-[-8deg] animate-float-1">
            <div className="mb-2 flex items-center justify-center sm:mb-3">
              <img src="/matcha.png" className="h-8 w-8 rounded-full sm:h-10 sm:w-10" />
            </div>
            <p className="mb-3 text-center text-sm font-semibold text-[#f2f6ef] sm:mb-4">
              Matcha House
            </p>

            <div className="grid grid-cols-5 gap-1.5 justify-items-center sm:gap-2">
              {matchaStamps.map((filled, index) => (
                <div
                  key={`perko-stamp-${index}`}
                  className={`flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8 ${filled ? "bg-[#425E31]" : "bg-[#8bb277]"
                    }`}
                >
                  {filled ? (
                    <span className="text-[9px] font-semibold text-[#e9f2e3] sm:text-[10px]">
                      <BadgeCheck color="#8bb277" />
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute h-44 w-64 sm:h-50 sm:w-72 top-[25%] right-[8%] sm:right-[15%] lg:right-[8%] lg:top-[32%]">
          <div className="h-full w-full rounded-2xl bg-[#ef4f2f] p-3 shadow-[0_18px_40px_-20px_rgba(120,34,26,0.45)] sm:p-5 rotate-6 animate-float-2">
            <div className="mb-2 flex items-center justify-center sm:mb-3">
              <img src="/guru.png" className="h-8 w-8 rounded-full sm:h-10 sm:w-10" />
            </div>
            <p className="mb-3 text-center text-sm font-semibold text-white sm:mb-4">
              Gurú Studio
            </p>

            <div className="grid grid-cols-5 gap-1.5 justify-items-center sm:gap-2">
              {lunaStamps.map((filled, index) => (
                <div
                  key={`luna-stamp-${index}`}
                  className={`flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8 ${filled ? "bg-[#BE2C0E]" : "bg-[#f29a82]"
                    }`}
                >
                  {filled ? (
                    <span className="text-[9px] font-semibold text-[#ffe9e3] sm:text-[10px]">
                      <BadgeCheck color="#f29a82" />
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute h-44 w-64 sm:h-50 sm:w-72 top-[45%] left-[15%] hidden sm:block sm:left-[20%] lg:left-auto lg:right-[14%] lg:top-[56%]">
          <div className="h-full w-full rounded-2xl bg-[#05668D] p-3 shadow-[0_18px_40px_-20px_rgba(145,116,18,0.45)] sm:p-5 rotate-3 animate-float-3">
            <div className="mb-2 flex items-center justify-center sm:mb-3">
              <img src="/borcelle.png" className="h-8 w-8 rounded-full sm:h-10 sm:w-10" />
            </div>
            <p className="mb-3 text-center text-sm font-semibold text-white sm:mb-4">
              Borcelle Car Wash
            </p>

            <div className="grid grid-cols-5 gap-1.5 justify-items-center sm:gap-2">
              {cedarStamps.map((filled, index) => (
                <div
                  key={`cedar-stamp-${index}`}
                  className={`flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8 ${filled ? "bg-[#045676]" : "bg-[#078FC5]"
                    }`}
                >
                  {filled ? (
                    <span className="text-[9px] font-semibold text-[#d7f3ff] sm:text-[10px]">
                      <BadgeCheck color="#078FC5" />
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-8 left-0 right-0 flex items-center justify-center">
        <span className="text-4xl font-semibold tracking-tight text-[#0f172a]">
          Perko
        </span>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col justify-end px-6 pb-12 sm:px-8 sm:pb-16 md:px-12 md:pb-20 lg:justify-center lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md sm:max-w-lg lg:ml-10 lg:mr-auto lg:max-w-xl font-[var(--font-thin)]">
          <h1 className="mb-4 text-4xl font-medium leading-tight tracking-tight text-[#0f172a] sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight">
            Convierte clientes ocasionales en clientes frecuentes{" "}
          </h1>

          <p className="mb-8 text-lg leading-relaxed text-[#0f172a]/70 font-[var(--font-thin)] sm:text-xl">
            Ofrece tarjetas digitales modernas y crea una experiencia profesional que tus clientes realmente usarán.
          </p>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-[#2A9D8F] px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-[#264653] hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#264653] focus:ring-offset-2 focus:ring-offset-[#f7f8fa] cursor-pointer"
            >
              Soy negocio
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-[#cbd5e1] bg-white px-8 py-4 text-base font-semibold text-[#0f172a] transition-all duration-200 hover:border-[#94a3b8] hover:text-[#1f2a44] focus:outline-none focus:ring-2 focus:ring-[#94a3b8] focus:ring-offset-2 focus:ring-offset-[#f7f8fa]"
            >
              Soy cliente
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
