# Lava

Lava is a bilingual content and portfolio platform for a technology company, implemented as a React/Vite frontend backed by Django REST Framework. This repository is a sanitized showcase copy prepared for portfolio presentation and technical evaluation.

## English

### Overview

Lava combines a public-facing bilingual website with an authenticated dashboard for managing site content, services, portfolio projects, packages, blog posts, team members, clients, careers, media, messages, and support conversations.

### Problem Solved

The project provides one content-management workflow for a bilingual technology website. It brings public content, editorial operations, media handling, contact and career submissions, and support workflows behind a shared API and role-aware dashboard.

### Key Features

- Arabic and English content with RTL-aware frontend behavior.
- Public home, about, services, portfolio, packages, blog, careers, contact, privacy, and terms pages.
- Dashboard CRUD workflows for the main content domains.
- JWT login and refresh, password reset flows, and custom roles.
- Role-aware permissions for super administrators, managers, editors, and viewers.
- Media upload validation, image resizing, WebP processing, and configurable watermarking.
- Contact, subscription, and job application forms, email notifications, and CSV exports.
- Support conversations with guest email verification, staff handover, read states, and WebSocket updates.
- Rule-based support automation with a human-support handover path.
- Scheduled publication tasks for blog posts and portfolio projects.
- Swagger and Redoc API documentation.
- Dashboard-managed theme, typography, SEO, navigation, and page-section settings.

### Architecture

~~~mermaid
flowchart TD
    Browser[Browser] --> Frontend[React + Vite frontend]
    Frontend --> FrontNginx[Frontend Nginx]
    FrontNginx --> API[Django REST API]
    FrontNginx --> WS[Django Channels WebSockets]
    API --> DB[(PostgreSQL or local SQLite)]
    API --> Redis[(Redis: cache, Channels, Celery)]
    API --> Media[Local media or optional S3]
    Worker[Celery tasks] --> Redis
    Worker --> DB
~~~

The production-oriented Compose file adds a reverse-proxy Nginx service and Certbot volume wiring. TLS certificates and production-specific reverse-proxy details are intentionally excluded.

### Technology Stack

Frontend: React, TypeScript, Vite, React Router, TanStack Query, Axios, i18next/react-i18next, Tailwind CSS, Framer Motion, Swiper, React Hook Form, React Quill, and React Easy Crop.

Backend: Django, Django REST Framework, Simple JWT, django-filter, drf-yasg, django-cors-headers, django-ratelimit, Pillow, and Whitenoise.

Database: PostgreSQL through dj-database-url when DATABASE_URL is set; an ignored SQLite file is used as the development fallback.

Cache and asynchronous work: Redis can back Django cache, Channels, and Celery. Memcached and local-memory fallbacks exist for development paths.

Infrastructure and DevOps: Docker Compose, Daphne, Gunicorn, Nginx, Certbot volume wiring in the production Compose file, and GitHub Actions CI.

APIs and integrations: REST resources for content, dashboard operations, authentication, uploads, exports, careers, and support. SMTP email is configurable through environment variables. S3-compatible media storage is optional. No payment-provider backend integration is claimed; payment logos are presentation assets.

### Main Modules

- core: site settings, pages, sections, contact information, messages, subscribers, media, activity logs, throttling, and shared utilities.
- accounts: custom user model, roles, JWT login, password changes/resets, and user administration.
- services, packages, and portfolio: catalogue, pricing packages, services, projects, technologies, project images, and publication state.
- blog: categories, posts, comments, publication scheduling, and editorial actions.
- clients and team: client records, testimonials, and team members.
- careers: job openings and job applications with resume validation.
- support: conversations, guest verification, support messages, staff activity, automation, and WebSocket consumers.
- dashboard: authenticated dashboard statistics and uploads.

### Frontend Architecture

The frontend is a Vite-built React single-page application. App.tsx defines public and dashboard routes, while PageGuard checks page visibility from the API. TanStack Query manages server state, Axios provides the API client, and shared components cover navigation, sections, cards, forms, lightboxes, editor controls, media selection, cropping, loading states, and error boundaries. The i18n layer switches Arabic/English content and direction-aware presentation.

### Backend Architecture

