import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./index.css";
import PageTransition from "./components/PageTransition/PageTransition";

import LoginPage from "./pages/Login/Login";
// import SignUpPage from './pages/Onboarding'
import OnboardingFlow from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
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
import { Pagination } from "antd";
import AdminProtectedWrapper from "./pages/AdminProtectedWrapper";
import EmployeeProtectedWrapper from "./pages/EmployeeProtectedWrapper";
import Assessments from "./pages/Assessments/Assessments";
import AssessmentQuestions from "./pages/AssessmentQuestions/AssessmentQuestions";

function App() {
  return (
    <BrowserRouter>
      <div className="main-content-wrapper">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Route */}
            <Route
              path="/login"
              element={
                <PageTransition>
                  <LoginPage />
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
                  <AdminProtectedWrapper>
                    <PageTransition>
                      <EmployeeManagement />
                    </PageTransition>
                  </AdminProtectedWrapper>
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
                  <AdminProtectedWrapper>
                    <PageTransition>
                      <RemoveEmployee />
                    </PageTransition>
                  </AdminProtectedWrapper>
                </UserProtectedWrapper>
              }
            />

            <Route
              path="/addNewEmployee"
              element={
                <UserProtectedWrapper>
                  <AdminProtectedWrapper>
                    <PageTransition>
                      <AddNewEmployee />
                    </PageTransition>
                  </AdminProtectedWrapper>
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

            {/* Employee Only Routes */}
            <Route
              path="/assessments"
              element={
                <UserProtectedWrapper>
                  <EmployeeProtectedWrapper>
                    <PageTransition>
                      <Assessments />
                    </PageTransition>
                  </EmployeeProtectedWrapper>
                </UserProtectedWrapper>
              }
            />
            <Route
              path="/assessmentQuestions"
              element={
                <UserProtectedWrapper>
                  <EmployeeProtectedWrapper>
                    <PageTransition>
                      <AssessmentQuestions />
                    </PageTransition>
                  </EmployeeProtectedWrapper>
                </UserProtectedWrapper>
              }
            />

            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;
