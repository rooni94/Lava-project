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
        { title: "شراكة طويلة الأمد", body: "نعمل كامتداد لفريقك ونقيس نجاحنا بالأثر على عملك لا بعدد المهام." },
        { title: "إبداع يقوده التحليل", body: "نمزج بين الأفكار الجريئة والبيانات لضبط الرسالة والحملات والمنتج." },
        { title: "إنتاج + برمجة متماسكة", body: "محتوى وتصميم وموشن جرافيك يتكامل مع مواقع وتطبيقات وأنظمة قابلة للتوسع." },
        { title: "وضوح وشفافية", body: "تقارير دورية، أولويات متفق عليها، وتواصل مباشر مع فريق متعدد التخصصات." },
      ]
    : [
        { title: "Long-term partnership", body: "We operate as your extended team and measure success by business impact." },
        { title: "Creative + analytical", body: "Bold ideas guided by data to tune the message, campaigns, and product." },
        { title: "Production + build in sync", body: "Content, design, and motion shipped alongside scalable sites, apps, and systems." },
        { title: "Clarity & transparency", body: "Regular reports, aligned priorities, and direct access to a hybrid team." },
      ];

  return (
    <Layout>
      <MetaHead
        title={isAr ? "من نحن | LAVA وكالة تسويق وبرمجة" : "About | LAVA marketing & engineering"}
        description={
          isAr
            ? "فريق واحد يجمع التسويق بالمحتوى والتصميم والموشن مع برمجة المواقع والتطبيقات والأنظمة لتحقيق نمو قابل للقياس."
            : "One team for marketing, content, design, motion, and engineering web/apps/systems for measurable growth."
        }
      />
      <section className="py-14 bg-white dark:bg-neutral-950 text-secondary dark:text-neutral-100">
        <div className="container mx-auto px-4 space-y-6">
          <SectionTitle
            title={isAr ? "نمو رقمي يقوده الإبداع" : "Creative-led digital growth"}
            subtitle={
              isAr ? "تسويق، محتوى، تصميم، موشن، وبرمجة في فريق واحد." : "Marketing, content, design, motion, and engineering under one roof."
            }
          />
          <p className="text-secondary/80 dark:text-neutral-300 leading-8 text-lg">
            {isAr
            ? "LAVA وكالة تسويق إلكتروني وبرمجة متكاملة تأسست على فكرة بسيطة: الإبداع الحقيقي يجب أن يقود إلى نتائج حقيقية. نجمع مسوقين ومصممين وكتّاب محتوى ومهندسي برمجيات لنكتب الرسالة، نصمم الهوية، ونبني المواقع والتطبيقات والأنظمة التي تخدم حملاتك وتوسّع أثرك."
            : "LAVA is a full-stack marketing and engineering agency built on one belief: creativity must deliver real results. Marketers, designers, writers, and engineers craft the story, brand, and the web/apps/systems that make campaigns work and scale."}
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
