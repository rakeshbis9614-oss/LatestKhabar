import { fetchLatestArticles } from "@/lib/news-service"
import { generateWebsiteJsonLd } from "@/lib/seo"
import { BreakingTicker } from "@/components/breaking-ticker"
import { FeaturedGrid } from "@/components/featured-grid"
import { NewsFeed } from "@/components/news-feed"
import { Sidebar } from "@/components/sidebar"
import { AdSlot } from "@/components/ad-slot"

export const revalidate = 300

export default async function HomePage() {
  const articles = await fetchLatestArticles(30)
  const jsonLd = generateWebsiteJsonLd()
  const nonFeatured = articles.filter((a) => !a.featured)
  const feedArticles = nonFeatured.length ? nonFeatured : articles.slice(3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BreakingTicker articles={articles} />

      <main className="mx-auto max-w-[1400px] px-6 pt-8 pb-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
          {/* Primary Content */}
          <div className="min-w-0">
            <FeaturedGrid articles={articles} />
            <AdSlot slot="header-banner" size="leaderboard" />
            <NewsFeed articles={feedArticles} />
            <AdSlot slot="infeed-bottom" size="leaderboard" />
          </div>

          {/* Sidebar */}
          <Sidebar articles={articles} />
        </div>
      </main>
    </>
  )
}
