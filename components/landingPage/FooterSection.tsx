import Link from "next/link";
import { BadgeCheck } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="relative z-10 mt-8 w-full border-t border-black/10 bg-white/80 pb-12 pt-10 pl-10 pr-6 backdrop-blur-sm sm:mt-10 sm:pl-12 sm:pr-8 md:pl-16 md:pr-12 lg:mt-12 lg:pl-24 lg:pr-16 xl:pl-32 xl:pr-24">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-[#0f172a]">
            <span>Perk</span>
            <BadgeCheck size={22} strokeWidth={3} />
          </div>
          <p className="mt-3 max-w-xs text-sm text-[#0f172a]/70">
            Modern loyalty cards for local businesses.
          </p>
        </div>

        <div className="flex flex-wrap gap-10">
          <div className="flex flex-col gap-2 text-sm text-[#0f172a]">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#66736d]">
              Company
            </span>
            <Link className="hover:text-[#0f172a]/70" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="hover:text-[#0f172a]/70" href="/terms">
              Terms
            </Link>
            <a className="hover:text-[#0f172a]/70" href="mailto:hello@perko.app">
              hello@perko.app
            </a>
          </div>

          <div className="flex flex-col gap-2 text-sm text-[#0f172a]">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#66736d]">
              Social
            </span>
            <a className="hover:text-[#0f172a]/70" href="https://instagram.com">
              Instagram
            </a>
            <a className="hover:text-[#0f172a]/70" href="https://linkedin.com">
              LinkedIn
            </a>
            <a className="hover:text-[#0f172a]/70" href="https://x.com">
              X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
