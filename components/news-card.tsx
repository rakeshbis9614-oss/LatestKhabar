import Image from "next/image"
import Link from "next/link"
import type { Article } from "@/lib/types"
import { getCategoryColor } from "@/lib/types"
import { timeAgo, getSafeImageUrl } from "@/lib/utils"

export function NewsCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/${article.categorySlug}/${article.id}`}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-lg border bg-surface-primary p-4 transition-all sm:flex-row sm:items-start sm:gap-5 border-border hover:border-brand hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative shrink-0 overflow-hidden rounded-md bg-surface-secondary sm:h-[130px] sm:w-[180px]">
        <Image
          src={getSafeImageUrl(article.imageUrl)}
          alt={article.title}
          width={300}
          height={200}
          className="h-[180px] w-full object-cover transition-transform group-hover:scale-105 sm:h-full"
          sizes="(max-width: 640px) 100vw, 180px"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className={`text-[11px] font-bold uppercase tracking-wide ${getCategoryColor(article.categorySlug)}`}>
          {article.category}
        </span>
        <h3 className="line-clamp-2 font-hindi text-base font-bold leading-snug text-foreground">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm text-foreground-secondary leading-relaxed">{article.description}</p>
        <div className="mt-auto flex items-center justify-between text-xs text-foreground-muted">
          <span>
            {article.author} &middot; {timeAgo(article.timestamp)}
          </span>
          <span className="font-semibold text-foreground-secondary">{article.readTime} मिनट</span>
        </div>
      </div>
    </Link>
  )
}
