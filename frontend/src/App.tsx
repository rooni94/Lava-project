import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
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
  DashboardSupportChatPage,
  DashboardMediaPage,
  DashboardPagesPage,
  DashboardSectionsPage,
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:id" element={<ProjectDetailPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/packages/:id" element={<PackageDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/careers" element={<CareersPage />} />
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
        <Route path="/dashboard/login" element={<DashboardLoginPage />} />
      </Routes>
    </Suspense>
  );
}
