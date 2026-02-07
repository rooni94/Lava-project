from __future__ import annotations

from django.db import migrations


def seed_package_translations(apps, schema_editor):
    Package = apps.get_model("packages", "Package")

    updates = {
        "react-landing-mvp": {
            "title_en": (["MVP \u2013 Custom site", "MVP - Custom site"], "MVP - Custom Site"),
            "short_description_en": ("Single landing page, React + Tailwind, high performance.", "Single landing page, React + Tailwind, high performance."),
            "description_en": (
                "React + Tailwind\nHigh performance\nGreat for validating a product idea",
                "React + Tailwind\nHigh performance\nIdeal for validating a product idea",
            ),
            "price_note_en": ("", "From SAR 4,000"),
        },
        "react-company": {
            "title_en": ("Company site", "Company site"),
            "short_description_en": ("Multi-page site + API + light CMS.", "Multi-page site + API + light CMS."),
            "description_en": (
                "Multi-page React site with API\nLight admin panel\nTechnical SEO in place",
                "Multi-page React site + API\nLight admin panel\nTechnical SEO setup",
            ),
            "price_note_en": ("", "From SAR 8,000"),
        },
        "react-full-system": {
            "title_en": ("Full system", "Full system"),
            "short_description_en": ("React frontend + custom backend, auth & roles.", "React frontend + custom backend, auth & roles."),
            "description_en": (
                "React frontend + custom backend\nUsers & roles\nPro dashboard\nScalable foundation",
                "React frontend + custom backend\nUser accounts & roles\nProfessional dashboard\nScalable foundation",
            ),
            "price_note_en": ("", "From SAR 15,000"),
        },
        "rn-mvp": {
            "title_en": (["MVP \u2013 Mobile app", "MVP - Mobile app"], "MVP - Mobile app"),
            "short_description_en": ("Android or iOS app, core screens, API hookup.", "Android or iOS app, core screens, API integration."),
            "description_en": (
                "Android or iOS\nCore screens\nAPI integration\nSimple UI",
                "Android or iOS app\nCore screens\nAPI integration\nSimple UI",
            ),
            "price_note_en": ("", "From SAR 8,000"),
        },
        "rn-pro": {
            "title_en": ("Pro mobile", "Pro mobile"),
            "short_description_en": ("Android + iOS, auth, push, high performance.", "Android + iOS, auth, push, high performance."),
            "description_en": (
                "Android + iOS\nAuthentication\nPush notifications\nHigh performance",
                "Android + iOS\nAuthentication system\nPush notifications\nHigh performance",
            ),
            "price_note_en": ("", "From SAR 15,000"),
        },
        "rn-startup": {
            "title_en": ("Startup bundle", "Startup bundle"),
            "short_description_en": ("Full UI/UX + backend + admin + store deployment.", "Full UI/UX + backend + admin + store deployment."),
            "description_en": (
                "Full UI/UX design\nIntegrated backend\nAdmin dashboard\nApp store publishing",
                "Full UI/UX design\nIntegrated backend\nAdmin dashboard\nApp store publishing",
            ),
            "price_note_en": ("", "From SAR 25,000"),
        },
        "wp-starter": {
            "title_en": ("Starter WordPress", "Starter WordPress"),
            "short_description_en": ("Up to 5-page corporate site, responsive, SEO basics.", "Up to 5-page corporate site, responsive, SEO basics."),
            "description_en": (
                "For small businesses:\nUp to 5 pages\nPro template\nResponsive\nEasy admin\nSEO basics",
                "For small businesses:\nUp to 5 pages\nProfessional template\nMobile responsive\nEasy admin\nSEO basics",
            ),
            "price_note_en": ("", "SAR 1,500-2,000"),
        },
        "wp-business": {
            "title_en": ("Business WordPress", "Business WordPress"),
            "short_description_en": ("Up to 10 pages, custom design, security & backup.", "Up to 10 pages, custom design, security & backups."),
            "description_en": (
                "For SMEs:\nUp to 10 pages\nCustom design + performance\nSecurity & backups\nAdvanced SEO\nArabic/English",
                "For SMEs:\nUp to 10 pages\nCustom design + performance\nSecurity & backups\nAdvanced SEO\nArabic/English",
            ),
            "price_note_en": ("", "SAR 3,500-5,000"),
        },
        "wp-pro": {
            "title_en": ("Pro WordPress", "Pro WordPress"),
            "short_description_en": ("Custom UI/UX, unlimited pages, integrations, training.", "Custom UI/UX, unlimited pages, integrations, training."),
            "description_en": (
                "For advanced teams:\nFully custom UI/UX\nUnlimited pages\nCustom admin\nHigh security\nIntegrations",
                "For advanced teams:\nFully custom UI/UX\nUnlimited pages\nCustom admin\nHigh security\nThird-party integrations",
            ),
            "price_note_en": ("", "From SAR 7,000"),
        },
        "ignite-marketing": {
            "title_en": ("Ignite Package", "Ignite Package"),
            "short_description_en": ("For startups and individuals to establish a solid digital presence.", "For startups and individuals to establish a solid digital presence."),
            "description_en": (
                "Basic content strategy\n8 posts + 8 designs / month\nManage 1 social platform\nVisual identity polish\nMonthly performance summary",
                "Basic content strategy\n8 posts + 8 designs per month\nManage 1 social platform\nVisual identity polish\nMonthly performance summary",
            ),
            "price_note_en": ("", "USD 1,500"),
        },
        "growth-marketing": {
            "title_en": ("Growth Package", "Growth Package"),
            "short_description_en": ("For SMBs to boost engagement and build audience.", "For SMBs to boost engagement and build audience."),
            "description_en": (
                "Monthly marketing strategy\n12 posts + 12 designs\nManage 2 platforms\n1 short video/motion monthly\nAd management (budget excluded)\nMonthly report & insights",
                "Monthly marketing strategy\n12 posts + 12 designs\nManage 2 platforms\n1 short video/motion monthly\nAd management (budget excluded)\nMonthly report & insights",
            ),
            "price_note_en": ("", "USD 3,000"),
        },
        "impact-marketing": {
            "title_en": ("Impact Package", "Impact Package"),
            "short_description_en": ("For scaling brands to strengthen presence and conversions.", "For scaling brands to strengthen presence and conversions."),
            "description_en": (
                "Advanced strategy\nFull content & advanced design\nManage 3 platforms\n2 motion videos monthly\nAd optimization\nLanding page development\nDetailed reports + continuous improvements",
                "Advanced strategy\nFull content & advanced design\nManage 3 platforms\n2 motion videos monthly\nAd optimization\nLanding page development\nDetailed reports + continuous improvements",
            ),
            "price_note_en": ("", "USD 5,500"),
        },
        "authority-marketing": {
            "title_en": ("Authority Package", "Authority Package"),
            "short_description_en": ("For enterprises to lead the market with strong digital authority.", "For enterprises to lead the market with strong digital authority."),
            "description_en": (
                "Full marketing management\nDedicated project team\nHigh-volume content & design\nPro video production\nAll-platform management\nMulti-channel campaigns\nCustom website/system\nStrategic reports + regular meetings",
                "Full marketing management\nDedicated project team\nHigh-volume content & design\nPro video production\nAll-platform management\nMulti-channel campaigns\nCustom website/system\nStrategic reports + regular meetings",
            ),
            "price_note_en": ("", "USD 9,000"),
        },
        "smart-custom-marketing": {
            "title_en": ("Smart Custom Package", "Smart Custom Package"),
            "short_description_en": ("Tailored to your business, goals, market, and budget.", "Tailored to your business, goals, market, and budget."),
            "description_en": (
                "Assess your business, goals, and market size\nDesign a bespoke mix of content, design, ads, and tech\nFull flexibility on scope and scale",
                "Assess your business, goals, and market size\nDesign a bespoke mix of content, design, ads, and tech\nFull flexibility on scope and scale",
            ),
            "price_note_en": ("", "Custom"),
        },
    }

    for slug, fields in updates.items():
        pkg = Package.objects.filter(slug=slug).first()
        if not pkg:
            continue
        update_fields = []
        for field, (old_value, new_value) in fields.items():
            current = getattr(pkg, field, "")
            match_old = current == old_value
            if isinstance(old_value, (list, tuple, set)):
                match_old = current in old_value
            if current in ("", None) or match_old:
                setattr(pkg, field, new_value)
                update_fields.append(field)
        if update_fields:
            pkg.save(update_fields=update_fields)


class Migration(migrations.Migration):
    dependencies = [
        ("packages", "0004_add_price_note_en"),
    ]

    operations = [
        migrations.RunPython(seed_package_translations, reverse_code=migrations.RunPython.noop),
    ]
