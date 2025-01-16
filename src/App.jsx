import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import LoginPage from "./pages/Login";
// import SignUpPage from './pages/Onboarding'
import OnboardingFlow from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import HelpAndSupport from "./pages/HelpAndSupport";
import AnnouncementsAndNotifications from "./pages/AnnouncementsAndNotifications";
import EmployeeManagement from "./pages/EmployeeManagement";
import Article from "./pages/Articles";
import RewardsDashboard from "./pages/RewardsDashboard";
import CompanyProfile from "./pages/CompanyProfile";
import WorkshopCard from "./pages/WorkshpCard";
import DashboardLayout from "./pages/MainPage";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import EventDashboard from "./pages/EventDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes - All Parallel */}
        <Route
          path="/"
          element={
            <UserProtectedWrapper>
              <DashboardLayout />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/dashboard"
          element={
            <UserProtectedWrapper>
              <Dashboard />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/support"
          element={
            <UserProtectedWrapper>
              <HelpAndSupport />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/announcements"
          element={
            <UserProtectedWrapper>
              <AnnouncementsAndNotifications />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/employees"
          element={
            <UserProtectedWrapper>
              <EmployeeManagement />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/articles"
          element={
            <UserProtectedWrapper>
              <Article />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/rewards"
          element={
            <UserProtectedWrapper>
              <RewardsDashboard />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/company"
          element={
            <UserProtectedWrapper>
              <CompanyProfile />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/workshopDetails"
          element={
            <UserProtectedWrapper>
              <WorkshopCard />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/workshopDetails/:workshopId"
          element={
            <UserProtectedWrapper>
              <WorkshopCard />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/onboarding"
          element={
            <UserProtectedWrapper>
              <OnboardingFlow />
            </UserProtectedWrapper>
          }
        />

        <Route
          path="/eventDashboard"
          element={
            <UserProtectedWrapper>
              <EventDashboard />
            </UserProtectedWrapper>
          }
        />

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
