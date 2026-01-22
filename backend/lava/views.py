from django.http import HttpResponse
from django.urls import reverse
from django.utils import timezone

from apps.core.models import Page
from apps.blog.models import BlogPost


def robots_txt(request):
    lines = [
        "User-Agent: *",
        "Allow: /",
        f"Sitemap: {request.build_absolute_uri(reverse('sitemap'))}",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")


def sitemap_xml(request):
    urls = [
        {"loc": request.build_absolute_uri("/"), "lastmod": timezone.now()},
        {"loc": request.build_absolute_uri("/about"), "lastmod": timezone.now()},
        {"loc": request.build_absolute_uri("/services"), "lastmod": timezone.now()},
        {"loc": request.build_absolute_uri("/portfolio"), "lastmod": timezone.now()},
        {"loc": request.build_absolute_uri("/blog"), "lastmod": timezone.now()},
        {"loc": request.build_absolute_uri("/careers"), "lastmod": timezone.now()},
        {"loc": request.build_absolute_uri("/contact"), "lastmod": timezone.now()},
    ]
    for page in Page.objects.filter(status="published"):
        urls.append(
            {
                "loc": request.build_absolute_uri(f"/{page.slug}"),
                "lastmod": page.updated_at or page.created_at,
            }
        )
    for post in BlogPost.objects.filter(is_published=True):
        urls.append(
            {
                "loc": request.build_absolute_uri(f"/blog/{post.slug}"),
                "lastmod": post.published_at or post.updated_at or post.created_at,
            }
        )
    body = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url in urls:
        lastmod = (url["lastmod"] or timezone.now()).strftime("%Y-%m-%d")
        body.append(f"<url><loc>{url['loc']}</loc><lastmod>{lastmod}</lastmod></url>")
    body.append("</urlset>")
    return HttpResponse("\n".join(body), content_type="application/xml")


def healthz(_request):
    return HttpResponse("ok", content_type="text/plain")
