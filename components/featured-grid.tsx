import Image from "next/image"
import Link from "next/link"
import type { Article } from "@/lib/types"
import { getCategoryBadgeColor, getCategoryColor } from "@/lib/types"
import { timeAgo, getSafeImageUrl } from "@/lib/utils"

export function FeaturedGrid({ articles }: { articles: Article[] }) {
  if (!articles.length) return null

  const featured = articles.filter((a) => a.featured)
  const hero = featured.length ? featured[0] : articles[0]
  const sideArticles = (featured.length > 1 ? featured.slice(1, 4) : articles.slice(1, 4))

  return (
    <section className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-6" aria-label="मुख्य समाचार">
      {/* Hero */}
      <Link href={`/${hero.categorySlug}/${hero.id}`} className="group relative flex flex-col">
        <div className="relative w-full overflow-hidden rounded-2xl bg-surface-secondary" style={{ aspectRatio: "16/10" }}>
          <Image
            src={getSafeImageUrl(hero.imageUrl)}
            alt={hero.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div>
        <div className="flex flex-col gap-2 pt-5">
          <span className={`w-fit rounded-md px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white ${getCategoryBadgeColor(hero.categorySlug)}`}>
            {hero.category}
          </span>
          <h2 className="text-balance font-hindi text-xl font-extrabold leading-tight text-foreground md:text-2xl">
            {hero.title}
          </h2>
          <p className="line-clamp-2 text-[15px] leading-relaxed text-foreground-secondary">{hero.description}</p>
          <div className="flex flex-wrap gap-3 text-xs text-foreground-muted">
            <span>{hero.author}</span>
            <span>&middot;</span>
            <span>{timeAgo(hero.timestamp)}</span>
            <span>&middot;</span>
            <span>{hero.readTime} मिनट</span>
          </div>
        </div>
      </Link>

      {/* Side Cards */}
      <div className="flex flex-col gap-5">
        {sideArticles.map((a) => (
          <Link
            key={a.id}
            href={`/${a.categorySlug}/${a.id}`}
            className="group flex gap-4 border-b pb-5 transition-transform hover:translate-x-1 border-border last:border-b-0 last:pb-0"
          >
            <div className="relative h-20 w-[110px] shrink-0 overflow-hidden rounded-lg bg-surface-secondary">
              <Image
                src={getSafeImageUrl(a.imageUrl)}
                alt={a.title}
                fill
                className="object-cover transition-transform group-hover:scale-110"
                sizes="110px"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className={`text-[10px] font-bold uppercase tracking-wide ${getCategoryColor(a.categorySlug)}`}>
                {a.category}
              </span>
              <h3 className="line-clamp-2 font-hindi text-[15px] font-bold leading-snug text-foreground">
                {a.title}
              </h3>
              <span className="text-xs text-foreground-muted">{timeAgo(a.timestamp)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
