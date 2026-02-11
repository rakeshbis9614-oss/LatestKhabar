import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "शर्तें और नियम",
  description: "Latest Khabar की शर्तें और नियम - वेबसाइट उपयोग की शर्तें।",
  alternates: { canonical: "https://latestkhabar.xyz/terms" },
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-[900px] px-6 py-16">
      <article className="rounded-2xl bg-surface-secondary p-8 md:p-10">
        <h1 className="mb-6 font-display text-3xl font-bold text-brand">शर्तें और नियम</h1>
        <p className="mb-6 text-sm text-foreground-muted">अंतिम अपडेट: फरवरी 2026</p>

        <section className="mb-8">
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">स्वीकृति</h2>
          <p className="leading-relaxed text-foreground-secondary">
            Latest Khabar (latestkhabar.xyz) का उपयोग करके आप इन शर्तों से सहमत होते हैं। यदि आप सहमत नहीं हैं, तो कृपया वेबसाइट का उपयोग न करें।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">बौद्धिक संपदा</h2>
          <p className="leading-relaxed text-foreground-secondary">
            सभी सामग्री, चित्र, डिज़ाइन और लोगो Latest Khabar की बौद्धिक संपदा हैं। बिना लिखित अनुमति के पुनर्प्रकाशन प्रतिबंधित है।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">उपयोगकर्ता आचरण</h2>
          <ul className="flex flex-col gap-2 pl-5 list-disc text-foreground-secondary">
            <li>वेबसाइट का दुरुपयोग निषेध है</li>
            <li>अनधिकृत पहुंच का प्रयास प्रतिबंधित है</li>
            <li>किसी भी प्रकार के स्वचालित स्क्रैपिंग की अनुमति नहीं है</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">संपर्क</h2>
          <p className="leading-relaxed text-foreground-secondary">
            इन शर्तों से संबंधित प्रश्नों के लिए legal@latestkhabar.com पर ईमेल करें।
          </p>
        </section>
      </article>
    </main>
  )
}
