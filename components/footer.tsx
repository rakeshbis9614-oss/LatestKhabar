import Image from "next/image"
import Link from "next/link"

const categoryLinks = [
  { name: "राजनीति", href: "/politics" },
  { name: "व्यापार", href: "/business" },
  { name: "टेक", href: "/technology" },
  { name: "क्रिकेट", href: "/sports" },
  { name: "मनोरंजन", href: "/entertainment" },
  { name: "स्वास्थ्य", href: "/health" },
]

const companyLinks = [
  { name: "हमारे बारे में", href: "/about" },
  { name: "संपर्क करें", href: "/contact" },
  { name: "संपादकीय नीति", href: "/editorial-policy" },
]

const legalLinks = [
  { name: "गोपनीयता नीति", href: "/privacy-policy" },
  { name: "शर्तें और नियम", href: "/terms" },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t bg-surface-secondary border-border">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-6 pb-8 pt-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="flex flex-col sm:col-span-2 lg:col-span-1">
          <div className="mb-4">
            <Image
              src="/Latest Khabar Logo.webp"
              alt="Latest Khabar - Hindi News Portal"
              width={160}
              height={40}
              className="h-10 w-auto object-contain transition-transform hover:scale-[1.03]"
            />
          </div>
          <p className="mb-6 text-sm leading-relaxed text-foreground-secondary">
            Latest Khabar: भारत की सबसे विश्वसनीय डिजिटल समाचार वेबसाइट। ताजा खबर, ब्रेकिंग न्यूज़, सभी विषयों में।
          </p>
          <div className="mt-auto flex items-center gap-2">
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-tertiary text-foreground-secondary transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-white" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004A9.87 9.87 0 012.18 12c0-5.455 4.436-9.885 9.889-9.885 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.878-9.885 9.878m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
            <a href="https://t.me/latest_khabar" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-tertiary text-foreground-secondary transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-white" aria-label="Telegram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zM17.6 8.4l-1.68 7.92c-.12.56-.48.72-.96.44l-2.64-1.96-1.28 1.24c-.16.16-.28.28-.56.28l.2-2.76 5-4.52c.2-.2-.04-.28-.32-.12l-6.2 3.92-2.68-.84c-.56-.16-.56-.56.12-.84l10.48-4.04c.48-.16.88.12.72.84l.8-.52z" /></svg>
            </a>
            <a href="https://x.com/latest_khabar" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-tertiary text-foreground-secondary transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-white" aria-label="X (Twitter)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.754-5.868 6.754h-3.31l7.732-8.835L2.882 2.25h6.6l4.67 6.169L17.822 2.25h.422zm-1.06 17.02h1.414L7.772 3.684H6.3l10.884 15.586z" /></svg>
            </a>
            <a href="https://facebook.com/latest_khabar" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-tertiary text-foreground-secondary transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-white" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col">
          <h3 className="mb-4 text-sm font-bold font-hindi text-foreground">समाचार विभाग</h3>
          <ul className="flex flex-col gap-2">
            {categoryLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-foreground-secondary transition-colors hover:text-brand">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="flex flex-col">
          <h3 className="mb-4 text-sm font-bold font-hindi text-foreground">कंपनी</h3>
          <ul className="flex flex-col gap-2">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-foreground-secondary transition-colors hover:text-brand">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="flex flex-col">
          <h3 className="mb-4 text-sm font-bold font-hindi text-foreground">कानूनी</h3>
          <ul className="flex flex-col gap-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-foreground-secondary transition-colors hover:text-brand">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-5 text-center">
          <p className="text-xs text-foreground-muted">
            &copy; {year} Latest Khabar. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
