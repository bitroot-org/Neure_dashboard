// DashboardLayout.jsx
import React, { useState, useContext, useEffect } from "react";
import {
  Layout,
  Space,
  Badge,
  Avatar,
  Button,
  Card,
  Spin,
  message,
} from "antd";
import {
  BellOutlined,
  SettingOutlined,
  RightOutlined,
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import CompanyHealthGauge from "../../components/CompanyHealthGauge";
import { UserDataContext } from "../../context/UserContext";
import { CompanyDataContext } from "../../context/CompanyContext";
import PresentationSlide from "../../components/PresentationSlide";
import {
  getWorkshops,
  getCompanyMetrics,
  acceptTermsAndConditions,
  updateDashboardTourStatus,
  getUnreadNotificationCount,
} from "../../services/api";
import TermsModal from "../../components/TermsModal";
import { motion } from "framer-motion";
import PasswordChangeModal from "../../components/PasswordChangeModal";
import { changePassword } from "../../services/api";
import DashboardTour from "../../components/DashboardTour";
import { useNotifications } from "../../context/NotificationContext";

const { Header, Content, Footer } = Layout;

const Home = () => {
  const [workshop, setWorkshop] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [workshopLoading, setWorkshopLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserDataContext);
  const [showTour, setShowTour] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] =
    useState(false);

  const { unreadCount } = useNotifications();

  const loading = workshopLoading || metricsLoading;

  const pageSize = 1;
  const currentPage = 1;

  const {
    companyData,
    isLoading: companyDataLoading,
    refreshCompanyData,
  } = useContext(CompanyDataContext);
  console.log("Company data:", companyData);

  useEffect(() => {
    console.log("CompanyData from context:", companyData);
    console.log("Is context loading:", companyDataLoading);
  }, [companyData, companyDataLoading]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const fetchWorkshop = async () => {
      console.log("fetchWorkshops called");
      try {
        setWorkshopLoading(true);
        setError(null);
        const data = await getWorkshops({
          companyId,
          currentPage,
          pageSize,
        });
        console.log("getWorkshops response:", data);
        if (data.status) {
          if (data.data.length === 0) {
            setWorkshop(null);
            setError(null);
          } else {
            setWorkshop(data.data[0]);
          }
          console.log("Workshop data:", data.data);
        } else {
          setError("Failed to fetch workshops.");
        }
      } catch (error) {
        console.error("Error fetching workshops:", error);
        setError("Failed to fetch workshops. Please try again later.");
      } finally {
        setWorkshopLoading(false);
      }
    };
    fetchWorkshop();
  }, [pageSize]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setMetricsLoading(true);
        const companyId = localStorage.getItem("companyId");
        if (!companyId) {
          message.error("Company ID not found");
          return;
        }

        const response = await getCompanyMetrics(companyId);
        console.log("Metrics response:", response);
        if (response.status) {
          setMetricsData(response.data.metrics);
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
        message.error("Failed to fetch company metrics");
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  useEffect(() => {
    if (location.state?.showTerms) {
      setIsTermsModalVisible(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (location.state?.showTour) {
      setShowTour(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  const getInitial = () => {
    return user.fullName.firstName
      ? user.fullName.firstName[0].toUpperCase()
      : "U";
  };

  const menuItems = [
    {
      key: "profile",
      label: (
        <button className="dropdown-btn">
          <UserOutlined /> Profile Details
        </button>
      ),
    },
    {
      key: "logout",
      label: (
        <button className="dropdown-btn">
          <LogoutOutlined /> Logout
        </button>
      ),
    },
  ];

  const handleLogout = () => {
    try {
      setUser({
        id: "",
        email: "",
        roleId: "",
        userType: "",
        fullName: {
          firstName: "",
          lastName: "",
        },
      });

      localStorage.clear();

      message.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      message.error("Failed to logout properly");
    }
  };

  const handleMenuClick = ({ key }) => {
    if (key === "profile") {
      handleProfileClick();
    } else if (key === "logout") {
      handleLogout();
    }
  };

  const handleProfileClick = () => {
    navigate("/companyProfile");
  };

  const handleViewAllWorkshops = () => {
    navigate("/workshops");
  };

  const handleCompanyGaugeClick = () => {
    navigate("/wellbeing-index");
  };

  const handleViewWorkshopDetails = () => {
    if (workshop && workshop.workshop_id) {
      const scheduleId = workshop.schedule_id || workshop.schedules?.[0]?.id;
      navigate(
        `/workshopDetails/${workshop.workshop_id}?scheduleId=${scheduleId}`
      );
    } else {
      message.error("Workshop details not available");
    }
  };
  const handleTermsAccept = async () => {
    try {
      await acceptTermsAndConditions();

      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          accepted_terms: 1,
        },
      };
      setUser(updatedUser);

      localStorage.setItem("userData", JSON.stringify(updatedUser));

      setIsTermsModalVisible(false);
      message.success("Terms accepted successfully");
    } catch (error) {
      console.error("Error accepting terms:", error);
      message.error("Failed to accept terms");
    }
  };

  const handleTermsCancel = () => {
    setIsTermsModalVisible(false);
    message.info("Please accept the terms to continue");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const getStressStatus = (stressLevel = 0) => {
    if (stressLevel >= 80) return "Excellent";
    if (stressLevel >= 60) return "Good";
    if (stressLevel >= 40) return "Moderate";
    if (stressLevel >= 20) return "wellbeing_score";
    return "Critical";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const truncateName = (name, maxLength) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.5,
      },
    },
  };

  const handleTourComplete = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const response = await updateDashboardTourStatus(userData.id);

      console.log("Tour status update response:", response);

      if (response && response.status) {
        setShowTour(false);
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            has_seen_dashboard_tour: 1,
          },
        };
        setUser(updatedUser);

        const updatedUserData = {
          ...userData,
          profile: {
            ...userData.profile,
            has_seen_dashboard_tour: 1,
          },
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));

        message.success("Tour preferences updated successfully");
      } else {
        throw new Error(response?.message || "Failed to update tour status");
      }
    } catch (error) {
      console.error("Error updating tour status:", error);
      message.error(error.message || "Failed to update tour status");
    }
  };

  const ROIShimmer = () => (
    <div
      style={{
        background:
          "radial-gradient(108.08% 74.37% at 50% 0%, #33353F 0%, #0D0D11 99.73%)",
      }}
      className="rounded-2xl border border-[#3f3c3c] p-4 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div className="h-6 w-28 rounded-md bg-gray-700 animate-pulse"></div>
        <div className="h-4 w-40 rounded-md bg-gray-700 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]"
          >
            <div className="h-3 w-24 rounded bg-gray-700 mb-2 animate-pulse"></div>
            <div className="h-6 w-3/5 rounded bg-gray-700 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const refreshData = async () => {
      if (companyData && refreshCompanyData) {
        await refreshCompanyData();
      }
    };

    refreshData();
  }, []);

  return (
    <div className="flex flex-col gap-3 h-screen w-full px-6 lg:px-28 py-2">
      
      <DashboardTour run={showTour} onClose={handleTourComplete} />
      <header className="w-full border border-slate-600 border-1 rounded-3xl">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="text-white text-2xl font-medium truncate max-w-xs">
              {metricsData?.companyName}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/soundscapes")}
              className="flex items-center gap-2 px-4 py-2 rounded-[110px] h-[52px] text-base text-white transition hover:opacity-95"
              style={{
                background:
                  "radial-gradient(85.53% 85.53% at 50% 14.47%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.10) 100%)",
              }}
            >
              <img
                src="/MusicNotes.png"
                className="w-8 h-8"
                alt="Soundscapes"
              />
              <span className="hidden sm:inline">Soundscapes</span>
            </button>

            <button
              onClick={() => navigate("/employeesManagement")}
              className="flex items-center gap-2 px-4 py-2 rounded-[110px] h-[52px] text-base text-white transition hover:opacity-95"
              style={{
                background:
                  "radial-gradient(85.53% 85.53% at 50% 14.47%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.10) 100%)",
              }}
            >
              <img src="/UserGear.png" className="w-8 h-8" alt="Employees" />
              <span className="hidden sm:inline">Employees</span>
            </button>

            <button
              onClick={handleSettingsClick}
              className="flex items-center gap-2 px-4 py-2 rounded-[110px] h-[52px] text-base text-white transition hover:opacity-95"
              style={{
                background:
                  "radial-gradient(85.53% 85.53% at 50% 14.47%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.10) 100%)",
              }}
            >
              <img src="/GearSix.png" className="w-8 h-8" alt="Settings" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            <Dropdown
              menu={{ items: menuItems, onClick: handleMenuClick }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <div
                className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-[110px] h-[52px] transition hover:opacity-95"
                style={{
                  background:
                    "radial-gradient(85.53% 85.53% at 50% 14.47%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.10) 100%)",
                }}
              >
                {companyData?.company_profile_url ? (
                  <img
                    src={`${
                      companyData.company_profile_url
                    }?${new Date().getTime()}`}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
                    {getInitial()}
                  </div>
                )}

                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-white text-base truncate max-w-[120px]">
                    {truncateName(`${user.fullName.firstName}`, 15)}
                  </span>
                  <DownOutlined className="text-white/70" />
                </div>
              </div>
            </Dropdown>

            <MenuOutlined
              className="text-white text-xl sm:hidden ml-2"
              onClick={toggleMenu}
            />
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="mobile-menu">
          <div
            className="mobile-menu-item"
            onClick={() => navigate("/soundscapes")}
          >
            <img src="/MusicNotes.png" style={{ width: 20, marginRight: 12 }} />
            Soundscapes
          </div>
          <div
            className="mobile-menu-item"
            onClick={() => navigate("/employeesManagement")}
          >
            <img src="/UserGear.png" style={{ width: 20, marginRight: 12 }} />
            Employees
          </div>
          <div className="mobile-menu-item" onClick={handleSettingsClick}>
            <img src="/GearSix.png" style={{ width: 20, marginRight: 12 }} />
            Settings
          </div>

          <div className="mobile-menu-item" onClick={handleProfileClick}>
            <UserOutlined style={{ fontSize: 16, marginRight: 12 }} />
            Profile Details
          </div>
          <div className="mobile-menu-item" onClick={handleLogout}>
            <LogoutOutlined style={{ fontSize: 16, marginRight: 12 }} />
            Logout
          </div>
        </div>
      )}

      <motion.div
        className="flex flex-col md:flex-row gap-4 h-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left column */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <motion.div
            variants={itemVariants}
            className="relative rounded-[24px] overflow-hidden h-[55%]"
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              background:
                "radial-gradient(61.93% 100% at 50% 0%, #33353F 0%, #191A20 100%)",
              boxShadow: "0 12px 8px -8px rgba(0,0,0,0.40)",
            }}
          >
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-white text-2xl font-medium">
                Upcoming Workshops
              </h2>
              <button
                type="link"
                onClick={handleViewAllWorkshops}
                className="text-white"
              >
                View All <RightOutlined />
              </button>
            </div>
            <div
              className="px-4 pb-4"
              onClick={workshop ? handleViewWorkshopDetails : undefined}
              style={{ cursor: workshop ? "pointer" : "default" }}
            >
              {workshopLoading ? (
                <PresentationSlide isLoading={true} />
              ) : error ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-red-400">{error}</p>
                </div>
              ) : (
                <PresentationSlide
                  title={workshop?.title}
                  date={workshop?.start_time}
                  backgroundImage={workshop?.poster_image}
                  endTime={workshop?.end_time}
                  isLoading={false}
                />
              )}
            </div>
          </motion.div>

          <div className="flex gap-4 h-[45%] ">
            <div className="flex flex-col gap-4 w-1/2">
              <motion.div
                variants={itemVariants}
                onClick={() => navigate("/announcements")}
                className="relative rounded-[24px] p-4 cursor-pointer h-1/2"
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  background:
                    "radial-gradient(61.93% 100% at 50% 0%, #33353F 0%, #191A20 100%)",
                  boxShadow: "0 12px 8px -8px rgba(0,0,0,0.40)",
                }}
              >
                {unreadCount > 0 && (
                  <div className="absolute top-3 right-3 z-10 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold shadow">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-2xl">
                    Announcements & Notifications
                  </h3>
                  <img
                    src="announcement.svg"
                    className="w-24 h-24 object-contain"
                    alt="announcement"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                onClick={() => navigate("/support")}
                className="rounded-[24px] p-4 flex items-center gap-4 cursor-pointer  h-1/2"
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  background:
                    "radial-gradient(61.93% 100% at 50% 0%, #33353F 0%, #191A20 100%)",
                  boxShadow: "0 12px 8px -8px rgba(0,0,0,0.40)",
                }}
              >
                <img src="support.svg" className="w-24 h-24 object-contain" alt="support" />
                <h3 className="text-white text-2xl">Help & support</h3>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              onClick={() => navigate("/rewardsAndRecognition")}
              className="flex-1 rounded-[24px] p-4 flex flex-col items-center justify-between cursor-pointer"
              style={{
                border: "1px solid rgba(255,255,255,0.10)",
                background:
                  "radial-gradient(61.93% 100% at 50% 0%, #33353F 0%, #191A20 100%)",
                boxShadow: "0 12px 8px -8px rgba(0,0,0,0.40)",
              }}
            >
              <div className="text-center">
                <h3 className="text-white text-2xl">Rewards & Recognition</h3>
                {/* <h3 className="text-white text-lg">Recognition</h3> */}
              </div>
              <img
                src="Rewards.svg"
                className="w-4/4 h-4/4 mt-2"
                alt="Rewards"
              />
            </motion.div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="flex gap-4">
            <motion.div
              variants={itemVariants}
              className="flex-1 cursor-pointer"
            >
              <CompanyHealthGauge
                value={Math.round(companyData?.wellbeing_score || 0)}
                maxValue={100}
                title="Wellbeing Index"
                status={getStressStatus(companyData?.wellbeing_score || 0)}
                onClick={handleCompanyGaugeClick}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              onClick={() => navigate("/resources")}
              className="flex-1 rounded-[24px] p-4 flex flex-col items-center justify-between cursor-pointer"
              style={{
                border: "1px solid rgba(255,255,255,0.10)",
                background:
                  "radial-gradient(61.93% 100% at 50% 0%, #33353F 0%, #191A20 100%)",
                boxShadow: "0 12px 8px -8px rgba(0,0,0,0.40)",
              }}
            >
              <h3 className="text-white text-2xl">Resources</h3>
              <img
                src="./resources.svg"
                className="w-3/4 h-3/4 mt-2"
                alt="Resources"
              />
            </motion.div>
          </div>

          {/* ROI should grow to fill remaining height — use flex-1 instead of percentage height */}
          <motion.div
            variants={itemVariants}
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer flex-1"
          >
            {metricsLoading ? (
              <ROIShimmer />
            ) : (
              <div
                className="rounded-[24px] p-4 h-full flex flex-col"
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  background:
                    "radial-gradient(61.93% 100% at 50% 0%, #33353F 0%, #191A20 100%)",
                  boxShadow: "0 12px 8px -8px rgba(0,0,0,0.40)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white text-2xl">ROI</h3>
                  <span className="text-sm text-gray-300">
                    Compare to prev. month
                  </span>
                </div>

                {/* Make grid and internal cards stretch to fill available height */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
                  {[
                    {
                      label: "Stress Levels",
                      value: Math.round(companyData?.stress_level || 0),
                      trend: companyData?.stress_trend,
                    },
                    {
                      label: "Psychological Safety Index (PSI)",
                      value: Math.round(
                        companyData?.psychological_safety_index || 0
                      ),
                      trend: companyData?.psi_trend,
                    },
                    {
                      label: "Employee Retention",
                      value: Math.round(companyData?.retention_rate || 0),
                      trend: companyData?.retention_trend,
                    },
                    {
                      label: "Employee Engagement",
                      value: Math.round(companyData?.engagement_score || 0),
                      trend: companyData?.engagement_trend,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="rounded-[24px] p-4 flex flex-col justify-center h-full"
                      style={{
                        border: "1px solid rgba(255,255,255,0.10)",
                        background:
                          "radial-gradient(61.93% 100% at 50% 0%, #33353F 0%, #191A20 100%)",
                        boxShadow: "0 12px 8px -8px rgba(0,0,0,0.40)",
                      }}
                    >
                      <span className="text-sm text-gray-300">{item.label}</span>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="text-white font-semibold text-2xl">
                          {item.value}%
                        </div>
                        <img
                          src={
                            item.trend === "stable"
                              ? "Upward.png"
                              : item.trend === "up"
                              ? "Upward.png"
                              : "/Downward.png"
                          }
                          className="h-4 w-4"
                          alt="trend"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      <footer className="w-full">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm text-gray-300">
          <span className="text-gray-300">Lumos by</span>
          <img src="./neure.png" alt="Neure Icon" className="h-6 ml-1" />
        </div>
      </footer>

      <TermsModal
        isOpen={isTermsModalVisible}
        onClose={() => setIsTermsModalVisible(false)}
        onAccept={handleTermsAccept}
      />
    </div>
  );
};

export default Home;
