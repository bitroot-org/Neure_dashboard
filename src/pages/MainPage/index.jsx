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
import axios from "axios";
import PresentationSlide from "../../components/PresentationSlide";
import UserStats from "../../components/UserStats";
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

  console.log("User from Mian dashboard ", user);

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
          setWorkshop(data.data.workshops[0]);
          console.log("Workshop data:", data.data.workshops);
          setTotalPages(data.data.pagination.totalPages);
          if (data.data.workshops.length === 0) {
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

  const handleProfileClickManagement = () => {
    navigate("/employees");
  };

  const handleProfileClick = () => {
    navigate("/companyProfile");
  };

  const handleViewAllWorkshops = () => {
    navigate("/eventDashboard");
  };

  const handleCompanyGaugeClick = () => {
    navigate("/dashboard");
  };

  const handleUserStatsClick = () => {
    navigate("/dashboard");
  };

  const handleViewWorkshopDetails = () => {
    navigate("/workshopDetails");
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

  return (
    <Layout className="dashboard-layout">
      <Header className="header">
        <div className="CompanyTitle">{metricsData?.companyName}</div>
        <div className="header-right">
          <Space size={16} align="center">
            <div className="soundscapes-button">
              <img src="/MusicNotes.png" />
              <h3>Soundscapes</h3>
            </div>
            <div className="employee_management-button">
              <img
                src="/UserGear.png"
                onClick={handleProfileClickManagement}
                style={{ cursor: "pointer" }}
              />
              <h3>Employess</h3>
            </div>
            <div
              className="settings-button"
              onClick={handleSettingsClick}
              style={{ cursor: "pointer" }}
            >
              <img src="/GearSix.png" />
              <h3>Settings</h3>
            </div>

            <div className="user-info">
              <Avatar className="avatar">{getInitial()}</Avatar>
              <h3 className="user-name">
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
      </Header>

      <Content className="main-content">
        <div className="left-section">
          <div className="workshops-content">
            <Card className="workshop-banner">
              <div className="workshops-header">
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
                className="workshops-image-card"
                onClick={handleViewWorkshopDetails}
                style={{ cursor: "pointer" }}
              >
                <PresentationSlide
                  title={workshop?.title}
                  date={formatDate(workshop?.start_time)}
                  location={workshop?.location}
                  backgroundImage={workshop?.poster_image}
                />
              </div>
            </Card>

            <div className="bottom-cards">
              <div className="left-cards">
                <Card
                  className="announcement-card"
                  onClick={() => navigate("/announcements")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="announcement-content">
                    <h3>Anouncements</h3>
                    <div className="announcement-icon">
                      <img src="Marketing.png" alt="marketing icon" />
                    </div>
                  </div>
                </Card>
                <Card
                  className="support-card"
                  onClick={() => navigate("/support")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="support-content">
                    <div className="support-icon">
                      <img src="support.png" alt="support icon" />
                    </div>
                    <h3>Help & support</h3>
                  </div>
                </Card>
              </div>
              <Card
                className="rewards-card"
                onClick={() => navigate("/rewards")}
                style={{ cursor: "pointer" }}
              >
                <div className="rewards-content">
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
                  <div className="rewards-illustration">
                    <img src="./winner.png" alt="Rewards and Recognition" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="metrics-cards">
            <CompanyHealthGauge
              className="metric-card"
              value={50}
              maxValue={100}
              title="Project performance"
              status="Average"
              onClick={handleCompanyGaugeClick}
              style={{ cursor: "pointer" }}
            />
            <div>
              <Card
                className="resource-card"
                onClick={() => navigate("/rewards")}
                style={{ cursor: "pointer" }}
              >
                <div className="resource-content">
                  <h3>Resources</h3>
                  <div className="resource-illustration">
                    <img src="./resources.png" alt="Rewards and Recognition" />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <Card className="roi-card">
            <div className="roi-header">
              <h3>ROI</h3>
              <span>Compare to prev. month</span>
            </div>
            <div className="roi-metrics">
              <div className="roi-item">
                <span>Stress Levels</span>
                <div className="percentage">
                  85% <img src="/Downward.png" />
                </div>
              </div>
              <div className="roi-item">
                <span>Psychological Safety Index (PSI)</span>
                <div className="percentage">
                  85% <img src="Upward.png" />
                </div>
              </div>
              <div className="roi-item">
                <span>Employee Retention</span>
                <div className="percentage">
                  85% <img src="Upward.png" />
                </div>
              </div>
              <div className="roi-item">
                <span>Employee Engagement</span>
                <div className="percentage">
                  85% <img src="/Downward.png" />
                </div>
              </div>
            </div>
          </Card>

          {/* <div className="custom-articles">
            <div className="articles-content">
              <h3>Explore articles on improving mental well-being by Neure.</h3>
              <h2
                type="link"
                className="view-all"
                onClick={() => navigate("/articles")}
                style={{ cursor: "pointer" }}
              >
                View All <RightOutlined />
              </h2>
            </div>
            <div className="articles-img">
              <img src="./problemSolving.png" alt="Problem solving" />
            </div>
          </div> */}
        </div>
      </Content>

      <Footer className="footer">
        <div className="footer-content">
          Powered by{" "}
          <img src="./neure.png" alt="Neure Icon" className="neure-icon" />
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
