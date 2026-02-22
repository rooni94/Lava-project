import Hero from "../components/sections/Hero";
import ServicesPreview from "../components/sections/ServicesPreview";
import ProjectsPreview from "../components/sections/ProjectsPreview";
import Testimonials from "../components/sections/Testimonials";
import CallToAction from "../components/sections/CallToAction";
import Layout from "../components/layout/Layout";
import MetaHead from "../components/MetaHead";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Reveal from "../components/ui/Reveal";



export default function Home() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  return (
    <>
      <MetaHead
        description={
          isAr
            ? "نمزج التسويق الإبداعي مع هندسة المنتجات: محتوى وتصميم وموشن جرافيك وخطط نمو، إلى جانب برمجة مواقع، تطبيقات، ولوحات تحكم وأنظمة قابلة للتوسع."
            : "We blend creative marketing with product engineering: content, design, motion, and growth strategy paired with scalable web, app, dashboard, and system development."
        }
      />
      <Hero />

      <section className="py-8 container mx-auto px-4 text-secondary dark:text-neutral-100">
        <Reveal className="neo-panel p-5 md:p-7 relative overflow-hidden">
          <div className="absolute -left-12 -top-12 h-48 w-48 rounded-full bg-primary/14 blur-3xl" />
          <div className="absolute -right-12 -bottom-12 h-52 w-52 rounded-full bg-secondary/10 blur-3xl dark:bg-white/6" />

          <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-secondary/60 dark:text-neutral-400">
                {isAr ? "فكرة LAVA" : "The LAVA model"}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold leading-snug">
                {isAr
                  ? "المنتج والحملة في لوحة تشغيل واحدة"
                  : "Product delivery and campaign execution on one operating board"}
              </h2>
              <p className="text-secondary/80 dark:text-neutral-300 leading-8">
                {isAr
                  ? "نعمل وفق إيقاع أسبوعي يجمع قرارات البرمجة والتسويق في نفس الاجتماع، لذلك يتحسن المنتج والنتيجة التسويقية معًا."
                  : "Weekly decision loops align engineering and growth teams, so both product quality and campaign outcomes improve together."}
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-accent/50 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-secondary/60 dark:text-neutral-400">01</p>
                <p className="font-semibold text-secondary dark:text-neutral-100">{isAr ? "خطة إطلاق تقنية" : "Technical launch plan"}</p>
              </div>
              <div className="rounded-2xl border border-accent/50 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-secondary/60 dark:text-neutral-400">02</p>
                <p className="font-semibold text-secondary dark:text-neutral-100">{isAr ? "نظام محتوى وحملات" : "Content and campaign engine"}</p>
              </div>
              <div className="rounded-2xl border border-accent/50 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-secondary/60 dark:text-neutral-400">03</p>
                <p className="font-semibold text-secondary dark:text-neutral-100">{isAr ? "تحسين مبني على النتائج" : "Performance-led optimization"}</p>
              </div>
            </div>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-primary/80"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </Reveal>
      </section>

      <ServicesPreview />
      <ProjectsPreview />
      <Testimonials />
      <CallToAction />
    </Layout>
  );
}
