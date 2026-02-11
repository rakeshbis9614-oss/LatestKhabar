import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("hi-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "अभी"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} मिनट पहले`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} घंटे पहले`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} दिन पहले`
  return formatDate(date)
}

export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false
  try {
    const parsed = new URL(url)
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      !!parsed.hostname &&
      parsed.hostname.includes(".")
    )
  } catch {
    return false
  }
}

export function getSafeImageUrl(url: string): string {
  return isValidImageUrl(url)
    ? url
    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='sans-serif' font-size='18'%3EImage%3C/text%3E%3C/svg%3E"
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}