Django exposes REST viewsets and API views through a router and explicit routes. Public content uses read-oriented mixins, while dashboard mutations use role-aware permissions and activity logging. The ASGI entry point combines Django HTTP handling with Channels WebSockets and JWT-aware support middleware. The WSGI entry point remains available for Gunicorn.

### API Design

The API is organized under /api/. Router resources cover site settings, pages, sections, services, service categories, projects, project images, technologies, clients, testimonials, team, blog resources, contact information, messages, subscribers, media, users, careers, activity logs, and packages. Explicit endpoints cover authentication, dashboard statistics, uploads, CSV exports, contact, subscription, support, health, sitemap, and robots. Swagger and Redoc are available from the documented API routes.

### Authentication & Authorization

Dashboard authentication uses Simple JWT access and refresh tokens. The custom accounts.User model adds super_admin, manager, editor, and viewer roles. RolePermission controls write access with module-specific restrictions; public submission endpoints are explicitly marked for anonymous access and throttled where configured.

### Database Architecture

The schema is represented by Django models and migrations, not by a committed database. Core entities include site settings, pages, sections, contact records, submissions, media, and activity logs. Other apps model users, services, packages, projects, technologies, blog content, clients, testimonials, team members, careers, conversations, support messages, and guest verification. Migrations contain schema changes and selected synthetic/default content only.

### Infrastructure

The development Compose stack contains PostgreSQL, Redis, a Daphne-backed Django service, and a frontend Nginx service. Frontend Nginx proxies /api/, /ws/, /media/, and /static/ to Django inside the Compose network. The production-oriented file adds reverse-proxy Nginx and Certbot volume wiring and requires secrets from environment files.

### Docker

backend/Dockerfile installs Python dependencies and uses Gunicorn for the WSGI entry point. frontend/Dockerfile builds the Vite application and serves it from Nginx. Compose files show database, cache, backend, frontend, reverse-proxy, and certificate-volume relationships without embedding production credentials.

### Engineering Challenges Solved

The source code and development history demonstrate work in bilingual RTL content, shared REST integration, role-based permissions, activity logging, upload/image processing, authenticated and guest realtime support, scheduled publication with Celery/Redis, configurable runtime environments, and reusable frontend layout/content/form/media/loading/error components. These are implementation areas, not claims of unverified metrics or business outcomes.

### Project Structure

~~~text
backend/
  apps/              Django domain apps, APIs, admin, migrations, and utilities
  lava/              Django settings, URLs, ASGI/WSGI, Celery, and middleware
  tests/             Django/pytest tests
  static/            Safe source-controlled static assets
frontend/
  src/               React routes, pages, components, API client, i18n, and styles
  public/            Public frontend assets and SEO files
docs/                English and Arabic architecture notes
deploy/              Safe sample reverse-proxy configuration
docker-compose*.yml  Development and production-oriented service topology
~~~

### Local Setup

The development path uses SQLite and the console email backend and does not use production data.

~~~powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
$env:SECRET_KEY = python -c "import secrets; print(secrets.token_urlsafe(48))"
$env:DEBUG = "True"
python manage.py migrate
python manage.py seed_content
python manage.py createsuperuser
python manage.py runserver
~~~

In a second terminal:

~~~powershell
cd frontend
Copy-Item .env.example .env
npm ci
npm run dev
~~~

The seed command creates demo content and contains no fixed administrator password. Set SEED_ADMIN_PASSWORD only in the local process if you explicitly want the seed user to receive a local password; otherwise create a development administrator with createsuperuser.

### Environment Variables

Use the root .env.example for Docker Compose and backend/.env.example plus frontend/.env.example for application-specific settings. Secret fields are intentionally blank. The backend defaults to console email, local SQLite, local-memory cache, and in-memory Channels when optional services are absent.

### Database Setup

Leave DATABASE_URL unset for local SQLite and run python manage.py migrate; the ignored backend/db.sqlite3 is created. For local PostgreSQL, set DATABASE_URL and run the same migration command. Never point a showcase checkout at a production database.

### Running with Docker

~~~powershell
Copy-Item .env.example .env
# Fill POSTGRES_PASSWORD and SECRET_KEY in .env locally.
docker compose config
docker compose up --build
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py seed_content
~~~

