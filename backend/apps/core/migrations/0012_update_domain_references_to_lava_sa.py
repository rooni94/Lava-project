from django.db import migrations


OLD_EMAIL_DOMAINS = {"itlava.com", "www.itlava.com", "lava.com.sa", "www.lava.com.sa", "lava-tech.sa"}
TEXT_REPLACEMENTS = [
    ("https://www.itlava.com", "https://www.lava.sa"),
    ("https://itlava.com", "https://lava.sa"),
    ("http://www.itlava.com", "https://www.lava.sa"),
    ("http://itlava.com", "https://lava.sa"),
    ("www.itlava.com", "www.lava.sa"),
    ("itlava.com", "lava.sa"),
    ("www.lava.com.sa", "www.lava.sa"),
    ("lava.com.sa", "lava.sa"),
    ("lava-tech.sa", "lava.sa"),
]


def _replace_domain_text(value: str) -> str:
    updated = value
    for old, new in TEXT_REPLACEMENTS:
        updated = updated.replace(old, new)
    return updated


def _normalize_email(value: str) -> str:
    if "@" not in value:
        return _replace_domain_text(value)
    local, domain = value.split("@", 1)
    if domain.lower() in OLD_EMAIL_DOMAINS:
        return f"{local}@lava.sa"
    return _replace_domain_text(value)


def _replace_in_json(value):
    if isinstance(value, dict):
        changed = {}
        for key, item in value.items():
            changed[key] = _replace_in_json(item)
        return changed
    if isinstance(value, list):
        return [_replace_in_json(item) for item in value]
    if isinstance(value, str):
        return _replace_domain_text(value)
    return value


def update_domains(apps, schema_editor):
    SiteSettings = apps.get_model("core", "SiteSettings")
    ContactInfo = apps.get_model("core", "ContactInfo")
    Section = apps.get_model("core", "Section")

    for settings in SiteSettings.objects.all():
        updates = {}
        if getattr(settings, "email", ""):
            normalized = _normalize_email(settings.email)
            if normalized != settings.email:
                updates["email"] = normalized
        if updates:
            for key, value in updates.items():
                setattr(settings, key, value)
            settings.save(update_fields=list(updates.keys()))

    for contact in ContactInfo.objects.all():
        updates = {}
        if getattr(contact, "email", ""):
            normalized = _normalize_email(contact.email)
            if normalized != contact.email:
                updates["email"] = normalized
        if updates:
            for key, value in updates.items():
                setattr(contact, key, value)
            contact.save(update_fields=list(updates.keys()))

    for section in Section.objects.all():
        updates = {}
        if getattr(section, "content", ""):
            content = _replace_domain_text(section.content)
            if content != section.content:
                updates["content"] = content

        extra = section.extra or {}
        replaced_extra = _replace_in_json(extra)
        if replaced_extra != extra:
            updates["extra"] = replaced_extra

        if updates:
            for key, value in updates.items():
                setattr(section, key, value)
            section.save(update_fields=list(updates.keys()))


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0011_seed_legal_pages_bilingual"),
    ]

    operations = [
        migrations.RunPython(update_domains, reverse_code=migrations.RunPython.noop),
    ]
