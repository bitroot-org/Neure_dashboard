import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./index.css";
import PageTransition from "./components/PageTransition/PageTransition";

import LoginPage from "./pages/Login/Login";
// import SignUpPage from './pages/Onboarding'
import OnboardingFlow from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import ForgotPasswordPage from "./pages/ResetPassword/ResetPassword";
import HelpAndSupport from "./pages/HelpAndSupport";
import AnnouncementsAndNotifications from "./pages/AnnouncementsAndNotifications/AnnouncementsAndNotifications";
import EmployeeManagement from "./pages/EmployeeManagement";
import Resources from "./pages/Resources";
import RewardsDashboard from "./pages/RewardsDashboard";
import CompanyProfile from "./pages/CompanyProfile";
import WorkshopCard from "./pages/WorkshpCard";
import DashboardLayout from "./pages/Home/Home";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import EventDashboard from "./pages/EventDashboard";
import Settings from "./pages/Settings";
import Article from "./pages/Article";
import RemoveEmployee from "./pages/RemoveEmployee";
import AddNewEmployee from "./pages/AddNewEmployee";
import Soundscapes from "./pages/Soundscapes/Soundscapes";
import RewardsAndRecognition from "./pages/RewardsAndRecognition";
import FavouriteSoundscapes from './pages/FavouriteSoundscapes/FavouriteSoundscapes';
import { Pagination } from "antd";
import WellbeingIndex from "./pages/WellbeingIndex";
import SetNewPasswordPage from "./pages/ResetPassword/SetNewPassword";

function App() {
  const location = useLocation();

  return (
    <div className="main-content-wrapper">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PageTransition>
                <LoginPage />
              </PageTransition>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageTransition>
                <ForgotPasswordPage />
              </PageTransition>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PageTransition>
                <SetNewPasswordPage />
              </PageTransition>
            }
          />

          {/* Protected Routes - All Parallel */}
          <Route
            path="/"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                  <DashboardLayout />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/dashboard"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <Dashboard />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/support"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <HelpAndSupport />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/announcements"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <AnnouncementsAndNotifications />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/employeesManagement"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <EmployeeManagement />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/resources"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <Resources />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/rewards"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <RewardsDashboard />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/companyProfile"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <CompanyProfile />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/workshopDetails/:workshopId"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <WorkshopCard />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/onboarding"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <OnboardingFlow />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />

          <Route
            path="/workshops"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <EventDashboard />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/settings"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <Settings />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/articleDetails/:articleId"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <Article />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/removeEmployee"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <RemoveEmployee />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />

          <Route
            path="/addNewEmployee"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <AddNewEmployee />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />

          <Route
            path="/soundscapes"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <Soundscapes />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/rewardsAndRecognition"
            element={
              <UserProtectedWrapper>
                <PageTransition>
                <RewardsAndRecognition />
                </PageTransition>
              </UserProtectedWrapper>
            }
          />
          <Route path="/favourite-soundscapes" element={<FavouriteSoundscapes />} />
          <Route path="/wellbeing-index" element={<WellbeingIndex />} />

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
