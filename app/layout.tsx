import type { Metadata, Viewport } from "next"
import { Inter, Mukta, Playfair_Display } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BottomNav } from "@/components/bottom-nav"
import { BackToTop } from "@/components/back-to-top"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-mukta",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Latest Khabar - ताज़ा खबरें, ब्रेकिंग न्यूज़ | Premium Hindi News Portal",
    template: "%s | Latest Khabar",
  },
  description:
    "Latest Khabar: भारत की सबसे विश्वसनीय डिजिटल समाचार वेबसाइट। ताजा खबर, ब्रेकिंग न्यूज, राजनीति, व्यापार, क्रिकेट, तकनीक - सब कुछ एक जगह।",
  metadataBase: new URL("https://latestkhabar.xyz"),
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    siteName: "Latest Khabar",
    locale: "hi_IN",
  },
  twitter: {
    card: "summary_large_image",
    site: "@LatestKhabar",
  },
}

export const viewport: Viewport = {
  themeColor: "#DC2626",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi" className="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'light';document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t)})()`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${mukta.variable} ${playfair.variable} font-sans pb-20 md:pb-0`}>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
          <BottomNav />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
