import Hero from "../components/sections/Hero";
import ServicesPreview from "../components/sections/ServicesPreview";
import ProjectsPreview from "../components/sections/ProjectsPreview";
import Testimonials from "../components/sections/Testimonials";
import CallToAction from "../components/sections/CallToAction";
import Layout from "../components/layout/Layout";
import MetaHead from "../components/MetaHead";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  return (
    <Layout>
      <MetaHead
        title={isAr ? "LAVA | وكالة تسويق وبرمجة متكاملة" : "LAVA | Integrated marketing & engineering agency"}
        description={
          isAr
            ? "نمزج التسويق الإبداعي مع هندسة المنتجات: محتوى وتصميم وموشن جرافيك وخطط نمو، إلى جانب برمجة مواقع، تطبيقات، ولوحات تحكم وأنظمة قابلة للتوسع."
            : "We blend creative marketing with product engineering: content, design, motion, and growth strategy paired with scalable web, app, dashboard, and system development."
        }
      />
      <Hero />
      <ServicesPreview />
      <ProjectsPreview />
      <Testimonials />
      <CallToAction />
    </Layout>
  );
}
