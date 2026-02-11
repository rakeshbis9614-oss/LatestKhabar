import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "संपर्क करें",
  description: "Latest Khabar से संपर्क करें। समाचार, विज्ञापन या अन्य प्रश्नों के लिए हमसे जुड़ें।",
  alternates: { canonical: "https://latestkhabar.xyz/contact" },
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-[900px] px-6 py-16">
      <article className="rounded-2xl bg-surface-secondary p-8 md:p-10">
        <h1 className="mb-6 font-display text-3xl font-bold text-brand">संपर्क करें</h1>

        <section className="mb-8">
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">हमसे जुड़ें</h2>
          <p className="mb-4 leading-relaxed text-foreground-secondary">
            Latest Khabar टीम आपकी सेवा में हमेशा तत्पर है। समाचार, विज्ञापन, सुझाव या शिकायत के लिए नीचे दिए गए तरीकों से हमसे संपर्क करें।
          </p>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 mb-8">
          <div className="rounded-lg border bg-surface-primary p-5 border-border">
            <h3 className="mb-2 font-hindi text-lg font-bold text-foreground">सामान्य प्रश्न</h3>
            <p className="text-sm text-foreground-secondary">info@latestkhabar.com</p>
          </div>
          <div className="rounded-lg border bg-surface-primary p-5 border-border">
            <h3 className="mb-2 font-hindi text-lg font-bold text-foreground">विज्ञापन</h3>
            <p className="text-sm text-foreground-secondary">ads@latestkhabar.com</p>
          </div>
          <div className="rounded-lg border bg-surface-primary p-5 border-border">
            <h3 className="mb-2 font-hindi text-lg font-bold text-foreground">संपादकीय</h3>
            <p className="text-sm text-foreground-secondary">editor@latestkhabar.com</p>
          </div>
          <div className="rounded-lg border bg-surface-primary p-5 border-border">
            <h3 className="mb-2 font-hindi text-lg font-bold text-foreground">कार्यालय</h3>
            <p className="text-sm text-foreground-secondary">नई दिल्ली, भारत</p>
          </div>
        </div>

        <section>
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">सोशल मीडिया</h2>
          <div className="flex flex-wrap gap-3">
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="rounded-md bg-surface-tertiary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-brand hover:text-white">WhatsApp</a>
            <a href="https://t.me/latest_khabar" target="_blank" rel="noopener noreferrer" className="rounded-md bg-surface-tertiary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-brand hover:text-white">Telegram</a>
            <a href="https://x.com/latest_khabar" target="_blank" rel="noopener noreferrer" className="rounded-md bg-surface-tertiary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-brand hover:text-white">X (Twitter)</a>
            <a href="https://facebook.com/latest_khabar" target="_blank" rel="noopener noreferrer" className="rounded-md bg-surface-tertiary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-brand hover:text-white">Facebook</a>
          </div>
        </section>
      </article>
    </main>
  )
}
