'use client';

import { Wallet, Users, User } from "lucide-react";

const tabs = [
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "join", label: "Join", icon: Users },
  { id: "profile", label: "Profile", icon: User },
];

export default function GlassNavbar({ activeTab, onTabChange }) {

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className="absolute inset-0 rounded-[28px] opacity-40 blur-2xl pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.4), rgba(200,210,230,0.2))",
        }}
      />

      <nav
        className="relative flex items-center gap-1 px-2 py-2 rounded-[28px] overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.45)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        <div
          className="absolute top-0 left-6 right-6 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
          }}
        />

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className="relative z-10 flex items-center gap-2 rounded-[20px] outline-none select-none cursor-pointer"
              style={{
                padding: "10px 18px",
                background: isActive
                  ? "linear-gradient(160deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.65) 100%)"
                  : "transparent",
                boxShadow: isActive
                  ? "0 2px 14px rgba(0, 0, 0, 0.07), 0 1px 4px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.03)"
                  : "none",
                border: isActive ? "1px solid rgba(255, 255, 255, 0.75)" : "1px solid transparent",
                transition:
                  "background 0.5s cubic-bezier(0.4, 0, 0.1, 1), box-shadow 0.5s cubic-bezier(0.4, 0, 0.1, 1), border-color 0.5s cubic-bezier(0.4, 0, 0.1, 1)",
              }}
            >
              <Icon
                className="shrink-0"
                style={{
                  width: 19,
                  height: 19,
                  color: isActive
                    ? "rgba(20, 20, 30, 0.88)"
                    : "rgba(60, 60, 80, 0.42)",
                  transition: "color 0.4s ease, transform 0.4s cubic-bezier(0.4,0,0.2,1)",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                }}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span
                className="font-medium whitespace-nowrap block overflow-hidden"
                style={{
                  fontSize: 14,
                  letterSpacing: "-0.015em",
                  color: "rgba(20, 20, 30, 0.88)",
                  maxWidth: isActive ? 72 : 0,
                  opacity: isActive ? 1 : 0,
                  transition:
                    "max-width 0.5s cubic-bezier(0.4, 0, 0.1, 1), opacity 0.35s ease",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
