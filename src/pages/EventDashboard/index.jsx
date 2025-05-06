import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Spin, Alert } from "antd";
import CustomCalendar from "../../components/CustomCalendar";
import PresentationSlide from "../../components/PresentationSlide";
import CustomHeader from "../../components/CustomHeader";
import axios from "axios";
import "./index.css";
import CustomPagination from "../../components/CustomPagination";
import { getWorkshops, getWorkshopDates } from "../../services/api";

const EventDashboard = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [workshopDates, setWorkshopDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const pageSize = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const companyId = localStorage.getItem("companyId");

        setLoading(true);
        setError(null); // Reset error state before fetching
        const data = await getWorkshops({
          companyId,
          currentPage,
          pageSize,
          selectedDate,
        });

        if (data.status) {
          console.log("API Response for workshops:", data.data);

          setWorkshops(data.data); // Ensure this is an array
          setTotalPages(data.pagination.totalPages);
          // Only set error if workshops array is empty
          if (data.data.length === 0) {
            setError("No workshops available.");
          }
        } else {
          setError("Failed to fetch workshops.");
        }
      } catch (err) {
        setError("Failed to fetch workshops. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, [currentPage, selectedDate]);

  useEffect(() => {
    const fetchWorkshopDates = async () => {
      try {
        const companyId = localStorage.getItem("companyId");
        const data = await getWorkshopDates(companyId);

        if (data.status && Array.isArray(data.data)) {
          const formattedDates = data.data.map((date) => {
            const formattedDate = new Date(date).toISOString().split("T")[0];
            console.log("Formatted date:", formattedDate);
            return formattedDate;
          });

          setWorkshopDates(formattedDates);
          console.log("Workshop dates set:", formattedDates);
        }
      } catch (error) {
        console.error("Failed to fetch workshop dates:", error);
      }
    };

    fetchWorkshopDates();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentPage(1); // Reset to first page when date changes
  };

  const handleWorkshopClick = (workshopId, scheduleId) => {
    navigate(`/workshopDetails/${workshopId}?scheduleId=${scheduleId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  return (
    <div className="workshop-page">
      <CustomHeader title="Workshops" />
      <div className="workshop-content">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8} lg={6}>
            <div className="calendar-wrapper">
              <CustomCalendar
                activeDates={workshopDates}
                onDateSelect={handleDateSelect}
              />
            </div>
          </Col>

          <div className="vertical-divider"></div>

          <Col xs={24} md={16} lg={18}>
            <div className="workshops-grid">
              {loading ? (
                // Show shimmer effect while loading
                Array(6).fill(0).map((_, index) => (
                  <div key={`shimmer-${index}`} className="workshop-item">
                    <PresentationSlide isLoading={true} />
                  </div>
                ))
              ) : error ? (
                <Alert message={error} type="warning" showIcon />
              ) : (
                workshops.map((workshop) => (
                  <div key={workshop.workshop_id} className="workshop-item">
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => handleWorkshopClick(workshop.workshop_id, workshop.schedule_id)}
                    >
                      <PresentationSlide
                        title={workshop.title}
                        date={formatDate(workshop.start_time)}
                        location={workshop.location}
                        backgroundImage={workshop.poster_image}
                        endTime={workshop.end_time}
                        isLoading={false}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Col>
        </Row>
      </div>
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default EventDashboard;
