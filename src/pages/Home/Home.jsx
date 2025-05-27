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
  MenuOutlined, // Add this import
} from "@ant-design/icons";
import { Dropdown } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";
import CompanyHealthGauge from "../../components/CompanyHealthGauge";
import { UserDataContext } from "../../context/UserContext";
import { CompanyDataContext } from "../../context/CompanyContext";
import PresentationSlide from "../../components/PresentationSlide";
import {
  logoutUser,
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
import DashboardTour from "../../components/DashboardTour/DashboardTour";

const { Header, Content, Footer } = Layout;

const Home = () => {
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [notificationLoading, setNotificationLoading] = useState(false);
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

  // Add this computed property to determine overall loading state
  const loading = workshopLoading || metricsLoading;

  const pageSize = 1;
  const currentPage = 1;

  const { companyData, isLoading } = useContext(CompanyDataContext);
  console.log("Company data:", companyData);

  useEffect(() => {
    // Debug log to check what data we have from context
    console.log("CompanyData from context:", companyData);
    console.log("Is context loading:", isLoading);
  }, [companyData, isLoading]);

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
            // Set workshop to null to trigger empty state in PresentationSlide
            setWorkshop(null);
            // Don't set an error message
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
      // Clean up the state to prevent modal from showing on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (location.state?.showTour) {
      setShowTour(true);
      // Clean up the state to prevent tour from showing on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

    // Add useEffect to fetch unread notification count
  useEffect(() => {
    const fetchUnreadNotificationCount = async () => {
      if (!user?.id || !user?.companyId) return;

      try {
        setNotificationLoading(true);
        const response = await getUnreadNotificationCount(
          user.id,
          user.companyId
        );

        if (response.status && response.data) {
          setUnreadNotificationCount(response.data.count);
        } else {
          // Silently fail - don't show error to user
          console.error(
            "Failed to fetch notification count:",
            response.message
          );
          setUnreadNotificationCount(0);
        }
      } catch (error) {
        // Silently fail - don't show error to user
        console.error("Error fetching notification count:", error);
        setUnreadNotificationCount(0);
      } finally {
        setNotificationLoading(false);
      }
    };

    fetchUnreadNotificationCount();

    // Set up interval to refresh count every minute (60000ms)
    const intervalId = setInterval(fetchUnreadNotificationCount, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [user?.id, user?.companyId]);

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

  const handleLogout = async () => {
    try {
      const response = await logoutUser();

      if (response.status) {
        // First reset user context with empty state
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
      }
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
      // Make sure to pass the schedule_id as a URL parameter
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

      // Update user context
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          accepted_terms: 1,
        },
      };
      setUser(updatedUser);

      // Update localStorage
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

  // Add this handler function along with your other handlers
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
        staggerChildren: 0.2, // adds delay between children animations
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

      // Check if the response is successful before proceeding
      if (response && response.status) {
        setShowTour(false);
        // Update user context
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            has_seen_dashboard_tour: 1,
          },
        };
        setUser(updatedUser); // Changed from updateUser to setUser

        // Update localStorage
        const updatedUserData = {
          ...userData,
          profile: {
            ...userData.profile,
            has_seen_dashboard_tour: 1,
          },
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));

        // Show success message only if API call was successful
        message.success("Tour preferences updated successfully");
      } else {
        // Only show error if the API response indicates failure
        throw new Error(response?.message || "Failed to update tour status");
      }
    } catch (error) {
      console.error("Error updating tour status:", error);
      message.error(error.message || "Failed to update tour status");
    }
  };

  const ROIShimmer = () => (
    <div className="main-roi-card">
      <div className="main-roi-header">
        <div className="shimmer-title shimmer-effect"></div>
        <div className="shimmer-subtitle shimmer-effect"></div>
      </div>
      <div className="main-roi-metrics">
        <div className="main-roi-item shimmer-container">
          <div className="shimmer-label shimmer-effect"></div>
          <div className="shimmer-value shimmer-effect"></div>
        </div>
        <div className="main-roi-item shimmer-container">
          <div className="shimmer-label shimmer-effect"></div>
          <div className="shimmer-value shimmer-effect"></div>
        </div>
        <div className="main-roi-item shimmer-container">
          <div className="shimmer-label shimmer-effect"></div>
          <div className="shimmer-value shimmer-effect"></div>
        </div>
        <div className="main-roi-item shimmer-container">
          <div className="shimmer-label shimmer-effect"></div>
          <div className="shimmer-value shimmer-effect"></div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout className="main-dashboard-layout">
      <DashboardTour run={showTour} onClose={handleTourComplete} />
      <div className="main-header">
        <div className="main-company-title">{metricsData?.companyName}</div>
        <div className="main-header-right">
          <div
            className="main-header-button"
            onClick={() => navigate("/soundscapes")}
          >
            <img src="/MusicNotes.png" />
            <h3>Soundscapes</h3>
          </div>
          <div
            className="main-header-button"
            onClick={() => navigate("/employeesManagement")}
          >
            <img src="/UserGear.png" style={{ cursor: "pointer" }} />
            <h3>Employess</h3>
          </div>
          <div
            className="main-header-button"
            onClick={handleSettingsClick}
            style={{ cursor: "pointer" }}
          >
            <img src="/GearSix.png" />
            <h3>Settings</h3>
          </div>

          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            placement="bottomRight"
            trigger={["click"]}
            overlayStyle={{ minWidth: "160px" }}
          >
            <div className="main-user-info">
              {companyData?.company_profile_url ? (
                <img
                  src={companyData?.company_profile_url}
                  alt="profile"
                  className="main-avatar"
                />
              ) : (
                <div className="main-avatar">{getInitial()}</div>
              )}
              <h3 className="main-user-name">
                {truncateName(`${user.fullName.firstName}`, 15)}
                <DownOutlined style={{ marginLeft: 18 }} />
              </h3>
            </div>
          </Dropdown>
          <MenuOutlined className="hamburger-menu" onClick={toggleMenu} />
        </div>
      </div>

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
        className="main-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {" "}
        <div className="main-dashboard-left">
            <motion.div
              className="main-workshop-banner"
              variants={itemVariants}
            >
              {" "}
              <div className="main-workshops-header">
                <h2>Upcoming Workshops</h2>
                <Button
                  type="link"
                  onClick={handleViewAllWorkshops}
                  className="view-all"
                >
                  View All <RightOutlined />
                </Button>
              </div>
              <div
                className="main-workshops-image-card"
                onClick={handleViewWorkshopDetails}
                style={{ cursor: "pointer" }}
              >
                {workshopLoading ? (
                  <PresentationSlide isLoading={true} />
                ) : error ? (
                  <div className="workshop-error">
                    <p>{error}</p>
                  </div>
                ) : (
                  <div
                    onClick={handleViewWorkshopDetails}
                    style={{ cursor: "pointer" }}
                  >
                    <PresentationSlide
                      title={workshop?.title}
                      date={workshop?.start_time}
                      backgroundImage={workshop?.poster_image}
                      endTime={workshop?.end_time}
                      isLoading={false}
                    />
                  </div>
                )}
              </div>
            </motion.div>

            <div className="main-bottom-cards">
              <div className="main-left-cards">
                <motion.div
                  variants={itemVariants}
                  className="main-announcement-card"
                  onClick={() => navigate("/announcements")}
                  style={{ cursor: "pointer" }}
                >
                  <h3>Announcements & Notifications</h3>
                  {!notificationLoading && unreadNotificationCount > 0 && (
                    <div className="notification-badge">
                      <p>
                        {unreadNotificationCount > 99
                          ? "99+"
                          : unreadNotificationCount}
                      </p>
                    </div>
                  )}{" "}
                  <img src="announcement.svg" alt="marketing icon" />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="main-support-card"
                  onClick={() => navigate("/support")}
                  style={{ cursor: "pointer" }}
                >
                  <img src="support.svg" alt="support icon" />
                  <h3>Help & support</h3>
                </motion.div>
              </div>

              <motion.div
                variants={itemVariants}
                className="main-rewards-card"
                onClick={() => navigate("/rewardsAndRecognition")}
                style={{ cursor: "pointer" }}
              >
                <div className="main-rewards-content">
                  <h3>Rewards &</h3>
                  <h3>Recognition</h3>
                </div>

                <img src="Rewards.svg" alt="Rewards and Recognition" />
              </motion.div>
            </div>
        </div>
        <div className="main-dashboard-right">
          <div className="main-metrics-cards">
            <motion.div variants={itemVariants} style={{ cursor: "pointer" }}>
              <CompanyHealthGauge
                className="main-company-health-gauge"
                value={companyData?.wellbeing_score || 0}
                maxValue={100}
                title="Wellbeing Index"
                status={getStressStatus(companyData?.wellbeing_score || 0)}
                onClick={handleCompanyGaugeClick}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="main-resource-card"
              onClick={() => navigate("/resources")}
              style={{ cursor: "pointer" }}
            >
              <h3>Resources</h3>
              <img src="./resources.svg" alt="Rewards and Recognition" />
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="main-roi-card"
            onClick={() => navigate("/dashboard")}
          >
            {metricsLoading ? (
              <ROIShimmer />
            ) : (
              <>
                <div className="main-roi-header">
                  <h3>ROI</h3>
                  <span>Compare to prev. month</span>
                </div>
                <div className="main-roi-metrics">
                  <div className="main-roi-item">
                    <span>Stress Levels</span>
                    <div className="main-percentage">
                      {Math.round(companyData?.stress_level || 0)}%{" "}
                      <img
                        src={
                          companyData?.stress_trend === "no_change"
                            ? "Upward.png"
                            : companyData?.stress_trend === "up"
                            ? "Downward.png"
                            : "/Upward.png"
                        }
                      />
                    </div>
                  </div>
                  <div className="main-roi-item">
                    <span>Psychological Safety Index (PSI)</span>
                    <div className="main-percentage">
                      {Math.round(companyData?.psychological_safety_index || 0)}
                      %{" "}
                      <img
                        src={
                          companyData?.psi_trend === "no_change"
                            ? "Upward.png"
                            : companyData?.psi_trend === "up"
                            ? "Upward.png"
                            : "/Downward.png"
                        }
                      />
                    </div>
                  </div>
                  <div className="main-roi-item">
                    <span>Employee Retention</span>
                    <div className="main-percentage">
                      {Math.round(companyData?.retention_rate || 0)}%{" "}
                      <img
                        src={
                          companyData?.retention_trend === "no_change"
                            ? "Upward.png"
                            : companyData?.retention_trend === "up"
                            ? "Upward.png"
                            : "/Downward.png"
                        }
                      />
                    </div>
                  </div>
                  <div className="main-roi-item">
                    <span>Employee Engagement</span>
                    <div className="main-percentage">
                      {Math.round(companyData?.engagement_score || 0)}%{" "}
                      <img
                        src={
                          companyData?.engagement_trend === "no_change"
                            ? "Upward.png"
                            : companyData?.engagement_trend === "up"
                            ? "Upward.png"
                            : "/Downward.png"
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      <Footer className="main-footer">
        <div className="main-footer-content">
          Powered by{" "}
          <img src="./neure.png" alt="Neure Icon" className="main-neure-icon" />
        </div>
      </Footer>

      <TermsModal
        isOpen={isTermsModalVisible}
        onClose={() => setIsTermsModalVisible(false)}
        onAccept={handleTermsAccept}
      />
    </Layout>
  );
};

export default Home;
