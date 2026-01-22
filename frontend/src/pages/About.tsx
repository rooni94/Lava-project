import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import SectionTitle from "../components/ui/SectionTitle";
import { fetchTeam } from "../api/endpoints";
import { TeamMember } from "../types";
import MetaHead from "../components/MetaHead";

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-5 shadow text-secondary dark:text-neutral-100">
      <div className="h-32 w-32 rounded-full bg-primary/10 text-primary grid place-items-center font-bold mx-auto mb-3 overflow-hidden">
        {member.image ? <img src={member.image} alt={member.name} className="h-full w-full rounded-full object-cover" /> : member.name[0]}
      </div>
      <h3 className="text-lg font-bold text-secondary dark:text-neutral-50 text-center">{member.name}</h3>
      <p className="text-sm text-primary text-center">{member.position}</p>
      <p className="text-sm text-secondary/80 dark:text-neutral-300 mt-2 text-center">{member.bio}</p>
    </div>
  );
}

export default function About() {
  const { data: team } = useQuery({ queryKey: ["team"], queryFn: fetchTeam });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const values = isAr
    ? [
        {
          title: "شراكة وثقة",
          body: "نبدأ كل مشروع بفهم عميق للسياق التجاري لنضمن أن الحل يخدم هدفك بوضوح.",
        },
        {
          title: "جودة وتقنية",
          body: "نستخدم أفضل الممارسات في الكود والاختبارات لضمان الاستقرار والأداء.",
        },
        {
          title: "تجربة مستخدم أولًا",
          body: "نصمم بعيون المستخدم النهائي لنحقق تبنيًا سريعًا ونموًا مستدامًا.",
        },
        {
          title: "تعلم مستمر",
          body: "نطوّر الفريق باستمرار ليواكب التقنيات والأدوات الحديثة.",
        },
      ]
    : [
        {
          title: "Partnership mindset",
          body: "We work as one team with you - aligning on outcomes, transparent plans, and a cadence you can rely on.",
        },
        {
          title: "Quality and craft",
          body: "Robust code, automated checks, and thoughtful design systems keep releases stable and future-proof.",
        },
        {
          title: "User-first thinking",
          body: "Discovery, research, and prototyping to ensure experiences are intuitive, accessible, and delightful.",
        },
        {
          title: "Continuous learning",
          body: "We invest in training, retros, and technical spikes so the team stays sharp and ready for what's next.",
        },
      ];

  return (
    <Layout>
      <MetaHead
        title={isAr ? "من نحن | لافا" : "About | LAVA"}
        description={
          isAr
            ? "فريق لافا يجمع بين الاستراتيجية، التصميم، والهندسة لبناء منتجات رقمية موثوقة."
            : "LAVA blends strategy, design, and engineering to ship dependable digital products."
        }
      />
      <section className="py-14 bg-white dark:bg-neutral-950 text-secondary dark:text-neutral-100">
        <div className="container mx-auto px-4 space-y-6">
          <SectionTitle
            title={isAr ? "نبني منتجات رقمية تدوم" : "We build digital products that last"}
            subtitle={
              isAr ? "فريق متعدد التخصصات في التصميم والهندسة والاستراتيجية." : "A multidisciplinary team across design, engineering, and strategy."
            }
          />
          <p className="text-secondary/80 dark:text-neutral-300 leading-8 text-lg">
            {isAr
              ? "لافا بدأت كفريق صغير في 2019 ونمت لتغطي كامل دورة حياة المنتج: البحث، التصميم، التطوير، والإطلاق. نعمل مع الشركات التقنية والجهات الحكومية والقطاع غير الربحي لبناء حلول عالية الاعتمادية."
              : "LAVA started in 2019 as a compact team and grew to cover the full product lifecycle: research, design, development, and launch. We partner with tech companies, government entities, and nonprofits to ship reliable solutions with clear business outcomes."}
          </p>
        </div>
      </section>

      <section className="py-10 container mx-auto px-4 grid md:grid-cols-3 gap-6 text-secondary dark:text-neutral-100">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-accent/40 dark:border-neutral-800 p-5 shadow">
          <h3 className="text-xl font-bold text-secondary dark:text-neutral-50 mb-2">
            {isAr ? "منهجية رشيقة" : "Agile delivery"}
          </h3>
          <p className="text-secondary/80 dark:text-neutral-300">
            {isAr
              ? "نقسم العمل إلى أسابيع واضحة مع أولويات متفق عليها ومؤشرات إنجاز قابلة للقياس."
              : "Weekly sprints with clear priorities, demo-ready builds, and measurable success indicators."}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-accent/40 dark:border-neutral-800 p-5 shadow">
          <h3 className="text-xl font-bold text-secondary dark:text-neutral-50 mb-2">
            {isAr ? "أمان وجودة" : "Security & quality"}
          </h3>
          <p className="text-secondary/80 dark:text-neutral-300">
            {isAr
              ? "نطبق مراجعات كود واختبارات تلقائية وفحوصات أمنية قبل كل إطلاق."
              : "Code reviews, automated tests, and security checks before every release keep the product stable."}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-accent/40 dark:border-neutral-800 p-5 shadow">
          <h3 className="text-xl font-bold text-secondary dark:text-neutral-50 mb-2">
            {isAr ? "تسليم شفاف" : "Transparent delivery"}
          </h3>
          <p className="text-secondary/80 dark:text-neutral-300">
            {isAr
              ? "لوحات متابعة، نسخ مرحلية، وتوثيق واضح لكل ميزة لتتبع التقدم بسهولة."
              : "Roadmaps, staging environments, and clear documentation make it easy to track progress."}
          </p>
        </div>
      </section>

      <section className="py-14 container mx-auto px-4 text-secondary dark:text-neutral-100">
        <SectionTitle title={isAr ? "قيمنا" : "Our values"} />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((value) => (
            <div key={value.title} className="p-5 rounded-2xl bg-surface dark:bg-neutral-900 border border-accent/50 dark:border-neutral-800 shadow-sm">
              <h4 className="text-lg font-bold text-secondary dark:text-neutral-50 mb-2">{value.title}</h4>
              <p className="text-sm text-secondary/80 dark:text-neutral-300">{value.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 bg-surface dark:bg-neutral-900 text-secondary dark:text-neutral-100">
        <div className="container mx-auto px-4">
          <SectionTitle title={isAr ? "فريق العمل" : "Meet the team"} />
          <div className="grid md:grid-cols-3 gap-6">
            {team?.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
