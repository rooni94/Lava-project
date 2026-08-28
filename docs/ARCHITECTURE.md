# Lava Architecture

This document describes the architecture present in the source code. It is intentionally limited to application behavior and safe local/container topology; it does not document production credentials, private hosts, certificates, or customer data.

## Runtime components

~~~mermaid
flowchart LR
    Browser --> React[React/Vite SPA]
    React --> Nginx[Frontend Nginx]
    Nginx --> HTTP[Django HTTP / DRF]
    Nginx --> Socket[Django Channels / WebSocket]
    HTTP --> ORM[Django ORM]
    ORM --> DB[(PostgreSQL or SQLite)]
    HTTP --> Cache[Redis, Memcached, or local memory]
    Socket --> Channel[Redis or in-memory channel layer]
    HTTP --> Storage[Local media or optional S3]
    Celery[Celery worker and beat] --> Broker[Redis broker/result backend]
    Broker --> DB
~~~

## Frontend

The frontend is a Vite-built React SPA. App.tsx declares public and dashboard routes. Public pages use PageGuard to check page visibility from the API. Shared layout components render navigation, footer, the support widget, theme loading, and route-level scrolling. TanStack Query handles server state and cache invalidation after dashboard mutations. i18next and react-i18next provide bilingual copy and direction-aware presentation.

Dashboard pages share a layout and use the API endpoint module for CRUD operations. Media workflows include a picker, crop modal, upload handling, lightbox support, and media URL resolution. The frontend also includes a rich editor, skeleton states, toast feedback, and an error boundary.

## Backend

The Django project is in backend/lava/. urls.py combines router-registered viewsets with explicit API views. asgi.py routes HTTP to Django and WebSocket traffic to the support routing table through JWT-aware middleware. wsgi.py provides the conventional WSGI entry point.

Domain apps are separated by responsibility:

- core owns site settings, pages, sections, contact data, submissions, media, activity logging, throttling, and shared utilities.
- accounts owns the custom user model, roles, JWT login, password flows, and user APIs.
- services, packages, and portfolio own catalogue and portfolio content.
- blog, clients, team, and careers own editorial, social-proof, people, and recruitment domains.
- support owns conversations, guest verification, support messages, staff activity, automation, and realtime consumers.
- dashboard exposes aggregate statistics and upload APIs used by the dashboard.

## Request flow

1. The browser loads the Vite-built SPA from Nginx.
2. React Query calls the Axios client for public or authenticated API resources.
3. Nginx proxies /api/ to Django HTTP and /ws/ to the ASGI WebSocket endpoint.
4. DRF authenticates JWT requests and applies public-read or role-aware permissions.
5. Viewsets validate serializer input, call the Django ORM, and activity logging records dashboard mutations where the mixin is used.
6. Email notifications, scheduled publication, cache access, and WebSocket broadcasts use the configured services when enabled.

## Authentication and authorization

The API uses Simple JWT access and refresh tokens. accounts.User adds the roles super_admin, manager, editor, and viewer. RolePermission centralizes write authorization while individual views override permissions for public submissions, authenticated reads, and support-agent operations. Password reset uses Django's token generator and email utilities.

## Data and storage

The repository contains migrations and source-controlled public/static assets, not a database. PostgreSQL is selected when DATABASE_URL is configured; otherwise Django uses an ignored SQLite file for development. Media files are stored through Django's storage abstraction. The source includes image validation, resizing, WebP output, and optional text/logo watermarking. S3-compatible storage is selected only when USE_S3=True and its credentials are supplied through the environment.

## Cache, Celery, and realtime

Redis can back Django cache, Channels, and Celery. If Redis is not configured, the settings provide local-memory cache and an in-memory Channels layer for development. Celery discovers tasks from the installed apps and schedules publication checks for blog posts and portfolio projects. Channels consumers broadcast support messages to conversation groups and persist message/read/activity state through Django models.

## Docker and deployment topology

The development Compose file contains PostgreSQL, Redis, a Daphne-backed backend, and a frontend Nginx container. The frontend Nginx configuration proxies API, media, static, and WebSocket paths to the backend service so the browser can use same-origin paths.

The production-oriented Compose file adds a reverse-proxy Nginx service, certificate-volume wiring, and a Certbot service. Its paths are relative and its database/password values are supplied through environment interpolation. deploy/nginx/conf.d/default.conf is an HTTP sample for evaluation; TLS certificates and production-specific server configuration remain operator-managed and are not part of this repository.

## Security boundary

The showcase repository intentionally has no .env file, production database, dump, Redis snapshot, backup, private key, private upload, or private infrastructure credential. Local secrets must be generated or supplied outside Git. Migrations are schema/source code and should not be confused with production data.

