import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import SectionTitle from "../components/ui/SectionTitle";
import { fetchTeam } from "../api/endpoints";
import { TeamMember } from "../types";
import MetaHead from "../components/MetaHead";
import Reveal from "../components/ui/Reveal";

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Reveal>
      <article className="neo-panel p-5 h-full">
        <div className="h-32 w-32 rounded-3xl bg-primary/10 text-primary grid place-items-center font-bold mx-auto mb-3 overflow-hidden">
          {member.image ? <img src={member.image} alt={member.name} className="h-full w-full object-cover" /> : member.name[0]}
        </div>
        <h3 className="text-lg font-bold text-secondary dark:text-neutral-50 text-center">{member.name}</h3>
        <p className="text-sm text-primary text-center">{member.position}</p>
        <p className="text-sm text-secondary/80 dark:text-neutral-300 mt-2 text-center leading-7">{member.bio}</p>
      </article>
    </Reveal>
  );
}

export default function About() {
  const { data: team } = useQuery({ queryKey: ["team"], queryFn: fetchTeam });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const values = isAr
    ? [
        { title: "شراكة طويلة الأمد", body: "نعمل كامتداد لفريقك ونقيس النجاح بالأثر الفعلي على النمو." },
        { title: "إبداع مدعوم بالبيانات", body: "نحوّل الأفكار الجريئة إلى قرارات دقيقة عبر التحليل المستمر." },
        { title: "تنفيذ متكامل", body: "التصميم والمحتوى والبرمجة والحملات كلها تسير بإيقاع واحد." },
        { title: "شفافية كاملة", body: "لوحات متابعة وتحديثات أسبوعية ووضوح في الأولويات." },
      ]
    : [
        { title: "Long-term partnership", body: "We operate as an extension of your team and measure success by real business impact." },
        { title: "Data-backed creativity", body: "Bold creative choices are guided by ongoing analytics and iteration." },
        { title: "Integrated execution", body: "Design, content, engineering, and campaigns move in one rhythm." },
        { title: "Full transparency", body: "Shared dashboards, weekly updates, and clear priorities at every stage." },
      ];

  const timeline = isAr
    ? [
        { year: "2019", detail: "انطلاق LAVA كنواة تجمع البرمجة والتسويق." },
        { year: "2021", detail: "توسيع الفريق وإطلاق مشاريع إقليمية متعددة." },
        { year: "2023", detail: "تأسيس وحدات متخصصة للأنظمة المؤسسية وحملات الأداء." },
        { year: "الآن", detail: "شريك نمو رقمي متكامل لعلامات تبحث عن أثر قابل للقياس." },
      ]
    : [
        { year: "2019", detail: "LAVA launched as a hybrid software and marketing studio." },
        { year: "2021", detail: "Expanded delivery squads and shipped multi-sector regional projects." },
        { year: "2023", detail: "Built dedicated units for enterprise systems and performance campaigns." },
        { year: "Now", detail: "A full digital growth partner for brands that care about measurable impact." },
      ];

  return (
    <Layout>
      <MetaHead
        title={isAr ? "من نحن | LAVA" : "About | LAVA"}
        description={
          isAr
            ? "فريق واحد يجمع التسويق بالمحتوى والتصميم والموشن مع برمجة المواقع والتطبيقات والأنظمة لتحقيق نمو قابل للقياس."
            : "One integrated team for software delivery and digital growth execution."
        }
      />

      <section className="py-14 container mx-auto px-4 space-y-10 text-secondary dark:text-neutral-100">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-panel p-6 md:p-10 relative overflow-hidden"
        >
          <div className="absolute -left-14 -top-16 h-52 w-52 rounded-full bg-primary/14 blur-3xl" />
          <div className="absolute -right-14 -bottom-16 h-56 w-56 rounded-full bg-secondary/10 blur-3xl dark:bg-white/5" />

          <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-secondary/60 dark:text-neutral-400">
                {isAr ? "قصة LAVA" : "Our story"}
              </p>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                {isAr ? "نبني النمو عبر الكود والرسالة" : "We engineer growth through product and narrative"}
              </h1>
              <p className="text-secondary/80 dark:text-neutral-300 leading-8">
                {isAr
                  ? "بدأنا لأننا رأينا فجوة بين فرق البرمجة وفرق التسويق. اليوم نعمل كنظام واحد: نبني المنتج ونطلق الحملة ونقيس الأثر في نفس الإيقاع."
                  : "We started by solving one core gap: product and growth teams operating in isolation. Today we run both tracks as one coordinated system."}
              </p>
            </div>

            <div className="space-y-3">
              {timeline.map((item) => (
                <Reveal key={item.year}>
                  <div className="rounded-2xl border border-accent/45 dark:border-neutral-700 bg-white/75 dark:bg-neutral-900/65 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-primary">{item.year}</p>
                    <p className="text-sm text-secondary/80 dark:text-neutral-300 leading-7 mt-1">{item.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </motion.div>

        <section className="space-y-6">
          <SectionTitle title={isAr ? "قيمنا" : "Our values"} />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value) => (
              <Reveal key={value.title}>
                <div className="neo-panel p-5 h-full">
                  <h4 className="text-lg font-bold text-secondary dark:text-neutral-50 mb-2">{value.title}</h4>
                  <p className="text-sm text-secondary/80 dark:text-neutral-300 leading-7">{value.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionTitle title={isAr ? "فريق العمل" : "Meet the team"} />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team?.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      </section>
    </Layout>
  );
}
