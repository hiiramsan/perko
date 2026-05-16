import { Plus } from 'lucide-react'
import React, { useState } from 'react'

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
]

const FaqComponent = () => {

    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <div className="mx-auto w-full max-w-xl">
            <div className="flex h-130 flex-col gap-3 overflow-y-auto pr-1 sm:h-140">
                {faqs.map((item, index) => {
                    const isOpen = openIndex === index

                    return (
                        <div
                            key={item.question}
                            className="rounded-2xl border px-5 py-4 transition-colors duration-300"
                            style={{
                                background: isOpen ? "#0f172a" : "white",
                                borderColor: isOpen ? "#0f172a" : "rgb(226 232 240)",
                            }}
                        >
                            <button
                                type="button"
                                aria-expanded={isOpen}
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-base font-semibold transition-colors duration-300"
                                style={{ color: isOpen ? "white" : "#0f172a" }}
                            >
                                <span>{item.question}</span>
                                <span
                                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300"
                                    style={{
                                        borderColor: isOpen ? "rgba(255,255,255,0.4)" : "rgb(203 213 225)",
                                        background: isOpen ? "rgba(255,255,255,0.1)" : "transparent",
                                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                                    }}
                                >
                                    <Plus className="h-4 w-4" style={{ color: isOpen ? "white" : "#475569" }} />
                                </span>
                            </button>

                            <div
                                className="grid transition-[grid-template-rows] duration-300 ease-out"
                                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                            >
                                <div className="overflow-hidden">
                                    <p
                                        className="mt-3 text-sm leading-relaxed transition-colors duration-300"
                                        style={{ color: isOpen ? "rgba(226,232,240,0.85)" : "rgba(15,23,42,0.6)" }}
                                    >
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default FaqComponent
