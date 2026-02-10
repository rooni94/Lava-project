import { Routes, Route, Navigate } from "react-router-dom";
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
  DashboardSectionsPage,
  DashboardSettingsPage,
} from "./routes/lazy";

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
        <Route path="/reset-password" element={<ResetRequestPage />} />
        <Route path="/reset-password/confirm" element={<ResetConfirmPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/services"
          element={
            <ProtectedRoute>
              <DashboardServicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/projects"
          element={
            <ProtectedRoute>
              <DashboardProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/blog"
          element={
            <ProtectedRoute>
              <DashboardBlogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/team"
          element={
            <ProtectedRoute>
              <DashboardTeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/clients"
          element={
            <ProtectedRoute>
              <DashboardClientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/packages"
          element={
            <ProtectedRoute>
              <DashboardPackagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/jobs"
          element={
            <ProtectedRoute>
              <DashboardJobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/messages"
          element={
            <ProtectedRoute>
              <DashboardMessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/job-applications"
          element={
            <ProtectedRoute>
              <DashboardJobApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/support-chat"
          element={
            <ProtectedRoute>
              <DashboardSupportChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/media"
          element={
            <ProtectedRoute>
              <DashboardMediaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/pages"
          element={
            <ProtectedRoute>
              <DashboardPagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/sections"
          element={
            <ProtectedRoute>
              <DashboardSectionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <DashboardSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard/login" element={<DashboardLoginPage />} />
      </Routes>
    </Suspense>
  );
}
