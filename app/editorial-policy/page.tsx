import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "संपादकीय नीति",
  description: "Latest Khabar की संपादकीय नीति - निष्पक्ष, सटीक और जिम्मेदार पत्रकारिता।",
  alternates: { canonical: "https://latestkhabar.xyz/editorial-policy" },
}

export default function EditorialPolicyPage() {
  return (
    <main className="mx-auto max-w-[900px] px-6 py-16">
      <article className="rounded-2xl bg-surface-secondary p-8 md:p-10">
        <h1 className="mb-6 font-display text-3xl font-bold text-brand">संपादकीय नीति</h1>

        <section className="mb-8">
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">हमारे सिद्धांत</h2>
          <p className="mb-3 leading-relaxed text-foreground-secondary">Latest Khabar निम्नलिखित संपादकीय सिद्धांतों का पालन करता है:</p>
          <ul className="flex flex-col gap-2 pl-5 list-disc text-foreground-secondary">
            <li><strong className="text-foreground">सटीकता:</strong> सभी समाचारों की तथ्य-जांच की जाती है।</li>
            <li><strong className="text-foreground">निष्पक्षता:</strong> हम किसी भी राजनीतिक दल या संगठन से संबद्ध नहीं हैं।</li>
            <li><strong className="text-foreground">पारदर्शिता:</strong> हम अपने स्रोतों और प्रक्रियाओं के बारे में पारदर्शी हैं।</li>
            <li><strong className="text-foreground">जवाबदेही:</strong> त्रुटियों को तुरंत सुधारा जाता है।</li>
            <li><strong className="text-foreground">गोपनीयता:</strong> स्रोतों की गोपनीयता का सम्मान किया जाता है।</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">सुधार नीति</h2>
          <p className="leading-relaxed text-foreground-secondary">
            यदि किसी समाचार में कोई त्रुटि पाई जाती है, तो हम उसे तुरंत सुधारते हैं और सुधार की सूचना पाठकों को देते हैं। सुधार की मांग info@latestkhabar.com पर भेजी जा सकती है।
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-hindi text-xl font-bold text-foreground">शिकायत निवारण</h2>
          <p className="leading-relaxed text-foreground-secondary">
            किसी भी समाचार से संबंधित शिकायत editor@latestkhabar.com पर भेजें। हम 48 घंटे के भीतर प्रतिक्रिया देने का प्रयास करते हैं।
          </p>
        </section>
      </article>
    </main>
  )
}