The production-oriented topology can be inspected with docker compose -f docker-compose.prod.yml config. It expects locally supplied environment files and operator-managed TLS configuration; no production deployment is performed by this repository.

### Testing

- Backend tests are under backend/tests/ and run with pytest.
- A frontend component test is under frontend/src/components/__tests__/ and runs with npx vitest run.
- CI runs backend pytest plus frontend lint and build, and generates an ephemeral test secret at runtime.

### Security

The showcase copy excludes environment files, production credentials, database files, database dumps, Redis dumps, backups, private uploads, and the tracked data export that existed in the source repository. .gitignore covers common runtime and secret formats. Do not commit filled environment files or production data.

### Portfolio Version

Lava-project is a sanitized showcase version intended for portfolio presentation and technical evaluation. It preserves the original development progression as far as safely possible while removing sensitive files and rewriting the new repository history.

### Author

The historical Git metadata is preserved as far as safely possible. The primary repository identity is rooni94; authorship and commit metadata were not invented or reassigned.

## العربية

### نبذة عن المشروع

Lava منصة ثنائية اللغة لإدارة محتوى ومشاريع شركة تقنية. تتكون من واجهة React مبنية باستخدام Vite، وخادم Django يقدّم واجهات REST، مع لوحة تحكم لإدارة المحتوى والتواصل والوسائط والدعم.

### المشكلة التي يحلها

يوحّد المشروع دورة إدارة المحتوى لموقع تقني عربي/إنجليزي. فهو يربط الصفحات العامة والتحرير وإدارة الوسائط ورسائل التواصل وطلبات التوظيف ومحادثات الدعم ضمن API واحدة ولوحة تحكم تراعي صلاحيات المستخدمين.

### المميزات الرئيسية

- دعم العربية والإنجليزية مع مراعاة اتجاه RTL.
- صفحات عامة للرئيسية والتعريف والخدمات والأعمال والباقات والمدونة والوظائف والتواصل والصفحات القانونية.
- عمليات CRUD من لوحة التحكم للمجالات الرئيسية للمحتوى.
- تسجيل الدخول وتجديد الجلسة باستخدام JWT، مع تدفقات تغيير واستعادة كلمة المرور.
- أدوار وصلاحيات للمشرف العام والمدير والمحرر والمشاهد.
- رفع الوسائط والتحقق منها وتغيير حجم الصور وتحويلها إلى WebP وإضافة علامة مائية قابلة للضبط.
- نماذج التواصل والاشتراك وطلبات التوظيف، وإشعارات البريد وتصدير CSV.
- محادثات دعم تشمل التحقق من بريد الزائر، وتحويل المحادثة للموظف، وحالات القراءة وتحديثات WebSocket.
- أتمتة دعم مبنية على قواعد مع إمكانية التحويل إلى الدعم البشري.
- مهام نشر مجدولة لمقالات المدونة ومشاريع الأعمال.
- توثيق Swagger وRedoc للـ API.
- إدارة إعدادات المظهر والخطوط وSEO والتنقل وأقسام الصفحات من لوحة التحكم.

### معمارية النظام

يتصل المتصفح بواجهة React، ثم تمرر الواجهة طلبات HTTP وWebSocket إلى Django. يستخدم Django REST Framework للـ API وDjango Channels للتحديثات اللحظية. تُخزّن البيانات في PostgreSQL عند ضبط DATABASE_URL، أو في SQLite للتطوير المحلي. يمكن استخدام Redis للتخزين المؤقت وChannels وCelery، بينما تُخزّن الوسائط محليًا أو عبر S3 اختياريًا. يوجد مخطط Mermaid في القسم الإنجليزي أعلاه.

### التقنيات المستخدمة

الواجهة الأمامية: React وTypeScript وVite وReact Router وTanStack Query وAxios وi18next وTailwind CSS وFramer Motion وSwiper وReact Hook Form وReact Quill وReact Easy Crop.

الخادم الخلفي: Django وDjango REST Framework وSimple JWT وdjango-filter وdrf-yasg وdjango-cors-headers وdjango-ratelimit وPillow وWhitenoise.

التخزين والبنية التشغيلية: PostgreSQL أو SQLite للتطوير، Redis، Memcached كخيار بديل للتخزين المؤقت، Celery، Channels، Daphne، Gunicorn، Docker Compose، Nginx، وS3 اختياريًا عبر django-storages.

