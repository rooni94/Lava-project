from django.db import migrations


PRIVACY_AR = (
    "<p><strong>تاريخ النفاذ:</strong> 22 فبراير 2026</p>"
    "<h2>1. مقدمة</h2>"
    "<p>نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية أثناء استخدام موقع وخدمات LAVA.</p>"
    "<h2>2. البيانات التي نجمعها</h2>"
    "<ul><li>الاسم والبريد الإلكتروني ورقم الهاتف.</li><li>بيانات الاستخدام.</li><li>البيانات التقنية المرتبطة بالجهاز والمتصفح.</li></ul>"
    "<h2>3. استخدام البيانات</h2>"
    "<ul><li>تنفيذ الطلبات والرد على الاستفسارات.</li><li>تحسين جودة الخدمة.</li><li>إرسال تحديثات تشغيلية مرتبطة بطلبك.</li></ul>"
    "<h2>4. مشاركة البيانات</h2>"
    "<p>لا نبيع بياناتك. قد تتم مشاركة بيانات محدودة عند الضرورة التشغيلية أو الالتزام النظامي.</p>"
    "<h2>5. التواصل</h2><p>privacy@lava.sa</p>"
)

PRIVACY_EN = (
    "<p><strong>Effective date:</strong> February 22, 2026</p>"
    "<h2>1. Introduction</h2>"
    "<p>We respect your privacy and are committed to protecting personal data.</p>"
    "<h2>2. Data we collect</h2>"
    "<ul><li>Name, email address, and phone number.</li><li>Usage data.</li><li>Technical device and browser data.</li></ul>"
    "<h2>3. How we use data</h2>"
    "<ul><li>Deliver requested services and respond to inquiries.</li><li>Improve service quality.</li><li>Send operational updates.</li></ul>"
    "<h2>4. Data sharing</h2>"
    "<p>We do not sell personal data. Limited sharing may happen when operationally or legally required.</p>"
    "<h2>5. Contact</h2><p>privacy@lava.sa</p>"
)

TERMS_AR = (
    "<p><strong>تاريخ النفاذ:</strong> 22 فبراير 2026</p>"
    "<h2>1. القبول</h2><p>باستخدامك موقع LAVA فإنك توافق على هذه الشروط.</p>"
    "<h2>2. استخدام الموقع</h2><ul><li>الاستخدام للأغراض المشروعة فقط.</li><li>يمنع إساءة الاستخدام أو محاولة الاختراق.</li></ul>"
    "<h2>3. الملكية الفكرية</h2><p>جميع المحتويات مملوكة لـ LAVA أو مرخصة لها.</p>"
    "<h2>4. الخدمات والعقود</h2><p>النطاق والمدة والتكلفة النهائية تحدد في العرض أو العقد المعتمد.</p>"
    "<h2>5. التواصل</h2><p>legal@lava.sa</p>"
)

TERMS_EN = (
    "<p><strong>Effective date:</strong> February 22, 2026</p>"
    "<h2>1. Acceptance</h2><p>By using LAVA website, you agree to these terms.</p>"
    "<h2>2. Website use</h2><ul><li>Use is allowed for lawful purposes only.</li><li>Abuse or unauthorized access attempts are prohibited.</li></ul>"
    "<h2>3. Intellectual property</h2><p>All content is owned by or licensed to LAVA.</p>"
    "<h2>4. Services and contracts</h2><p>Final scope, timeline, and pricing are defined in approved proposals and signed agreements.</p>"
    "<h2>5. Contact</h2><p>legal@lava.sa</p>"
)


def seed_legal_pages(apps, schema_editor):
    Page = apps.get_model("core", "Page")
    Section = apps.get_model("core", "Section")

    definitions = [
        {
            "slug": "privacy-policy",
            "name": "سياسة الخصوصية",
            "title": "سياسة الخصوصية",
            "meta": "سياسة الخصوصية لموقع LAVA",
            "section_title": "سياسة الخصوصية",
            "section_title_en": "Privacy Policy",
            "content": PRIVACY_AR,
            "content_en": PRIVACY_EN,
        },
        {
            "slug": "terms-conditions",
            "name": "الشروط والأحكام",
            "title": "الشروط والأحكام",
            "meta": "الشروط والأحكام لموقع LAVA",
            "section_title": "الشروط والأحكام",
            "section_title_en": "Terms and Conditions",
            "content": TERMS_AR,
            "content_en": TERMS_EN,
        },
    ]

    for definition in definitions:
        page, _ = Page.objects.get_or_create(
            slug=definition["slug"],
            defaults={
                "name": definition["name"],
                "title": definition["title"],
                "meta_description": definition["meta"],
                "status": "published",
            },
        )

        updates = {}
        if not getattr(page, "name", ""):
            updates["name"] = definition["name"]
        if not getattr(page, "title", ""):
            updates["title"] = definition["title"]
        if not getattr(page, "meta_description", ""):
            updates["meta_description"] = definition["meta"]
        if updates:
            for key, value in updates.items():
                setattr(page, key, value)
            page.save(update_fields=list(updates.keys()))

        has_any_section = Section.objects.filter(page=page).exclude(content="").exists()
        if has_any_section:
            continue

        Section.objects.create(
            page=page,
            title=definition["section_title"],
            content=definition["content"],
            order=1,
            section_type="legal",
            extra={
                "title_en": definition["section_title_en"],
                "content_en": definition["content_en"],
            },
        )


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0010_sitesettings_hero_title_font_size"),
    ]

    operations = [
        migrations.RunPython(seed_legal_pages, reverse_code=migrations.RunPython.noop),
    ]
