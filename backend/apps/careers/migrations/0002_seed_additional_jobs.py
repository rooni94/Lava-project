from __future__ import annotations

from django.db import migrations


def seed_additional_jobs(apps, schema_editor):
    JobOpening = apps.get_model("careers", "JobOpening")

    jobs = [
        {
            "title": "مهندس واجهات أمامية (React/Next.js)",
            "department": "التطوير",
            "location": "عن بعد",
            "employment_type": "full_time",
            "description": "بناء واجهات حديثة عالية الأداء مع التركيز على تجربة المستخدم وإتقان التفاصيل.",
            "requirements": ["خبرة 3+ سنوات React", "إتقان TypeScript", "خبرة في Next.js", "فهم جيد لـ UI/UX"],
            "benefits": ["مرونة عمل", "تطوير مهني", "بيئة فريق قوية"],
            "is_active": True,
        },
        {
            "title": "مهندس باك إند (Django/Node)",
            "department": "التطوير",
            "location": "عن بعد",
            "employment_type": "full_time",
            "description": "تصميم وتنفيذ خدمات خلفية آمنة وقابلة للتوسع مع تكاملات خارجية.",
            "requirements": ["خبرة 3+ سنوات Django أو Node", "تصميم قواعد بيانات", "REST APIs", "أفضل ممارسات الأمان"],
            "benefits": ["عمل مرن", "فرص نمو", "مشاريع متنوعة"],
            "is_active": True,
        },
        {
            "title": "مطوّر تطبيقات جوال (React Native)",
            "department": "التطوير",
            "location": "عن بعد",
            "employment_type": "full_time",
            "description": "تطوير تطبيقات iOS/Android بواجهات سلسة وربطها بالـ APIs.",
            "requirements": ["خبرة React Native", "تجربة نشر على المتاجر", "حل مشاكل الأداء", "فهم أساسيات UX"],
            "benefits": ["ساعات مرنة", "بيئة تعلم", "فريق داعم"],
            "is_active": True,
        },
        {
            "title": "مصمم UI/UX", 
            "department": "التصميم",
            "location": "الرياض / عن بعد",
            "employment_type": "full_time",
            "description": "تصميم واجهات وتجارب عربية احترافية قابلة للتحويل إلى منتجات قابلة للنمو.",
            "requirements": ["محفظة قوية", "Figma", "تحليل تجربة المستخدم", "تصميم أنظمة UI"],
            "benefits": ["مرونة", "تأثير واضح", "تطوير مستمر"],
            "is_active": True,
        },
        {
            "title": "مهندس ضمان جودة (QA)",
            "department": "الجودة",
            "location": "عن بعد",
            "employment_type": "contract",
            "description": "إنشاء خطط اختبار شاملة لضمان جودة الإطلاق عبر الويب والجوال.",
            "requirements": ["اختبارات وظيفية", "توثيق الأخطاء", "اختبارات واجهة", "خبرة أدوات QA"],
            "benefits": ["عمل مرن", "مشاريع متعددة"],
            "is_active": True,
        },
        {
            "title": "مدير مشروع تقني",
            "department": "إدارة المشاريع",
            "location": "الرياض / عن بعد",
            "employment_type": "full_time",
            "description": "إدارة فرق التنفيذ، التخطيط، المتابعة مع العملاء، وضبط الجودة والوقت.",
            "requirements": ["خبرة Agile/Scrum", "تنظيم ومتابعة", "مهارات تواصل عالية", "إدارة نطاق"],
            "benefits": ["دور قيادي", "نمو مهني", "مرونة"],
            "is_active": True,
        },
        {
            "title": "أخصائي تسويق رقمي",
            "department": "التسويق",
            "location": "عن بعد",
            "employment_type": "full_time",
            "description": "إدارة الحملات الرقمية وتحسين الأداء ورفع العائد على الإنفاق.",
            "requirements": ["خبرة Google Ads", "Meta Ads", "تحليل البيانات", "تقارير أداء"],
            "benefits": ["مكافآت أداء", "مرونة"],
            "is_active": True,
        },
        {
            "title": "كاتب/ة محتوى رقمي",
            "department": "المحتوى",
            "location": "عن بعد",
            "employment_type": "part_time",
            "description": "كتابة محتوى موجه للأعمال يرفع التحويل ويعكس هوية العلامة.",
            "requirements": ["مهارات كتابة قوية", "خبرة محتوى تسويقي", "بحث وتحليل", "لغة عربية سليمة"],
            "benefits": ["عمل مرن", "إمكانية التوسع"],
            "is_active": True,
        },
    ]

    for job in jobs:
        JobOpening.objects.update_or_create(title=job["title"], defaults=job)


def unseed_additional_jobs(apps, schema_editor):
    JobOpening = apps.get_model("careers", "JobOpening")
    titles = [
        "مهندس واجهات أمامية (React/Next.js)",
        "مهندس باك إند (Django/Node)",
        "مطوّر تطبيقات جوال (React Native)",
        "مصمم UI/UX",
        "مهندس ضمان جودة (QA)",
        "مدير مشروع تقني",
        "أخصائي تسويق رقمي",
        "كاتب/ة محتوى رقمي",
    ]
    JobOpening.objects.filter(title__in=titles).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("careers", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_additional_jobs, reverse_code=unseed_additional_jobs),
    ]
