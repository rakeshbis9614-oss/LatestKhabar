import {
  db,
  collection,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  doc,
  updateDoc,
  increment,
  where,
} from "./firebase"
import type { Article } from "./types"
import { getCategoryByName } from "./types"

function validateArticle(rawData: Record<string, unknown>, docId: string): Article | null {
  if (!rawData || typeof rawData !== "object") return null

  const title = String(rawData.title || "").trim()
  const content = String(rawData.content || "").trim()
  const category = String(rawData.category || "समाचार").trim()
  const imageUrl = String(rawData.imageUrl || "").trim()
  const views = Number(rawData.views) || 0
  const seoDescription = String(rawData.seoDescription || "").trim()
  const author = String(rawData.author || "Latest Khabar").trim()
  const featured = Boolean(rawData.featured)
  const trending = Boolean(rawData.trending)

  if (!title || !content) return null

  const cleanContent = content.replace(/<[^>]*>/g, "").trim()
  const description = seoDescription || cleanContent.substring(0, 160)
  const readTime = Math.max(1, Math.ceil(cleanContent.split(/\s+/).length / 200))

  let timestamp = new Date()
  const ts = rawData.timestamp as { toDate?: () => Date } | Date | undefined
  if (ts && typeof (ts as { toDate?: () => Date }).toDate === "function") {
    timestamp = (ts as { toDate: () => Date }).toDate()
  } else if (ts instanceof Date) {
    timestamp = ts
  }

  const cat = getCategoryByName(category)
  const categorySlug = cat?.slug || "politics"

  return {
    id: String(docId),
    title,
    content,
    description,
    category,
    categorySlug,
    imageUrl,
    views,
    seoDescription,
    author,
    featured,
    trending,
    timestamp,
    readTime,
  }
}

export async function fetchLatestArticles(limitCount = 30): Promise<Article[]> {
  try {
    const q = query(collection(db, "articles"), orderBy("timestamp", "desc"), limit(limitCount))
    const snap = await getDocs(q)
    return snap.docs.map((d) => validateArticle(d.data(), d.id)).filter(Boolean) as Article[]
  } catch {
    return []
  }
}

export async function fetchByCategory(cat: string, limitCount = 20): Promise<Article[]> {
  try {
    const q = query(
      collection(db, "articles"),
      where("category", "==", cat),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => validateArticle(d.data(), d.id)).filter(Boolean) as Article[]
  } catch {
    return []
  }
}

export async function fetchArticleById(id: string): Promise<Article | null> {
  try {
    const docRef = doc(db, "articles", id)
    const snap = await getDoc(docRef)
    if (!snap.exists()) return null

    const article = validateArticle(snap.data(), snap.id)
    if (!article) return null

    try {
      await updateDoc(docRef, { views: increment(1) })
      article.views += 1
    } catch {
      // View increment failed silently
    }

    return article
  } catch {
    return null
  }
}

export async function searchArticles(term: string): Promise<Article[]> {
  const articles = await fetchLatestArticles(50)
  const lower = term.toLowerCase()
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(lower) ||
      a.category.toLowerCase().includes(lower) ||
      a.description.toLowerCase().includes(lower)
  )
}
