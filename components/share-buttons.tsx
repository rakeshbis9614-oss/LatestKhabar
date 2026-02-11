"use client"

export function ShareButtons({ title, articleId, categorySlug }: { title: string; articleId: string; categorySlug: string }) {
  const url = `https://latestkhabar.xyz/${categorySlug}/${articleId}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // fallback
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-surface-tertiary text-foreground transition-all hover:scale-110 hover:bg-brand hover:text-white"
        aria-label="WhatsApp पर साझा करें"
      >
        <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004A9.87 9.87 0 012.18 12c0-5.455 4.436-9.885 9.889-9.885 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.878-9.885 9.878m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-surface-tertiary text-foreground transition-all hover:scale-110 hover:bg-brand hover:text-white"
        aria-label="Telegram पर साझा करें"
      >
        <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zM17.6 8.4l-1.68 7.92c-.12.56-.48.72-.96.44l-2.64-1.96-1.28 1.24c-.16.16-.28.28-.56.28l.2-2.76 5-4.52c.2-.2-.04-.28-.32-.12l-6.2 3.92-2.68-.84c-.56-.16-.56-.56.12-.84l10.48-4.04c.48-.16.88.12.72.84l.8-.52z" /></svg>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-surface-tertiary text-foreground transition-all hover:scale-110 hover:bg-brand hover:text-white"
        aria-label="Twitter पर साझा करें"
      >
        <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.754-5.868 6.754h-3.31l7.732-8.835L2.882 2.25h6.6l4.67 6.169L17.822 2.25h.422zm-1.06 17.02h1.414L7.772 3.684H6.3l10.884 15.586z" /></svg>
      </a>
      <button
        onClick={copyLink}
        className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-surface-tertiary text-foreground transition-all hover:scale-110 hover:bg-brand hover:text-white"
        aria-label="लिंक कॉपी करें"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
      </button>
    </div>
  )
}
