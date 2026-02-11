import type { Article } from "@/lib/types"
import { NewsCard } from "./news-card"
import { AdSlot } from "./ad-slot"

export function NewsFeed({ articles, title = "ताज़ा खबरें" }: { articles: Article[]; title?: string }) {
  if (!articles.length) {
    return (
      <section aria-label={title}>
        <h2 className="mb-5 inline-block border-b-[3px] border-brand pb-2 font-hindi text-xl font-extrabold text-foreground">
          {title}
        </h2>
        <p className="py-10 text-center text-foreground-secondary">कोई लेख उपलब्ध नहीं है।</p>
      </section>
    )
  }

  return (
    <section aria-label={title}>
      <h2 className="mb-5 inline-block border-b-[3px] border-brand pb-2 font-hindi text-xl font-extrabold text-foreground">
        {title}
      </h2>
      <div className="flex flex-col gap-5 mb-10">
        {articles.map((article, i) => (
          <div key={article.id}>
            {i > 0 && i % 4 === 0 && <AdSlot slot={`infeed-${i}`} className="mb-5" />}
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </section>
  )
}
