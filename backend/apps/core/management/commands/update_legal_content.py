from django.core.management.base import BaseCommand
from apps.core.models import Page, Section

class Command(BaseCommand):
    help = 'Update legal pages content'
    
    def handle(self, *args, **options):
        # Privacy Policy
        privacy_page = Page.objects.get(slug='privacy-policy')
        privacy_page.sections.all().delete()
        
        Section.objects.create(
            page=privacy_page,
            title='سياسة الخصوصية',
            content='''<div class=prose max-w-none>
<h1>سياسة الخصوصية</h1>
<p><strong>تاريخ النفاذ:</strong> 22 فبراير 2026</p>

<h2>1. مقدمة</h2>
<p>مرحبًا بكم في موقع لافا (LAVA). نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.</p>

<h2>2. المعلومات التي نجمعها</h2>
<ul>
<li>الاسم، البريد الإلكتروني، رقم الهاتف</li>
<li>معلومات الاستخدام (الصفحات المزورة، وقت الزيارة)</li>
<li>بيانات الجهاز والمتصفح</li>
</ul>

<h2>3. كيفية استخدام معلوماتك</h2>
<ul>
<li>تقديم خدماتنا وتحسينها</li>
<li>التواصل معك والرد على استفساراتك</li>
<li>تحليل استخدام الموقع</li>
<li>منع الاحتيال وحماية الأنظمة</li>
</ul>

<h2>4. مشاركة المعلومات</h2>
<p>لا نبيع أو نشارك معلوماتك إلا مع إذنك أو عندما يقتضي القانون.</p>

<h2>5. حماية المعلومات</h2>
<p>نطبق إجراءات أمنية معقولة لحماية معلوماتك.</p>

<h2>6. حقوقك</h2>
<ul>
<li>الوصول إلى معلوماتك</li>
<li>تصحيح المعلومات غير الدقيقة</li>
<li>حذف معلوماتك</li>
<li>الاعتراض على معالجة بياناتك</li>
</ul>

<h2>7. ملفات تعريف الارتباط</h2>
<p>نستخدم ملفات تعريف الارتباط لتحسين تجربتك.</p>

<h2>8. التغييرات</h2>
<p>قد نقوم بتحديث هذه السياسة وسننشر التغييرات هنا.</p>

<h2>9. التواصل معنا</h2>
<p>privacy@lava.com.sa | +966 11 123 4567</p>
</div>''',
            order=1
        )
        
        Section.objects.create(
            page=privacy_page,
            title='Privacy Policy',
            content='''<div class=prose max-w-none>
<h1>Privacy Policy</h1>
<p><strong>Effective Date:</strong> February 22, 2026</p>

<h2>1. Introduction</h2>
<p>Welcome to LAVA website. We respect your privacy and protect your personal data.</p>

<h2>2. Information We Collect</h2>
<ul>
<li>Name, email, phone number</li>
<li>Usage information (pages visited, visit time)</li>
<li>Device and browser data</li>
</ul>

<h2>3. How We Use Your Information</h2>
<ul>
<li>Providing and improving our services</li>
<li>Communicating with you and responding to inquiries</li>
<li>Analyzing site usage</li>
<li>Fraud prevention and system protection</li>
</ul>

<h2>4. Sharing Information</h2>
<p>We do not sell or share your information except with your permission or when required by law.</p>

<h2>5. Information Security</h2>
<p>We implement reasonable security measures to protect your information.</p>

<h2>6. Your Rights</h2>
<ul>
<li>Access your information</li>
<li>Correct inaccurate information</li>
<li>Delete your information</li>
<li>Object to processing of your data</li>
</ul>

<h2>7. Cookies</h2>
<p>We use cookies to improve your experience.</p>

<h2>8. Changes</h2>
<p>We may update this policy and will post changes here.</p>

<h2>9. Contact Us</h2>
<p>privacy@lava.com.sa | +966 11 123 4567</p>
</div>''',
            order=2
        )
        
        self.stdout.write(self.style.SUCCESS('✅ Updated privacy policy content'))
        
        # Terms & Conditions
        terms_page = Page.objects.get(slug='terms-conditions')
        terms_page.sections.all().delete()
        
        Section.objects.create(
            page=terms_page,
            title='الشروط والأحكام',
            content='''<div class=prose max-w-none>
<h1>الشروط والأحكام</h1>
<p><strong>تاريخ النفاذ:</strong> 22 فبراير 2026</p>

<h2>1. القبول بالشروط</h2>
<p>باستخدامك موقع لافا، فإنك توافق على هذه الشروط.</p>

<h2>2. استخدام الموقع</h2>
<ul>
<li>يجب أن تكون عمرك 18 عامًا على الأقل</li>
<li>لا تستخدم الموقع لأي غرض غير قانوني</li>
<li>لا تحاول اختراق أمن الموقع</li>
</ul>

<h2>3. الملكية الفكرية</h2>
<p>جميع المحتويات ملك لـ لافا أو مرخصة لنا.</p>

<h2>4. الخدمات</h2>
<p>نقدم خدمات تطوير البرمجيات والاستشارات التقنية.</p>

<h2>5. الدفع والفوترة</h2>
<ul>
<li>الأسعار بالريال السعودي وقد تتغير</li>
<li>نقبل الدفع عبر التحويل البنكي والبطاقات الائتمانية</li>
<li>جميع الأسعار تشمل ضريبة القيمة المضافة إذا كانت مطبقة</li>
</ul>

<h2>6. الضمان والمسؤولية</h2>
<ul>
<li>نضمن أن خدماتنا ستكون كما هو موصوف</li>
<li>لن نكون مسؤولين عن أي أضرار غير مباشرة</li>
</ul>

<h2>7. الإلغاء والاسترداد</h2>
<p>يتم الإلغاء والاسترداد وفقًا لشروط العقد الموقع.</p>

<h2>8. التعديلات</h2>
<p>نحتفظ بالحق في تعديل هذه الشروط.</p>

<h2>9. القانون الحاكم</h2>
<p>تخضع هذه الشروط لقوانين المملكة العربية السعودية.</p>

<h2>10. التواصل</h2>
<p>legal@lava.com.sa | +966 11 123 4567</p>
</div>''',
            order=1
        )
        
        Section.objects.create(
            page=terms_page,
            title='Terms & Conditions',
            content='''<div class=prose max-w-none>
<h1>Terms & Conditions</h1>
<p><strong>Effective Date:</strong> February 22, 2026</p>

<h2>1. Acceptance of Terms</h2>
<p>By using LAVA website, you agree to these Terms.</p>

<h2>2. Use of Website</h2>
<ul>
<li>You must be at least 18 years old</li>
<li>Do not use the site for illegal purposes</li>
<li>Do not attempt to breach site security</li>
</ul>

<h2>3. Intellectual Property</h2>
<p>All content is owned by LAVA or licensed to us.</p>

<h2>4. Services</h2>
<p>We provide software development and technical consulting services.</p>

<h2>5. Payment & Invoicing</h2>
<ul>
<li>Prices are in Saudi Riyal and may change</li>
<li>We accept payment via bank transfer and credit cards</li>
<li>All prices include VAT if applicable</li>
</ul>

<h2>6. Warranty & Liability</h2>
<ul>
<li>We warrant that our services will be as described</li>
<li>We will not be liable for any indirect damages</li>
</ul>

<h2>7. Cancellation & Refund</h2>
<p>Cancellation and refund are according to signed contract terms.</p>

<h2>8. Modifications</h2>
<p>We reserve the right to modify these terms.</p>

<h2>9. Governing Law</h2>
<p>These terms are governed by Saudi Arabian laws.</p>

<h2>10. Contact</h2>
<p>legal@lava.com.sa | +966 11 123 4567</p>
</div>''',
            order=2
        )
        
        self.stdout.write(self.style.SUCCESS('✅ Updated terms & conditions content'))
        self.stdout.write(self.style.SUCCESS('\n✅ Legal pages content updated successfully!'))
