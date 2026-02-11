export interface Article {
  id: string
  title: string
  content: string
  description: string
  category: string
  categorySlug: string
  imageUrl: string
  views: number
  seoDescription: string
  author: string
  featured: boolean
  trending: boolean
  timestamp: Date
  readTime: number
}

export const CATEGORIES = [
  { name: "राजनीति", slug: "politics", en: "Politics" },
  { name: "व्यापार", slug: "business", en: "Business" },
  { name: "टेक", slug: "technology", en: "Technology" },
  { name: "क्रिकेट", slug: "sports", en: "Sports" },
  { name: "मनोरंजन", slug: "entertainment", en: "Entertainment" },
  { name: "स्वास्थ्य", slug: "health", en: "Health" },
  { name: "AI", slug: "artificial-intelligence", en: "Artificial Intelligence" },
  { name: "विश्व", slug: "world", en: "World" },
  { name: "सरकारी योजना", slug: "public-policy", en: "Public Policy" },
] as const

export type CategorySlug = (typeof CATEGORIES)[number]["slug"]

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getCategoryByName(name: string) {
  return CATEGORIES.find((c) => c.name === name)
}

export function getCategoryColor(slug: string): string {
  const map: Record<string, string> = {
    politics: "text-purple-600 dark:text-purple-400",
    business: "text-green-600 dark:text-green-400",
    technology: "text-blue-600 dark:text-blue-400",
    sports: "text-red-600 dark:text-red-400",
    entertainment: "text-pink-600 dark:text-pink-400",
    health: "text-amber-600 dark:text-amber-400",
    "artificial-intelligence": "text-blue-600 dark:text-blue-400",
    world: "text-purple-600 dark:text-purple-400",
    "public-policy": "text-green-600 dark:text-green-400",
  }
  return map[slug] || "text-brand"
}

export function getCategoryBadgeColor(slug: string): string {
  const map: Record<string, string> = {
    politics: "bg-purple-600",
    business: "bg-green-600",
    technology: "bg-blue-600",
    sports: "bg-red-600",
    entertainment: "bg-pink-600",
    health: "bg-amber-600",
    "artificial-intelligence": "bg-blue-600",
    world: "bg-purple-600",
    "public-policy": "bg-green-600",
  }
  return map[slug] || "bg-brand"
}
