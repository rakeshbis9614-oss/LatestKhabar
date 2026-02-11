import type { Metadata } from "next"
import type { Article } from "./types"

const SITE_URL = "https://latestkhabar.xyz"
const SITE_NAME = "Latest Khabar"
const LOGO_URL = `${SITE_URL}/Latest%20Khabar%20Logo.webp`

export function generateHomeMetadata(): Metadata {
  return {
    title: "Latest Khabar - ताज़ा खबरें, ब्रेकिंग न्यूज़ | Premium Hindi News Portal",
    description:
      "Latest Khabar: भारत की सबसे विश्वसनीय डिजिटल समाचार वेबसाइट। ताजा खबर, ब्रेकिंग न्यूज, राजनीति, व्यापार, क्रिकेट, तकनीक - सब कुछ एक जगह।",
    keywords: [
      "हिंदी समाचार",
      "ताजा खबर",
      "ब्रेकिंग न्यूज",
      "Latest News Hindi",
      "Politics",
      "Business",
      "Cricket",
      "Technology",
    ],
    authors: [{ name: SITE_NAME }],
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      type: "website",
      title: "Latest Khabar - ताज़ा खबरें, ब्रेकिंग न्यूज़",
      description: "भारत की सबसे विश्वसनीय डिजिटल समाचार वेबसाइट। ताजा खबर, ब्रेकिंग न्यूज़ सभी विषयों में।",
      url: SITE_URL,
      siteName: SITE_NAME,
      images: [{ url: LOGO_URL, width: 1200, height: 630 }],
      locale: "hi_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: "Latest Khabar - ताज़ा खबरें",
      description: "भारत की Premium हिंदी समाचार वेबसाइट।",
      images: [LOGO_URL],
      site: "@LatestKhabar",
    },
  }
}

export function generateArticleMetadata(article: Article): Metadata {
  const desc = article.seoDescription || article.description
  const imageUrl = article.imageUrl || LOGO_URL
  const articleUrl = `${SITE_URL}/${article.categorySlug}/${article.id}`

  return {
    title: `${article.title} | Latest Khabar`,
    description: desc,
    authors: [{ name: article.author }],
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: desc,
      url: articleUrl,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, width: 1200, height: 675 }],
      locale: "hi_IN",
      publishedTime: article.timestamp.toISOString(),
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: desc,
      images: [imageUrl],
      site: "@LatestKhabar",
    },
  }
}

export function generateArticleJsonLd(article: Article) {
  const articleUrl = `${SITE_URL}/${article.categorySlug}/${article.id}`
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.seoDescription || article.description,
    image: {
      "@type": "ImageObject",
      url: article.imageUrl || LOGO_URL,
      height: 675,
      width: 1200,
    },
    datePublished: article.timestamp.toISOString(),
    dateModified: article.timestamp.toISOString(),
    author: {
      "@type": "Person",
      name: article.author || "Latest Khabar",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    wordCount: article.content.replace(/<[^>]*>/g, "").split(/\s+/).length,
    inLanguage: "hi-IN",
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ReadAction",
      userInteractionCount: article.views || 0,
    },
  }
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
    inLanguage: "hi-IN",
  }
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
