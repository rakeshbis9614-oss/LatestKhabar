import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { fetchByCategory } from "@/lib/news-service"
import { getCategoryBySlug, CATEGORIES } from "@/lib/types"
import { NewsFeed } from "@/components/news-feed"
import { AdSlot } from "@/components/ad-slot"

export const revalidate = 300

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const cat = getCategoryBySlug(category)
  if (!cat) return {}

  return {
    title: `${cat.name} - ${cat.en} News`,
    description: `Latest Khabar पर ${cat.name} की ताज़ा खबरें पढ़ें। ${cat.en} से जुड़ी सभी अपडेट एक जगह।`,
    alternates: {
      canonical: `https://latestkhabar.xyz/${category}`,
    },
    openGraph: {
      title: `${cat.name} - Latest Khabar`,
      description: `${cat.name} की ताज़ा खबरें`,
      url: `https://latestkhabar.xyz/${category}`,
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const cat = getCategoryBySlug(category)
  if (!cat) notFound()

  const articles = await fetchByCategory(cat.name, 20)

  return (
    <main className="mx-auto max-w-[1400px] px-6 pt-8 pb-16">
      <nav className="mb-6 flex items-center gap-2 text-sm text-foreground-muted" aria-label="ब्रेडक्रम्ब">
        <a href="/" className="text-foreground-secondary hover:text-brand">होम</a>
        <span>/</span>
        <span className="text-foreground">{cat.name}</span>
      </nav>

      <NewsFeed articles={articles} title={`${cat.name} की खबरें`} />
      <AdSlot slot="category-bottom" size="leaderboard" />
    </main>
  )
}
