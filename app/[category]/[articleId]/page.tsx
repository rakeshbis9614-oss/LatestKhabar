import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { fetchArticleById, fetchLatestArticles } from "@/lib/news-service"
import { getCategoryBySlug } from "@/lib/types"
import { generateArticleMetadata, generateArticleJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo"
import { formatDate, getSafeImageUrl } from "@/lib/utils"
import { ShareButtons } from "@/components/share-buttons"
import { AdSlot } from "@/components/ad-slot"

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; articleId: string }>
}): Promise<Metadata> {
  const { articleId } = await params
  const article = await fetchArticleById(articleId)
  if (!article) return {}
  return generateArticleMetadata(article)
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; articleId: string }>
}) {
  const { category, articleId } = await params
  const cat = getCategoryBySlug(category)
  if (!cat) notFound()

  const article = await fetchArticleById(articleId)
  if (!article) notFound()

  const articleJsonLd = generateArticleJsonLd(article)
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "होम", url: "https://latestkhabar.xyz" },
    { name: cat.name, url: `https://latestkhabar.xyz/${category}` },
    { name: article.title, url: `https://latestkhabar.xyz/${category}/${articleId}` },
  ])

  // Related articles
  const allArticles = await fetchLatestArticles(30)
  const related = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 4)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="mx-auto max-w-[820px] px-6 pt-8 pb-16">
        <article className="animate-fade-in" itemScope itemType="https://schema.org/NewsArticle">
          {/* Breadcrumb */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-foreground-muted" aria-label="ब्रेडक्रम्ब">
            <Link href="/" className="text-foreground-secondary hover:text-brand">होम</Link>
            <span>/</span>
            <Link href={`/${category}`} className="text-foreground-secondary hover:text-brand">{cat.name}</Link>
            <span>/</span>
            <span className="truncate max-w-[200px]">{article.title.substring(0, 40)}...</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <span className="mb-3 inline-block rounded-md bg-brand px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              {article.category}
            </span>
            <h1 className="mb-4 text-balance font-hindi text-2xl font-extrabold leading-tight text-foreground md:text-4xl" itemProp="headline">
              {article.title}
            </h1>
            <p className="mb-6 border-b pb-6 text-lg leading-relaxed text-foreground-secondary border-border">
              {article.description}
            </p>

            {/* Author + Share */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-xl font-extrabold text-white">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-foreground" itemProp="author">{article.author}</p>
                  <p className="text-sm text-foreground-secondary">
                    <time dateTime={article.timestamp.toISOString()} itemProp="datePublished">
                      {formatDate(article.timestamp)}
                    </time>
                    {" "}&middot; {article.readTime} मिनट पढ़ने में &middot; {article.views.toLocaleString("hi-IN")} views
                  </p>
                </div>
              </div>
              <ShareButtons title={article.title} articleId={article.id} categorySlug={article.categorySlug} />
            </div>
          </header>

          {/* Featured Image */}
          <figure className="mb-8 overflow-hidden rounded-2xl">
            <Image
              src={getSafeImageUrl(article.imageUrl)}
              alt={article.title}
              width={1200}
              height={675}
              className="w-full object-cover"
              style={{ aspectRatio: "16/9" }}
              priority
              sizes="(max-width: 820px) 100vw, 820px"
              itemProp="image"
            />
          </figure>

          <AdSlot slot="article-top" size="in-article" />

          {/* Body */}
          <div
            className="article-body font-hindi text-foreground"
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <AdSlot slot="article-bottom" size="in-article" />

          {/* Footer */}
          <footer className="mt-10 border-t pt-8 border-border">
            <div className="mb-8 flex flex-wrap gap-2">
              <Link
                href={`/${article.categorySlug}`}
                className="inline-block rounded-full bg-surface-tertiary px-3.5 py-1.5 text-[13px] text-foreground transition-all hover:bg-brand hover:text-white"
              >
                {article.category}
              </Link>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-foreground-secondary">यह खबर साझा करें:</p>
              <ShareButtons title={article.title} articleId={article.id} categorySlug={article.categorySlug} />
            </div>
          </footer>
        </article>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="mt-12 rounded-2xl bg-surface-secondary p-6">
            <h2 className="mb-5 font-hindi text-xl font-extrabold text-foreground">संबंधित खबरें</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {related.map((a) => (
                <Link
                  key={a.id}
                  href={`/${a.categorySlug}/${a.id}`}
                  className="group overflow-hidden rounded-lg bg-surface-primary transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-[140px] w-full overflow-hidden">
                    <Image
                      src={getSafeImageUrl(a.imageUrl)}
                      alt={a.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 400px"
                    />
                  </div>
                  <div className="p-3">
                    <span className="mb-1 inline-block rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
                      {a.category}
                    </span>
                    <h3 className="line-clamp-2 font-hindi text-sm font-bold leading-snug text-foreground">{a.title}</h3>
                    <p className="mt-1 text-xs text-foreground-secondary line-clamp-2">{a.description.substring(0, 80)}...</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  )
}