### بنية الواجهة الأمامية

الواجهة تطبيق React أحادي الصفحة مبني بواسطة Vite. يحدد App.tsx المسارات العامة ومسارات لوحة التحكم، ويستخدم PageGuard للتحقق من ظهور الصفحات عبر API. يدير TanStack Query حالة الخادم، ويوفر Axios عميل HTTP، وتغطي المكونات المشتركة التخطيط والتنقل والبطاقات والنماذج ومعرض الصور والمحرر واختيار الوسائط والقص وحالات التحميل ومعالجة الأخطاء. تتولى طبقة i18n تبديل اللغة والمحتوى واتجاه العرض.

### بنية الخادم الخلفي

يقدم Django مجموعات ViewSet وواجهات API عبر Router ومسارات صريحة. تستخدم المحتويات العامة خلطات للقراءة، بينما تعتمد عمليات لوحة التحكم على الصلاحيات وتسجيل النشاط. يجمع مدخل ASGI بين HTTP الخاص بـ Django وWebSockets الخاصة بـ Channels ووسيط JWT للدعم. ويبقى مدخل WSGI متاحًا للتشغيل عبر Gunicorn.

### واجهات API

توجد الواجهات تحت /api/، وتشمل إعدادات الموقع والصفحات والأقسام والخدمات والباقات والمشاريع والتقنيات والصور والمدونة والعملاء والشهادات والفريق والمعلومات ورسائل التواصل والمشتركين والوسائط والمستخدمين والوظائف وسجل النشاط. كما توجد مسارات صريحة للمصادقة والإحصاءات والرفع والتصدير والتواصل والاشتراك والدعم، إضافة إلى الصحة وملفي sitemap وrobots. يوفر المشروع مسارات Swagger وRedoc عند تشغيله.

### المصادقة والصلاحيات

تعتمد لوحة التحكم على رموز Simple JWT للوصول والتجديد. يضيف نموذج المستخدم المخصص أدوار المشرف العام والمدير والمحرر والمشاهد، وتتحكم RolePermission في عمليات الكتابة مع قيود بحسب الوحدة. أما مسارات النماذج العامة فتعلن صراحة قبول الزوار وتستخدم التقييد بالمعدل حيثما كان مفعّلًا.

### قاعدة البيانات

تمثل Django models وmigrations مخطط البيانات، ولا توجد قاعدة بيانات متعقبة في هذه النسخة. تشمل النماذج الأساسية إعدادات الموقع والصفحات والأقسام وبيانات التواصل والرسائل والاشتراكات والوسائط وسجل النشاط، إضافة إلى المستخدمين والخدمات والباقات والمشاريع والمدونة والعملاء والفريق والوظائف ومحادثات الدعم والتحقق من الزوار. ملفات migrations تعريفات مخطط ومحتوى افتراضي/تجريبي محدد، وليست تصديرًا لبيانات الإنتاج.

### البنية التحتية

يشغّل Compose التطويري PostgreSQL وRedis وDjango عبر Daphne وواجهة Nginx. يمرر Nginx مسارات /api/ و/ws/ و/media/ و/static/ إلى Django داخل شبكة Compose. ويضيف ملف Compose ذي التوجه الإنتاجي خدمة Nginx عكسية وربط وحدات Certbot، مع اشتراط تمرير الأسرار من ملفات البيئة.

### Docker

يبني backend/Dockerfile بيئة Python ويستخدم Gunicorn افتراضيًا لمدخل WSGI. ويبني frontend/Dockerfile تطبيق Vite ثم يخدم الناتج بواسطة Nginx. توضح ملفات Compose علاقة قاعدة البيانات وRedis والخادم والواجهة وNginx ووحدات الشهادات دون تضمين بيانات اعتماد إنتاجية.

### التحديات الهندسية التي تم حلها

