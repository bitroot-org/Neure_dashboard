import React, { useState, useEffect } from "react";
import { Typography, Button, Spin, message } from "antd";
import { useParams } from "react-router-dom";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { getWorkshopDetails, markAttendance } from "../../services/api";
import CustomHeader from "../../components/CustomHeader";
import CheckInModal from "../../components/CheckInModal";
import AttendeeModal from "../../components/AttendeeModal";
import "./index.css";

const { Title, Text, Paragraph } = Typography;

// Add this helper function at the top of the file
const formatDateTime = (date, startTime, endTime) => {
  if (!startTime) return "";

  // Use start_time as the base date since conference_date is null
  const eventDate = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date(startTime);

  // Add 30 minutes to end time if not provided
  if (!endTime) {
    end.setMinutes(end.getMinutes() + 30);
  }

  const formattedDate = eventDate.toLocaleString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata", // Add IST timezone
  });

  const formattedStartTime = eventDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata", // Add IST timezone
  });

  const formattedEndTime = end.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata", // Add IST timezone
  });

  return `${formattedDate} | ${formattedStartTime} - ${formattedEndTime}`;
};

const WorkshopCard = () => {
  const { workshopId } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);

  const handleViewAttendees = () => {
    setIsAttendeeModalOpen(true);
  };

  const handleCheckIn = () => {
    setIsCheckInModalOpen(true);
  };

  // Add this function to check if the workshop is scheduled for today
  const isWorkshopToday = () => {
    if (!workshop?.schedules?.[0]?.start_time) return false;

    const startTime = new Date(workshop.schedules[0].start_time);
    const today = new Date();

    return (
      startTime.getDate() === today.getDate() &&
      startTime.getMonth() === today.getMonth() &&
      startTime.getFullYear() === today.getFullYear()
    );
  };

  // Add this function to check if workshop is canceled
  const isWorkshopCanceled = () => {
    return workshop?.schedules?.[0]?.status === "canceled";
  };

  // Add this function to get button disabled state
  const getButtonsDisabled = () => {
    return !isWorkshopToday() || isWorkshopCanceled();
  };

  // Add this function to get tooltip text
  const getButtonTooltip = () => {
    if (isWorkshopCanceled()) return "This workshop is yet to be held ";
    if (!isWorkshopToday())
      return "These actions are only available on the day of the workshop";
    return "";
  };

  // Add this function to check if workshop is completed
  const isWorkshopCompleted = () => {
    return workshop?.schedules?.[0]?.status === "completed";
  };

  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      const companyId = localStorage.getItem("companyId");
      try {
        setLoading(true);
        // Get schedule_id from URL params or state if available
        const scheduleId = new URLSearchParams(window.location.search).get(
          "scheduleId"
        );
        const response = await getWorkshopDetails(
          workshopId,
          companyId,
          scheduleId
        );
        if (response.status) {
          setWorkshop(response.data);
        } else {
          message.error("Failed to fetch workshop details");
        }
      } catch (error) {
        message.error("Error fetching workshop details");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopDetails();
  }, []);

  const handleDownload = () => {
    if (!isWorkshopCompleted()) {
      message.info(
        "Worksheet will be available after the workshop is completed"
      );
      return;
    }

    if (workshop?.pdf_url) {
      window.open(workshop.pdf_url, "_blank");
    } else {
      message.error("PDF not available");
    }
  };

  if (loading) return <Spin size="large" />;
  if (!workshop) return <div>Workshop not found</div>;

  return (
    <div className="workshop-container">
      <CustomHeader
        title="Workshop Details"
        showAttendeeButtons={true}
        onViewAttendeesClick={handleViewAttendees}
        onCheckInClick={handleCheckIn}
        buttonDisabled={getButtonsDisabled()}
        buttonTooltip={getButtonTooltip()}
      />
      <div className="workshop-card">
        <div className="image-container">
          {workshop.poster_image ? (
            <img
              src={workshop.poster_image}
              alt="Workshop"
              className="workshop-image"
            />
          ) : (
            <div className="placeholder-container">
              <div className="placeholder-icon">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="placeholder-text">No Image Available</div>
            </div>
          )}
        </div>

        <div className="content-container">
          <div className="title-container">
            <Title className="workshop-title">{workshop.title}</Title>
            <p>
              By <span>{workshop.organizer}</span>
            </p>
          </div>

          {/* Update the event-details section */}
          <div className="event-details">
            <div className="detail-item">
              <img
                src="/calendarIcon.png"
                alt="calendar-icon"
                className="detail-icon"
              />
              <h3 className="detail-text">
                {formatDateTime(
                  workshop.conference_date,
                  workshop.schedules[0]?.start_time,
                  workshop.schedules[0]?.end_time
                )}
              </h3>
            </div>
            {/* <div className="detail-item">
              <EnvironmentOutlined className="detail-icon" />
              <Text>{workshop.location}</Text>
            </div> */}
            <button
              className={`download-button ${
                !isWorkshopCompleted() ? "disabled-button" : ""
              }`}
              onClick={handleDownload}
              disabled={!isWorkshopCompleted()}
            >
              Download worksheet
            </button>
          </div>

          <div className="section">
            <h3 className="section-title">Overview:</h3>
            <p className="overview-text">{workshop.description}</p>
          </div>

          <div className="section">
            <h3 className="section-title">Agenda:</h3>
            <div className="agenda-list">
              {workshop.agenda.split(",").map((item, index) => (
                <div key={index} className="agenda-item">
                  <p className="agenda-title">
                    {index + 1}. {item.trim()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
      />
      <AttendeeModal
        isOpen={isAttendeeModalOpen}
        onClose={() => setIsAttendeeModalOpen(false)}
      />
    </div>
  );
};

export default WorkshopCard;
