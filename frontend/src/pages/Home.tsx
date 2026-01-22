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
        title={isAr ? "لافا | حلول برمجية وتصميم منتجات رقمية" : "LAVA | Software solutions and digital product design"}
        description={
          isAr
            ? "نبني مواقع وتطبيقات ويب وتطبيقات جوال مع فرق تصميم وتطوير متكاملة."
            : "We build web platforms, mobile apps, and cohesive product experiences with strategy, design, and engineering under one roof."
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
