# LAVA Software & IT Solutions

منصة متكاملة لإدارة موقع شركة تقنية: Django REST API + React (Vite/TS) مع لوحة تحكم، مدونة، أعمال، خدمات، وظائف، عملاء، وفريق.

## المتطلبات
- Python 3.10+
- Node.js 18+
- PostgreSQL (SQLite مدعوم للتطوير)

## تشغيل الـBackend (تطوير)
```bash
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # أنشئ ملف البيئة
python manage.py migrate
python manage.py runserver
```

متغيرات بيئة أساسية:
```
SECRET_KEY = os.environ["SECRET_KEY"]
DEBUG=True
DATABASE_URL=postgres://user:pass@localhost:5432/lava
ALLOWED_HOSTS=localhost,127.0.0.1
CSRF_TRUSTED_ORIGINS=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

## تشغيل الـFrontend (تطوير)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

`.env` الأمامي:
```
VITE_API_URL=http://localhost:8000/api
VITE_SITE_NAME=LAVA
```

## الأوامر المفيدة
- تجميع ملفات الستاتيك: `python manage.py collectstatic --noinput`
- بناء الواجهة: `npm run build`
- فحص الكود: `npm run lint`
- اختبارات الباك: `pytest`

## مسار الإنتاج المقترح
1) CI (انظر `.github/workflows/ci.yml`): تثبيت، lint، tests، build.
2) ترحيل قواعد البيانات: `python manage.py migrate`.
3) جمع الستاتيك: `python manage.py collectstatic --noinput`.
4) بناء الواجهة ونشرها خلف Nginx/SSL.
5) تفعيل متغيرات الأمان: `DEBUG=False`, مفاتيح سرية، `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, وإعدادات البريد.
6) تخزين الوسائط: إما S3 عبر `USE_S3=True` أو التخزين المحلي مع نسخ احتياطي.
7) مراقبة: مسار صحة `/healthz` + سجلات مهيكلة (stdout) وربطها بمراقب خارجي.
8) التحويل إلى https: فعّل `SECURE_SSL_REDIRECT=True` فقط عند وجود عكس وكيل يدعم SSL ويضبط `X-Forwarded-Proto=https` (مثل Nginx/ALB). في التطوير اتركها False واستخدم HTTP.

## Docker
```
docker-compose up --build
```
يُشغِّل PostgreSQL, Redis, backend (Gunicorn), frontend (Nginx). اضبط `VITE_API_URL` إذا كان النشر خلف دومين مختلف.

## المزايا
- JWT Auth + أدوار (Super Admin / Manager / Editor / Viewer).
- CRUD كامل للمحتوى (صفحات، أقسام، خدمات، مشاريع، تدوينات، فريق، عملاء، وظائف).
- تحميل ملفات مع ضغط صور بسيط، وروابط تصدير CSV.
- Swagger/Redoc متاح على `/api/docs/`.
- دعم RTL وتخصيص ألوان من لوحة التحكم.

## نقاط يجب ضبطها قبل النشر
- مفاتيح سرية وكلمات مرور قواعد البيانات.
- نطاقات `ALLOWED_HOSTS` و `CSRF_TRUSTED_ORIGINS`.
- بريد حقيقي لإشعارات إعادة التعيين والنماذج.
- تخزين وسائط خارجي (S3) أو وحدة تخزين دائمة مع CDN.
- شهادة SSL عبر عكس وكيل (Nginx/Traefik/Cloudflare).
- إعداد مهام مجدولة للجدولة (Celery Beat) إن لزم.
