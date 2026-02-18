import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchProjects } from "../../api/endpoints";
import SectionTitle from "../ui/SectionTitle";
import ProjectCard from "../ui/ProjectCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function ProjectsPreview() {
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(),
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <section className="py-14 bg-white/70 dark:bg-neutral-950 text-secondary dark:text-neutral-100">
      <div className="container mx-auto px-4">
        <div className="rounded-[28px] border border-accent/35 dark:border-neutral-800 bg-surface/80 dark:bg-neutral-900/70 p-6 md:p-8 shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
        <SectionTitle
          title={isAr ? "أحدث الأعمال" : "Latest projects"}
          subtitle={
            isAr
              ? "نماذج متنوعة من المشاريع المنجزة لعملائنا."
              : "Recent product launches, brand work, and platforms we delivered."
          }
        />
        <Swiper
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
        >
          {projects?.slice(0, 6).map((project) => (
            <SwiperSlide key={project.id}>
              <ProjectCard project={project} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-6 text-center">
          <a
            href="/portfolio"
            className="inline-block px-6 py-3 rounded-full bg-primary text-white shadow-[0_12px_26px_rgba(var(--color-primary),0.3)] hover:-translate-y-0.5 transition-transform"
          >
            {isAr ? "شاهد كل الأعمال" : "View all projects"}
          </a>
        </div>
        </div>
      </div>
    </section>
  );
}
