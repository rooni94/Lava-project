import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense } from "react";
import PageGuard from "./components/layout/PageGuard";
import { useTranslation } from "react-i18next";
import SiteThemeLoader from "./components/SiteThemeLoader";
import ScrollToTop from "./components/ScrollToTop";
import {
  HomePage,
  AboutPage,
  ServicesPage,
  ServiceDetailPage,
  PortfolioPage,
  ProjectDetailPage,
  PackagesPage,
  PackageDetailPage,
  BlogPage,
  BlogDetailPage,
  ContactPage,
  CareersPage,
  ResetRequestPage,
  ResetConfirmPage,
  DashboardPage,
  DashboardLoginPage,
  DashboardServicesPage,
  DashboardProjectsPage,
  DashboardBlogPage,
  DashboardTeamPage,
  DashboardClientsPage,
  DashboardPackagesPage,
  DashboardJobsPage,
  DashboardMessagesPage,
  DashboardJobApplicationsPage,
  DashboardSupportChatPage,
  DashboardMediaPage,
  DashboardPagesPage,
  DashboardSectionsPage, PrivacyPolicyPage, TermsConditionsPage,
  DashboardSettingsPage,
} from "./routes/lazy";

const DASHBOARD_ACCESS_KEY = (import.meta.env.VITE_DASHBOARD_ACCESS_KEY || "").trim();
const DASHBOARD_GATE_FLAG = "dashboard_access_granted";

function DashboardGate({ children }: { children: JSX.Element }) {
  const location = useLocation();
  if (!DASHBOARD_ACCESS_KEY) return children;

  const params = new URLSearchParams(location.search);
  const key = params.get("k");
  if (key && key === DASHBOARD_ACCESS_KEY) {
    sessionStorage.setItem(DASHBOARD_GATE_FLAG, "1");
    return children;
  }

  const unlocked = sessionStorage.getItem(DASHBOARD_GATE_FLAG) === "1";
  return unlocked ? children : <Navigate to="/" replace />;
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/dashboard/login" replace />;
}

export default function App() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  return (
    <Suspense fallback={<div className="p-6 text-center">{isAr ? "جارٍ التحميل..." : "Loading..."}</div>}>
      <SiteThemeLoader />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PageGuard slug="home"><HomePage /></PageGuard>} />
        <Route path="/about" element={<PageGuard slug="about"><AboutPage /></PageGuard>} />
        <Route path="/services" element={<PageGuard slug="services"><ServicesPage /></PageGuard>} />
        <Route path="/services/:id" element={<PageGuard slug="services"><ServiceDetailPage /></PageGuard>} />
        <Route path="/portfolio" element={<PageGuard slug="portfolio"><PortfolioPage /></PageGuard>} />
        <Route path="/portfolio/:id" element={<PageGuard slug="portfolio"><ProjectDetailPage /></PageGuard>} />
        <Route path="/packages" element={<PageGuard slug="packages"><PackagesPage /></PageGuard>} />
        <Route path="/packages/:id" element={<PageGuard slug="packages"><PackageDetailPage /></PageGuard>} />
        <Route path="/blog" element={<PageGuard slug="blog"><BlogPage /></PageGuard>} />
        <Route path="/blog/:slug" element={<PageGuard slug="blog"><BlogDetailPage /></PageGuard>} />
        <Route path="/contact" element={<PageGuard slug="contact"><ContactPage /></PageGuard>} />
        <Route path="/careers" element={<PageGuard slug="careers"><CareersPage /></PageGuard>} />
        <Route path="/privacy-policy" element={<PageGuard slug="privacy-policy"><PrivacyPolicyPage /></PageGuard>} />
        <Route path="/terms-conditions" element={<PageGuard slug="terms-conditions"><TermsConditionsPage /></PageGuard>} />
        <Route path="/reset-password" element={<ResetRequestPage />} />
        <Route path="/reset-password/confirm" element={<ResetConfirmPage />} />

        <Route path="/dashboard/login" element={<DashboardGate><DashboardLoginPage /></DashboardGate>} />
        <Route path="/dashboard" element={<DashboardGate><ProtectedRoute><DashboardPage /></ProtectedRoute></DashboardGate>} />
        <Route path="/dashboard/services" element={<DashboardGate><ProtectedRoute><DashboardServicesPage /></ProtectedRoute></DashboardGate>} />
        <Route path="/dashboard/projects" element={<DashboardGate><ProtectedRoute><DashboardProjectsPage /></ProtectedRoute></DashboardGate>} />
        <Route path="/dashboard/blog" element={<DashboardGate><ProtectedRoute><DashboardBlogPage /></ProtectedRoute></DashboardGate>} />
        <Route path="/dashboard/team" element={<DashboardGate><ProtectedRoute><DashboardTeamPage /></ProtectedRoute></DashboardGate>} />
        <Route path="/dashboard/clients" element={<DashboardGate><ProtectedRoute><DashboardClientsPage /></ProtectedRoute></DashboardGate>} />
        <Route path="/dashboard/packages" element={<DashboardGate><ProtectedRoute><DashboardPackagesPage /></ProtectedRoute></DashboardGate>} />
        <Route path="/dashboard/jobs" element={<DashboardGate><ProtectedRoute><DashboardJobsPage /></ProtectedRoute></DashboardGate>} />
        <Route path="/dashboard/messages" element={<DashboardGate><ProtectedRoute><DashboardMessagesPage /></ProtectedRoute></DashboardGate>} />
        <Route path="/dashboard/job-applications" element={<DashboardGate><ProtectedRoute><DashboardJobApplicationsPage /></ProtectedRoute></DashboardGate>} />
        <Route path="/dashboard/support-chat" element={<DashboardGate><ProtectedRoute><DashboardSupportChatPage /></ProtectedRoute></DashboardGate>} />
        <Route path="/dashboard/media" element={<DashboardGate><ProtectedRoute><DashboardMediaPage /></ProtectedRoute></DashboardGate>} />
        <Route path="/dashboard/pages" element={<DashboardGate><ProtectedRoute><DashboardPagesPage /></ProtectedRoute></DashboardGate>} />
        <Route path="/dashboard/sections" element={<DashboardGate><ProtectedRoute><DashboardSectionsPage /></ProtectedRoute></DashboardGate>} />
        <Route path="/dashboard/settings" element={<DashboardGate><ProtectedRoute><DashboardSettingsPage /></ProtectedRoute></DashboardGate>} />
      </Routes>
    </Suspense>
  );
}
