from __future__ import annotations

from django.db import migrations


def seed_cafems_system_translations(apps, schema_editor):
    Project = apps.get_model("portfolio", "Project")

    translations = {
        "نظام المحاسبة والمالية (CafeMS)": {
            "title_en": "Accounting & Finance System (CafeMS)",
            "description_en": "An integrated accounting suite for ledgers, journals, inventory, expenses, invoices, and payments with ready financial reports.",
            "summary_en": "Includes accounting periods, a hierarchical chart of accounts, and operational posting with dashboards for quick reviews.",
            "goals_en": "- Unify accounting entries and tie sales/purchases to the ledger.\n- Reduce errors through balanced journal entries.\n- Provide instant profitability, liquidity, and tax reporting.",
            "challenges_en": "- Multiple transaction sources (orders/purchases/inventory/expenses).\n- Multi-currency and multi-account compatibility.\n- Tracking taxes and aging.",
            "solution_en": "- Accounting periods with open/closed/locked states.\n- Hierarchical chart of accounts with account types.\n- Journals and journal lines with auto-balancing.\n- Purchase orders, suppliers, expenses, and bank accounts.\n- Incoming/outgoing payments linked to invoices and orders.\n- Inventory accounting with in/out/adjustment movements and valuation methods.\n- P&L, balance sheet, cash flow, aging, and tax reports.\n- Receipt OCR for quick review.",
            "results_en": "- A unified financial view in one dashboard.\n- Faster period close and expense tracking.\n- Data-driven decisions based on liquidity and profitability.",
            "scope_en": "General ledger + inventory + financial reports + taxes + payments",
            "client_en": "CafeMS",
        },
        "نظام الموارد البشرية وإدارة الموظفين": {
            "title_en": "HR & Employee Management System",
            "description_en": "An HR suite for employees, attendance, leaves, payroll, documents, and notifications.",
            "summary_en": "Employee database linked to accounts with attendance, leave, payroll, and document workflows.",
            "goals_en": "- Organize employee files and job data.\n- Automate attendance, leave, and payroll.\n- Send expiry alerts for documents and residencies.",
            "challenges_en": "- Multiple leave types and contract scenarios.\n- Accurate expiry tracking.\n- Multi-level approvals.",
            "solution_en": "- Full employee profiles (department, role, salary, contact details).\n- Attendance and check-in/out with status.\n- Leave balances and approval workflows.\n- Contracts and monthly payroll with overtime.\n- Visa/residency/passport tracking with alerts.\n- Employee document management and classification.\n- HR reports and in-app notifications.\n- Salary raise requests and daily work reports.\n- HR settings and configurable leave types.",
            "results_en": "- Lower administrative overhead and better compliance.\n- Clear visibility into payroll and leave obligations.\n- Early alerts for expiring documents.",
            "scope_en": "Employee files + attendance/leaves + payroll + documents + reports",
            "client_en": "CafeMS",
        },
        "نظام المتجر والهوية الرقمية": {
            "title_en": "Store & Digital Brand System",
            "description_en": "A comprehensive settings panel for customizing the cafe storefront, branding, and content.",
            "summary_en": "Full control over colors, logos, homepage content, header/footer links, and social channels.",
            "goals_en": "- Enable the team to update content and branding without development.\n- Unify communication across email channels.\n- Simplify storefront and promotion management.",
            "challenges_en": "- Many sections, templates, and links.\n- Separate email settings for verification and support.",
            "solution_en": "- Brand settings (colors, logo, favicon, hero images).\n- Homepage sections and hero cards.\n- About/hero copy, hours, and address content.\n- Header/footer/social links.\n- Multiple email profiles (default/verification/support) with separate SMTP.\n- Apple/Google Wallet loyalty pass templates.",
            "results_en": "- Faster content and brand updates.\n- Consistent storefront experience across channels.\n- Less day-to-day dependence on developers.",
            "scope_en": "Store settings + content + email + branding",
            "client_en": "CafeMS",
        },
        "نظام المنتجات والمخزون": {
            "title_en": "Products & Inventory System",
            "description_en": "A complete product catalog with categories, add-ons, and inventory tracking.",
            "summary_en": "Manage categories, products, availability, images, pricing, and options.",
            "goals_en": "- Organize the menu and improve discovery.\n- Reduce stockouts.\n- Enable flexible pricing and add-ons.",
            "challenges_en": "- Many items with hierarchy.\n- Monitoring minimum stock thresholds.",
            "solution_en": "- Categories and subcategories with automatic slugs.\n- Product data (description, price, image, availability).\n- Optional inventory tracking.\n- Minimum stock thresholds and alerts.\n- Product add-ons with pricing and ordering.",
            "results_en": "- Organized, easy-to-update menu.\n- Fewer unexpected stockouts.\n- More pricing flexibility.",
            "scope_en": "Products + categories + add-ons + inventory",
            "client_en": "CafeMS",
        },
        "نظام الطلبات والطاولات ونقاط البيع": {
            "title_en": "Orders, Tables & POS System",
            "description_en": "End-to-end order lifecycle with dine-in, takeaway, delivery, and table management.",
            "summary_en": "Clear order states, table management, discounts, delivery fees, and activity logs.",
            "goals_en": "- Speed up order intake and preparation.\n- Reduce cashier/kitchen errors.\n- Provide full order traceability.",
            "challenges_en": "- Multiple order types and payment statuses.\n- Real-time updates.",
            "solution_en": "- Multiple order states (pending/confirmed/preparing/ready/completed).\n- Order types (dine-in/takeaway/delivery) with delivery fees.\n- Table management and statuses.\n- Order items with add-ons and price snapshots.\n- Amount/percent discounts and notes.\n- Activity log for status changes.\n- Inventory adjustments linked to orders.\n- Real-time updates via Channels.",
            "results_en": "- Clear order workflows.\n- Faster service and improved customer experience.\n- Full transparency in order tracking.",
            "scope_en": "Orders + POS + tables + tracking",
            "client_en": "CafeMS",
        },
        "نظام المدفوعات وبوابات الدفع": {
            "title_en": "Payments & Payment Gateways System",
            "description_en": "Manage payment methods and transactions with gateway-ready integration.",
            "summary_en": "Define payment methods, ordering, and transaction logs with provider references.",
            "goals_en": "- Unify online and in-store payments.\n- Track transactions and statuses accurately.",
            "challenges_en": "- Multiple providers and status differences.",
            "solution_en": "- Payment methods management (cash, cards, Tabby, Tamara, Apple/Google Pay, Mada).\n- Mark online methods.\n- Transaction records with statuses (pending/authorized/captured/failed/refunded).\n- Store provider reference and raw response.",
            "results_en": "- Better payment visibility.\n- Ready for gateway expansion.",
            "scope_en": "Payment methods + payment transactions",
            "client_en": "CafeMS",
        },
        "نظام الفواتير والإيصالات": {
            "title_en": "Invoices & Receipts System",
            "description_en": "Generate Arabic PDF invoices with QR order tracking.",
            "summary_en": "Auto-generated 80mm thermal receipts with order details and payment info.",
            "goals_en": "- Automate invoice creation.\n- Enable QR-based order tracking.",
            "challenges_en": "- Arabic text rendering in small PDF receipts.",
            "solution_en": "- Auto-numbering for invoices.\n- 80mm PDF receipts with Arabic font support.\n- Item lines, unit price, totals.\n- QR linking to order tracking.",
            "results_en": "- Fast, accurate invoicing.\n- Convenient tracking experience.",
            "scope_en": "PDF invoices + QR tracking",
            "client_en": "CafeMS",
        },
        "نظام الولاء والمحفظة الرقمية": {
            "title_en": "Loyalty & Digital Wallet System",
            "description_en": "Points-based loyalty program with QR and Apple/Google Wallet passes.",
            "summary_en": "Flexible points settings, customer loyalty profiles, and transaction history.",
            "goals_en": "- Increase repeat purchases through rewards.\n- Offer a digital loyalty card.",
            "challenges_en": "- Syncing points with orders.\n- Wallet pass support.",
            "solution_en": "- Earn-rate and auto-reward thresholds.\n- Loyalty profiles with membership ID and QR.\n- Points transactions (orders/rewards/manual/scan).\n- Apple/Google Wallet device registration and pass issuance.",
            "results_en": "- Higher loyalty and engagement.\n- Digital-first experience without plastic cards.",
            "scope_en": "Loyalty + QR + Wallet",
            "client_en": "CafeMS",
        },
        "نظام الدعم والمحادثات الذكية": {
            "title_en": "Support & Smart Chat System",
            "description_en": "Real-time support with chat, bot, and voice messages.",
            "summary_en": "Customer/guest conversations with assignment and notifications.",
            "goals_en": "- Reduce response time.\n- Enable multi-channel support (text/voice).",
            "challenges_en": "- Handling guests without accounts.\n- Auditing support staff activity.",
            "solution_en": "- Customer/guest conversations with guest email verification.\n- Real-time messages with read states.\n- Assignment/close/soft-delete flows.\n- Support staff activity logs.\n- Automated support bot.\n- Voice-to-text (Whisper) and TTS replies.",
            "results_en": "- Faster, more interactive support.\n- Full activity traceability.",
            "scope_en": "Live support + bot + voice",
            "client_en": "CafeMS",
        },
        "نظام المستخدمين والصلاحيات": {
            "title_en": "Users & Permissions System",
            "description_en": "Account, role, and permission management with activity tracking.",
            "summary_en": "Roles (customer/staff/supervisor/manager) with fine-grained access.",
            "goals_en": "- Control access to every module.\n- Monitor user and device activity.",
            "challenges_en": "- Different permissions across accounting, HR, inventory, and more.",
            "solution_en": "- User roles and separate HR roles.\n- Granular permissions per module.\n- User addresses and contact info.\n- Saved delivery addresses.\n- Full activity logs (IP/device/browser/action).\n- Push tokens for devices.",
            "results_en": "- Higher security and precise control.\n- Complete user activity monitoring.",
            "scope_en": "Accounts + permissions + activity + addresses",
            "client_en": "CafeMS",
        },
        "نظام نماذج التواصل": {
            "title_en": "Contact Forms System",
            "description_en": "Collect and manage contact messages with read/reply status.",
            "summary_en": "Centralized inbox for customer messages with response tracking.",
            "goals_en": "- Avoid losing any inquiry.\n- Document replies and ownership.",
            "challenges_en": "- Tracking read/reply status and responder.",
            "solution_en": "- Contact form capturing name/email/phone/message.\n- Read/reply state and reply content.\n- Store responder and reply timestamp.",
            "results_en": "- Clear follow-up workflow for inquiries.\n- Better communication experience.",
            "scope_en": "Contact forms + replies",
            "client_en": "CafeMS",
        },
        "تطبيق CafeMS للهواتف": {
            "title_en": "CafeMS Mobile App",
            "description_en": "Mobile app for customers and management combining ordering, loyalty, and operations.",
            "summary_en": "Customer ordering and tracking plus admin POS/operations in one app.",
            "goals_en": "- Enable mobile ordering.\n- Provide an on-the-go operations dashboard.",
            "challenges_en": "- Unified UX for customers and staff.\n- Real-time notifications.",
            "solution_en": "- Signup/login/password reset.\n- Menu browsing, product details, cart, checkout.\n- Order tracking screen.\n- Profile and saved addresses.\n- Loyalty rewards screen.\n- Admin dashboard: POS, orders, inventory, products, tables, users, permissions, support, reports, settings.\n- Employee HR screens (requests, notifications, documents).\n- Expo push notifications and token sync.\n- Multi-language support (i18n).",
            "results_en": "- Unified customer + operations experience.\n- Faster multi-branch operations.",
            "scope_en": "Customer app + admin app",
            "client_en": "CafeMS",
        },
    }

    for ar_title, data in translations.items():
        for project in Project.objects.filter(title=ar_title):
            update_fields = []
            for field, value in data.items():
                if not getattr(project, field, ""):
                    setattr(project, field, value)
                    update_fields.append(field)
            if update_fields:
                project.save(update_fields=update_fields)


def unseed_cafems_system_translations(apps, schema_editor):
    Project = apps.get_model("portfolio", "Project")
    titles = [
        "نظام المحاسبة والمالية (CafeMS)",
        "نظام الموارد البشرية وإدارة الموظفين",
        "نظام المتجر والهوية الرقمية",
        "نظام المنتجات والمخزون",
        "نظام الطلبات والطاولات ونقاط البيع",
        "نظام المدفوعات وبوابات الدفع",
        "نظام الفواتير والإيصالات",
        "نظام الولاء والمحفظة الرقمية",
        "نظام الدعم والمحادثات الذكية",
        "نظام المستخدمين والصلاحيات",
        "نظام نماذج التواصل",
        "تطبيق CafeMS للهواتف",
    ]
    Project.objects.filter(title__in=titles).update(
        title_en="",
        description_en="",
        summary_en="",
        goals_en="",
        challenges_en="",
        solution_en="",
        results_en="",
        scope_en="",
        client_en="",
    )


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0009_seed_cafems_systems"),
    ]

    operations = [
        migrations.RunPython(
            seed_cafems_system_translations,
            unseed_cafems_system_translations,
        ),
    ]
