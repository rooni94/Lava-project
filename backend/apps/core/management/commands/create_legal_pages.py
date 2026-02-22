from django.core.management.base import BaseCommand
from apps.core.models import Page, Section

class Command(BaseCommand):
    help = 'Create privacy policy and terms & conditions pages'
    
    def handle(self, *args, **options):
        # Privacy Policy
        privacy_page, created = Page.objects.get_or_create(
            slug='privacy-policy',
            defaults={
                'name': 'سياسة الخصوصية',
                'title': 'سياسة الخصوصية | LAVA',
                'meta_description': 'سياسة الخصوصية لموقع لافا',
                'status': 'published'
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('✅ Created privacy policy page'))
            
            # Add Arabic content
            Section.objects.create(
                page=privacy_page,
                title='سياسة الخصوصية',
                content='''# سياسة الخصوصية

**تاريخ النفاذ:** 22 فبراير 2026

## 1. مقدمة
مرحبًا بكم في موقع لافا (LAVA). نحن نحترم خصوصيتك.

## 2. المعلومات التي نجمعها
- الاسم، البريد الإلكتروني، رقم الهاتف
- معلومات الاستخدام

## 3. كيفية استخدام معلوماتك
- تقديم خدماتنا
- التواصل معك
- تحليل استخدام الموقع

## 4. مشاركة المعلومات
لا نبيع أو نشارك معلوماتك إلا مع إذنك أو عندما يقتضي القانون.

## 5. حماية المعلومات
نطبق إجراءات أمنية معقولة.

## 6. حقوقك
لديك الحق في الوصول، التصحيح، الحذف.

## 7. التغييرات
قد نقوم بتحديث هذه السياسة.

## 8. التواصل معنا
info@lava.com.sa''',
                order=1
            )
            
            # Add English content
            Section.objects.create(
                page=privacy_page,
                title='Privacy Policy',
                content='''# Privacy Policy

**Effective Date:** February 22, 2026

## 1. Introduction
Welcome to LAVA website. We respect your privacy.

## 2. Information We Collect
- Name, email, phone number
- Usage information

## 3. How We Use Your Information
- Providing our services
- Communicating with you
- Analyzing site usage

## 4. Sharing Information
We do not sell or share your information except with your permission or when required by law.

## 5. Information Security
We implement reasonable security measures.

## 6. Your Rights
You have the right to access, correct, delete.

## 7. Changes
We may update this policy.

## 8. Contact Us
info@lava.com.sa''',
                order=2
            )
        else:
            self.stdout.write(self.style.WARNING('⚠️ Privacy policy page already exists'))
        
        # Terms & Conditions
        terms_page, created = Page.objects.get_or_create(
            slug='terms-conditions',
            defaults={
                'name': 'الشروط والأحكام',
                'title': 'الشروط والأحكام | LAVA',
                'meta_description': 'الشروط والأحكام لاستخدام موقع لافا',
                'status': 'published'
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('✅ Created terms & conditions page'))
            
            # Add Arabic content
            Section.objects.create(
                page=terms_page,
                title='الشروط والأحكام',
                content='''# الشروط والأحكام

**تاريخ النفاذ:** 22 فبراير 2026

## 1. القبول بالشروط
باستخدامك موقع لافا، فإنك توافق على هذه الشروط.

## 2. استخدام الموقع
- يجب أن تكون عمرك 18 عامًا على الأقل
- لا تستخدم الموقع لأي غرض غير قانوني

## 3. الملكية الفكرية
جميع المحتويات ملك لـ لافا.

## 4. الخدمات
نقدم خدمات تطوير البرمجيات.

## 5. الدفع
نقبل الدفع عبر التحويل البنكي، البطاقات الائتمانية.

## 6. الضمان
نضمن أن خدماتنا ستكون كما هو موصوف.

## 7. الإلغاء
يتم الإلغاء وفقًا لشروط العقد.

## 8. التعديلات
نحتفظ بالحق في تعديل هذه الشروط.

## 9. القانون
تخضع هذه الشروط لقوانين السعودية.

## 10. التواصل
legal@lava.com.sa''',
                order=1
            )
            
            # Add English content
            Section.objects.create(
                page=terms_page,
                title='Terms & Conditions',
                content='''# Terms & Conditions

**Effective Date:** February 22, 2026

## 1. Acceptance of Terms
By using LAVA website, you agree to these Terms.

## 2. Use of Website
- You must be at least 18 years old
- Do not use the site for illegal purposes

## 3. Intellectual Property
All content is owned by LAVA.

## 4. Services
We provide software development services.

## 5. Payment
We accept payment via bank transfer, credit cards.

## 6. Warranty
We warrant that our services will be as described.

## 7. Cancellation
Cancellation is according to contract terms.

## 8. Modifications
We reserve the right to modify these terms.

## 9. Governing Law
These terms are governed by Saudi Arabian laws.

## 10. Contact
legal@lava.com.sa''',
                order=2
            )
        else:
            self.stdout.write(self.style.WARNING('⚠️ Terms & conditions page already exists'))
        
        self.stdout.write(self.style.SUCCESS('\n✅ Legal pages created successfully!'))
        self.stdout.write('\nURLs:')
        self.stdout.write('- Privacy Policy: /privacy-policy/')
        self.stdout.write('- Terms & Conditions: /terms-conditions/')
