import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "गोपनीयता नीति",
  description: "Latest Khabar की गोपनीयता नीति - आपकी निजता की सुरक्षा हमारी प्राथमिकता।",
  alternates: { canonical: "https://latestkhabar.xyz/privacy-policy" },
}

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-[900px] px-6 py-16">
      <article className="rounded-2xl bg-surface-secondary p-8 md:p-10">
        <h1 className="mb-6 font-display text-3xl font-bold text-brand">गोपनीयता नीति</h1>
        <p className="mb-6 text-sm text-foreground-muted">अंतिम अपडेट: फरवरी 2026</p>

        <section className="mb-8">
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">परिचय</h2>
          <p className="leading-relaxed text-foreground-secondary">
            Latest Khabar (latestkhabar.xyz) आपकी गोपनीयता का सम्मान करता है। यह गोपनीयता नीति बताती है कि हम आपकी जानकारी कैसे एकत्रित, उपयोग और संरक्षित करते हैं।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">जानकारी का संग्रह</h2>
          <ul className="flex flex-col gap-2 pl-5 list-disc text-foreground-secondary">
            <li>ब्राउज़र प्रकार और संस्करण</li>
            <li>ऑपरेटिंग सिस्टम</li>
            <li>रेफरल URL</li>
            <li>पेज व्यू और विज़िट का समय</li>
            <li>IP एड्रेस (अनामित)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">कुकीज़</h2>
          <p className="leading-relaxed text-foreground-secondary">
            हम कुकीज़ का उपयोग आपके अनुभव को बेहतर बनाने, थीम प्राथमिकता सहेजने और विज्ञापन प्रदर्शित करने के लिए करते हैं। आप अपने ब्राउज़र सेटिंग्स से कुकीज़ को अक्षम कर सकते हैं।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">विज्ञापन</h2>
          <p className="leading-relaxed text-foreground-secondary">
            हम Google AdSense का उपयोग करते हैं जो तृतीय-पक्ष कुकीज़ का उपयोग कर सकता है। Google की गोपनीयता नीति के लिए google.com/privacy पर जाएं।
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">संपर्क</h2>
          <p className="leading-relaxed text-foreground-secondary">
            गोपनीयता संबंधी प्रश्नों के लिए privacy@latestkhabar.com पर ईमेल करें।
          </p>
        </section>
      </article>
    </main>
  )
}
