import Link from "next/link"
import type { Article } from "@/lib/types"

export function BreakingTicker({ articles }: { articles: Article[] }) {
  const tickerArticles = articles.slice(0, 8)
  if (!tickerArticles.length) return null

  return (
    <div className="overflow-hidden border-b bg-surface-primary px-6 py-2.5 border-border" role="marquee" aria-label="ब्रेकिंग न्यूज़">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4">
        <span className="shrink-0 animate-ticker-pulse rounded-md bg-brand px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white">
          ब्रेकिंग
        </span>
        <div className="flex-1 overflow-hidden ticker-mask">
          <div className="inline-flex animate-ticker-scroll items-center gap-6 whitespace-nowrap">
            {[...tickerArticles, ...tickerArticles].map((a, i) => (
              <span key={`${a.id}-${i}`} className="inline-flex items-center gap-6">
                <Link
                  href={`/${a.categorySlug}/${a.id}`}
                  className="shrink-0 text-[13px] font-semibold text-foreground transition-colors hover:text-brand"
                >
                  {a.title}
                </Link>
                <span className="shrink-0 text-foreground-muted opacity-30">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
