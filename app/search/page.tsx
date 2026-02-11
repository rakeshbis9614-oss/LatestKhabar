import type { Metadata } from "next"
import { searchArticles } from "@/lib/news-service"
import { NewsCard } from "@/components/news-card"

export const metadata: Metadata = {
  title: "खोज परिणाम",
  robots: { index: false, follow: true },
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() || ""
  const results = query ? await searchArticles(query) : []

  return (
    <main className="mx-auto max-w-[1400px] px-6 pt-8 pb-16">
      <h1 className="mb-2 font-hindi text-2xl font-extrabold text-foreground">
        {query ? `"${query}" के लिए खोज परिणाम` : "खोजें"}
      </h1>
      {query && (
        <p className="mb-6 text-sm text-foreground-secondary">
          {results.length} परिणाम मिले
        </p>
      )}

      {results.length > 0 ? (
        <div className="flex flex-col gap-5">
          {results.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : query ? (
        <p className="py-16 text-center text-foreground-secondary">कोई परिणाम नहीं मिला।</p>
      ) : (
        <p className="py-16 text-center text-foreground-secondary">खोजने के लिए ऊपर सर्च बार का उपयोग करें।</p>
      )}
    </main>
  )
}
