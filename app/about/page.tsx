import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "हमारे बारे में",
  description: "Latest Khabar के बारे में जानें - भारत की सबसे विश्वसनीय हिंदी समाचार वेबसाइट।",
  alternates: { canonical: "https://latestkhabar.xyz/about" },
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-[900px] px-6 py-16">
      <article className="rounded-2xl bg-surface-secondary p-8 md:p-10">
        <h1 className="mb-6 font-display text-3xl font-bold text-brand">Latest Khabar के बारे में</h1>

        <section className="mb-8">
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">हमारा मिशन</h2>
          <p className="leading-relaxed text-foreground-secondary">
            Latest Khabar भारत की सबसे विश्वसनीय हिंदी समाचार वेबसाइट है। हमारा मिशन प्रत्येक भारतीय तक सत्य, निष्पक्ष और समय पर समाचार पहुंचाना है।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">हमारी दृष्टि</h2>
          <p className="leading-relaxed text-foreground-secondary">
            एक ऐसे भारत का निर्माण करना जहां हर व्यक्ति वर्तमान घटनाओं के बारे में सूचित रहे और समाज के विकास में भाग ले सके।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">समाचार क्षेत्र</h2>
          <ul className="flex flex-col gap-2 pl-5 text-foreground-secondary list-disc">
            <li><strong className="text-foreground">राजनीति:</strong> राष्ट्रीय और अंतर्राष्ट्रीय राजनीतिक समाचार</li>
            <li><strong className="text-foreground">व्यापार:</strong> बाजार, शेयर, अर्थव्यवस्था संबंधी अपडेट</li>
            <li><strong className="text-foreground">क्रिकेट:</strong> IPL, अंतर्राष्ट्रीय क्रिकेट समाचार</li>
            <li><strong className="text-foreground">तकनीक:</strong> नई तकनीक, स्टार्टअप्स, गैजेट्स</li>
            <li><strong className="text-foreground">मनोरंजन:</strong> बॉलीवुड, वेब सीरीज, सेलिब्रिटी समाचार</li>
            <li><strong className="text-foreground">स्वास्थ्य:</strong> स्वास्थ्य सुझाव, मेडिकल समाचार</li>
            <li><strong className="text-foreground">विश्व:</strong> अंतर्राष्ट्रीय समाचार</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">हमारी टीम</h2>
          <p className="leading-relaxed text-foreground-secondary">
            Latest Khabar की टीम में अनुभवी पत्रकार, संपादक और तकनीकी विशेषज्ञ शामिल हैं जो समाचार को सत्यापित करने और सटीकता सुनिश्चित करने के लिए प्रतिबद्ध हैं।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">संपादकीय नीति</h2>
          <p className="leading-relaxed text-foreground-secondary">
            हम निष्पक्षता, सटीकता और जिम्मेदारी के साथ समाचार प्रकाशित करते हैं। अधिक जानकारी के लिए{" "}
            <Link href="/editorial-policy" className="text-brand underline underline-offset-2">संपादकीय नीति</Link> देखें।
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">हमसे संपर्क करें</h2>
          <p className="mb-2 text-foreground-secondary">
            किसी भी प्रश्न या सुझाव के लिए <Link href="/contact" className="text-brand underline underline-offset-2">संपर्क पृष्ठ</Link> पर जाएं।
          </p>
          <p className="text-foreground-secondary"><strong className="text-foreground">ईमेल:</strong> info@latestkhabar.com</p>
          <p className="text-foreground-secondary"><strong className="text-foreground">पता:</strong> नई दिल्ली, भारत</p>
        </section>
      </article>
    </main>
  )
}
