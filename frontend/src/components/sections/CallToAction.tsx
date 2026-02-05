import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CallToAction() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  return (
    <section className="py-16 bg-primary text-white text-center">
      <div className="container mx-auto px-4 space-y-4">
        <h3 className="text-3xl font-bold">
          {isAr ? "لنشعل نمو علامتك بتسويق ذكي وكود متين." : "Ignite your growth with smart marketing and solid code."}
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          {isAr
            ? "فريق واحد يكتب الرسالة، يصمم الهوية، يدير الحملات، ويطور الموقع أو التطبيق الذي يحقق الأثر."
            : "One team to craft your story, design your identity, run campaigns, and ship the web/app experience that converts."}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/contact" className="px-6 py-3 rounded-full bg-white text-primary font-semibold">
            {isAr ? "احجز استشارة" : "Book a consultation"}
          </Link>
          <Link to="/services" className="px-6 py-3 rounded-full border border-white text-white font-semibold">
            {isAr ? "اكتشف التسويق والبرمجة معًا" : "Explore marketing + engineering"}
          </Link>
        </div>
      </div>
    </section>
  );
}
