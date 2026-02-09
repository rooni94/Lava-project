from django.db import migrations

HEADER_TITLE_AR = "الهيدر"
FOOTER_TITLE_AR = "شريكك التقني لبناء منتجات موثوقة"
FOOTER_CONTENT_AR = (
    "نبني تطبيقات ويب وجوال، ونصمم واجهات وتجارب مستخدم، مع فريق يجمع بين الاستراتيجية والتقنية."
)
FOOTER_TITLE_EN = "Your product partner for dependable launches"
FOOTER_CONTENT_EN = (
    "We design and ship web and mobile apps, create thoughtful interfaces, and build scalable platforms with a team that blends strategy, design, and engineering."
)

HEADER_EXTRA = {
    "logo_url": "/logo.PNG",
    "logo_alt_ar": "LAVA",
    "logo_alt_en": "LAVA",
    "logo_height": "64",
}

FOOTER_EXTRA = {
    "title_en": FOOTER_TITLE_EN,
    "content_en": FOOTER_CONTENT_EN,
    "links_title_ar": "روابط مهمة",
    "links_title_en": "Useful links",
    "links_items": "الخدمات|Services|/services\nالباقات|Packages|/packages\nالأعمال|Portfolio|/portfolio\nتواصل معنا|Contact|/contact",
    "newsletter_title_ar": "اشترك في النشرة",
    "newsletter_title_en": "Join our newsletter",
    "newsletter_body_ar": "أخبار العروض والإطلاقات الجديدة مباشرة إلى بريدك.",
    "newsletter_body_en": "Product updates, offers, and launches straight to your inbox.",
    "newsletter_placeholder_ar": "بريدك الإلكتروني",
    "newsletter_placeholder_en": "Your email",
    "newsletter_button_ar": "اشترك الآن",
    "newsletter_button_en": "Subscribe",
    "newsletter_success_ar": "تم الاشتراك بنجاح.",
    "newsletter_success_en": "Thanks for subscribing.",
    "payments_title_ar": "طرق الدفع الآمنة",
    "payments_title_en": "Secure payment methods",
}


def seed_header_footer_sections(apps, schema_editor):
    Page = apps.get_model("core", "Page")
    Section = apps.get_model("core", "Section")

    home = Page.objects.filter(slug="home").first()
    if not home:
        return

    has_header = Section.objects.filter(page=home, section_type="header").exists()
    if not has_header:
        Section.objects.create(
            page=home,
            title=HEADER_TITLE_AR,
            content="",
            section_type="header",
            order=0,
            extra=HEADER_EXTRA,
        )

    has_footer = Section.objects.filter(page=home, section_type="footer").exists()
    if not has_footer:
        Section.objects.create(
            page=home,
            title=FOOTER_TITLE_AR,
            content=FOOTER_CONTENT_AR,
            section_type="footer",
            order=99,
            extra=FOOTER_EXTRA,
        )


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0007_seed_default_pages"),
    ]

    operations = [
        migrations.RunPython(seed_header_footer_sections, reverse_code=migrations.RunPython.noop),
    ]
