"use client"
import Link from "next/link"
import { Highlighter } from "../ui/highlighter"
import StampPreviewCard from "@/app/(admin)/onboarding/components/StampPreviewCard"

export default function ActionSection() {
    return (
        <section id="action" className="my-12 w-full px-6 sm:px-12">
            <div className="mx-auto max-w-3xl rounded-2xl bg-white py-12 px-6 text-center shadow-md z-20 border border-slate-100">
                <div className="mx-auto max-w-lg">
                    <div className="mb-6 flex justify-center">
                        <div className="w-full max-w-xs sm:max-w-sm">
                            <StampPreviewCard businessName="Matcha House" logoPreview="/matcha.png" />
                        </div>
                    </div>

                    <h3 className="text-base font-semibold uppercase tracking-[0.3em] text-[#66736d] mb-2">LISTOS PARA DESPEGAR</h3>
                    <h2 className="mb-4 text-3xl font-semibold text-[#0f172a] sm:text-4xl">
                        Ya estás usando <Highlighter action="underline" color="#FF9800" strokeWidth={2}>Perko</Highlighter>?
                    </h2>
                    <p className="mb-6 text-sm text-[#0f172a]/70">Activa tu tarjeta digital y convierte visitas en clientes frecuentes desde hoy.</p>

                    <div className="flex justify-center">
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center rounded-full bg-[#05668D] px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-[#045676]"
                        >
                            Crear mi tarjeta
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}