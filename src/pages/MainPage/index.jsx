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
} from "../../services/api";
import TermsModal from "../../components/TermsModal";

const { Header, Content, Footer } = Layout;

const DashboardLayout = () => {
  const [hasNotifications, setHasNotifications] = useState(false);
  const [workshop, setWorkshop] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserDataContext);

  const pageSize = 1;
  const currentPage = 1;

  const { companyData } = useContext(CompanyDataContext);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const fetchWorkshop = async () => {
      console.log("fetchWorkshops called");
      try {
        setLoading(true);
        setError(null);
        const data = await getWorkshops({
          companyId,
          currentPage,
          pageSize,
        });
        console.log("getWorkshops response:", data);
        if (data.status) {
          setWorkshop(data.data[0]);
          console.log("Workshop data:", data.data);
          // setTotalPages(data.pagination.totalPages);
          if (data.data.length === 0) {
            setError("No workshops available.");
          }
        } else {
          setError("Failed to fetch workshops.");
        }
      } catch (error) {
        console.error("Error fetching workshops:", error);
        setError("Failed to fetch workshops. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshop();
  }, [pageSize]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Add this useEffect to show modal when navigating from success page
  useEffect(() => {
    if (location.state?.showTerms) {
      setIsTermsModalVisible(true);
      // Clean up the state to prevent modal from showing on refresh
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
    navigate("/dashboard");
  };


  const handleViewWorkshopDetails = () => {
    if (workshop && workshop.workshop_id) {
      navigate(`/workshopDetails/${workshop.workshop_id}`);
    } else {
      message.error("Workshop details not available");
    }
  };
  const handleTermsAccept = () => {
    setIsTermsModalVisible(false);
  };

  const handleTermsCancel = () => {
    setIsTermsModalVisible(false);
    message.info("Please accept the terms to continue");
  };

  // Add this handler function along with your other handlers
  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const getStressStatus = (stressLevel) => {
    if (stressLevel <= 20) return "Excellent";
    if (stressLevel <= 40) return "Good";
    if (stressLevel <= 60) return "Moderate";
    if (stressLevel <= 80) return "High";
    return "Critical";
  };

  return (
    <Layout className="main-dashboard-layout">
      <div className="main-header">
        <div className="main-company-title">{metricsData?.companyName}</div>
        <div className="main-header-right">
          <Space size={16} align="center">
            <div className="main-header-button"
              onClick={() => navigate("/soundscapes")}
            >
              <img src="/MusicNotes.png" />
              <h3>Soundscapes</h3>
            </div>
            <div className="main-header-button" onClick={() => navigate("/employeesManagement")}>
              <img
                src="/UserGear.png"
                style={{ cursor: "pointer" }}
              />
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

            <div className="main-user-info">
              <img className="main-avatar" src={metricsData?.companyProfileUrl} />
              <h3 className="main-user-name">
                {`${user.fullName.firstName} ${user.fullName.lastName}`}
                <Dropdown
                  menu={{ items: menuItems, onClick: handleMenuClick }}
                  placement="bottomRight"
                  trigger={["click"]}
                  overlayStyle={{ minWidth: "160px" }}
                >
                  <DownOutlined style={{ marginLeft: 18, cursor: "pointer" }} />
                </Dropdown>
              </h3>
            </div>
          </Space>
        </div>
      </div>

      <div className="main-content">
        <div className="main-dashboard-left">
          <div className="main-workshops-content">
            <div className="main-workshop-banner">
              <div className="main-workshops-header">
                <h2>Upcoming Workshops</h2>
                <Button
                  type="link"
                  onClick={handleViewAllWorkshops}
                  style={{
                    cursor: "pointer",
                    color: "#ffffff",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  View All <RightOutlined />
                </Button>
              </div>
              <div
                className="main-workshops-image-card"
                onClick={handleViewWorkshopDetails}
                style={{ cursor: "pointer" }}
              >
                <PresentationSlide
                  title={workshop?.title}
                  date={formatDate(workshop?.start_time)}
                  backgroundImage={workshop?.poster_image}
                  endTime={workshop?.end_time}
                />
              </div>
            </div>

            <div className="main-bottom-cards">
              <div className="main-left-cards">
                <div
                  className="main-announcement-card"
                  onClick={() => navigate("/announcements")}
                  style={{ cursor: "pointer" }}
                >
                  <h3>Anouncements</h3>
                  <img src="announcement.svg" alt="marketing icon" />
                </div>

                <div
                  className="main-support-card"
                  onClick={() => navigate("/support")}
                  style={{ cursor: "pointer" }}
                >
                  <img src="support.svg" alt="support icon" />
                  <h3>Help & support</h3>
                </div>
              </div>
              <div
                className="main-rewards-card"
                onClick={() => navigate("/rewardsAndRecognition")}
                style={{ cursor: "pointer" }}
              >
                <div className="main-rewards-content">
                  <h3>Rewards & Recognition</h3>
                  <h3
                    style={{
                      color: "#EEE420",
                      fontSize: "18px",
                      fontWeight: "500",
                      paddingTop: "10px",
                    }}
                  >
                    COMING SOON !
                  </h3>
                </div>

                <img src="./winner.svg" alt="Rewards and Recognition" />

              </div>
            </div>
          </div>
        </div>

        <div className="main-dashboard-right">
          <div className="main-metrics-cards">
            <div className="company-health-card">
              <CompanyHealthGauge
                className="main-metric-card"
                value={(companyData.stress_level)}
                maxValue={100}
                title="Company Well-being Index"
                status={getStressStatus(companyData.stress_level)}
                onClick={handleCompanyGaugeClick}
                style={{ cursor: "pointer" }}
              />
            </div>

            <div
              className="main-resource-card"
              onClick={() => navigate("/resources")}
              style={{ cursor: "pointer" }}
            >
              <h3>Resources</h3>
              <img src="./resources.svg" alt="Rewards and Recognition" />
            </div>
          </div>

          <div className="main-roi-card">
            <div className="main-roi-header">
              <h3>ROI</h3>
              <span>Compare to prev. month</span>
            </div>
            <div className="main-roi-metrics">
              <div className="main-roi-item">
                <span>Stress Levels</span>
                <div className="main-percentage">
                  {Math.round(companyData.stress_level)}% <img src="/Downward.png" />
                </div>
              </div>
              <div className="main-roi-item">
                <span>Psychological Safety Index (PSI)</span>
                <div className="main-percentage">
                  {Math.round(companyData.psychological_safety_index)}% <img src="Upward.png" />
                </div>
              </div>
              <div className="main-roi-item">
                <span>Employee Retention</span>
                <div className="main-percentage">
                  {Math.round(companyData.retention_rate)}% <img src="Upward.png" />
                </div>
              </div>
              <div className="main-roi-item">
                <span>Employee Engagement</span>
                <div className="main-percentage">
                  {Math.round(companyData.engagement_score)}% <img src="/Downward.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer className="main-footer">
        <div className="main-footer-content">
          Powered by{" "}
          <img src="./neure.png" alt="Neure Icon" className="main-neure-icon" />
        </div>
      </Footer>

      <TermsModal
        isOpen={isTermsModalVisible}
        onClose={() => setIsTermsModalVisible(false)}
        onAccept={() => {
          setIsTermsModalVisible(false);
          message.success("Terms accepted successfully");
        }}
      />
    </Layout>
  );
};

export default DashboardLayout;
