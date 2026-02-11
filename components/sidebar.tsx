import Image from "next/image"
import Link from "next/link"
import type { Article } from "@/lib/types"
import { getCategoryColor } from "@/lib/types"
import { timeAgo, getSafeImageUrl } from "@/lib/utils"

function TrendingSection({ articles }: { articles: Article[] }) {
  const trending = articles.filter((a) => a.trending).slice(0, 5)
  const display = trending.length ? trending : articles.slice(0, 5)

  return (
    <div className="sticky top-[90px] rounded-lg border bg-surface-primary p-5 border-border">
      <h3 className="mb-4 inline-block border-b-[3px] border-brand pb-2 font-hindi text-lg font-extrabold text-foreground">
        ट्रेंडिंग
      </h3>
      <div className="flex flex-col gap-4">
        {display.map((a) => (
          <Link
            key={a.id}
            href={`/${a.categorySlug}/${a.id}`}
            className="group flex flex-col gap-2 border-b pb-4 border-border last:border-b-0 last:pb-0"
          >
            <div className="relative h-[100px] w-full overflow-hidden rounded-md bg-surface-secondary">
              <Image
                src={getSafeImageUrl(a.imageUrl)}
                alt={a.title}
                fill
                className="object-cover transition-transform group-hover:scale-[1.03]"
                sizes="320px"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className={`text-[10px] font-bold uppercase tracking-wide ${getCategoryColor(a.categorySlug)}`}>
                {a.category}
              </span>
              <h4 className="line-clamp-2 font-hindi text-sm font-bold leading-snug text-foreground">
                {a.title}
              </h4>
              <time className="text-[11px] text-foreground-muted">{timeAgo(a.timestamp)}</time>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function NewsletterSection() {
  return (
    <div className="rounded-lg border bg-surface-secondary p-5 border-border">
      <h3 className="mb-2 font-hindi text-lg font-extrabold text-foreground">न्यूज़लेटर</h3>
      <p className="mb-4 text-sm text-foreground-secondary">ताज़ा खबरें सीधे अपने इनबॉक्स में पाएं।</p>
      <form className="flex flex-col gap-2" aria-label="न्यूज़लेटर सदस्यता">
        <input
          type="email"
          placeholder="आपका ईमेल पता"
          required
          className="rounded-md border bg-surface-primary px-3.5 py-2.5 text-sm text-foreground outline-none border-border placeholder:text-foreground-muted focus:border-brand"
          aria-label="ईमेल पता"
        />
        <button
          type="submit"
          className="rounded-md bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
        >
          सदस्यता लें
        </button>
      </form>
    </div>
  )
}

function MostReadSection({ articles }: { articles: Article[] }) {
  const sorted = [...articles].sort((a, b) => b.views - a.views).slice(0, 5)

  return (
    <div className="rounded-lg border bg-surface-primary p-5 border-border">
      <h3 className="mb-4 inline-block border-b-[3px] border-brand pb-2 font-hindi text-lg font-extrabold text-foreground">
        सबसे ज़्यादा पढ़ा गया
      </h3>
      <ol className="flex flex-col">
        {sorted.map((a, i) => (
          <li key={a.id}>
            <Link
              href={`/${a.categorySlug}/${a.id}`}
              className="flex items-start gap-3 border-b py-2 transition-transform hover:translate-x-1 border-border last:border-b-0"
            >
              <span className="min-w-[28px] font-display text-2xl font-extrabold leading-none text-brand">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="line-clamp-2 font-hindi text-sm font-bold leading-snug text-foreground">
                  {a.title}
                </h4>
                <span className="text-[11px] text-foreground-muted">
                  {a.category} &middot; {a.views.toLocaleString("hi-IN")} views
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function Sidebar({ articles }: { articles: Article[] }) {
  return (
    <aside className="hidden flex-col gap-6 lg:flex" role="complementary" aria-label="साइडबार">
      <TrendingSection articles={articles} />
      <div className="flex justify-center">
        <div className="flex min-h-[250px] w-full max-w-[300px] items-center justify-center rounded-md border border-dashed bg-surface-secondary border-border">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">विज्ञापन</span>
        </div>
      </div>
      <NewsletterSection />
      <MostReadSection articles={articles} />
    </aside>
  )
}