تظهر في الكود وتاريخ التطوير مجالات هندسية مهمة، منها بناء دورة محتوى عربية/إنجليزية، ربط الصفحات العامة ولوحة التحكم عبر REST API، تطبيق الصلاحيات وتسجيل النشاط، معالجة رفع الصور والوسائط، دعم محادثات الزوار والمستخدمين عبر WebSocket، جدولة النشر عبر Celery وRedis، وإبقاء مسارات التشغيل المحلي والحاويات والإنتاج قابلة للضبط عبر البيئة. كما توجد مكونات واجهة قابلة لإعادة الاستخدام للتخطيط والمحتوى والنماذج والوسائط وحالات التحميل والأخطاء.

هذه مجالات تنفيذية مثبتة في المصدر وليست ادعاءات بأرقام أداء أو نتائج تجارية غير موثقة.

### هيكل المشروع

~~~text
backend/       تطبيقات Django والإعدادات والاختبارات والوسائط الثابتة الآمنة
frontend/      صفحات React والمكونات وعميل API وi18n والأنماط والأصول العامة
docs/          وثائق المعمارية بالإنجليزية والعربية
deploy/        إعداد Nginx تجريبي آمن
~~~

### تشغيل المشروع محليًا

يستخدم المسار المحلي SQLite وبريد console ومحتوى تجريبيًا فقط. أنشئ بيئة Python وثبّت backend/requirements.txt، ثم عيّن SECRET_KEY عشوائيًا في جلسة PowerShell، وشغّل migrate ثم seed_content وcreatesuperuser ثم runserver. في الطرفية الثانية انسخ frontend/.env.example إلى .env وشغّل npm ci ثم npm run dev.

### متغيرات البيئة

استخدم .env.example الجذر لتشغيل Docker Compose، وملفي backend/.env.example وfrontend/.env.example لإعدادات التطبيق. جميع الحقول السرية فارغة عمدًا، والافتراضات المحلية تستخدم البريد الطرفي وSQLite والتخزين المؤقت المحلي عند غياب الخدمات الاختيارية.

### إعداد قاعدة البيانات

للتطوير المحلي اترك DATABASE_URL فارغًا وشغّل python manage.py migrate؛ سينشئ Django ملف SQLite متجاهلًا بواسطة Git. لا توجّه نسخة العرض إلى قاعدة إنتاج. عند استخدام PostgreSQL محلي، اضبط DATABASE_URL ثم شغّل الأمر نفسه.

### التشغيل باستخدام Docker

انسخ .env.example إلى .env، املأ POSTGRES_PASSWORD وSECRET_KEY محليًا، تحقّق عبر docker compose config، ثم شغّل docker compose up --build. بعد بدء الخدمات شغّل migrate وseed_content داخل حاوية backend. يمكن فحص ملف Compose ذي التوجه الإنتاجي عبر docker compose -f docker-compose.prod.yml config، لكنه يتطلب ملفات بيئة وإعداد TLS يديره المشغّل.

### الاختبارات

اختبارات الخادم موجودة في backend/tests/ وتُشغّل عبر pytest. يوجد اختبار مكوّن للواجهة في frontend/src/components/__tests__/ ويُشغّل عبر npx vitest run. يشغّل CI اختبارات الخادم، وlint الواجهة، وbuild الواجهة، ويولّد سر اختبار مؤقتًا أثناء التشغيل.

### الأمان

استُبعدت من نسخة العرض ملفات البيئة وبيانات الاعتماد وقواعد البيانات وملفات dump وRedis والنسخ الاحتياطية والوسائط الخاصة وتصدير البيانات الموجود في المصدر. يغطي .gitignore الصيغ المعتادة للأسرار والملفات المؤقتة. لا تحفظ أي ملف بيئة ممتلئ أو بيانات إنتاج داخل المستودع.

### نسخة معرض الأعمال

Lava-project نسخة عرض منقّحة ومُعقّمة مخصصة للتقديم للوظائف والتقييم التقني. حُفظ تسلسل التطوير الأصلي بقدر ما يسمح به الأمان، مع إزالة الملفات الحساسة وإعادة كتابة تاريخ المستودع الجديد فقط.

### المطور

حُفظت بيانات Git التاريخية بقدر ما يسمح به التنظيف، ولم تُخترع هوية أو تُنسب التزامات إلى شخص آخر. هوية المستودع الأساسية في التاريخ هي rooni94.

## License and sharing

No open-source license is added by this showcase copy. See NOTICE for the portfolio and technical-evaluation notice and the treatment of third-party packages and assets.
