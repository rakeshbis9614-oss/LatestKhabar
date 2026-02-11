import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <h1 className="mb-3 font-display text-6xl font-extrabold text-brand">404</h1>
        <p className="mb-6 text-lg text-foreground-secondary">
          पेज नहीं मिला। यह हटा दिया गया हो सकता है या लिंक गलत हो सकता है।
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
        >
          होम पर लौटें
        </Link>
      </div>
    </main>
  )
}
