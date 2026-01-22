from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.blog.models import BlogCategory, BlogPost
from apps.careers.models import JobOpening
from apps.clients.models import Client, Testimonial
from apps.core.models import ContactInfo, Page, Section, SiteSettings
from apps.portfolio.models import Project, Technology
from apps.services.models import Service, ServiceCategory
from apps.team.models import TeamMember


class Command(BaseCommand):
    help = "Seeds Arabic demo content for settings, pages/sections, services, projects, blog, team, clients, jobs."

    def handle(self, *args, **options):
        self.seed_admin_user()
        self.seed_site_settings()
        self.seed_contact()
        self.seed_pages()
        self.seed_services()
        self.seed_projects()
        self.seed_blog()
        self.seed_team()
        self.seed_clients()
        self.seed_jobs()
        self.stdout.write(self.style.SUCCESS("Seed content created successfully."))

    def seed_admin_user(self) -> None:
        User = get_user_model()
        admin_username = "admin"
        admin_email = "admin@lava.local"
        admin_password = None
        user, created = User.objects.get_or_create(
            username=admin_username,
            defaults={"email": admin_email, "role": User.Role.SUPER_ADMIN},
        )
        if created or not user.check_password(admin_password):
            user.set_password(admin_password)
            user.role = User.Role.SUPER_ADMIN
            user.is_staff = True
            user.is_superuser = True
            user.save()

    # ---------------- core ---------------- #
    def seed_site_settings(self) -> None:
        SiteSettings.objects.update_or_create(
            pk=1,
            defaults={
                "site_name": "LAVA",
                "tagline": "التقدم اللامحدود عبر الإبداع التقني",
                "hero_title": "التقدم اللامحدود عبر الإبداع التقني",
                "hero_subtitle": "نرى التحديات التقنية كفرص للإبداع، ونحوّل عملك إلى قصة نجاح رقمية.",
                "seo_title": "LAVA | الحلول البرمجية والتحول الرقمي",
                "meta_description": "حلول برمجية عربية بمعايير عالمية: تطبيقات ويب وموبايل، أنظمة مؤسسية، وأمن سيبراني.",
            },
        )

    def seed_contact(self) -> None:
        ContactInfo.objects.update_or_create(
            pk=1,
            defaults={
                "location": "الرياض، حي العليا، شارع الملك فهد، برج LAVA، الطابق 12",
                "phone": "+966 11 123 4567",
                "email": "info@lava-tech.sa",
                "working_hours": "الأحد - الخميس: 8:00 ص - 6:00 م",
            },
        )

    # ---------------- pages / sections ---------------- #
    def seed_pages(self) -> None:
        pages = [
            {
                "name": "الرئيسية",
                "slug": "home",
                "title": "التقدم اللامحدود عبر الإبداع التقني",
                "sections": [
                    {
                        "title": "قسم البطل",
                        "content": "نحن في LAVA نرى التحديات التقنية كفرص للإبداع، نقدم حلول برمجية ذكية تحوّل عملك إلى قصة نجاح رقمية.",
                        "section_type": "hero",
                        "extra": {
                            "primary_cta": "ابدأ رحلتك التقنية",
                            "secondary_cta": "شاهد مشاريعنا",
                            "stats": [
                                "50+ مشروعاً ناجحاً",
                                "30+ عميلاً راضياً",
                                "5+ سنوات خبرة",
                                "98% رضا عملاء",
                            ],
                        },
                        "order": 1,
                    },
                    {
                        "title": "لماذا تختار LAVA؟",
                        "content": "نوظِّف فن الإبداع في صياغة حلول تقنية تواكب المستقبل. ندمج بين الجمال البصري والكفاءة التقنية لإنشاء منتجات تنمو مع نمو أعمالك.",
                        "section_type": "about-blurb",
                        "order": 2,
                    },
                    {
                        "title": "خدمات سريعة",
                        "content": "تطوير تطبيقات مخصصة | الاستشارات التقنية | حلول المؤسسات المتكاملة",
                        "section_type": "services-quick",
                        "order": 3,
                    },
                    {
                        "title": "أقوال العملاء",
                        "content": "LAVA حوّلت فكرتنا البسيطة إلى تطبيق يحقق مبيعات شهرية تتجاوز 100 ألف ريال — أحمد السليم، متجرك الإلكتروني\nفريق احترافي يفهم احتياجات العمل التقنية ويقدم الحلول في الوقت المحدد — سارة الفهد، تعليم بلا حدود",
                        "section_type": "testimonials",
                        "order": 4,
                    },
                ],
            },
            {
                "name": "من نحن",
                "slug": "about",
                "title": "من الإبداع الفني إلى التميز التقني",
                "sections": [
                    {
                        "title": "مقدمة",
                        "content": "LAVA ليست مجرد شركة برمجيات، بل ورشة إبداعية تقنية تأسست عام 2019 بخلفية فنية ورؤية طموحة.",
                        "order": 1,
                    },
                    {"title": "رؤيتنا", "content": "أن نكون الشريك التقني المفضل للشركات الطموحة في الشرق الأوسط.", "order": 2},
                    {
                        "title": "رسالتنا",
                        "content": "تمكين الشركات عبر حلول برمجية ذكية تجمع الإبداع في التصميم والدقة في الأداء.",
                        "order": 3,
                    },
                    {
                        "title": "قيمنا",
                        "content": "الإبداع في الحلول | الدقة في التنفيذ | الشفافية في التعامل | التطور المستمر",
                        "order": 4,
                    },
                ],
            },
            {
                "name": "الخدمات",
                "slug": "services",
                "title": "حلول تقنية تواكب أحلامك",
                "sections": [
                    {
                        "title": "خدمات رئيسية",
                        "content": "1) تطوير تطبيقات الويب المتقدمة\n2) تطوير تطبيقات الجوال\n3) حلول المؤسسات ERP & CRM\n4) الاستشارات التقنية\n5) الأمن السيبراني\n6) الذكاء الاصطناعي وتحليل البيانات\n7) التعهيد التقني",
                        "order": 1,
                    },
                    {
                        "title": "عملية العمل",
                        "content": "الاستماع → التخطيط → التصميم → التطوير → الاختبار → التسليم → الدعم",
                        "order": 2,
                    },
                ],
            },
            {
                "name": "الأعمال",
                "slug": "portfolio",
                "title": "قصص نجاح رقمية نفتخر بها",
                "sections": [
                    {
                        "title": "مشاريع مميزة",
                        "content": (
                            "معرفة (تعليم): LMS يدعم 50,000 طالب، 98% رضا\n"
                            "سريع (توصيل): تحسين مسارات، نمو 40%\n"
                            "صحتك (صحة): أتمتة مواعيد وسجلات، تقليل الانتظار 60%\n"
                            "موضة (تجارة إلكترونية): واقع معزز، زيادة التحويلات 150%"
                        ),
                        "order": 1,
                    }
                ],
            },
            {
                "name": "المدونة",
                "slug": "blog",
                "title": "أحدث المقالات",
                "sections": [
                    {
                        "title": "مستقبل الذكاء الاصطناعي في الأعمال العربية",
                        "content": "15 مارس 2024 — قراءة 5 دقائق — تقنية",
                        "order": 1,
                    },
                    {
                        "title": "7 نصائح لأمن المعلومات في الشركات الناشئة",
                        "content": "10 مارس 2024 — قراءة 4 دقائق — أمن معلومات",
                        "order": 2,
                    },
                    {
                        "title": "بين React و Vue: أيهما تختار لمشروعك القادم؟",
                        "content": "5 مارس 2024 — قراءة 7 دقائق — تطوير ويب",
                        "order": 3,
                    },
                ],
            },
            {
                "name": "اتصل بنا",
                "slug": "contact",
                "title": "اتصل بنا",
                "sections": [
                    {
                        "title": "معلومات الاتصال",
                        "content": "العنوان: الرياض، برج LAVA، الطابق 12\nالهاتف: +966 11 123 4567\nالبريد: info@lava-tech.sa\nساعات العمل: الأحد - الخميس: 8:00 ص - 6:00 م",
                        "order": 1,
                    },
                ],
            },
            {
                "name": "الوظائف",
                "slug": "careers",
                "title": "انضم إلى فريق LAVA",
                "sections": [
                    {
                        "title": "الثقافة المؤسسية",
                        "content": "بيئة عمل إبداعية | تدريب وتطوير | مرونة في الساعات | مشاريع متنوعة | فريق شاب",
                        "order": 1,
                    },
                    {
                        "title": "مبرمج Full-Stack",
                        "content": "مسؤوليات: تطوير واجهات أمامية وخلفية، كود نظيف، تصميم الحلول، Agile.\nمتطلبات: 3+ سنوات React/Node، قواعد بيانات، إنجليزي جيد، شهادة حاسب.",
                        "order": 2,
                    },
                    {
                        "title": "مصمم UI/UX",
                        "content": "مسؤوليات: تصميم واجهات، نماذج أولية، اختبارات سهولة الاستخدام، تعاون مع التطوير.\nمتطلبات: محفظة قوية، Figma/Adobe XD، فهم UX، عمل ضمن فريق.",
                        "order": 3,
                    },
                ],
            },
            {
                "name": "خدمة تفصيلية",
                "slug": "web-apps",
                "title": "تطوير تطبيقات ويب احترافية تنمو مع عملك",
                "sections": [
                    {
                        "title": "كيف نعمل",
                        "content": "اكتشاف عميق → استراتيجية التصميم → التطوير الدقيق → الاختبار الشامل → الإطلاق والتدريب → الدعم المستمر",
                        "order": 1,
                    },
                    {
                        "title": "التقنيات",
                        "content": "React, Vue, Angular, TypeScript, Django, Node.js, .NET Core, PostgreSQL, MongoDB, AWS, Docker, GraphQL",
                        "order": 2,
                    },
                    {
                        "title": "دراسة حالة: تعلم بسهولة",
                        "content": "تحسن سرعة التحميل 300%، قدرة 10,000 مستخدم متزامن، تقليل التكاليف 40%",
                        "order": 3,
                    },
                ],
            },
        ]

        for page_data in pages:
            page, _ = Page.objects.update_or_create(
                slug=page_data["slug"],
                defaults={
                    "name": page_data["name"],
                    "title": page_data["title"],
                    "meta_description": page_data.get("title", ""),
                    "status": "published",
                },
            )
            for sec in page_data["sections"]:
                Section.objects.update_or_create(
                    page=page,
                    title=sec["title"],
                    defaults={
                        "content": sec["content"],
                        "order": sec.get("order", 0),
                        "section_type": sec.get("section_type", ""),
                        "extra": sec.get("extra", {}),
                    },
                )

    # ---------------- services ---------------- #
    def seed_services(self) -> None:
        cat, _ = ServiceCategory.objects.get_or_create(slug="default", defaults={"name": "الخدمات", "description": ""})
        services = [
            {
                "title": "تطوير تطبيقات الويب المتقدمة",
                "description": "تطبيقات سريعة وآمنة وقابلة للتوسع باستخدام React وDjango.",
                "features": ["SPA", "واجهات تفاعلية", "تكامل دفع", "تحسين الأداء"],
                "order": 1,
            },
            {
                "title": "تطوير تطبيقات الجوال",
                "description": "تطبيقات iOS وAndroid باستخدام React Native وFlutter.",
                "features": ["هجينة وأصلية", "تجربة مستخدم مخصصة", "نشر على المتاجر", "صيانة مستمرة"],
                "order": 2,
            },
            {
                "title": "حلول المؤسسات ERP/CRM",
                "description": "أنظمة متكاملة لإدارة الموارد والعملاء.",
                "features": ["تقارير ولوحات تحكم", "تكامل مع الأنظمة الحالية"],
                "order": 3,
            },
            {
                "title": "الاستشارات التقنية",
                "description": "دراسة جدوى تقنية وتخطيط البنية التحتية واتخاذ قرارات تقنية صحيحة.",
                "features": ["تحليل الاحتياجات", "توصيات تطويرية", "مراجعة الأنظمة الحالية"],
                "order": 4,
            },
            {
                "title": "الأمن السيبراني",
                "description": "حماية التطبيقات والبيانات مع خطط استجابة للحوادث.",
                "features": ["تقييم الثغرات", "مراقبة مستمرة", "تدريب الفرق"],
                "order": 5,
            },
            {
                "title": "الذكاء الاصطناعي وتحليل البيانات",
                "description": "نماذج تنبؤية، روبوتات محادثة، ولوحات تحكم تفاعلية.",
                "features": ["تحليل بيانات ضخمة", "نماذج تنبؤية", "لوحات تفاعلية"],
                "order": 6,
            },
            {
                "title": "التعهيد التقني",
                "description": "توفير فريق تقني يعمل كجزء من فريقك بمرونة عالية.",
                "features": ["مبرمجون متخصصون", "إدارة مشاريع", "مرونة تعاقدية"],
                "order": 7,
            },
        ]
        for svc in services:
            Service.objects.update_or_create(
                title=svc["title"],
                defaults={**svc, "category": cat, "is_active": True},
            )

    # ---------------- projects ---------------- #
    def seed_projects(self) -> None:
        tech_names = ["React", "Django", "PostgreSQL", "React Native", "Node.js"]
        tech_objs = []
        for name in tech_names:
            obj, _ = Technology.objects.get_or_create(slug=name.lower().replace(" ", "-"), defaults={"name": name})
            tech_objs.append(obj)

        projects = [
            {
                "title": "منصة التعليم الإلكتروني معرفة",
                "description": "LMS يدعم 50,000 طالب مع فصول افتراضية.",
                "category": "web",
                "client": "معرفة",
                "is_featured": True,
                "status": "done",
            },
            {
                "title": "تطبيق توصيل سريع",
                "description": "تحسين مسارات التوصيل ونمو المبيعات 40%.",
                "category": "mobile",
                "client": "سريع",
                "is_featured": True,
                "status": "done",
            },
        ]
        for proj in projects:
            p, _ = Project.objects.update_or_create(
                title=proj["title"],
                defaults=proj,
            )
            p.technologies.set(tech_objs)

    # ---------------- blog ---------------- #
    def seed_blog(self) -> None:
        User = get_user_model()
        author, _ = User.objects.get_or_create(username="seed", defaults={"email": "seed@lava.local"})
        categories = [
            ("تقنية", "tech"),
            ("أمن معلومات", "security"),
            ("تطوير ويب", "web-dev"),
        ]
        cat_objs = {}
        for name, slug in categories:
            obj, _ = BlogCategory.objects.get_or_create(slug=slug, defaults={"name": name})
            cat_objs[slug] = obj

        posts = [
            {
                "title": "مستقبل الذكاء الاصطناعي في الأعمال العربية",
                "slug": "ai-future-arabic-business",
                "excerpt": "كيف يمكن للشركات العربية الاستفادة من الذكاء الاصطناعي لتعزيز نموها؟",
                "content": "مقال تمهيدي حول الفرص والتحديات في الذكاء الاصطناعي.",
                "category": cat_objs["tech"],
            },
            {
                "title": "7 نصائح لأمن المعلومات في الشركات الناشئة",
                "slug": "security-tips-startups",
                "excerpt": "خطوات بسيطة لكنها فعالة لحماية البيانات.",
                "content": "قائمة مختصرة لتأمين الأنظمة والتطبيقات.",
                "category": cat_objs["security"],
            },
        ]
        for post in posts:
            BlogPost.objects.update_or_create(
                slug=post["slug"],
                defaults={**post, "author": author, "is_published": True},
            )

    # ---------------- team ---------------- #
    def seed_team(self) -> None:
        members = [
            {"name": "أحمد الراشد", "position": "مدير التقنية", "bio": "يقود فرق التطوير ويضمن جودة التنفيذ."},
            {"name": "سارة البدر", "position": "قائدة تجربة المستخدم", "bio": "تصمم تجارب عربية متقنة."},
            {"name": "فهد المطيري", "position": "مهندس برمجيات أول", "bio": "متخصص في الأنظمة المؤسسية والتكاملات."},
        ]
        for m in members:
            TeamMember.objects.update_or_create(name=m["name"], defaults=m)

    # ---------------- clients ---------------- #
    def seed_clients(self) -> None:
        clients = [
            {"name": "متجرك الإلكتروني", "rating": 5, "category": "تجارة إلكترونية"},
            {"name": "تعليم بلا حدود", "rating": 5, "category": "تعليم"},
        ]
        for c in clients:
            Client.objects.update_or_create(name=c["name"], defaults=c)
        c1 = Client.objects.filter(name="متجرك الإلكتروني").first()
        if c1:
            Testimonial.objects.update_or_create(
                client=c1,
                author="أحمد السليم",
                defaults={
                    "quote": "LAVA حوّلت فكرتنا البسيطة إلى تطبيق يحقق مبيعات شهرية تتجاوز 100 ألف ريال.",
                    "position": "مدير تطوير الأعمال",
                },
            )

    # ---------------- jobs ---------------- #
    def seed_jobs(self) -> None:
        jobs = [
            {
                "title": "مبرمج Full-Stack",
                "department": "التطوير",
                "location": "عن بُعد",
                "employment_type": "full_time",
                "description": "تطوير واجهات أمامية وخلفية والمشاركة في تصميم الحلول.",
                "requirements": ["React", "Node.js", "PostgreSQL"],
                "benefits": ["مرونة عمل", "تأمين طبي"],
            },
            {
                "title": "مصمم UI/UX",
                "department": "التصميم",
                "location": "الرياض",
                "employment_type": "part_time",
                "description": "تصميم واجهات وتجارب مستخدم عربية عالية الجودة.",
                "requirements": ["Figma", "Adobe XD", "اختبارات قابلية الاستخدام"],
                "benefits": ["بيئة إبداعية", "مشاريع متنوعة"],
            },
        ]
        for job in jobs:
            JobOpening.objects.update_or_create(title=job["title"], defaults=job)
