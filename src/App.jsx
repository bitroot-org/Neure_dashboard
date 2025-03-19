import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import LoginPage from "./pages/Login/Login";
// import SignUpPage from './pages/Onboarding'
import OnboardingFlow from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import HelpAndSupport from "./pages/HelpAndSupport";
import AnnouncementsAndNotifications from "./pages/AnnouncementsAndNotifications";
import EmployeeManagement from "./pages/EmployeeManagement";
import Resources from "./pages/Resources";
import RewardsDashboard from "./pages/RewardsDashboard";
import CompanyProfile from "./pages/CompanyProfile";
import WorkshopCard from "./pages/WorkshpCard";
import DashboardLayout from "./pages/MainPage";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import EventDashboard from "./pages/EventDashboard";
import Settings from "./pages/Settings";
import Article from "./pages/Article";
import RemoveEmployee from "./pages/RemoveEmployee";
import AddNewEmployee from "./pages/AddNewEmployee";
import Soundscapes from "./pages/Soundscapes/Soundscapes";
import RewardsAndRecognition from "./pages/RewardsAndRecognition";

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
          path="/employeesManagement"
          element={
            <UserProtectedWrapper>
              <EmployeeManagement />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/resources"
          element={
            <UserProtectedWrapper>
              <Resources />
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
          path="/companyProfile"
          element={
            <UserProtectedWrapper>
              <CompanyProfile />
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
          path="/workshops"
          element={
            <UserProtectedWrapper>
              <EventDashboard />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/settings"
          element={
            <UserProtectedWrapper>
              <Settings />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/articleDetails/:articleId"
          element={
            <UserProtectedWrapper>
              <Article />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/removeEmployee"
          element={
            <UserProtectedWrapper>
              <RemoveEmployee />
            </UserProtectedWrapper>
          }
        />

        <Route
          path= "/addNewEmployee"
          element={
            <UserProtectedWrapper>
              <AddNewEmployee />
            </UserProtectedWrapper>
          }
        />

        <Route
          path="/soundscapes"
          element={
            <UserProtectedWrapper>
              <Soundscapes />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/rewardsAndRecognition"
          element={
            <UserProtectedWrapper>
              <RewardsAndRecognition />
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
