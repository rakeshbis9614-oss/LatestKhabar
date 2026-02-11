"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNav() {
  const pathname = usePathname()

  const items = [
    {
      label: "होम",
      href: "/",
      icon: (
        <svg className="h-[22px] w-[22px]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      label: "ट्रेंडिंग",
      href: "/sports",
      icon: (
        <svg className="h-[22px] w-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: "टेक",
      href: "/technology",
      icon: (
        <svg className="h-[22px] w-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "मेनू",
      href: "/about",
      icon: (
        <svg className="h-[22px] w-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 block border-t bg-surface-primary/95 backdrop-blur-xl border-border pb-[max(env(safe-area-inset-bottom),4px)] md:hidden" aria-label="मोबाइल नेविगेशन">
      <div className="mx-auto grid max-w-[500px] grid-cols-4 px-2 py-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-md px-2 py-2.5 transition-colors ${
              pathname === item.href ? "text-brand" : "text-foreground-muted"
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-semibold leading-none">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
