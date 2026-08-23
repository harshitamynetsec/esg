import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import NotificationCenter from './components/platform/NotificationCenter';
import AppLayout from './layouts/AppLayout';
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import PricingPage from './pages/public/PricingPage';
import ContactPage from './pages/public/ContactPage';
import ServicesPage from './pages/public/ServicesPage';
import SolutionsPage from './pages/public/SolutionsPage';
import CompassIntroPage from './pages/public/CompassIntroPage';
import CompassQuestionnairePage from './pages/public/CompassQuestionnairePage';
import CompassResultsPage from './pages/public/CompassResultsPage';
import BookDemoPage from './pages/public/BookDemoPage';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import SetPasswordPage from './pages/auth/SetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ESGScoresPage from './pages/dashboard/ESGScoresPage';
import AnalyticsDashboard from './components/dashboard/AnalyticsDashboard';
import WelcomePage from './pages/onboarding/WelcomePage';
import OnboardingLearningHubPage from './pages/onboarding/LearningHubPage';
import QuestionnairePage from './pages/onboarding/QuestionnairePage';
import MaterialTopicsPage from './pages/onboarding/MaterialTopicsPage';
import MaterialityMatrixPage from './pages/onboarding/MaterialityMatrixPage';
import GoalsKPIsPage from './pages/onboarding/GoalsKPIsPage';
import OnboardingCompletePage from './pages/onboarding/OnboardingCompletePage';
import LearningHubPage from './pages/learning/LearningHubPage';
import ObjectivesPage from './pages/objectives/ObjectivesPage';
import PoliciesPage from './pages/policies/PoliciesPage';
import ReportsPage from './pages/reports/ReportsPage';
import ReportViewerPage from './pages/reports/ReportViewerPage';
import SettingsPage from './pages/settings/SettingsPage';
import TeamManagementPage from './pages/team/TeamManagementPage';
import HelpCenterPage from './pages/help/HelpCenterPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UsersPage from './pages/admin/UsersPage';
import CompaniesPage from './pages/admin/CompaniesPage';
import CompanyDetailsPage from './pages/admin/CompanyDetailsPage';
import SubscriptionsPage from './pages/admin/SubscriptionsPage';
import BillingPage from './pages/admin/BillingPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import RolesPage from './pages/admin/RolesPage';
import ContactQueriesPage from './pages/admin/ContactQueriesPage';
import DemoRequestsPage from './pages/admin/DemoRequestsPage';
import PlatformSettingsPage from './pages/admin/PlatformSettingsPage';
import SupportPage from './pages/admin/SupportPage';
import TermsPage from './pages/public/TermsPage';
import PrivacyPage from './pages/public/PrivacyPage';
import IndustriesPage from './pages/public/IndustriesPage';
import ResourcesPage from './pages/public/ResourcesPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <NotificationCenter />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/industries/:industry" element={<IndustriesPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/book-demo" element={<BookDemoPage />} />
            <Route path="/compass" element={<CompassIntroPage />} />
            <Route path="/compass/questionnaire" element={<CompassQuestionnairePage />} />
            <Route path="/compass/results" element={<CompassResultsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-in" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/set-password" element={<SetPasswordPage />} />
            <Route path="/try" element={<CompassIntroPage />} />
            <Route path="/legal/terms" element={<TermsPage />} />
            <Route path="/legal/privacy" element={<PrivacyPage />} />
            <Route path="/admin" element={<Navigate to="/app/admin/overview" replace />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<AppLayout />}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="analytics" element={<AnalyticsDashboard />} />
                <Route path="scores" element={<ESGScoresPage />} />
                <Route path="onboarding" element={<WelcomePage />} />
                <Route path="onboarding/learning" element={<OnboardingLearningHubPage />} />
                <Route path="onboarding/questionnaire" element={<QuestionnairePage />} />
                <Route path="onboarding/material-topics" element={<MaterialTopicsPage />} />
                <Route path="onboarding/materiality-matrix" element={<MaterialityMatrixPage />} />
                <Route path="onboarding/goals-kpis" element={<GoalsKPIsPage />} />
                <Route path="onboarding/complete" element={<OnboardingCompletePage />} />
                <Route path="kpis" element={<GoalsKPIsPage />} />
                <Route path="objectives" element={<ObjectivesPage />} />
                <Route path="material-topics" element={<MaterialTopicsPage />} />
                <Route path="policies" element={<PoliciesPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="reports/:id" element={<ReportViewerPage />} />
                <Route path="learning" element={<LearningHubPage />} />
                <Route path="team" element={<TeamManagementPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="help" element={<HelpCenterPage />} />
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/app/admin/overview" replace />} />
                  <Route path="overview" element={<AdminDashboardPage />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="roles" element={<RolesPage />} />
                  <Route path="companies" element={<CompaniesPage />} />
                  <Route path="companies/:id" element={<CompanyDetailsPage />} />
                  <Route path="subscriptions" element={<SubscriptionsPage />} />
                  <Route path="billing" element={<BillingPage />} />
                  <Route path="reports" element={<AdminReportsPage />} />
                  <Route path="analytics" element={<AdminAnalyticsPage />} />
                  <Route path="audit-logs" element={<AuditLogsPage />} />
                  <Route path="contact-queries" element={<ContactQueriesPage />} />
                  <Route path="demo-requests" element={<DemoRequestsPage />} />
                  <Route path="support" element={<SupportPage />} />
                  <Route path="settings" element={<PlatformSettingsPage />} />
                  <Route path="*" element={<Navigate to="/app/admin/overview" replace />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
