// DashboardLayout.jsx
import React, { useState, useContext } from "react";
import {
  Layout,
  Space,
  Badge,
  Avatar,
  Button,
  Card,
  Progress,
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
import { useNavigate } from "react-router-dom";
import "./index.css";
import CompanyHealthGauge from "../../components/CompanyHealthGauge";
import { UserDataContext } from "../../context/UserContext";
import axios from "axios";
import PresentationSlide from "../../components/PresentationSlide";
import UserStats from "../../components/UserStats";
import { logoutUser } from "../../services/api";

const { Header, Content, Footer } = Layout;

const DashboardLayout = () => {
  const [hasNotifications, setHasNotifications] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  console.log("User from Mian dashboard ", user);

  const getInitial = () => {
    return user.fullName.firstName
      ? user.fullName.firstName[0].toUpperCase()
      : "U";
  };

  const data = {
    totalUsers: 512,
    activeUsers: 500,
    inactiveUsers: 12,
    lastUpdated: "21 Apr",
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
          id: '',
          email: '',
          roleId: '',
          userType: '',
          fullName: {
            firstName: '',
            lastName: ''
          }
        });


        localStorage.clear(); 

        message.success('Logged out successfully');
        navigate('/login');
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
    navigate('/dashboard');
  };

  const handleUserStatsClick = () => {
    navigate('/dashboard');
  };

  const handleViewWorkshopDetails = () => {
    navigate('/workshopDetails');
  };

  return (
    <Layout className="dashboard-layout">
      <Header className="header">
        <div className="CompanyTitle">The Company</div>
        <div className="header-right">
          <Space size={16} align="center">
            <Badge dot={hasNotifications} offset={[-5, 5]}>
              <UserOutlined
                className="header-icon"
                onClick={handleProfileClickManagement}
                style={{ cursor: "pointer" }}
              />
            </Badge>
            <SettingOutlined className="header-icon" />
            <div className="user-info">
              {/* <Avatar className="company-avatar">{getInitial()}</Avatar> */}
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
                  className="view-all"
                  onClick={handleViewAllWorkshops}
                >
                  View All <RightOutlined />
                </Button>
              </div>
              <div className="workshops-image-card" onClick={handleViewWorkshopDetails} style={{ cursor: 'pointer' }}>
                <PresentationSlide
                  title="Building Resilience: Strategies for Stress Management"
                  date="Mumbai | 15 Oct '24"
                  backgroundImage="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg"
                />
              </div>
            </Card>

            <div className="bottom-cards">
              <Card
                className="rewards-card"
                onClick={() => navigate("/rewards")}
                style={{ cursor: "pointer" }}
              >
                <div className="rewards-content">
                  <h3>Rewards & </h3>
                  <h3>Recognition</h3>
                  <div className="rewards-illustration">
                    <img src="./winner.png" alt="Rewards and Recognition" />
                  </div>
                </div>
              </Card>
              <div className="right-cards">
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
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="metrics-cards">
            <CompanyHealthGauge
              className="metric-card"
              value={500}
              title="Project performance"
              lastCheckDate="31 Jan"
              status="Average"
              onClick={handleCompanyGaugeClick}
              style={{ cursor: 'pointer' }}
            />
            <UserStats 
              data={data} 
              onClick={handleUserStatsClick}
              style={{ cursor: 'pointer' }}
            />
          </div>

          <Card className="roi-card">
            <div className="roi-header">
              <h3>ROI</h3>
              <span>Compare to prev. month</span>
            </div>
            <div className="roi-metrics">
              <div className="roi-item">
                <span>Employee Engagement Levels</span>
                <div className="percentage">85% ↑</div>
              </div>
              <div className="roi-item">
                <span>Productivity Improvements</span>
                <div className="percentage">85% ↑</div>
              </div>
              <div className="roi-item">
                <span>Reduction in Absenteeism</span>
                <div className="percentage">85% ↓</div>
              </div>
              <div className="roi-item">
                <span>Employee Retention</span>
                <div className="percentage">85% ↑</div>
              </div>
            </div>
          </Card>

          <Card className="articles-card">
            <div className="articles-header">
              <h3>Explore articles on improving mental well-being by Neure.</h3>
              <Button type="link" className="view-all" onClick={() => navigate('/articles')} style={{ cursor: 'pointer' }}>
                View All <RightOutlined />
              </Button>
            </div>
            <div className="articles-image-container">
              <img src="./problemSolving.png" alt="Problem solving" />
            </div>
          </Card>
        </div>
      </Content>

      <Footer className="footer">
        <div className="footer-content">
          Powered by{" "}
          <img src="./neure.png" alt="Neure Icon" className="neure-icon" />
        </div>
      </Footer>
    </Layout>
  );
};

export default DashboardLayout;
