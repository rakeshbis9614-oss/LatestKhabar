"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "./theme-provider"
import { CATEGORIES } from "@/lib/types"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        setSearchOpen(false)
        setSearchQuery("")
      }
    },
    [searchQuery, router]
  )

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b transition-all duration-250 ${
          scrolled
            ? "shadow-md backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border-border"
            : "bg-surface-primary border-border"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-8 px-6 py-3">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center transition-transform hover:scale-105 active:scale-[0.98]" aria-label="Latest Khabar - Hindi News Portal">
            <Image
              src="/Latest Khabar Logo.webp"
              alt="Latest Khabar - Hindi News Portal"
              width={160}
              height={48}
              className="h-12 w-auto object-contain drop-shadow-sm dark:brightness-110 max-md:h-[38px]"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex" aria-label="मुख्य नेविगेशन">
            <Link href="/" className="rounded-md px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-tertiary hover:text-brand">
              होम
            </Link>
            {CATEGORIES.slice(0, 7).map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="whitespace-nowrap rounded-md px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-tertiary hover:text-brand"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-tertiary hover:text-brand"
              aria-label="खोजें"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-tertiary hover:text-brand"
              aria-label="थीम बदलें"
            >
              {theme === "light" ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-tertiary hover:text-brand md:hidden"
              aria-label="मेनू खोलें"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="absolute left-0 right-0 top-full z-50 border-b bg-surface-primary p-4 shadow-lg border-border">
            <form onSubmit={handleSearch} className="mx-auto flex max-w-xl items-center gap-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="खबरें खोजें..."
                className="flex-1 rounded-lg border-2 bg-surface-secondary px-4 py-3 text-base font-hindi text-foreground outline-none transition-colors border-border placeholder:text-foreground-muted focus:border-brand"
                autoFocus
                aria-label="खबरें खोजें"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-foreground-secondary hover:text-brand hover:bg-surface-tertiary"
                aria-label="खोज बंद करें"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[300] bg-black/50 transition-opacity" onClick={closeSidebar} />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed right-0 top-0 z-[400] flex h-screen w-[280px] max-w-[85vw] flex-col overflow-y-auto bg-surface-primary transition-transform duration-250 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="मोबाइल मेनू"
      >
        <div className="flex items-center justify-between border-b p-6 border-border">
          <Image
            src="/Latest Khabar Logo.webp"
            alt="Latest Khabar"
            width={120}
            height={36}
            className="h-9 w-auto object-contain"
          />
          <button
            onClick={closeSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-surface-tertiary"
            aria-label="मेनू बंद करें"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-1 flex-col py-4">
          <Link href="/" onClick={closeSidebar} className="block border-l-[3px] border-transparent px-6 py-3.5 text-base font-semibold font-hindi text-foreground transition-all hover:border-brand hover:bg-surface-secondary hover:text-brand">
            होम
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              onClick={closeSidebar}
              className="block border-l-[3px] border-transparent px-6 py-3.5 text-base font-semibold font-hindi text-foreground transition-all hover:border-brand hover:bg-surface-secondary hover:text-brand"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 border-t p-6 border-border">
          <Link href="/about" onClick={closeSidebar} className="text-[13px] text-foreground-secondary hover:text-brand">हमारे बारे में</Link>
          <Link href="/contact" onClick={closeSidebar} className="text-[13px] text-foreground-secondary hover:text-brand">संपर्क करें</Link>
          <Link href="/privacy-policy" onClick={closeSidebar} className="text-[13px] text-foreground-secondary hover:text-brand">गोपनीयता नीति</Link>
        </div>
      </aside>
    </>
  )
}
